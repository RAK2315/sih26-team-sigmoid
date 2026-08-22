import { bearing, destination, midpoint } from "@turf/turf";
import { describe, expect, test } from "vitest";
import { zone as diwanIAamZone, centroid as diwanIAamCentroid } from "@/content/zones/red-fort-diwan-i-aam";
import { zone as diwanIKhasZone, centroid as diwanIKhasCentroid } from "@/content/zones/red-fort-diwan-i-khas";
import { zone as khasMahalZone, centroid as khasMahalCentroid } from "@/content/zones/red-fort-khas-mahal";
import { initialState, prepare, step } from "@/lib/location/engine";
import type { EngineConfig, EngineState } from "@/lib/location/engine";
import type { Coord, Fix, HeritagePoint } from "@/lib/types";

const CONFIG: EngineConfig = {
  dwellMs: 3000,
  facingToleranceDeg: 60,
  approachBufferM: 25,
  dwellDriftM: 1.5,
  rearmBufferM: 10,
  rearmMs: 3000,
  sightRangeM: 40,
};

function heritagePoint(id: string, zone: GeoJSON.Polygon, centroid: Coord): HeritagePoint {
  return {
    id,
    siteId: "red-fort",
    name: id,
    tags: ["history"],
    importance: 3,
    zone,
    centroid,
    livingTradition: null,
  };
}

const diwanIAam = heritagePoint("red-fort/diwan-i-aam", diwanIAamZone, diwanIAamCentroid);

// due south of the hall and about 35 m off, which is inside a 25 m Approach Ring but outside the Zone
const SOUTH_OF_DIWAN_I_AAM: Coord = [77.242348, 28.655418];

function fix(at: Coord, headingDeg: number | null, t: number): Fix {
  return { lng: at[0], lat: at[1], headingDeg, accuracyM: 1, t, source: "sim" };
}

function walk(state: EngineState, fixes: Fix[], prepared = prepare([diwanIAam], CONFIG)) {
  let current = state;
  const crossings = [];
  let statuses = step(current, fixes[0], prepared, CONFIG).statuses;
  for (const f of fixes) {
    const result = step(current, f, prepared, CONFIG);
    current = result.state;
    crossings.push(...result.crossings);
    statuses = result.statuses;
  }
  return { state: current, crossings, statuses };
}

describe("Threshold Crossing", () => {
  test("fires once the Visitor has faced the Heritage Point for the full dwell", () => {
    const result = walk(initialState(), [
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 0),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 1000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 2000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 3000),
    ]);

    expect(result.crossings).toHaveLength(1);
    expect(result.crossings[0].pointId).toBe("red-fort/diwan-i-aam");
    expect(result.crossings[0].kind).toBe("approach");
  });

  test("does not fire on a Visitor who walks straight past without stopping", () => {
    // due south of the hall by 30 m, starting 70 m west of it, heading east at walking pace
    const south = destination(diwanIAamCentroid, 30, 180, { units: "meters" });
    let at = destination(south, 70, 270, { units: "meters" }).geometry.coordinates as Coord;

    const fixes: Fix[] = [];
    for (let second = 0; second <= 100; second++) {
      fixes.push(fix(at, 90, second * 1000));
      at = destination(at, 1.4, 90, { units: "meters" }).geometry.coordinates as Coord;
    }

    expect(walk(initialState(), fixes).crossings).toHaveLength(0);
  });

  test("picks the Faced Heritage Point when the Visitor stands inside two overlapping rings", () => {
    const diwanIKhas = heritagePoint("red-fort/diwan-i-khas", diwanIKhasZone, diwanIKhasCentroid);
    const khasMahal = heritagePoint("red-fort/khas-mahal", khasMahalZone, khasMahalCentroid);
    const prepared = prepare([diwanIKhas, khasMahal], CONFIG);

    // halfway between the two, which are about 38 m apart, so both rings contain it
    const between = midpoint(diwanIKhasCentroid, khasMahalCentroid).geometry.coordinates as Coord;
    const facingDiwanIKhas = bearing(between, diwanIKhasCentroid);

    const result = walk(
      initialState(),
      [0, 1000, 2000, 3000].map((t) => fix(between, facingDiwanIKhas, t)),
      prepared,
    );

    expect(result.statuses.every((s) => s.inRing)).toBe(true);
    expect(result.crossings.map((c) => c.pointId)).toEqual(["red-fort/diwan-i-khas"]);
  });

  test("fires at most once per Walk when the Visitor steps out and straight back in", () => {
    // 56 m south of the centre is outside the 25 m ring but only about 5 m beyond it
    const justOutside = destination(diwanIAamCentroid, 56, 180, { units: "meters" })
      .geometry.coordinates as Coord;

    const result = walk(initialState(), [
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 0),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 3000),
      fix(justOutside, 0, 4000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 5000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 8000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 11000),
    ]);

    expect(result.crossings).toHaveLength(1);
  });

  test("re-arms only after the Visitor is fully clear of the ring for long enough", () => {
    // 70 m south of the centre clears the ring by more than the 10 m re-arm margin
    const wellClear = destination(diwanIAamCentroid, 70, 180, { units: "meters" })
      .geometry.coordinates as Coord;

    const firstCrossing = [fix(SOUTH_OF_DIWAN_I_AAM, 0, 0), fix(SOUTH_OF_DIWAN_I_AAM, 0, 3000)];

    const tooBrief = walk(initialState(), [
      ...firstCrossing,
      fix(wellClear, 0, 4000),
      fix(wellClear, 0, 5000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 6000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 9000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 12000),
    ]);
    expect(tooBrief.crossings).toHaveLength(1);

    const longEnough = walk(initialState(), [
      ...firstCrossing,
      fix(wellClear, 0, 4000),
      fix(wellClear, 0, 7000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 8000),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 11000),
    ]);
    expect(longEnough.crossings).toHaveLength(2);
  });

  test("stepping inside the Zone after it has spoken fires the inside detail, once", () => {
    const inside = diwanIAamCentroid;

    const result = walk(initialState(), [
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 0),
      fix(SOUTH_OF_DIWAN_I_AAM, 0, 3000),
      fix(inside, 0, 4000),
      fix(inside, 0, 5000),
      fix(inside, 0, 6000),
    ]);

    expect(result.crossings.map((c) => c.kind)).toEqual(["approach", "inside"]);
  });

  test("does not fire the inside detail before the Heritage Point has spoken", () => {
    const result = walk(initialState(), [
      fix(diwanIAamCentroid, 0, 0),
      fix(diwanIAamCentroid, 0, 1000),
    ]);

    expect(result.crossings.filter((c) => c.kind === "inside")).toHaveLength(0);
  });
});

// 70 m due south of the hall, which is well outside a 25 m Approach Ring but close enough that
// a 40 m sight line thrown from here lands on it
const IN_SIGHT_OF_DIWAN_I_AAM: Coord = destination(diwanIAamCentroid, 70, 180, {
  units: "meters",
}).geometry.coordinates as Coord;

const FAR_FROM_DIWAN_I_AAM: Coord = destination(diwanIAamCentroid, 200, 180, {
  units: "meters",
}).geometry.coordinates as Coord;

describe("the sight line", () => {
  test("fires from outside the Approach Ring when the Visitor is looking at it", () => {
    const result = walk(initialState(), [
      fix(IN_SIGHT_OF_DIWAN_I_AAM, 0, 0),
      fix(IN_SIGHT_OF_DIWAN_I_AAM, 0, 1500),
      fix(IN_SIGHT_OF_DIWAN_I_AAM, 0, 3000),
    ]);

    expect(result.statuses[0].inRing).toBe(false);
    expect(result.statuses[0].inSight).toBe(true);
    expect(result.crossings.map((c) => c.kind)).toEqual(["approach"]);
  });

  test("stays quiet from the same spot when the Visitor has their back to it", () => {
    const result = walk(initialState(), [
      fix(IN_SIGHT_OF_DIWAN_I_AAM, 180, 0),
      fix(IN_SIGHT_OF_DIWAN_I_AAM, 180, 1500),
      fix(IN_SIGHT_OF_DIWAN_I_AAM, 180, 3000),
    ]);

    expect(result.statuses[0].inSight).toBe(false);
    expect(result.crossings).toHaveLength(0);
  });

  test("stays quiet past the sight range even facing straight at it", () => {
    const result = walk(initialState(), [
      fix(FAR_FROM_DIWAN_I_AAM, 0, 0),
      fix(FAR_FROM_DIWAN_I_AAM, 0, 1500),
      fix(FAR_FROM_DIWAN_I_AAM, 0, 3000),
    ]);

    expect(result.statuses[0].inSight).toBe(false);
    expect(result.crossings).toHaveLength(0);
  });

  test("does nothing without a compass, because a sight line needs a direction", () => {
    const result = walk(initialState(), [
      fix(IN_SIGHT_OF_DIWAN_I_AAM, null, 0),
      fix(IN_SIGHT_OF_DIWAN_I_AAM, null, 1500),
      fix(IN_SIGHT_OF_DIWAN_I_AAM, null, 3000),
    ]);

    expect(result.statuses[0].inSight).toBe(false);
    expect(result.crossings).toHaveLength(0);
  });

  test("leaves the Approach Ring alone, so a Visitor inside it with no compass still hears it", () => {
    const result = walk(initialState(), [
      fix(SOUTH_OF_DIWAN_I_AAM, null, 0),
      fix(SOUTH_OF_DIWAN_I_AAM, null, 1500),
      fix(SOUTH_OF_DIWAN_I_AAM, null, 3000),
    ]);

    expect(result.statuses[0].inRing).toBe(true);
    expect(result.crossings.map((c) => c.kind)).toEqual(["approach"]);
  });
});
