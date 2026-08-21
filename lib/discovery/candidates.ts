import { checkBaseline } from "@/lib/discovery/baseline";
import type { BaselineFeature } from "@/lib/discovery/baseline";
import { scoreConfidence } from "@/lib/discovery/confidence";
import { resolveClue } from "@/lib/discovery/resolve";
import type { Anchor, Candidate, Mention } from "@/lib/types";

// Zafar Hasan's survey is a published ASI volume with named authorship and a stated method,
// which is about as good as a single source gets. It is still one source.
export const VOLUME_RELIABILITY: Record<string, number> = {
  "zafar-hasan-v2": 0.9,
};

export interface CandidateInput {
  mentions: Mention[];
  anchors: Anchor[];
  baseline: BaselineFeature[];
  volumeId: string;
}

// A Mention whose Anchor is unknown produces no Candidate at all. That is the partial state
// on /discover: the passage is shown, and nothing is placed on the map.
export function buildCandidates(input: CandidateInput): Candidate[] {
  const sourceReliability = VOLUME_RELIABILITY[input.volumeId] ?? 0.7;
  const candidates: Candidate[] = [];

  for (const mention of input.mentions) {
    // a passage the Page does not contain was not copied but composed, and a clue read out of
    // a composed passage is a distance the survey never printed
    if (mention.passageOffset === null) continue;
    const resolved = resolveClue(mention.spatialClue, input.anchors);
    if (resolved.status !== "resolved") continue;
    if (!mention.spatialClue) continue;

    const anchorFeatureId = resolved.anchor.source.startsWith("osm:")
      ? resolved.anchor.source.slice("osm:".length)
      : undefined;
    const baseline = checkBaseline(resolved.centroid, resolved.uncertaintyRadiusM, input.baseline, anchorFeatureId);
    const confidence = scoreConfidence({
      clue: mention.spatialClue,
      anchorPrecisionM: resolved.anchor.precisionM,
      uncertaintyRadiusM: resolved.uncertaintyRadiusM,
      baseline,
      sourceReliability,
    });

    candidates.push({
      id: mention.id.replace(/^m_/, "c_"),
      mentionId: mention.id,
      centroid: resolved.centroid,
      uncertaintyRadiusM: resolved.uncertaintyRadiusM,
      // ADR-0003: candidate is the ceiling for automation. What the Baseline found is evidence,
      // carried in evidence.baselineVerdict, and only a Reviewer may turn it into a status.
      status: "candidate",
      matchedBaselineFeature: baseline.match,
      confidence,
      evidence: {
        anchorId: resolved.anchor.id,
        anchorName: resolved.anchor.name,
        anchorSource: resolved.anchor.source,
        anchorCentroid: resolved.anchor.centroid,
        bearingDeg: resolved.bearingDeg,
        distanceM: resolved.distanceM,
        radiusParts: resolved.radiusParts,
        baselineVerdict: baseline.verdict,
        baselineChecked: baseline.checked,
      },
    });
  }

  return candidates;
}
