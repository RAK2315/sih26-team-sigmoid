import { describe, expect, test } from "vitest";
import { checkBaseline } from "../lib/baseline";
import type { BaselineFeature } from "../lib/types";

const near: BaselineFeature = {
  id: "node/111",
  name: "Kotla ruins",
  centroid: [77.2433, 28.6384],
};
const far: BaselineFeature = {
  id: "node/222",
  name: "Somewhere far",
  centroid: [77.35, 28.75],
};
const mid: BaselineFeature = {
  id: "node/333",
  name: "Mid feature",
  centroid: [77.2435, 28.6385],
};

describe("checkBaseline", () => {
  test("feature inside radius returns it", () => {
    const r = checkBaseline([77.2432, 28.6383], 500, [near, far]);
    expect(r).not.toBeNull();
    expect(r!.id).toBe("node/111");
  });

  test("feature outside radius returns null", () => {
    const r = checkBaseline([77.2432, 28.6383], 50, [far]);
    expect(r).toBeNull();
  });

  test("nearest wins when two are inside", () => {
    const r = checkBaseline([77.2432, 28.6383], 500, [mid, near]);
    expect(r!.id).toBe("node/111");
  });

  test("empty baseline returns null", () => {
    expect(checkBaseline([77.2432, 28.6383], 500, [])).toBeNull();
  });
});