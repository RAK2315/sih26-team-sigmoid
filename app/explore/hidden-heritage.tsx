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
  // true when the place is on this list because we judged it so, not because evidence put it here
  editorial: boolean;
  centroid: Coord;
}

// representationScore is a number we set by hand. it orders this list and it is not derived from
// anything, so entries that depend on it say so on screen rather than borrowing the authority of
// the Candidates beside them.
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
        why: "we rank this among Delhi's least visited, which is our judgement and not a measurement",
        evidence:
          s.coordSource === "approximate" ? "position approximate, no mapped feature" : s.coordSource,
        verified: false,
        editorial: true,
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
        editorial: false,
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
  const [source, setSource] = useState<"live" | "stale" | "unreachable">("live");

  useEffect(() => {
    let live = true;
    fetch("/api/candidates", { cache: "no-store" })
      .then((r) => r.json())
      .then((body: { source: "live" | "stale"; candidates: StoredCandidate[] }) => {
        if (!live) return;
        setSource(body.source);
        setEntries(buildHidden(sites, body.candidates, from));
      })
      // the sites half needs nothing from the network, so it still has something to show
      .catch(() => {
        if (!live) return;
        setSource("unreachable");
        setEntries(buildHidden(sites, [], from));
      });
    return () => {
      live = false;
    };
  }, [sites, from]);

  return (
    <div className="border border-ink-faint/40 bg-paper-raised p-4 shadow-paper">
      <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
        Hidden heritage
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        Places near you that almost nobody visits, and what each claim rests on.
      </p>

      {source === "stale" && (
        <p className="font-archive mt-2 text-[11px] leading-relaxed text-state-candidate">
          stale &middot; the database is unreachable, so confirmed Candidates come from the
          snapshot committed with the app
        </p>
      )}
      {source === "unreachable" && (
        <p className="font-archive mt-2 text-[11px] leading-relaxed text-state-candidate">
          offline &middot; only the eleven Heritage Sites are listed. Candidates confirmed by a
          Reviewer need the network and are missing from this list.
        </p>
      )}

      {entries === null && (
        <div className="mt-3 space-y-2">
          <div className="h-3 w-3/4 bg-paper-sunk" />
          <div className="h-3 w-1/2 bg-paper-sunk" />
          <div className="h-3 w-2/3 bg-paper-sunk" />
        </div>
      )}

      {entries !== null && entries.length === 0 && (
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Nothing to surface here. This panel lists Heritage Sites we judge under-visited and
          Candidates a Reviewer has confirmed, and right now neither has anything within reach.
        </p>
      )}
      <ul className="mt-3 max-h-64 overflow-y-auto">
        {(entries ?? []).map((e) => (
          <li key={e.id} className="border-t border-ink-faint/20 py-2">
            <button type="button" onClick={() => onPick(e.centroid)} className="w-full text-left">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`text-sm ${e.verified ? "font-medium text-state-verified" : "text-ink"}`}
                >
                  {e.verified && "✓ "}
                  {e.name}
                  {e.editorial && (
                    <span className="font-archive ml-2 text-[10px] tracking-wide text-state-candidate uppercase">
                      editorial
                    </span>
                  )}
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
