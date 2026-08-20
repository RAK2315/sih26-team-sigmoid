import { describe, expect, test } from "vitest";
import { buildCandidates } from "../lib/pipeline";
import { FIXTURE_ANCHORS, FIXTURE_MENTIONS } from "../content/fixtures";

const baseline = [
  {
    id: "node/1",
    name: "Kotla Firoz Shah",
    centroid: [77.2432, 28.6383] as [number, number],
  },
];

describe("buildCandidates", () => {
  test("a mention with an unknown anchor produces centroid null and stays in output", () => {
    const [c] = buildCandidates(
      [FIXTURE_MENTIONS[2]],
      FIXTURE_ANCHORS,
      baseline
    );
    expect(c.centroid).toBeNull();
    expect(c.uncertaintyRadiusM).toBeNull();
    expect(c.status).toBe("extracted");
    expect(c.id).toBe("c_87_1");
  });

  test("a mention with no spatial clue produces centroid null", () => {
    const m = {
      ...FIXTURE_MENTIONS[0],
      id: "m_88_1",
      spatialClue: null,
    };
    const [c] = buildCandidates([m], FIXTURE_ANCHORS, baseline);
    expect(c.centroid).toBeNull();
    expect(c.status).toBe("extracted");
  });

  test("a resolved mention without a baseline match becomes candidate", () => {
    const [c] = buildCandidates(
      [FIXTURE_MENTIONS[0]],
      FIXTURE_ANCHORS,
      []
    );
    expect(c.centroid).not.toBeNull();
    expect(c.status).toBe("candidate");
    expect(c.matchedBaselineFeature).toBeNull();
    expect(c.confidence.parts.modernEvidence).toBe(0.1);
  });

  test("a resolved mention with a baseline match becomes matched_existing", () => {
    const [c] = buildCandidates(
      [FIXTURE_MENTIONS[1]],
      FIXTURE_ANCHORS,
      baseline
    );
    expect(c.status).toBe("matched_existing");
    expect(c.matchedBaselineFeature).not.toBeNull();
    expect(c.confidence.parts.modernEvidence).toBe(0.4);
  });
});