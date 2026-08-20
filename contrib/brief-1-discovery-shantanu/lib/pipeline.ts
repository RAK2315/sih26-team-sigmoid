import { checkBaseline } from "./baseline";
import {
  anchorPrecisionScore,
  clueSpecificity,
  scoreConfidence,
} from "./confidence";
import { resolveClue } from "./resolve";
import type { Anchor, BaselineFeature, Candidate, Mention } from "./types";

export function buildCandidates(
  mentions: Mention[],
  anchors: Anchor[],
  baseline: BaselineFeature[]
): Candidate[] {
  return mentions.map((mention, idx) => {
    const pageNo = Number(mention.id.split("_")[1]);
    const baseConfidence = {
      sourceReliability: 0.9,
      crossSourceAgreement: 0,
    };

    const clue = mention.spatialClue;
    if (!clue) {
      return {
        id: `c_${pageNo}_${idx + 1}`,
        mentionId: mention.id,
        centroid: null,
        uncertaintyRadiusM: null,
        status: "extracted",
        matchedBaselineFeature: null,
        confidence: {
          total: scoreConfidence({
            ...baseConfidence,
            clueSpecificity: 0,
            anchorPrecision: 0,
            modernEvidence: 0.1,
          }),
          parts: {
            ...baseConfidence,
            clueSpecificity: 0,
            anchorPrecision: 0,
            modernEvidence: 0.1,
          },
        },
      };
    }

    const resolved = resolveClue(clue, anchors);
    if (!resolved) {
      return {
        id: `c_${pageNo}_${idx + 1}`,
        mentionId: mention.id,
        centroid: null,
        uncertaintyRadiusM: null,
        status: "extracted",
        matchedBaselineFeature: null,
        confidence: {
          total: scoreConfidence({
            ...baseConfidence,
            clueSpecificity: clueSpecificity(clue.bearing, clue.distanceUnit),
            anchorPrecision: 0,
            modernEvidence: 0.1,
          }),
          parts: {
            ...baseConfidence,
            clueSpecificity: clueSpecificity(clue.bearing, clue.distanceUnit),
            anchorPrecision: 0,
            modernEvidence: 0.1,
          },
        },
      };
    }

    const match = checkBaseline(
      resolved.centroid,
      resolved.uncertaintyRadiusM,
      baseline
    );

    const anchor = anchors.find(
      (a) =>
        a.name.toLowerCase() === clue.anchorName.trim().toLowerCase() ||
        a.aliases.some((al) => al.toLowerCase() === clue.anchorName.trim().toLowerCase())
    );

    const anchorPrecision = anchor ? anchorPrecisionScore(anchor.precisionM) : 0;
    const modernEvidence = match ? 0.4 : 0.1;

    const parts = {
      ...baseConfidence,
      clueSpecificity: clueSpecificity(clue.bearing, clue.distanceUnit),
      anchorPrecision,
      modernEvidence,
    };

    return {
      id: `c_${pageNo}_${idx + 1}`,
      mentionId: mention.id,
      centroid: resolved.centroid,
      uncertaintyRadiusM: resolved.uncertaintyRadiusM,
      status: match ? "matched_existing" : "candidate",
      matchedBaselineFeature: match,
      confidence: { total: scoreConfidence(parts), parts },
    };
  });
}