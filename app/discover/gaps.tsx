"use client";

import { useEffect, useState } from "react";
import type { CandidateStatus, StoredCandidate } from "@/lib/types";

export interface Gap {
  id: string;
  name: string;
  structureType: string;
  period: string | null;
  passage: string;
  anchorName: string;
  radiusM: number;
  confidence: number;
  pageNo: number;
  printedPageNo: number | null;
}

const STATUS_LABEL: Record<CandidateStatus, string> = {
  extracted: "Read off the page",
  geo_resolved: "Placed on the map",
  candidate: "Candidate, waiting for a Reviewer",
  under_review: "A Reviewer has it",
  verified: "Confirmed by a Reviewer",
  rejected: "Rejected by a Reviewer",
  matched_existing: "Turned out to be on today's map",
};

const STATUS_COLOUR: Record<CandidateStatus, string> = {
  extracted: "text-ink-faint",
  geo_resolved: "text-ink-faint",
  candidate: "text-state-candidate",
  under_review: "text-state-review",
  verified: "text-state-verified",
  rejected: "text-state-rejected",
  matched_existing: "text-state-matched",
};

// the whole point of forty pages, shown before the machine that produced them
export default function Gaps({ gaps, onOpen }: { gaps: Gap[]; onOpen: (pageNo: number) => void }) {
  const [live, setLive] = useState<Map<string, CandidateStatus> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/candidates", { cache: "no-store" })
      .then((r) => r.json())
      .then((body: { candidates: StoredCandidate[] }) => {
        if (!alive) return;
        setLive(new Map(body.candidates.map((c) => [c.id, c.status])));
      })
      // the cache already knows every one of these is a Candidate, so a dead network loses nothing
      .catch(() => {
        if (alive) setLive(new Map());
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="border-b border-ink-faint/40 px-6 py-14 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-archive text-xs tracking-[0.2em] text-madder uppercase">The finding</p>
        <h2 className="font-display mt-3 max-w-4xl text-4xl leading-tight text-ink lg:text-5xl">
          {gaps.length} places the survey wrote down and today&apos;s map does not have
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Each of these came out of a real page of the 1919 volume. Each carries the passage it was
          read from, the landmark it was measured against, and a circle saying how wrong the
          position could be. None of them is a discovery until a person says so, which is why every
          card names its own status.
        </p>

        <div className="stagger mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gaps.map((gap) => {
            const status = live?.get(gap.id) ?? "candidate";
            return (
              <article
                key={gap.id}
                className="flex flex-col border border-ink-faint/40 bg-paper-raised p-5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-archive text-[10px] tracking-[0.2em] text-ink-faint uppercase">
                    {gap.structureType}
                  </span>
                  <span className="font-archive shrink-0 text-[11px] text-ink-faint">
                    scan {gap.pageNo}
                  </span>
                </div>

                <h3 className="font-display mt-1 text-2xl leading-tight text-ink">{gap.name}</h3>
                {gap.period && (
                  <p className="font-archive text-[11px] text-ink-faint">{gap.period}</p>
                )}

                <p className="font-archive mt-4 border-l-2 border-madder/40 pl-3 text-[12px] leading-relaxed text-ink">
                  {gap.passage.length > 190 ? `${gap.passage.slice(0, 190)}...` : gap.passage}
                </p>

                <dl className="mt-4 flex-1 space-y-1 text-[12px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-muted">Measured from</dt>
                    <dd className="font-archive text-right text-ink">{gap.anchorName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-muted">Could be wrong by</dt>
                    <dd className="font-archive text-ink">{Math.round(gap.radiusM)} m</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-muted">Confidence</dt>
                    <dd className="font-archive text-ink">{gap.confidence.toFixed(2)}</dd>
                  </div>
                </dl>

                <p
                  className={`font-archive mt-4 text-[11px] tracking-wide uppercase ${
                    live === null ? "breathe text-ink-faint" : STATUS_COLOUR[status]
                  }`}
                >
                  {live === null ? "reading the queue" : STATUS_LABEL[status]}
                </p>

                <button
                  type="button"
                  onClick={() => onOpen(gap.pageNo)}
                  className="font-archive mt-4 border border-madder px-3 py-1.5 text-[11px] tracking-widest text-madder uppercase transition-colors duration-200 hover:bg-madder hover:text-paper"
                >
                  Read the page it came off
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
