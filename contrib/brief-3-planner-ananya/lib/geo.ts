import { distance } from "@turf/turf";

export type Coord = [number, number];

export function haversineMetres(from: Coord, to: Coord): number {
  return distance(from, to, { units: "meters" });
}

// Leaflet is the only consumer that needs [lat, lng]. All planner data stays [lng, lat].
export function toLeaflet(coord: Coord): [number, number] {
  return [coord[1], coord[0]];
}
