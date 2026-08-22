import { RED_FORT_ENTRANCE, RED_FORT_POINTS } from "../content/red-fort";
import { planRoute } from "../lib/planner";
import type { PlanInput } from "../lib/types";

const input: PlanInput = {
  points: RED_FORT_POINTS,
  interests: ["architecture"],
  budgetMin: 45,
  persona: "architecture",
  startAt: RED_FORT_ENTRANCE,
};
const route = planRoute(input);

console.assert(Array.isArray(route.pointIds) && Array.isArray(route.droppedIds));
console.assert(route.totalMin <= 45, "must respect the budget");
console.assert(Math.abs(route.totalMin - (route.walkMin + route.listenMin)) < 0.5, "totals must add up");
console.assert(new Set(route.pointIds).size === route.pointIds.length, "no duplicates");
console.assert(!route.pointIds.some((id) => route.droppedIds.includes(id)), "a point cannot be both");
console.assert(JSON.stringify(planRoute(input)) === JSON.stringify(route), "must be deterministic");

const longerRoute = planRoute({ ...input, budgetMin: 90 });
console.assert(longerRoute.pointIds.length >= route.pointIds.length, "more time cannot remove stops");
console.assert(planRoute({ ...input, points: [] }).pointIds.length === 0, "empty input must work");
console.assert(planRoute({ ...input, points: [RED_FORT_POINTS[0]] }).pointIds.length === 1, "one point must work");

for (const point of RED_FORT_POINTS) {
  console.assert(point.centroid[0] > 76.8 && point.centroid[0] < 77.4, `${point.id}: longitude must be first`);
  console.assert(point.centroid[1] > 28.3 && point.centroid[1] < 28.9, `${point.id}: latitude must be second`);
}

console.log(`Verified ${route.pointIds.length} stops, ${route.droppedIds.length} dropped, ${route.totalMin.toFixed(1)} minutes.`);
