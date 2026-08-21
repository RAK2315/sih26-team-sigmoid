"use client";

import { useEffect, useRef, useState } from "react";
import { GPS_SETTLE_M } from "@/lib/location/config";
import { metresBetween } from "@/lib/location/geometry";
import type { Coord, Fix } from "@/lib/types";

const TICK_MS = 500;

export type GpsState = "off" | "asking" | "live" | "denied" | "unavailable";

export interface GpsLocation {
  fix: Fix | null;
  state: GpsState;
  message: string | null;
  hasCompass: boolean;
}

// a real fix wanders several metres while the phone sits on a wall, and Dwell resets at 1.5 m of
// drift, so a raw watchPosition feed means a Threshold Crossing that can never fire. the position
// only moves once a reading is clearly outside the noise, which is a job for the source, not the
// engine.
function settle(previous: Coord | null, next: Coord, accuracyM: number): Coord {
  if (previous === null) return next;
  const moved = metresBetween(previous, next);
  return moved > Math.max(GPS_SETTLE_M, accuracyM * 0.5) ? next : previous;
}

export function useGpsLocation(enabled: boolean): GpsLocation {
  const [state, setState] = useState<GpsState>("off");
  const [message, setMessage] = useState<string | null>(null);
  const [fix, setFix] = useState<Fix | null>(null);
  const [hasCompass, setHasCompass] = useState(false);

  const at = useRef<Coord | null>(null);
  const accuracy = useRef(0);
  // the compass is the only source. position.coords.heading is null whenever the phone is still,
  // which is exactly when Dwell runs, so holding on to the last moving value would aim the Facing
  // gate at a bearing the Visitor has since turned away from.
  const heading = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setState("off");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState("unavailable");
      setMessage("This browser has no location service, so the walk stays simulated.");
      return;
    }

    setState("asking");
    setMessage("Waiting for the first fix from the phone.");

    const watch = navigator.geolocation.watchPosition(
      (position) => {
        const reading: Coord = [position.coords.longitude, position.coords.latitude];
        accuracy.current = position.coords.accuracy;
        at.current = settle(at.current, reading, position.coords.accuracy);
        setState("live");
        setMessage(null);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setState("denied");
          setMessage("Location was refused, so the walk stays simulated. Nothing else changes.");
          return;
        }
        // a stationary phone times out routinely, and the fix it already gave us is still good
        if (at.current !== null) return;
        setState("unavailable");
        setMessage("No fix from the phone yet. Outdoors and away from walls works best.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );

    function onOrientation(event: DeviceOrientationEvent) {
      const webkit = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
        .webkitCompassHeading;
      if (typeof webkit === "number") {
        heading.current = webkit;
        setHasCompass(true);
        return;
      }
      if (event.absolute && typeof event.alpha === "number") {
        heading.current = (360 - event.alpha) % 360;
        setHasCompass(true);
      }
    }

    window.addEventListener("deviceorientationabsolute", onOrientation);
    window.addEventListener("deviceorientation", onOrientation);

    // Dwell counts time, so the engine needs a fix on every tick even when nothing has moved
    const timer = setInterval(() => {
      if (at.current === null) return;
      setFix({
        lng: at.current[0],
        lat: at.current[1],
        headingDeg: heading.current,
        accuracyM: accuracy.current,
        t: Date.now(),
        source: "gps",
      });
    }, TICK_MS);

    return () => {
      navigator.geolocation.clearWatch(watch);
      window.removeEventListener("deviceorientationabsolute", onOrientation);
      window.removeEventListener("deviceorientation", onOrientation);
      clearInterval(timer);
      at.current = null;
      heading.current = null;
      setFix(null);
      setHasCompass(false);
    };
  }, [enabled]);

  return { fix, state, message, hasCompass };
}
