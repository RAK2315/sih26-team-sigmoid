import { distance } from "@turf/turf";
import type { BaselineFeature } from "./types";

export function checkBaseline(
  centroid: [number, number],
  radiusM: number,
  baseline: BaselineFeature[]
): { id: string; name: string; distanceM: number } | null {
  let nearest: { id: string; name: string; distanceM: number } | null = null;

  for (const feature of baseline) {
    const d = distance(centroid, feature.centroid, { units: "meters" });
    if (d <= radiusM && (nearest === null || d < nearest.distanceM)) {
      nearest = { id: feature.id, name: feature.name, distanceM: d };
    }
  }

  return nearest;
}