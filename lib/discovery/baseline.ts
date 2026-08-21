import { metresBetween } from "@/lib/location/geometry";
import type { BaselineMatch, BaselineNeighbour, Coord } from "@/lib/types";

export interface BaselineProperties {
  name: string | null;
  historic: string | null;
  heritage: string | null;
  tourism: string | null;
}

export interface BaselineFeature {
  type: "Feature";
  id: string;
  geometry: { type: "Point"; coordinates: number[] };
  properties: BaselineProperties;
}

export interface BaselineCheck {
  verdict: "matched_existing" | "representation_gap" | "inconclusive";
  match: BaselineMatch | null;
  checked: BaselineNeighbour[];
}

// enough for the Evidence panel to show its working without turning into a list
const NEIGHBOURS_KEPT = 5;

// the verdict rule, in one place, so a row read back from the database means the same thing
// as one straight out of the pipeline
export function verdictFrom(
  match: BaselineMatch | null,
  uncertaintyRadiusM: number,
): BaselineCheck["verdict"] {
  if (uncertaintyRadiusM > CONCLUSIVE_RADIUS_M) return "inconclusive";
  return match ? "matched_existing" : "representation_gap";
}

// past this the circle covers so much of Delhi that finding something inside it says nothing,
// and finding nothing says nothing either
const CONCLUSIVE_RADIUS_M = 500;

// an unnamed node still proves something is mapped here, so it needs a label a Reviewer can chase
function label(feature: BaselineFeature): string {
  const { name, historic, heritage, tourism } = feature.properties;
  if (name) return name;
  return `unnamed ${historic ?? heritage ?? tourism ?? "feature"} (${feature.id})`;
}

export function checkBaseline(
  centroid: Coord,
  uncertaintyRadiusM: number,
  baseline: BaselineFeature[],
  anchorFeatureId?: string,
): BaselineCheck {
  const neighbours: BaselineNeighbour[] = baseline
    .map((feature) => {
      const at: Coord = [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
      const distanceM = metresBetween(centroid, at);
      // the landmark a clue was measured from cannot be evidence that the clue found something.
      // it is kept in the list so a reader sees it was considered and set aside.
      const isAnchor = anchorFeatureId !== undefined && feature.id === anchorFeatureId;
      return { id: feature.id, name: label(feature), distanceM, insideRadius: !isAnchor && distanceM <= uncertaintyRadiusM };
    })
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, NEIGHBOURS_KEPT);

  const nearest = uncertaintyRadiusM > CONCLUSIVE_RADIUS_M ? null : (neighbours.find((n) => n.insideRadius) ?? null);
  const match = nearest ? { id: nearest.id, name: nearest.name, distanceM: nearest.distanceM } : null;

  return { verdict: verdictFrom(match, uncertaintyRadiusM), match, checked: neighbours };
}
