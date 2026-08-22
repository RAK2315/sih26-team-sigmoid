"use client";

import { useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const WIDE = "(min-width: 1024px)";

function watcher(query: string) {
  return (onChange: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  };
}

const watchReduced = watcher(REDUCED);
const watchWide = watcher(WIDE);

// two animations here carry information, so the reduced path has to show the end state, not nothing
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    watchReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

export function useWideScreen(): boolean {
  return useSyncExternalStore(
    watchWide,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}
