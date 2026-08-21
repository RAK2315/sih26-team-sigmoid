"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Coord, HeritageSite } from "@/lib/types";
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

  return (
    // every other map in the app sits in a box with a real height. this one held the whole page
    // in absolutely positioned panels, so nothing gave the map any height to be 100% of.
    <div className="relative min-h-[28rem] flex-1">
      <div className="absolute inset-0">
        <ExploreMapCanvas sites={sites} selectedId={selected?.id ?? null} onSelect={setSelected} />
      </div>

      <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] flex flex-col gap-3 p-4 lg:inset-y-0 lg:left-auto lg:right-0 lg:w-96 lg:overflow-y-auto">
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
          <HiddenHeritage sites={sites} from={FROM} onPick={() => undefined} />
        </div>
      </aside>
    </div>
  );
}
