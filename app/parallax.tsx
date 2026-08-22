"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "./use-reduced-motion";

// the backdrop drifts slower than the page, so a flat plate reads as depth
export default function Parallax({
  speed = 0.25,
  className,
  children,
}: {
  speed?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    const frame = element?.parentElement;
    if (!element || !frame || reduced) return;

    let queued = 0;
    // the parent is measured because moving the child would move what we are measuring
    const move = () => {
      queued = 0;
      element.style.transform = `translate3d(0, ${-frame.getBoundingClientRect().top * speed}px, 0)`;
    };
    const onScroll = () => {
      if (queued === 0) queued = requestAnimationFrame(move);
    };

    move();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (queued !== 0) cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      element.style.transform = "";
    };
  }, [reduced, speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
