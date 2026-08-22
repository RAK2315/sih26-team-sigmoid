"use client";

import Link from "next/link";
import { metresBetween } from "@/lib/location/geometry";
import type { ArchiveImage, Coord, HeritageSite, StoredCandidate } from "@/lib/types";

export interface HiddenEntry {
  id: string;
  candidate?: StoredCandidate;
  name: string;
  distanceM: number;
  why: string;
  evidence: string;
  verified: boolean;
  // true when the place is on this list because we judged it so, not because evidence put it here
  editorial: boolean;
  centroid: Coord;
  image?: ArchiveImage;
  href?: string;
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
        candidate: undefined,
        image: s.image,
        href: s.pointIds.length > 0 ? `/site/${s.id}/plan` : undefined,
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
        candidate: c,
        image: undefined,
        href: undefined,
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

function Card({ entry, onOpen }: { entry: HiddenEntry; onOpen: () => void }) {
  return (
    <article
      className={`flex flex-col border bg-paper-raised ${
        entry.verified ? "border-state-verified/50" : "border-ink-faint/40"
      }`}
    >
      {entry.image ? (
        <div className="aspect-[4/3] overflow-hidden bg-paper-sunk">
          <img
            src={entry.image.url}
            alt={entry.image.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        // a Representation Gap with no photograph is the argument, not a gap in the page
        <div className="flex aspect-[4/3] flex-col justify-center border-b border-ink-faint/25 bg-paper-sunk/60 p-5">
          <svg
            viewBox="0 0 120 120"
            className="h-16 w-16 text-state-verified"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="60" cy="60" r="46" strokeDasharray="3 5" strokeWidth="1.2" />
            <circle cx="60" cy="60" r="4" fill="currentColor" stroke="none" />
          </svg>
          <p className="font-archive mt-3 text-[11px] leading-relaxed text-ink-faint">
            No photograph of this exists on Commons under a licence we can use. That is not a hole
            in this page. It is the finding.
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={`font-archive text-[10px] tracking-[0.2em] uppercase ${
              entry.verified ? "text-state-verified" : "text-state-candidate"
            }`}
          >
            {entry.verified ? "Confirmed by a Reviewer" : "Editorial"}
          </span>
          <span className="font-archive shrink-0 text-[11px] text-ink-faint">
            {(entry.distanceM / 1000).toFixed(1)} km
          </span>
        </div>

        <h3 className="font-display mt-1 text-2xl leading-tight text-ink">{entry.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{entry.why}</p>
        <p className="font-archive mt-3 flex-1 text-[11px] leading-relaxed text-ink-faint">
          {entry.evidence}
        </p>

        {entry.href && (
          <Link
            href={entry.href}
            className="font-archive mt-4 inline-block border border-ink-faint/50 px-3 py-1.5 text-[11px] tracking-widest text-ink uppercase transition-colors duration-200 hover:border-madder hover:text-madder"
          >
            Begin tour &rarr;
          </Link>
        )}

        {entry.candidate && (
          <button
            type="button"
            onClick={onOpen}
            className="font-archive mt-4 border border-state-verified/60 px-3 py-1.5 text-[11px] tracking-widest text-state-verified uppercase transition-colors duration-200 hover:bg-state-verified hover:text-paper"
          >
            The whole working &rarr;
          </button>
        )}
      </div>
    </article>
  );
}

export default function HiddenHeritage({
  sites,
  candidates,
  source,
  from,
  onOpenCandidate,
}: {
  sites: HeritageSite[];
  candidates: StoredCandidate[] | null;
  source: "live" | "stale" | "unreachable";
  from: Coord;
  onOpenCandidate: (candidate: StoredCandidate) => void;
}) {
  const entries = candidates === null ? null : buildHidden(sites, candidates, from);
  const confirmed = (entries ?? []).filter((e) => e.verified);
  const editorial = (entries ?? []).filter((e) => !e.verified);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-12 lg:py-20">
      <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
        Hidden heritage
      </p>
      <h2 className="font-display mt-3 max-w-3xl text-4xl leading-tight text-ink lg:text-5xl">
        Places almost nobody visits, and what each claim rests on
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
        Two different kinds of thing sit on this list and the difference is the whole point. One
        kind came out of the survey and was confirmed by a person. The other is our opinion, and
        it is labelled as our opinion.
      </p>

      {source === "stale" && (
        <p className="font-archive mt-4 text-[11px] leading-relaxed text-state-candidate">
          stale &middot; the database is unreachable, so confirmed Candidates come from the
          snapshot committed with the app
        </p>
      )}
      {source === "unreachable" && (
        <p className="font-archive mt-4 text-[11px] leading-relaxed text-state-candidate">
          offline &middot; only the Heritage Sites are listed. Candidates confirmed by a Reviewer
          need the network and are missing from this list.
        </p>
      )}

      {entries === null && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 bg-paper-sunk" />
          ))}
        </div>
      )}

      {confirmed.length > 0 && (
        <>
          <p className="font-archive mt-10 border-b border-state-verified/40 pb-2 text-[11px] tracking-[0.2em] text-state-verified uppercase">
            Recorded once, confirmed by a Reviewer, on nobody else&apos;s map
          </p>
          <div className="stagger mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {confirmed.map((entry) => (
              <Card
                key={entry.id}
                entry={entry}
                onOpen={() => entry.candidate && onOpenCandidate(entry.candidate)}
              />
            ))}
          </div>
        </>
      )}

      {editorial.length > 0 && (
        <>
          <p className="font-archive mt-12 border-b border-state-candidate/40 pb-2 text-[11px] tracking-[0.2em] text-state-candidate uppercase">
            Our judgement, not a measurement
          </p>
          <div className="stagger mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {editorial.map((entry) => (
              <Card key={entry.id} entry={entry} onOpen={() => undefined} />
            ))}
          </div>
        </>
      )}

      {entries !== null && entries.length === 0 && (
        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          Nothing to surface here. This list holds Heritage Sites we judge under-visited and
          Candidates a Reviewer has confirmed, and right now neither has anything within reach.
        </p>
      )}
    </section>
  );
}
