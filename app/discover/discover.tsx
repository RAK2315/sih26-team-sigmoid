"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { AnalyseResult, Candidate, Mention } from "@/lib/types";
import { useReducedMotion, useWideScreen } from "../use-reduced-motion";
import DiscoverHeader from "./discover-header";
import EvidencePanel from "./evidence-panel";
import EvidenceThread, { type PinPoint } from "./evidence-thread";
import Gaps, { type Gap } from "./gaps";
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

// one press of Analyse plays as one move: the passage lights, a line reaches the map,
// the circle lands wide and closes, then the cards arrive
const STAGES = ["none", "passage", "thread", "contract", "cards"] as const;
type Stage = (typeof STAGES)[number];

function reached(stage: Stage, mark: Stage): boolean {
  return STAGES.indexOf(stage) >= STAGES.indexOf(mark);
}

// the sequence opens on the tightest Representation Gap, because that is the finding
function pickLead(result: AnalyseResult): string | null {
  const quoted = result.candidates.filter(
    (c) => result.mentions.find((m) => m.id === c.mentionId)?.passageOffset !== null,
  );
  const gapFirst = (c: Candidate) => (c.evidence.baselineVerdict === "representation_gap" ? 0 : 1);
  const best = [...quoted].sort(
    (a, b) => gapFirst(a) - gapFirst(b) || a.uncertaintyRadiusM - b.uncertaintyRadiusM,
  )[0];
  if (best) return best.mentionId;
  return result.mentions.find((m) => m.passageOffset !== null)?.id ?? null;
}

export default function Discover({
  volumeId,
  title,
  sourceUrl,
  licence,
  pages,
  gaps,
}: {
  volumeId: string;
  title: string;
  sourceUrl: string;
  licence: string;
  pages: ShelfPage[];
  gaps: Gap[];
}) {
  const [page, setPage] = useState<ShelfPage>(pages[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AnalyseResult | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("none");
  const [pin, setPin] = useState<PinPoint | null>(null);

  const reduced = useReducedMotion();
  const wide = useWideScreen();
  const markRef = useRef<HTMLElement>(null);
  const textBoxRef = useRef<HTMLPreElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const stopSequence = useCallback(() => {
    for (const timer of timers.current) clearTimeout(timer);
    timers.current = [];
  }, []);

  useEffect(() => stopSequence, [stopSequence]);

  const candidates = useMemo(() => result?.candidates ?? [], [result]);

  const candidateByMention = useMemo(() => {
    const map = new Map<string, Candidate>();
    for (const c of candidates) map.set(c.mentionId, c);
    return map;
  }, [candidates]);

  const focusId = openId ?? leadId;
  const focus = result?.mentions.find((m) => m.id === focusId) ?? null;
  const open = result?.mentions.find((m) => m.id === openId) ?? null;
  const openCandidate = openId ? (candidateByMention.get(openId) ?? null) : null;

  function choose(next: ShelfPage) {
    stopSequence();
    setPage(next);
    setPhase("idle");
    setResult(null);
    setOpenId(null);
    setLeadId(null);
    setStage("none");
  }

  // opening a card by hand ends the sequence rather than fighting it
  function openMention(id: string) {
    stopSequence();
    setStage("cards");
    setOpenId(id);
  }

  function play(next: AnalyseResult) {
    const lead = pickLead(next);
    setLeadId(lead);
    if (lead === null || reduced) {
      setStage("cards");
      return;
    }
    setStage("passage");
    const step = (ms: number, to: Stage) =>
      timers.current.push(window.setTimeout(() => setStage(to), ms));
    step(750, "thread");
    step(1500, "contract");
    step(2400, "cards");
  }

  // the Page is passed in rather than read off state, because a Gap card sets both at once
  async function analysePage(target: ShelfPage) {
    stopSequence();
    setPhase("reading");
    setResult(null);
    setOpenId(null);
    setLeadId(null);
    setStage("none");
    try {
      const res = await fetch("/api/discover/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volumeId, pageNo: target.pageNo }),
      });
      if (!res.ok) {
        setPhase("unavailable");
        return;
      }
      const next = (await res.json()) as AnalyseResult;
      setResult(next);
      setPhase("done");
      play(next);
    } catch {
      // the route already falls back to the cache, so getting here means the request never landed
      setPhase(navigator.onLine ? "unavailable" : "offline");
    }
  }

  function openPage(pageNo: number) {
    const target = pages.find((p) => p.pageNo === pageNo);
    if (!target) return;
    setPage(target);
    toolRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    void analysePage(target);
  }

  const highlight = reached(stage, "passage") ? (focus?.passageOffset ?? null) : null;
  const revealed = reached(stage, "contract");
  const showThread =
    wide && reached(stage, "thread") && highlight !== null && focusId !== null && pin !== null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <DiscoverHeader pageCount={pages.length} gapCount={gaps.length} />

      {gaps.length > 0 && <Gaps gaps={gaps} onOpen={openPage} />}

      <div ref={toolRef} className="border-b border-ink-faint/40 px-6 pt-14 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            Check the working
          </p>
          <h2 className="font-display mt-3 max-w-3xl text-4xl leading-tight text-ink lg:text-5xl">
            Open any page of the volume and watch it happen
          </h2>
          <p className="mt-5 mb-10 max-w-2xl text-base leading-relaxed text-ink-muted">
            This is the machine that produced the cards above, running live. Pick a Page and press
            Analyse. The number beside each Page is how many places it put on the map last time it
            was read, so a Page worth opening is easy to find.
          </p>
        </div>
      </div>

      <div className="flex min-h-[38rem] flex-1 flex-col lg:flex-row">
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
              onClick={() => void analysePage(page)}
              disabled={phase === "reading"}
              className="border border-madder px-4 py-2 text-sm text-madder transition-colors duration-200 hover:bg-madder hover:text-paper disabled:opacity-40"
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

          <PageText text={page.text} highlight={highlight} markRef={markRef} boxRef={textBoxRef} />

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
          <div ref={mapBoxRef} className="relative h-80 shrink-0 lg:h-96">
            <DiscoverMapCanvas
              candidates={candidates}
              openId={focusId}
              onOpen={openMention}
              reveal={revealed}
              onPinPoint={setPin}
            />
            <div className="pointer-events-none absolute top-3 left-3 z-[500] border border-ink-faint/40 bg-paper-raised/95 px-3 py-2">
              <p className="font-archive text-[10px] tracking-[0.2em] text-ink-faint uppercase">
                Where the page puts them
              </p>
              <p className="font-archive mt-0.5 text-[11px] text-ink">
                {result === null || !revealed
                  ? "nothing read yet"
                  : `${result.candidates.length} placed, each inside its own circle`}
              </p>
            </div>
            {phase === "done" && revealed && result?.candidates.length === 0 && (
              <p className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] bg-paper-raised/95 p-3 text-center text-xs leading-relaxed text-ink-muted">
                Nothing on this page could be placed. The map is empty because the survey measures
                these from landmarks the Anchor table does not hold, not because it failed.
              </p>
            )}
          </div>
          <Results
            phase={phase}
            ready={reached(stage, "cards")}
            result={result}
            candidateByMention={candidateByMention}
            openId={openId}
            onOpen={openMention}
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

      {showThread && (
        <EvidenceThread
          markRef={markRef}
          boxRef={textBoxRef}
          mapBoxRef={mapBoxRef}
          pin={pin}
          drawKey={focusId}
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
              className={`flex w-full min-w-[6rem] items-baseline justify-between gap-2 px-2 py-1 text-left text-sm transition-colors duration-150 ${
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
  ready,
  result,
  candidateByMention,
  openId,
  onOpen,
}: {
  phase: Phase;
  ready: boolean;
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
    return <p className="breathe p-4 text-sm text-ink-muted">Reading the page.</p>;
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

  if (!ready) {
    return <p className="breathe p-4 text-sm text-ink-muted">Placing what the page names.</p>;
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
      {result.source === "cached" && (
        <p className="font-archive border-b border-ink-faint/30 px-4 py-2 text-[11px] leading-relaxed text-ink-faint">
          Served from the copy committed with the app, read by {result.modelId}
          {result.fallbackReason ? `, because no model answered: ${result.fallbackReason}` : ""}.
        </p>
      )}
      <ul className="stagger">
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
