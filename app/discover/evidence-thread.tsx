"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "../use-reduced-motion";

export interface PinPoint {
  x: number;
  y: number;
}

// the line from the quoted passage to the pin it produced, drawn over the whole page
export default function EvidenceThread({
  markRef,
  boxRef,
  mapBoxRef,
  pin,
  drawKey,
}: {
  markRef: RefObject<HTMLElement | null>;
  boxRef: RefObject<HTMLPreElement | null>;
  mapBoxRef: RefObject<HTMLDivElement | null>;
  pin: PinPoint | null;
  drawKey: string;
}) {
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  const measure = useCallback(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const dot = dotRef.current;
    const mark = markRef.current;
    const box = boxRef.current;
    const mapBox = mapBoxRef.current;
    if (!svg || !path || !dot) return;
    if (!mark || !box || !mapBox || pin === null) {
      svg.style.opacity = "0";
      return;
    }

    const m = mark.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const map = mapBox.getBoundingClientRect();

    // the passage can be scrolled out of its own box, so the line starts at the edge instead
    const x1 = Math.min(m.right, b.right - 6);
    const y1 = Math.min(Math.max(m.top + m.height / 2, b.top + 6), b.bottom - 6);
    const x2 = map.left + pin.x;
    const y2 = map.top + pin.y;

    const bend = Math.max(Math.abs(x2 - x1) * 0.45, 48);
    path.setAttribute("d", `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
    dot.setAttribute("cx", String(x2));
    dot.setAttribute("cy", String(y2));
    svg.style.opacity = "1";
  }, [markRef, boxRef, mapBoxRef, pin]);

  useLayoutEffect(() => {
    measure();
    const path = pathRef.current;
    if (!path || reduced) return;
    const length = path.getTotalLength();
    if (length === 0) return;
    path.style.transition = "none";
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    // reading a layout value here is what makes the transition start from the offset just set
    void path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset .75s cubic-bezier(.2,.7,.3,1)";
    path.style.strokeDashoffset = "0";

    // once it has drawn, drop the inline dashes so the line settles back to its dashed evidence look
    const settle = () => {
      path.style.transition = "";
      path.style.strokeDasharray = "";
      path.style.strokeDashoffset = "";
    };
    path.addEventListener("transitionend", settle, { once: true });
    return () => path.removeEventListener("transitionend", settle);
  }, [drawKey, measure, reduced]);

  // the panels around it settle over the next few frames, so the ends are re-read until they stop
  useEffect(() => {
    let frame = 0;
    const until = performance.now() + 700;
    const tick = () => {
      measure();
      if (performance.now() < until) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [drawKey, measure]);

  useEffect(() => {
    const again = () => measure();
    window.addEventListener("scroll", again, true);
    window.addEventListener("resize", again);
    return () => {
      window.removeEventListener("scroll", again, true);
      window.removeEventListener("resize", again);
    };
  }, [measure]);

  return (
    <svg
      ref={svgRef}
      className="thread-draw pointer-events-none fixed inset-0 z-[700] h-full w-full"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <path ref={pathRef} fill="none" stroke="#9A3412" strokeWidth="1.25" strokeDasharray="3 4" />
      <circle ref={dotRef} r="3.5" fill="#9A3412" fillOpacity="0.85" />
    </svg>
  );
}
