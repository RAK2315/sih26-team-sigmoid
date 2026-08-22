import { diwanIAam } from "../content/points/red-fort/diwan-i-aam";
import { initialState, prepare, step } from "../lib/location/engine";
import { moveBy } from "../lib/location/geometry";
import type { Coord, Fix } from "../lib/types";

const CONFIG = {
  dwellMs: 3000, facingToleranceDeg: 60, approachBufferM: 25,
  dwellDriftM: 1.5, rearmBufferM: 10, rearmMs: 3000, sightRangeM: 40,
};
const prepared = prepare([diwanIAam], CONFIG);

function run(label: string, headingWhileStopped: number) {
  let state = initialState();
  let at: Coord = moveBy(diwanIAam.centroid, 70, 180);
  let t = 0;
  let fired: number | null = null;

  // walk north at 1.2 m/s for 30 s, then stand still for 6 s
  for (let tick = 0; tick < 180; tick++) {
    const walking = tick < 150;
    if (walking) at = moveBy(at, 1.2 * 0.2, 0);
    const fix: Fix = {
      lng: at[0], lat: at[1],
      headingDeg: walking ? 0 : headingWhileStopped,
      accuracyM: 1, t, source: "sim",
    };
    const result = step(state, fix, prepared, CONFIG);
    state = result.state;
    if (result.crossings.length > 0 && fired === null) fired = t;
    t += 200;
  }
  console.log(`${label.padEnd(34)} ${fired === null ? "never fired" : `fired at ${(fired / 1000).toFixed(1)}s`}`);
}

run("walk up, stop, keep facing it", 0);
run("walk up, stop, turn 90 away", 90);
run("walk up, stop, turn right around", 180);
