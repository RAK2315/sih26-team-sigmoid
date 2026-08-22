"use client";

import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "../use-reduced-motion";

// the passage lights up in the page's own text, so a reader can check the claim against the scan
export default function PageText({
  text,
  highlight,
  markRef,
  boxRef,
}: {
  text: string;
  highlight: [number, number] | null;
  markRef: RefObject<HTMLElement | null>;
  boxRef: RefObject<HTMLPreElement | null>;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    markRef.current?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
  }, [highlight, markRef, reduced]);

  const usable = highlight !== null && highlight[1] > highlight[0] && highlight[1] <= text.length;

  return (
    <pre
      ref={boxRef}
      className="font-archive mt-4 max-h-96 overflow-y-auto border border-ink-faint/30 bg-paper-raised p-3 text-[12px] leading-relaxed whitespace-pre-wrap text-ink-muted"
    >
      {usable ? (
        <>
          {text.slice(0, highlight[0])}
          {/* the key restarts the sweep when a different passage is chosen */}
          <mark
            key={`${highlight[0]}-${highlight[1]}`}
            ref={markRef}
            className="passage-sweep bg-transparent"
          >
            {text.slice(highlight[0], highlight[1])}
          </mark>
          {text.slice(highlight[1])}
        </>
      ) : (
        text
      )}
    </pre>
  );
}
