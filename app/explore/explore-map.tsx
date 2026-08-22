"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Coord, HeritageSite, StoredCandidate } from "@/lib/types";
import HiddenHeritage from "./hidden-heritage";

// leaflet reads window while it loads, so it must never render on the server
const ExploreMapCanvas = dynamic(() => import("./explore-map-canvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-paper-sunk" />,
});

// the centre of Delhi, which is where a Visitor is until real GPS says otherwise
const FROM: Coord = [77.215, 28.605];

export default function ExploreMap({ sites }: { sites: HeritageSite[] }) {
  const [selected, setSelected] = useState<HeritageSite | null>(null);
  const [candidates, setCandidates] = useState<StoredCandidate[] | null>(null);
  const [source, setSource] = useState<"live" | "stale" | "unreachable">("live");

  useEffect(() => {
    let alive = true;
    fetch("/api/candidates", { cache: "no-store" })
      .then((r) => r.json())
      .then((body: { source: "live" | "stale"; candidates: StoredCandidate[] }) => {
        if (!alive) return;
        setSource(body.source);
        setCandidates(body.candidates);
      })
      // the sites half needs nothing from the network, so the map still has pins to draw
      .catch(() => {
        if (!alive) return;
        setSource("unreachable");
        setCandidates([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // ADR-0003: only a Reviewer can put a Candidate on the Visitor's map
  const verified = (candidates ?? []).filter((c) => c.status === "verified");

  return (
    // the panels stack under the map on a phone and float beside it from lg, because absolute
    // children give a parent no height and this map used to collapse to nothing
    <div className="relative flex min-h-0 flex-1 flex-col lg:block lg:min-h-[30rem]">
      <div className="h-[52vh] min-h-[17rem] shrink-0 lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
        <ExploreMapCanvas
          sites={sites}
          verified={verified}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />
      </div>

      <aside className="stagger z-[500] flex flex-col gap-3 p-4 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-0 lg:w-96 lg:overflow-y-auto">
        <div className="pointer-events-auto border border-ink-faint/40 bg-paper-raised p-4 shadow-paper">
          {selected === null ? (
            <>
              <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
                {sites.length} heritage sites
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Filled pins hold several Heritage Points you can walk between. Hollow pins are a
                single structure. Pick one on the map, or from here.
              </p>
              {verified.length > 0 && (
                <p className="font-archive mt-2 flex items-start gap-2 text-[11px] leading-relaxed text-state-verified">
                  <span aria-hidden className="mt-1 h-2 w-2 shrink-0 rounded-full bg-state-verified" />
                  <span>
                    {verified.length === 1 ? "One green pin is" : `${verified.length} green pins are`}{" "}
                    a Candidate read out of the 1919 survey and confirmed by a Reviewer, drawn
                    inside the circle it was found in. Nobody had it on a map before.
                  </span>
                </p>
              )}
              <ul className="mt-3 max-h-56 overflow-y-auto">
                {sites.map((site) => (
                  <li key={site.id} className="border-t border-ink-faint/20">
                    <button
                      type="button"
                      onClick={() => setSelected(site)}
                      className="flex w-full items-baseline justify-between gap-2 py-1.5 text-left hover:text-madder"
                    >
                      <span className="text-sm text-ink">{site.name}</span>
                      <span className="font-archive shrink-0 text-[11px] text-ink-faint">
                        {site.pointIds.length > 0
                          ? `${site.pointIds.length} points`
                          : "single structure"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
                {selected.depth === "deep" ? "Deep site" : "Single structure"}
              </p>
              <h2 className="font-display mt-1 text-3xl leading-tight text-ink">{selected.name}</h2>
              {selected.nameLocal && (
                <p className="font-deva text-lg text-ink-muted">{selected.nameLocal}</p>
              )}
              <p className="mt-1 text-sm text-ink-muted">{selected.period}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink">{selected.blurb}</p>
              <p className="mt-3 font-archive text-xs leading-relaxed text-ink-faint">
                {selected.pointIds.length} Heritage Points
                <br />
                position from{" "}
                {selected.coordSource === "approximate"
                  ? "no mapped feature, approximate"
                  : selected.coordSource}
              </p>
              {selected.pointIds.length > 0 ? (
                <Link
                  href={`/site/${selected.id}/plan`}
                  className="mt-4 inline-block border border-madder px-4 py-2 text-sm text-madder hover:bg-madder hover:text-paper"
                >
                  Begin tour
                </Link>
              ) : (
                <p className="mt-4 text-sm text-ink-faint">
                  No Heritage Points written for this site yet.
                </p>
              )}
            </>
          )}
        </div>

        <div className="pointer-events-auto">
          <HiddenHeritage
            sites={sites}
            candidates={candidates}
            source={source}
            from={FROM}
            onPick={() => undefined}
          />
        </div>
      </aside>
    </div>
  );
}
