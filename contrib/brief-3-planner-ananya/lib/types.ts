export type InterestTag =
  | 'history' | 'architecture' | 'culture_traditions' | 'military' | 'religion';

export type Persona = 'history' | 'architecture' | 'kids';

export interface HeritagePoint {
  id: string;                    // 'red-fort/diwan-i-aam'
  siteId: string;                // 'red-fort'
  name: string;
  tags: InterestTag[];
  importance: 1 | 2 | 3;         // 3 = skipping it means you missed the site
  centroid: [number, number];    // [lng, lat] GeoJSON order
  narrationSec: Record<Persona, number>;  // how long each persona's audio runs
}

export interface PlanInput {
  points: HeritagePoint[];
  interests: InterestTag[];      // empty array means "everything"
  budgetMin: 30 | 45 | 90 | 240;
  persona: Persona;
  startAt: [number, number];     // [lng, lat] - the site entrance
}

export interface Route {
  pointIds: string[];            // ordered
  totalMin: number;
  walkMin: number;
  listenMin: number;
  droppedIds: string[];          // matched interests but did not fit the budget
}

export declare function planRoute(input: PlanInput): Route;
