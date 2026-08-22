"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

// how far down the page you are, as a hairline rule. one CSS variable, no re-renders
export default function ScrollRule() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;

    let queued = 0;
    const draw = () => {
      queued = 0;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      element.style.setProperty("--read", room > 0 ? String(window.scrollY / room) : "0");
    };
    const onScroll = () => {
      if (queued === 0) queued = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (queued !== 0) cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return <div ref={ref} className="scroll-rule" aria-hidden="true" />;
}
