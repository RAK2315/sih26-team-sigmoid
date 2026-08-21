"use client";

import { useEffect, useState } from "react";

interface Crossing {
  pointId: string;
  siteId: string;
  persona: string;
  kind: string;
  locationSource: string;
  createdAt: string;
}

export default function WalkLog() {
  const [crossings, setCrossings] = useState<Crossing[]>([]);
  const [reachable, setReachable] = useState<boolean | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/walk/recent", { cache: "no-store" });
      const body = (await res.json()) as { reachable: boolean; crossings: Crossing[] };
      setCrossings(body.crossings);
      setReachable(body.reachable);
    } catch {
      setReachable(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="mt-10 border-t border-ink-faint/30 pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">Walk log</p>
          <h2 className="font-display text-xl text-ink">Threshold Crossings that happened</h2>
        </div>
        <button
          type="button"
          onClick={load}
          className="font-archive border border-ink-faint/40 px-2 py-1 text-[11px] text-ink-muted hover:bg-paper-sunk"
        >
          Refresh
        </button>
      </div>

      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Anonymous. A Walk is a random id made in the browser and thrown away, never a person.
      </p>

      {reachable === false && (
        <p className="mt-3 text-sm text-madder">
          The database is unreachable, so this is empty rather than complete. Crossings made now
          are held in the browser until it comes back.
        </p>
      )}

      {reachable && crossings.length === 0 && (
        <p className="mt-3 text-sm text-ink-muted">No Walk has been recorded yet.</p>
      )}

      <ul className="mt-3">
        {crossings.map((c, i) => (
          <li
            key={`${c.createdAt}-${i}`}
            className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-faint/20 py-1.5 text-sm"
          >
            <span className="text-ink">{c.pointId}</span>
            <span className="font-archive text-[11px] text-ink-faint">
              {c.persona} &middot; {c.kind} &middot; {c.locationSource} &middot;{" "}
              {new Date(c.createdAt).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
