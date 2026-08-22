"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

export type InView = "pending" | "shown";

// the server sends everything visible, so nothing is hidden unless it is below the fold at the
// moment this mounts. that way there is never a flash of content being taken away
export function useInView<T extends HTMLElement>(): [RefObject<T | null>, InView] {
  const ref = useRef<T>(null);
  const [state, setState] = useState<InView>("shown");

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState("pending");
    const watcher = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setState("shown");
        watcher.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);

  return [ref, state];
}
