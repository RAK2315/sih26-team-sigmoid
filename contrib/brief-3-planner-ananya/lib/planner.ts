import { haversineMetres } from "./geo";
import type { HeritagePoint, InterestTag, Persona, PlanInput, Route } from "./types";

const WALKING_SPEED_METRES_PER_SECOND = 1.2;
const EXACT_ORDER_LIMIT = 12;

interface RouteCosts {
  walkSec: number;
  listenSec: number;
}

// Persona changes narration duration, not point membership. Interest Tags decide membership.
export function scorePoint(point: HeritagePoint, interests: InterestTag[]): number {
  const interestMatch = interests.length === 0
    ? 1
    : point.tags.filter((tag) => interests.includes(tag)).length;

  return interestMatch * 2 + point.importance;
}

function matchesInterests(point: HeritagePoint, interests: InterestTag[]): boolean {
  return interests.length === 0 || point.tags.some((tag) => interests.includes(tag));
}

// All coordinates remain [lng, lat], which is the order Turf expects.
export function walkingSeconds(from: [number, number], to: [number, number]): number {
  return haversineMetres(from, to) / WALKING_SPEED_METRES_PER_SECOND;
}

function listeningSeconds(point: HeritagePoint, persona: Persona): number {
  return point.narrationSec[persona];
}

function nearestNeighbour(points: HeritagePoint[], startAt: [number, number]): HeritagePoint[] {
  const remaining = [...points];
  const ordered: HeritagePoint[] = [];
  let current = startAt;

  while (remaining.length > 0) {
    let nextIndex = 0;
    for (let index = 1; index < remaining.length; index++) {
      const candidateDistance = walkingSeconds(current, remaining[index].centroid);
      const bestDistance = walkingSeconds(current, remaining[nextIndex].centroid);
      if (
        candidateDistance < bestDistance ||
        (candidateDistance === bestDistance && remaining[index].id.localeCompare(remaining[nextIndex].id) < 0)
      ) {
        nextIndex = index;
      }
    }

    const [next] = remaining.splice(nextIndex, 1);
    ordered.push(next);
    current = next.centroid;
  }

  return ordered;
}

// Held-Karp finds the shortest open walk from startAt. It does not return to the entrance.
export function orderPoints(points: HeritagePoint[], startAt: [number, number]): HeritagePoint[] {
  const count = points.length;
  if (count === 0) return [];
  if (count > EXACT_ORDER_LIMIT) return nearestNeighbour(points, startAt);

  const fromStart = points.map((point) => walkingSeconds(startAt, point.centroid));
  const between = points.map((from) =>
    points.map((to) => walkingSeconds(from.centroid, to.centroid)),
  );
  const maskCount = 1 << count;
  const best = Array.from({ length: maskCount }, () => new Array<number>(count).fill(Infinity));
  const parent = Array.from({ length: maskCount }, () => new Array<number>(count).fill(-1));

  for (let index = 0; index < count; index++) {
    best[1 << index][index] = fromStart[index];
  }

  for (let mask = 1; mask < maskCount; mask++) {
    for (let last = 0; last < count; last++) {
      if ((mask & (1 << last)) === 0 || best[mask][last] === Infinity) continue;

      for (let next = 0; next < count; next++) {
        if ((mask & (1 << next)) !== 0) continue;

        const nextMask = mask | (1 << next);
        const candidateCost = best[mask][last] + between[last][next];
        if (candidateCost < best[nextMask][next]) {
          best[nextMask][next] = candidateCost;
          parent[nextMask][next] = last;
        }
      }
    }
  }

  const fullMask = maskCount - 1;
  let last = 0;
  for (let index = 1; index < count; index++) {
    if (best[fullMask][index] < best[fullMask][last]) last = index;
  }

  const reversed: number[] = [];
  let mask = fullMask;
  while (last !== -1) {
    reversed.push(last);
    const previous = parent[mask][last];
    mask ^= 1 << last;
    last = previous;
  }

  return reversed.reverse().map((index) => points[index]);
}

function costsFor(ordered: HeritagePoint[], startAt: [number, number], persona: Persona): RouteCosts {
  let previous = startAt;
  let walkSec = 0;
  let listenSec = 0;

  for (const point of ordered) {
    walkSec += walkingSeconds(previous, point.centroid);
    listenSec += listeningSeconds(point, persona);
    previous = point.centroid;
  }

  return { walkSec, listenSec };
}

export function choosePoints(input: PlanInput): { chosen: HeritagePoint[]; droppedIds: string[] } {
  const eligible = input.points
    .filter((point) => matchesInterests(point, input.interests))
    .sort((left, right) =>
      scorePoint(right, input.interests) - scorePoint(left, input.interests) || left.id.localeCompare(right.id),
    );
  const chosen: HeritagePoint[] = [];
  const budgetSec = input.budgetMin * 60;

  for (let index = 0; index < eligible.length; index++) {
    const candidate = eligible[index];
    const orderedCandidate = orderPoints([...chosen, candidate], input.startAt);
    const costs = costsFor(orderedCandidate, input.startAt, input.persona);

    if (costs.walkSec + costs.listenSec > budgetSec) {
      return { chosen, droppedIds: eligible.slice(index).map((point) => point.id) };
    }

    chosen.push(candidate);
  }

  return { chosen, droppedIds: [] };
}

export function planRoute(input: PlanInput): Route {
  const { chosen, droppedIds } = choosePoints(input);
  const ordered = orderPoints(chosen, input.startAt);
  const { walkSec, listenSec } = costsFor(ordered, input.startAt, input.persona);

  return {
    pointIds: ordered.map((point) => point.id),
    walkMin: walkSec / 60,
    listenMin: listenSec / 60,
    totalMin: (walkSec + listenSec) / 60,
    droppedIds,
  };
}
