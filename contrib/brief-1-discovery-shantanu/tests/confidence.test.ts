import { describe, expect, test } from "vitest";
import {
  anchorPrecisionScore,
  clueSpecificity,
  scoreConfidence,
} from "../lib/confidence";
import type { ConfidenceParts } from "../lib/types";

describe("scoreConfidence", () => {
  test("all zeros returns 0", () => {
    const parts: ConfidenceParts = {
      sourceReliability: 0,
      clueSpecificity: 0,
      anchorPrecision: 0,
      crossSourceAgreement: 0,
      modernEvidence: 0,
    };
    expect(scoreConfidence(parts)).toBe(0);
  });

  test("all ones returns 1.0", () => {
    const parts: ConfidenceParts = {
      sourceReliability: 1,
      clueSpecificity: 1,
      anchorPrecision: 1,
      crossSourceAgreement: 1,
      modernEvidence: 1,
    };
    expect(scoreConfidence(parts)).toBe(1);
  });

  test("output never leaves 0..1", () => {
    const parts: ConfidenceParts = {
      sourceReliability: 2,
      clueSpecificity: -1,
      anchorPrecision: 1,
      crossSourceAgreement: 0,
      modernEvidence: 0.5,
    };
    const r = scoreConfidence(parts);
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(1);
  });
});

describe("helpers", () => {
  test("clueSpecificity: tight units score 1", () => {
    expect(clueSpecificity("N", "yards")).toBe(1);
    expect(clueSpecificity("NE", "feet")).toBe(1);
  });
  test("clueSpecificity: vague units score 0.7", () => {
    expect(clueSpecificity("W", "kos")).toBe(0.7);
  });
  test("clueSpecificity: non-directional scores 0.4", () => {
    expect(clueSpecificity("adjacent", null)).toBe(0.4);
  });
  test("clueSpecificity: no clue scores 0", () => {
    expect(clueSpecificity(null, null)).toBe(0);
  });
  test("anchorPrecisionScore clamps to 0..1", () => {
    expect(anchorPrecisionScore(0)).toBe(1);
    expect(anchorPrecisionScore(5000)).toBe(0);
    expect(anchorPrecisionScore(200)).toBeCloseTo(0.9);
  });
});