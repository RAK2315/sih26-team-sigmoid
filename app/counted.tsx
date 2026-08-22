"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "./use-in-view";

const COUNT_MS = 900;

// a tally being written rather than printed. it always lands on the real figure, and a figure
// that was already on screen when the page loaded is never taken away and counted back up
export default function Counted({ value }: { value: number }) {
  const [ref, state] = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(value);
  const fromZero = useRef(false);

  useLayoutEffect(() => {
    if (state !== "pending") return;
    fromZero.current = true;
    setShown(0);
  }, [state]);

  useEffect(() => {
    if (state !== "shown" || !fromZero.current) return;
    fromZero.current = false;
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now: number) {
      const t = Math.min(1, (now - start) / COUNT_MS);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [state, value]);

  return <span ref={ref}>{shown}</span>;
}
