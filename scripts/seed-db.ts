import { writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { ANCHORS } from "@/content/anchors";
import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import type { StoredCandidate } from "@/lib/types";

// Puts every Candidate the pipeline surfaced into Supabase, and writes the same set to
// content/candidates.seed.json so /authority has a queue even with the database asleep.
// Run with: npx tsx --env-file=.env.local scripts/seed-db.ts

const SEED_FILE = "content/candidates.seed.json";

function rows() {
  return Object.values(DISCOVERY_CACHE)
    .flatMap((page) =>
      page.candidates.map((c) => {
        const mention = page.mentions.find((m) => m.id === c.mentionId);
        const anchor = ANCHORS.find((a) => a.name === c.evidence.anchorName);
        return {
          id: c.id,
          volume_id: "zafar-hasan-v2",
          page_no: page.pageNo,
          mention_name: mention?.name ?? "Unknown",
          structure_type: mention?.type ?? "other",
          period: mention?.period ?? null,
          passage: mention?.passage ?? "",
          passage_start: mention?.passageOffset?.[0] ?? null,
          passage_end: mention?.passageOffset?.[1] ?? null,
          anchor_id: anchor?.id ?? null,
          bearing: mention?.spatialClue?.bearing ?? null,
          distance_value: mention?.spatialClue?.distanceValue ?? null,
          distance_unit: mention?.spatialClue?.distanceUnit ?? null,
          lng: c.centroid[0],
          lat: c.centroid[1],
          uncertainty_radius_m: Math.round(c.uncertaintyRadiusM),
          status: c.status,
          confidence: Number(c.confidence.total.toFixed(4)),
          confidence_parts: c.confidence.parts,
          matched_feature_id: c.matchedBaselineFeature?.id ?? null,
          matched_feature_name: c.matchedBaselineFeature?.name ?? null,
          matched_distance_m: c.matchedBaselineFeature
            ? Math.round(c.matchedBaselineFeature.distanceM)
            : null,
        };
      }),
    )
    .sort((a, b) => b.confidence - a.confidence);
}

// the snapshot is shaped like what listCandidates returns, so the fallback needs no translation
function snapshot(all: ReturnType<typeof rows>): StoredCandidate[] {
  return all.map((r) => ({
    id: r.id,
    volumeId: r.volume_id,
    pageNo: r.page_no,
    name: r.mention_name,
    structureType: r.structure_type,
    period: r.period,
    passage: r.passage,
    anchorId: r.anchor_id,
    anchorName: ANCHORS.find((a) => a.id === r.anchor_id)?.name ?? null,
    bearing: r.bearing,
    distanceValue: r.distance_value,
    distanceUnit: r.distance_unit,
    centroid: [r.lng, r.lat] as [number, number],
    uncertaintyRadiusM: r.uncertainty_radius_m,
    status: r.status,
    confidence: r.confidence,
    confidenceParts: r.confidence_parts,
    baselineVerdict:
      r.uncertainty_radius_m > 500
        ? ("inconclusive" as const)
        : r.matched_feature_id
          ? ("matched_existing" as const)
          : ("representation_gap" as const),
    matchedFeature: r.matched_feature_id
      ? {
          id: r.matched_feature_id,
          name: r.matched_feature_name ?? r.matched_feature_id,
          distanceM: r.matched_distance_m ?? 0,
        }
      : null,
  }));
}

async function main() {
  const all = rows();
  const matched = all.filter((r) => r.matched_feature_id !== null).length;
  const gaps = all.filter((r) => r.matched_feature_id === null && r.uncertainty_radius_m <= 500).length;

  await writeFile(SEED_FILE, JSON.stringify(snapshot(all), null, 1) + "\n");
  console.log(`${SEED_FILE}: ${all.length} Candidates, ${matched} matched, ${gaps} gaps`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("no service role key, so the snapshot is written and the database is left alone");
    return;
  }

  const client = createClient(url, key);

  // the cache calls every Candidate a candidate, so writing status blindly would undo a
  // Reviewer's decision. a row that already exists keeps the status the database has.
  const existing = await client.from("candidates").select("id,status");
  if (existing.error) {
    console.error("could not read the existing queue:", existing.error.message);
    process.exitCode = 1;
    return;
  }
  const reviewed = new Map((existing.data ?? []).map((r) => [r.id as string, r.status as string]));
  const kept = all.map((row) => ({ ...row, status: reviewed.get(row.id) ?? row.status }));
  const moved = kept.filter((row) => row.status !== "candidate").length;

  const { error } = await client.from("candidates").upsert(kept, { onConflict: "id" });
  if (error) {
    console.error("upsert failed:", error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`supabase: ${kept.length} Candidates upserted, ${moved} left where a Reviewer put them`);
}

main();
