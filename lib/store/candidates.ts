import { ANCHORS } from "@/content/anchors";
import { verdictFrom } from "@/lib/discovery/baseline";
import type { Candidate, CandidateStatus, StoredCandidate } from "@/lib/types";
import { storeClient } from "./client";

// what the candidates table holds, in its own column names
interface Row {
  id: string;
  volume_id: string;
  page_no: number;
  mention_name: string;
  structure_type: string;
  period: string | null;
  passage: string;
  anchor_id: string | null;
  bearing: string | null;
  distance_value: number | null;
  distance_unit: string | null;
  lng: number;
  lat: number;
  uncertainty_radius_m: number;
  status: string;
  confidence: number;
  confidence_parts: Candidate["confidence"]["parts"];
  matched_feature_id: string | null;
  matched_feature_name: string | null;
  matched_distance_m: number | null;
}

function fromRow(row: Row): StoredCandidate {
  const matchedFeature =
    row.matched_feature_id === null
      ? null
      : {
          id: row.matched_feature_id,
          name: row.matched_feature_name ?? row.matched_feature_id,
          distanceM: Number(row.matched_distance_m ?? 0),
        };
  const radiusM = Number(row.uncertainty_radius_m);

  return {
    id: row.id,
    volumeId: row.volume_id,
    pageNo: row.page_no,
    name: row.mention_name,
    structureType: row.structure_type,
    period: row.period,
    passage: row.passage,
    anchorId: row.anchor_id,
    anchorName: ANCHORS.find((a) => a.id === row.anchor_id)?.name ?? null,
    bearing: row.bearing,
    distanceValue: row.distance_value,
    distanceUnit: row.distance_unit,
    centroid: [row.lng, row.lat],
    uncertaintyRadiusM: radiusM,
    status: row.status as CandidateStatus,
    confidence: Number(row.confidence),
    confidenceParts: row.confidence_parts,
    baselineVerdict: verdictFrom(matchedFeature, radiusM),
    matchedFeature,
  };
}

export async function listCandidates(): Promise<StoredCandidate[] | null> {
  const client = storeClient();
  if (client === null) return null;

  const { data, error } = await client
    .from("candidates")
    .select("*")
    .order("confidence", { ascending: false });

  // the caller serves the committed snapshot with a stale badge rather than an empty queue
  if (error) {
    console.error("candidates select failed:", error.message);
    return null;
  }
  return (data as Row[]).map(fromRow);
}

export async function moveCandidate(
  id: string,
  from: CandidateStatus,
  to: CandidateStatus,
  note: string | null,
): Promise<boolean> {
  const client = storeClient();
  if (client === null) return false;

  const { data, error } = await client
    .from("candidates")
    .update({ status: to, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", from)
    .select("id");

  if (error) {
    console.error("candidate update failed:", error.message);
    return false;
  }

  // matching no rows is not an error to Postgres, but it means the Candidate was not in the
  // state the Reviewer thought it was, and writing an event for a move that did not happen
  // would put a lie in the one table that exists to be trusted
  if (data === null || data.length === 0) return false;

  // append-only, and it is the Evidence trail for the review decision itself
  const event = await client
    .from("candidate_events")
    .insert({ candidate_id: id, from_status: from, to_status: to, note });

  // a status that moved with no record of how it got there is exactly what this table exists to
  // prevent, so the move is put back rather than left standing without its trail
  if (event.error) {
    console.error("candidate_events insert failed:", event.error.message);
    await client.from("candidates").update({ status: from }).eq("id", id).eq("status", to);
    return false;
  }

  return true;
}
