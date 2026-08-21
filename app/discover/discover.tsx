"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { AnalyseResult, Candidate, Mention } from "@/lib/types";
import EvidencePanel from "./evidence-panel";
import MentionCard from "./mention-card";
import PageText from "./page-text";

const DiscoverMapCanvas = dynamic(() => import("./discover-map-canvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-paper-sunk" />,
});

export interface ShelfPage {
  pageNo: number;
  printedPageNo: number | null;
  imageUrl: string;
  text: string;
  // how many Candidates the committed cache holds for this Page, so the shelf can say which
  // Pages are worth opening without anyone having to press Analyse on all forty
  placed: number;
}

type Phase = "idle" | "reading" | "done" | "unavailable" | "offline";

export default function Discover({
  volumeId,
  title,
  sourceUrl,
  licence,
  pages,
}: {
  volumeId: string;
  title: string;
  sourceUrl: string;
  licence: string;
  pages: ShelfPage[];
}) {
  const [page, setPage] = useState<ShelfPage>(pages[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AnalyseResult | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const candidateByMention = useMemo(() => {
    const map = new Map<string, Candidate>();
    for (const c of result?.candidates ?? []) map.set(c.mentionId, c);
    return map;
  }, [result]);

  const open = result?.mentions.find((m) => m.id === openId) ?? null;
  const openCandidate = openId ? (candidateByMention.get(openId) ?? null) : null;

  function choose(next: ShelfPage) {
    setPage(next);
    setPhase("idle");
    setResult(null);
    setOpenId(null);
  }

  async function analyse() {
    setPhase("reading");
    setResult(null);
    setOpenId(null);
    try {
      const res = await fetch("/api/discover/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volumeId, pageNo: page.pageNo }),
      });
      if (!res.ok) {
        setPhase("unavailable");
        return;
      }
      setResult((await res.json()) as AnalyseResult);
      setPhase("done");
    } catch {
      // the route already falls back to the cache, so getting here means the request never landed
      setPhase(navigator.onLine ? "unavailable" : "offline");
    }
  }

  const highlight = open?.passageOffset ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <Shelf pages={pages} current={page} title={title} onChoose={choose} />

      <section className="flex min-w-0 flex-1 flex-col border-ink-faint/30 lg:flex-row lg:border-x">
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4">
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="font-display text-2xl text-ink">
              Scan {page.pageNo}
              <span className="font-archive ml-2 text-xs text-ink-faint">
                {page.printedPageNo === null
                  ? "no printed page number"
                  : `printed page ${page.printedPageNo}`}
              </span>
            </h1>
            <button
              type="button"
              onClick={analyse}
              disabled={phase === "reading"}
              className="border border-madder px-4 py-2 text-sm text-madder hover:bg-madder hover:text-paper disabled:opacity-40"
            >
              {phase === "reading" ? "Reading the page" : "Analyse"}
            </button>
          </header>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.imageUrl}
            alt={`Scan of page ${page.printedPageNo ?? page.pageNo}`}
            className="mt-3 w-full border border-ink-faint/30 bg-paper-raised"
          />

          <PageText text={page.text} highlight={highlight} />

          <p className="font-archive mt-4 text-[11px] leading-relaxed text-ink-faint">
            {title}
            <br />
            {licence}.{" "}
            <a href={sourceUrl} className="underline" target="_blank" rel="noreferrer">
              archive.org
            </a>
          </p>
        </div>

        <div className="flex min-h-[22rem] w-full flex-col lg:w-[26rem] lg:border-l lg:border-ink-faint/30">
          <div className="relative h-64 shrink-0 lg:h-72">
            <DiscoverMapCanvas
              candidates={result?.candidates ?? []}
              openId={openId}
              onOpen={(mentionId) => setOpenId(mentionId)}
            />
            {phase === "done" && result?.candidates.length === 0 && (
              <p className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] bg-paper-raised/95 p-3 text-center text-xs leading-relaxed text-ink-muted">
                Nothing on this page could be placed. The map is empty because the survey measures
                these from landmarks the Anchor table does not hold, not because it failed.
              </p>
            )}
          </div>
          <Results
            phase={phase}
            result={result}
            candidateByMention={candidateByMention}
            openId={openId}
            onOpen={setOpenId}
          />
        </div>
      </section>

      {open && (
        <EvidencePanel
          mention={open}
          candidate={openCandidate}
          page={page}
          volumeTitle={title}
          source={result?.source ?? "cached"}
          modelId={result?.modelId ?? ""}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

function Shelf({
  pages,
  current,
  title,
  onChoose,
}: {
  pages: ShelfPage[];
  current: ShelfPage;
  title: string;
  onChoose: (page: ShelfPage) => void;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col lg:w-56">
      <div className="border-b border-ink-faint/30 p-4">
        <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">The shelf</p>
        <p className="mt-1 text-sm leading-snug text-ink-muted">{title}</p>
        <p className="font-archive mt-2 text-[11px] leading-relaxed text-ink-faint">
          {pages.length} pages ingested, in the order the volume is bound. The number on the right
          is how many places that page put on the map last time it was read.
        </p>
      </div>
      <ol className="flex max-h-40 flex-row gap-1 overflow-auto p-2 lg:max-h-none lg:flex-1 lg:flex-col">
        {pages.map((p) => (
          <li key={p.pageNo}>
            <button
              type="button"
              onClick={() => onChoose(p)}
              className={`flex w-full min-w-[6rem] items-baseline justify-between gap-2 px-2 py-1 text-left text-sm ${
                p.pageNo === current.pageNo
                  ? "bg-paper-sunk text-ink"
                  : "text-ink-muted hover:bg-paper-sunk/60"
              }`}
            >
              <span>
                {p.pageNo}
                {p.printedPageNo !== null && (
                  <span className="font-archive ml-1 text-[11px] text-ink-faint">
                    p. {p.printedPageNo}
                  </span>
                )}
              </span>
              <span
                className={`font-archive text-[11px] ${p.placed > 0 ? "text-madder" : "text-ink-faint/50"}`}
              >
                {p.placed > 0 ? p.placed : "-"}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function Results({
  phase,
  result,
  candidateByMention,
  openId,
  onOpen,
}: {
  phase: Phase;
  result: AnalyseResult | null;
  candidateByMention: Map<string, Candidate>;
  openId: string | null;
  onOpen: (id: string) => void;
}) {
  if (phase === "idle") {
    return (
      <p className="p-4 text-sm leading-relaxed text-ink-muted">
        This is a real page of the 1919 survey. Press Analyse and watch what it records become
        places on the map, with an honest circle around each one.
      </p>
    );
  }

  if (phase === "reading") {
    return <p className="p-4 text-sm text-ink-muted">Reading the page.</p>;
  }

  if (phase === "offline") {
    return (
      <p className="p-4 text-sm leading-relaxed text-madder">
        This device is offline, so the page could not be sent to be read. The scan and its text are
        already here and stay readable. Reconnect and press Analyse again.
      </p>
    );
  }

  if (phase === "unavailable" || !result) {
    return (
      <p className="p-4 text-sm leading-relaxed text-madder">
        No model answered and nothing is stored for this page. Nothing is shown rather than
        guessed. Try another page.
      </p>
    );
  }

  if (result.mentions.length === 0) {
    return (
      <p className="p-4 text-sm leading-relaxed text-ink-muted">
        This page names no structure. Some pages of the volume are index, preface or continuation
        text, and reading one honestly returns nothing.
      </p>
    );
  }

  const placed = result.candidates.length;
  const partial = result.mentions.length - placed;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex items-baseline justify-between border-b border-ink-faint/30 px-4 py-2">
        <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
          {result.mentions.length} mentions, {placed} placed, {partial} partial
        </p>
        <span
          className={`font-archive text-[11px] ${
            result.source === "live" ? "text-verdigris" : "text-state-candidate"
          }`}
          title={result.modelId}
        >
          {result.source}
        </span>
      </div>
      <ul>
        {result.mentions.map((m: Mention) => (
          <MentionCard
            key={m.id}
            mention={m}
            candidate={candidateByMention.get(m.id) ?? null}
            isOpen={m.id === openId}
            onOpen={() => onOpen(m.id)}
          />
        ))}
      </ul>
    </div>
  );
}
