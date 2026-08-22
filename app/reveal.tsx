"use client";

import type { ReactNode } from "react";
import { useInView } from "./use-in-view";

export default function Reveal({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [ref, state] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} data-reveal={state} className={className}>
      {children}
    </div>
  );
}
