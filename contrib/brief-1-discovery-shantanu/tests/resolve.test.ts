import { describe, expect, test } from "vitest";
import { resolveClue } from "../lib/resolve";
import { FIXTURE_ANCHORS, FIXTURE_MENTIONS } from "../content/fixtures";

describe("resolveClue", () => {
  test("200 yards north lands north of the anchor and barely moves east or west", () => {
    const r = resolveClue(FIXTURE_MENTIONS[0].spatialClue!, FIXTURE_ANCHORS)!;
    expect(r.centroid[1]).toBeGreaterThan(28.6383);
    expect(r.centroid[0]).toBeCloseTo(77.2432, 3);
  });

  test("an unknown anchor returns null rather than a guess", () => {
    expect(resolveClue(FIXTURE_MENTIONS[2].spatialClue!, FIXTURE_ANCHORS)).toBeNull();
  });

  test("one kos produces a radius over 1000m", () => {
    const clue = {
      anchorName: "Kotla Firoz Shah",
      bearing: "W" as const,
      distanceValue: 1,
      distanceUnit: "kos" as const,
    };
    expect(resolveClue(clue, FIXTURE_ANCHORS)!.uncertaintyRadiusM).toBeGreaterThan(1000);
  });

  test("adjacent returns the anchor centroid itself", () => {
    const r = resolveClue(FIXTURE_MENTIONS[1].spatialClue!, FIXTURE_ANCHORS)!;
    expect(r.centroid[0]).toBeCloseTo(77.2432, 4);
    expect(r.centroid[1]).toBeCloseTo(28.6383, 4);
  });

  test("a null distance with a bearing still resolves, with a wider radius", () => {
    const clue = {
      anchorName: "Kotla Firoz Shah",
      bearing: "N" as const,
      distanceValue: null,
      distanceUnit: null,
    };
    const r = resolveClue(clue, FIXTURE_ANCHORS)!;
    expect(r.centroid[1]).toBeGreaterThan(28.6383);
    expect(r.uncertaintyRadiusM).toBeGreaterThan(150);
  });

  test("aliases match case-insensitively", () => {
    const clue = {
      anchorName: "  firozabad  ",
      bearing: "NE" as const,
      distanceValue: 10,
      distanceUnit: "feet" as const,
    };
    expect(resolveClue(clue, FIXTURE_ANCHORS)).not.toBeNull();
  });

  test("every returned coordinate carries a radius", () => {
    const r = resolveClue(FIXTURE_MENTIONS[0].spatialClue!, FIXTURE_ANCHORS)!;
    expect(typeof r.uncertaintyRadiusM).toBe("number");
    expect(r.uncertaintyRadiusM).toBeGreaterThan(0);
  });

  test("every returned coordinate is inside the Delhi bounds", () => {
    const cases = [
      { anchorName: "Kotla Firoz Shah", bearing: "N" as const, distanceValue: 200, distanceUnit: "yards" as const },
      { anchorName: "Kotla Firoz Shah", bearing: "SE" as const, distanceValue: 1, distanceUnit: "miles" as const },
      { anchorName: "Kotla Firoz Shah", bearing: "W" as const, distanceValue: 1, distanceUnit: "kos" as const },
    ];
    for (const c of cases) {
      const r = resolveClue(c, FIXTURE_ANCHORS)!;
      expect(r.centroid[0]).toBeGreaterThan(76.8);
      expect(r.centroid[0]).toBeLessThan(77.4);
      expect(r.centroid[1]).toBeGreaterThan(28.3);
      expect(r.centroid[1]).toBeLessThan(28.9);
    }
  });
});