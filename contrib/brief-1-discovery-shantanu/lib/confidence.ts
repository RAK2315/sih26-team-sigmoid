import type { ConfidenceParts } from "./types";

const WEIGHTS = {
  sourceReliability: 0.3,
  clueSpecificity: 0.25,
  anchorPrecision: 0.2,
  crossSourceAgreement: 0.15,
  modernEvidence: 0.1,
} as const;

export function scoreConfidence(parts: ConfidenceParts): number {
  const total =
    parts.sourceReliability * WEIGHTS.sourceReliability +
    parts.clueSpecificity * WEIGHTS.clueSpecificity +
    parts.anchorPrecision * WEIGHTS.anchorPrecision +
    parts.crossSourceAgreement * WEIGHTS.crossSourceAgreement +
    parts.modernEvidence * WEIGHTS.modernEvidence;

  const clamped = Math.min(1, Math.max(0, total));
  return Math.round(clamped * 100) / 100;
}

export const CONFIDENCE_WEIGHTS = WEIGHTS;

export function clueSpecificity(
  bearing: string | null,
  unit: string | null
): number {
  if (!bearing) return 0;
  if (bearing === "adjacent" || bearing === "within" || bearing === "opposite")
    return 0.4;
  if (unit === "feet" || unit === "yards") return 1;
  if (unit === "kos" || unit === "gaz" || unit === "paces") return 0.7;
  return 0.7;
}

export function anchorPrecisionScore(precisionM: number): number {
  const v = 1 - precisionM / 2000;
  return Math.min(1, Math.max(0, v));
}