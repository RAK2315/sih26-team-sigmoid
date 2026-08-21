import { storeClient } from "./client";
import type { WalkCrossingInput } from "@/lib/types";

export async function recordCrossing(crossing: WalkCrossingInput): Promise<boolean> {
  const client = storeClient();
  if (client === null) return false;

  const { error } = await client.from("walk_crossings").insert({
    walk_id: crossing.walkId,
    point_id: crossing.pointId,
    site_id: crossing.siteId,
    persona: crossing.persona,
    kind: crossing.kind,
    location_source: crossing.locationSource,
  });

  // a Walk must never stall on its own logging, so a failure is reported and swallowed here
  if (error) {
    console.error("walk_crossings insert failed:", error.message);
    return false;
  }
  return true;
}

export interface LoggedCrossing {
  pointId: string;
  siteId: string;
  persona: string;
  kind: string;
  locationSource: string;
  createdAt: string;
}

export async function recentCrossings(limit = 25): Promise<LoggedCrossing[] | null> {
  const client = storeClient();
  if (client === null) return null;

  const { data, error } = await client
    .from("walk_crossings")
    .select("point_id, site_id, persona, kind, location_source, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("walk_crossings select failed:", error.message);
    return null;
  }

  return data.map((r) => ({
    pointId: r.point_id,
    siteId: r.site_id,
    persona: r.persona,
    kind: r.kind,
    locationSource: r.location_source,
    createdAt: r.created_at,
  }));
}
