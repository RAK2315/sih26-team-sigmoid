"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Coord, HeritageSite, StoredCandidate } from "@/lib/types";
import Reveal from "../reveal";
import { JaliBand } from "../motifs";
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
  const walkable = sites.filter((s) => s.pointIds.length > 0);

  return (
    <div className="w-full">
      <header className="border-b border-ink-faint/40 bg-paper-sunk px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            For the visitor
          </p>
          <h1 className="ink-in font-display mt-3 max-w-3xl text-5xl leading-[0.95] text-ink lg:text-6xl">
            Eleven places in Delhi, and the reason to stand in front of each one
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            Filled pins hold several Heritage Points you can walk between. Hollow pins are a single
            structure. Green pins came out of the 1919 survey and were confirmed by a person.{" "}
            {walkable.length} of the eleven have a Walk written for them.
          </p>
        </div>
      </header>

      {/* the panels stack under the map on a phone and float beside it from lg, because absolute
          children give a parent no height and this map used to collapse to nothing */}
      <div className="relative flex flex-col border-b border-ink-faint/40 lg:block lg:h-[62vh] lg:min-h-[30rem]">
        <div className="h-[52vh] min-h-[17rem] shrink-0 lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
          <ExploreMapCanvas
            sites={sites}
            verified={verified}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        </div>

        <aside className="z-[500] flex flex-col gap-3 p-4 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-0 lg:w-96 lg:overflow-y-auto">
          <div className="pointer-events-auto border border-ink-faint/40 bg-paper-raised shadow-paper">
            {selected === null ? (
              <div className="p-4">
                <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
                  {sites.length} heritage sites
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Pick one on the map, or from here.
                </p>
                {verified.length > 0 && (
                  <p className="font-archive mt-2 flex items-start gap-2 text-[11px] leading-relaxed text-state-verified">
                    <span
                      aria-hidden
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-state-verified"
                    />
                    <span>
                      {verified.length === 1
                        ? "One green pin is"
                        : `${verified.length} green pins are`}{" "}
                      a Candidate read out of the 1919 survey and confirmed by a Reviewer, drawn
                      inside the circle it was found in. Nobody had it on a map before.
                    </span>
                  </p>
                )}
                <ul className="mt-3 max-h-64 overflow-y-auto">
                  {sites.map((site) => (
                    <li key={site.id} className="border-t border-ink-faint/20">
                      <button
                        type="button"
                        onClick={() => setSelected(site)}
                        className="flex w-full items-center gap-3 py-2 text-left hover:text-madder"
                      >
                        {site.image && (
                          <img
                            src={site.image.url}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-10 w-14 shrink-0 border border-ink-faint/30 object-cover"
                          />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-ink">{site.name}</span>
                          <span className="font-archive block text-[11px] text-ink-faint">
                            {site.pointIds.length === 0
                              ? "single structure"
                              : `${site.pointIds.length} Heritage ${site.pointIds.length === 1 ? "Point" : "Points"}`}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                {selected.image && (
                  <img
                    src={selected.image.url}
                    alt={selected.image.alt}
                    className="block aspect-[16/9] w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
                      {selected.depth === "deep" ? "Deep site" : "Single structure"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="font-archive text-[11px] text-ink-faint hover:text-madder"
                    >
                      back to the list
                    </button>
                  </div>
                  <h2 className="font-display mt-1 text-3xl leading-tight text-ink">
                    {selected.name}
                  </h2>
                  {selected.nameLocal && (
                    <p className="font-deva text-lg text-ink-muted">{selected.nameLocal}</p>
                  )}
                  <p className="mt-1 text-sm text-ink-muted">{selected.period}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink">{selected.blurb}</p>
                  <p className="font-archive mt-3 text-xs leading-relaxed text-ink-faint">
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
                      className="mt-4 inline-block border border-madder px-4 py-2 text-sm text-madder transition-colors duration-200 hover:bg-madder hover:text-paper"
                    >
                      Begin tour
                    </Link>
                  ) : (
                    <p className="mt-4 text-sm text-ink-faint">
                      No Heritage Points written for this site yet.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-12 lg:py-20">
        <Reveal>
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            The eleven
          </p>
          <h2 className="font-display mt-3 text-4xl leading-tight text-ink lg:text-5xl">
            Every Heritage Site, and whether you can walk it yet
          </h2>
        </Reveal>

        <Reveal className="stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <article
              key={site.id}
              className="group flex flex-col border border-ink-faint/40 bg-paper-raised"
            >
              {site.image && (
                <button
                  type="button"
                  onClick={() => setSelected(site)}
                  className="aspect-[4/3] overflow-hidden bg-paper-sunk"
                >
                  <img
                    src={site.image.url}
                    alt={site.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </button>
              )}
              <div className="flex flex-1 flex-col p-4">
                <p className="font-archive text-[10px] tracking-[0.2em] text-ink-faint uppercase">
                  {site.period}
                </p>
                <h3 className="font-display mt-1 text-2xl leading-tight text-ink">{site.name}</h3>
                {site.nameLocal && (
                  <p className="font-deva text-sm text-ink-muted">{site.nameLocal}</p>
                )}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{site.blurb}</p>
                {site.pointIds.length > 0 ? (
                  <Link
                    href={`/site/${site.id}/plan`}
                    className="font-archive mt-4 inline-block border border-madder px-3 py-1.5 text-[11px] tracking-widest text-madder uppercase transition-colors duration-200 hover:bg-madder hover:text-paper"
                  >
                    Begin tour &middot; {site.pointIds.length}{" "}
                    {site.pointIds.length === 1 ? "point" : "points"}
                  </Link>
                ) : (
                  <p className="font-archive mt-4 text-[11px] text-ink-faint">
                    Single structure. No Walk written yet.
                  </p>
                )}
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      <JaliBand className="h-10 w-full text-ink-faint/35" />

      <div className="border-t border-ink-faint/40 bg-paper-raised">
        <HiddenHeritage sites={sites} candidates={candidates} source={source} from={FROM} />
      </div>
    </div>
  );
}
