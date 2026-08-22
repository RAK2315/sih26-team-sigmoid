"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { moveBy } from "@/lib/location/geometry";
import type { Coord, Fix } from "@/lib/types";

const TICK_MS = 200;
const TURN_DEG = 15;
const STEP_M = 5;

// the engine needs a fix on every tick even when nobody is moving, because Dwell counts time
export function useSimLocation(start: Coord, startHeadingDeg: number, enabled: boolean) {
  const at = useRef<Coord>(start);
  const heading = useRef(startHeadingDeg);
  const [fix, setFix] = useState<Fix>({
    lng: start[0],
    lat: start[1],
    headingDeg: startHeadingDeg,
    accuracyM: 1,
    t: Date.now(),
    source: "sim",
  });
  const [walking, setWalking] = useState(false);
  const [speedMs, setSpeedMs] = useState(1.2);

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => {
      if (walking) at.current = moveBy(at.current, (speedMs * TICK_MS) / 1000, heading.current);
      setFix({
        lng: at.current[0],
        lat: at.current[1],
        headingDeg: heading.current,
        accuracyM: 1,
        t: Date.now(),
        source: "sim",
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [walking, speedMs, enabled]);

  const moveTo = useCallback((next: Coord) => {
    at.current = next;
  }, []);

  const turn = useCallback((degrees: number) => {
    heading.current = (heading.current + degrees + 360) % 360;
  }, []);

  const stepForward = useCallback((metres: number) => {
    at.current = moveBy(at.current, metres, heading.current);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") turn(-TURN_DEG);
      else if (event.key === "ArrowRight") turn(TURN_DEG);
      else if (event.key === "ArrowUp") stepForward(STEP_M);
      else if (event.key === "ArrowDown") stepForward(-STEP_M);
      else return;
      event.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn, stepForward, enabled]);

  return { fix, moveTo, turn, walking, setWalking, speedMs, setSpeedMs };
}
