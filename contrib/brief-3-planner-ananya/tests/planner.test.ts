import { describe, expect, test } from "vitest";
import { RED_FORT_ENTRANCE, RED_FORT_POINTS } from "../content/red-fort";
import { planRoute, walkingSeconds } from "../lib/planner";
import type { HeritagePoint, InterestTag, PlanInput } from "../lib/types";

const base: Omit<PlanInput, "interests" | "budgetMin"> = {
  points: RED_FORT_POINTS,
  startAt: RED_FORT_ENTRANCE,
  persona: "history",
};

function point(
  id: string,
  centroid: [number, number],
  tags: InterestTag[] = ["history"],
  importance: 1 | 2 | 3 = 1,
  narrationSec = { history: 60, architecture: 45, kids: 30 },
): HeritagePoint {
  return { id, siteId: "test-site", name: id, centroid, tags, importance, narrationSec };
}

describe("Brief 3 route planner", () => {
  test("is deterministic for the same PlanInput", () => {
    const input: PlanInput = { ...base, interests: ["history"], budgetMin: 45 };

    expect(planRoute(input)).toEqual(planRoute(input));
  });

  test("prefers the stronger Interest Tag match before a more important weaker match", () => {
    const points = [
      point("two-matches", [77.239, 28.6562], ["history", "architecture"], 2, {
        history: 1200,
        architecture: 1200,
        kids: 1200,
      }),
      point("one-match", [77.2391, 28.6562], ["history"], 3, {
        history: 1200,
        architecture: 1200,
        kids: 1200,
      }),
    ];

    const route = planRoute({
      points,
      interests: ["history", "architecture"],
      budgetMin: 30,
      persona: "history",
      startAt: RED_FORT_ENTRANCE,
    });

    expect(route.pointIds).toEqual(["two-matches"]);
    expect(route.droppedIds).toEqual(["one-match"]);
  });

  test("uses the relevant Heritage Point for a specific Interest Tag", () => {
    const route = planRoute({ ...base, interests: ["religion"], budgetMin: 90 });

    expect(route.pointIds).toEqual(["red-fort/moti-masjid"]);
    expect(route.droppedIds).toEqual([]);
  });

  test("treats no Interest Tags as every point being eligible", () => {
    const route = planRoute({ ...base, interests: [], budgetMin: 240 });

    expect(route.pointIds).toHaveLength(RED_FORT_POINTS.length);
    expect(route.droppedIds).toEqual([]);
  });

  test("returns only real Heritage Point IDs with no duplicates", () => {
    const route = planRoute({ ...base, interests: [], budgetMin: 90 });

    expect(new Set(route.pointIds).size).toBe(route.pointIds.length);
    expect(route.pointIds.every((id) => RED_FORT_POINTS.some((point) => point.id === id))).toBe(true);
  });

  test("returns fewer stops for a short budget and never exceeds either budget", () => {
    const points = Array.from({ length: 5 }, (_, index) =>
      point(`long-${index}`, [77.239 + index * 0.0001, 28.6562], ["history"], 1, {
        history: 1200,
        architecture: 1200,
        kids: 1200,
      }),
    );
    const common = { points, interests: [] as InterestTag[], persona: "history" as const, startAt: RED_FORT_ENTRANCE };
    const short = planRoute({ ...common, budgetMin: 30 });
    const long = planRoute({ ...common, budgetMin: 90 });

    expect(short.pointIds.length).toBeLessThan(long.pointIds.length);
    expect(short.totalMin).toBeLessThanOrEqual(30);
    expect(long.totalMin).toBeLessThanOrEqual(90);
  });

  test("includes travel from startAt and between consecutive stops without returning to the entrance", () => {
    const startAt: [number, number] = [77.238, 28.6562];
    const first = point("first", [77.239, 28.6562]);
    const second = point("second", [77.24, 28.6562]);

    const route = planRoute({
      points: [first, second],
      interests: [],
      budgetMin: 30,
      persona: "history",
      startAt,
    });
    const expectedWalkMin =
      (walkingSeconds(startAt, first.centroid) + walkingSeconds(first.centroid, second.centroid)) / 60;

    expect(route.pointIds).toEqual(["first", "second"]);
    expect(route.walkMin).toBeCloseTo(expectedWalkMin, 10);
    expect(route.totalMin).toBeCloseTo(route.walkMin + route.listenMin, 10);
  });

  test("uses Persona-specific narration time without changing all-point eligibility", () => {
    const history = planRoute({ ...base, interests: [], budgetMin: 240, persona: "history" });
    const kids = planRoute({ ...base, interests: [], budgetMin: 240, persona: "kids" });

    expect(history.pointIds).toEqual(kids.pointIds);
    expect(history.listenMin).toBeGreaterThan(kids.listenMin);
    expect(history.walkMin).toBeCloseTo(kids.walkMin, 10);
  });

  test("reports eligible Heritage Points left out by the budget in droppedIds", () => {
    const points = [
      point("included", [77.239, 28.6562], ["history"], 3, { history: 1200, architecture: 1200, kids: 1200 }),
      point("dropped-a", [77.2391, 28.6562], ["history"], 2, { history: 1200, architecture: 1200, kids: 1200 }),
      point("dropped-b", [77.2392, 28.6562], ["history"], 1, { history: 1200, architecture: 1200, kids: 1200 }),
    ];

    const route = planRoute({
      points,
      interests: [],
      budgetMin: 30,
      persona: "history",
      startAt: RED_FORT_ENTRANCE,
    });

    expect(route.pointIds).toEqual(["included"]);
    expect(route.droppedIds).toEqual(["dropped-a", "dropped-b"]);
    expect(route.pointIds.some((id) => route.droppedIds.includes(id))).toBe(false);
  });

  test("handles an empty point list", () => {
    const route = planRoute({ ...base, points: [], interests: [], budgetMin: 45 });

    expect(route).toEqual({ pointIds: [], totalMin: 0, walkMin: 0, listenMin: 0, droppedIds: [] });
  });

  test("handles one selected Heritage Point", () => {
    const onlyPoint = RED_FORT_POINTS[0];
    const route = planRoute({ ...base, points: [onlyPoint], interests: [], budgetMin: 45 });

    expect(route.pointIds).toEqual([onlyPoint.id]);
    expect(route.totalMin).toBeLessThanOrEqual(45);
  });
});
