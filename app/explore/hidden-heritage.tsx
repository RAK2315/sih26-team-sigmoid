"use client";

import { useEffect, useState } from "react";
import { metresBetween } from "@/lib/location/geometry";
import type { Coord, HeritageSite, StoredCandidate } from "@/lib/types";

export interface HiddenEntry {
  id: string;
  name: string;
  distanceM: number;
  why: string;
  evidence: string;
  verified: boolean;
  centroid: Coord;
}

// low representation and close by, which is the pairing the panel exists to surface
function siteScore(site: HeritageSite, distanceM: number): number {
  return (1 - site.representationScore) * (1 / (1 + distanceM / 3000));
}

export function buildHidden(
  sites: HeritageSite[],
  candidates: StoredCandidate[],
  from: Coord,
): HiddenEntry[] {
  const fromSites = sites
    .filter((s) => s.representationScore <= 0.45)
    .map((s) => {
      const distanceM = metresBetween(from, s.centroid);
      return {
        id: s.id,
        name: s.name,
        distanceM,
        why: `${Math.round((1 - s.representationScore) * 100)} out of 100 on how little it is written about`,
        evidence: s.coordSource === "approximate" ? "position approximate, no mapped feature" : s.coordSource,
        verified: false,
        centroid: s.centroid,
        score: siteScore(s, distanceM),
      };
    });

  // only verified Candidates cross over. ADR-0003: nothing automated may put a place on this list
  const fromPipeline = candidates
    .filter((c) => c.status === "verified")
    .map((c) => {
      const distanceM = metresBetween(from, c.centroid);
      return {
        id: c.id,
        name: c.name,
        distanceM,
        why: "recorded once by the survey, confirmed by a Reviewer",
        evidence:
          c.baselineVerdict === "representation_gap"
            ? `Zafar Hasan Vol. 2, scan ${c.pageNo}, and nothing in the modern baseline sits inside its circle`
            : `Zafar Hasan Vol. 2, scan ${c.pageNo}`,
        verified: true,
        centroid: c.centroid,
        score: 1 / (1 + distanceM / 3000),
      };
    });

  return [...fromPipeline, ...fromSites]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ score, ...rest }) => {
      void score;
      return rest;
    });
}

export default function HiddenHeritage({
  sites,
  from,
  onPick,
}: {
  sites: HeritageSite[];
  from: Coord;
  onPick: (centroid: Coord) => void;
}) {
  const [entries, setEntries] = useState<HiddenEntry[] | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/candidates", { cache: "no-store" })
      .then((r) => r.json())
      .then((body: { candidates: StoredCandidate[] }) => {
        if (live) setEntries(buildHidden(sites, body.candidates, from));
      })
      // the sites half needs nothing from the network, so it still has something to show
      .catch(() => live && setEntries(buildHidden(sites, [], from)));
    return () => {
      live = false;
    };
  }, [sites, from]);

  if (entries === null) return null;

  return (
    <div className="border border-ink-faint/40 bg-paper-raised p-4 shadow-paper">
      <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
        Hidden heritage
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        Places near you that almost nobody visits, and what each claim rests on.
      </p>
      <ul className="mt-3 max-h-64 overflow-y-auto">
        {entries.map((e) => (
          <li key={e.id} className="border-t border-ink-faint/20 py-2">
            <button type="button" onClick={() => onPick(e.centroid)} className="w-full text-left">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`text-sm ${e.verified ? "font-medium text-state-verified" : "text-ink"}`}
                >
                  {e.verified && "✓ "}
                  {e.name}
                </span>
                <span className="font-archive shrink-0 text-[11px] text-ink-faint">
                  {(e.distanceM / 1000).toFixed(1)} km
                </span>
              </div>
              <p className="font-archive mt-0.5 text-[11px] leading-relaxed text-ink-faint">
                {e.why}
                <br />
                {e.evidence}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
