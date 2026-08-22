"use client";

import { useEffect, useState } from "react";

// two animations here carry information, so the reduced path has to show the end state, not nothing
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listen = () => setReduced(query.matches);
    query.addEventListener("change", listen);
    return () => query.removeEventListener("change", listen);
  }, []);

  return reduced;
}

export function useWideScreen(): boolean {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    setWide(query.matches);
    const listen = () => setWide(query.matches);
    query.addEventListener("change", listen);
    return () => query.removeEventListener("change", listen);
  }, []);

  return wide;
}
