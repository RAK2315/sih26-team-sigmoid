import raw from "./baseline.json";
import type { BaselineFeature } from "../lib/types";

const fc = raw as unknown as {
  type: string;
  features: Array<{
    id?: string | number;
    properties?: { name?: string };
    geometry?: { type: string; coordinates?: [number, number] };
  }>;
};

function toFeatures(
  features: Array<{
    id?: string | number;
    properties?: { name?: string };
    geometry?: { type: string; coordinates?: [number, number] };
  }>
): BaselineFeature[] {
  const out: BaselineFeature[] = [];
  for (const f of features) {
    const name = f.properties?.name;
    const coords = f.geometry?.coordinates;
    if (!name || !coords || coords.length < 2) continue;
    out.push({
      id: String(f.id ?? `feature/${out.length}`),
      name,
      centroid: [coords[0], coords[1]],
    });
  }
  return out;
}

export const BASELINE: BaselineFeature[] = toFeatures(fc.features);