import { destination, point } from "@turf/turf";
import type { Anchor, DistanceUnit, SpatialClue } from "./types";

export interface ResolvedClue {
  centroid: [number, number];
  uncertaintyRadiusM: number;
}

const UNIT_METERS: Record<DistanceUnit, number> = {
  feet: 0.3048,
  yards: 0.9144,
  miles: 1609.34,
  paces: 0.76,
  gaz: 0.83,
  kos: 2500,
};

const UNIT_VAGUENESS: Record<DistanceUnit, number> = {
  feet: 0.1,
  yards: 0.15,
  paces: 0.25,
  gaz: 0.25,
  miles: 0.2,
  kos: 0.3,
};

const BEARING_DEGREES: Record<string, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

const NON_DIRECTIONAL = new Set(["adjacent", "within", "opposite"]);

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/\(no\.\s*\d+\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^the\s+/, "")
    .replace(/['’]s\b/g, "");
}

function matchAnchor(anchorName: string, anchors: Anchor[]): Anchor | null {
  const needle = normalizeName(anchorName);
  return (
    anchors.find(
      (a) =>
        normalizeName(a.name) === needle ||
        a.aliases.some((al) => normalizeName(al) === needle)
    ) ?? null
  );
}

export function resolveClue(
  clue: SpatialClue,
  anchors: Anchor[]
): ResolvedClue | null {
  const anchor = matchAnchor(clue.anchorName, anchors);
  if (!anchor) return null;

  let distanceM = 0;
  if (clue.distanceValue !== null && clue.distanceUnit !== null) {
    distanceM = clue.distanceValue * UNIT_METERS[clue.distanceUnit];
  }

  if (!clue.bearing || NON_DIRECTIONAL.has(clue.bearing)) {
    const extra = clue.distanceValue !== null ? Math.max(distanceM, 50) : 50;
    return {
      centroid: anchor.centroid,
      uncertaintyRadiusM: Math.round(anchor.precisionM + extra),
    };
  }

  if (clue.distanceValue === null) {
    const bearingDeg = BEARING_DEGREES[clue.bearing];
    const impliedDistanceM = 150;
    const dest = destination(
      point(anchor.centroid),
      impliedDistanceM / 1000,
      bearingDeg,
      { units: "kilometers" }
    );
    const centroid = dest.geometry.coordinates as [number, number];
    const bearingErrorM = impliedDistanceM * Math.sin((22.5 * Math.PI) / 180);
    return {
      centroid,
      uncertaintyRadiusM: Math.round(
        anchor.precisionM + bearingErrorM + impliedDistanceM
      ),
    };
  }

  const unit = clue.distanceUnit ?? "yards";
  const bearingDeg = BEARING_DEGREES[clue.bearing];
  const dest = destination(
    point(anchor.centroid),
    distanceM / 1000,
    bearingDeg,
    { units: "kilometers" }
  );
  const centroid = dest.geometry.coordinates as [number, number];

  const bearingErrorM = distanceM * Math.sin((22.5 * Math.PI) / 180);
  const distanceErrorM = distanceM * UNIT_VAGUENESS[unit];

  const radius = anchor.precisionM + bearingErrorM + distanceErrorM;

  return {
    centroid,
    uncertaintyRadiusM: Math.round(radius),
  };
}