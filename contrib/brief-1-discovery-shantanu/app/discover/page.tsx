"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Candidate, Mention } from "@/lib/types";
import { buildCandidates } from "@/lib/pipeline";
import { ANCHORS } from "@/content/anchors";
import { BASELINE } from "@/content/baseline";
import { PAGES } from "@/content/pages";
import type { MapStage } from "@/components/DiscoverMap";
import EvidencePanel from "@/components/EvidencePanel";

const DiscoverMap = dynamic(() => import("@/components/DiscoverMap"), {
  ssr: false,
});

type Phase = "idle" | "loading" | "revealing" | "done" | "error";

const REVEAL_MS = 900;

export default function DiscoverPage() {
  const [selectedPage, setSelectedPage] = useState(PAGES[0]?.pageNo ?? 9);
  const [phase, setPhase] = useState<Phase>("idle");
  const [source, setSource] = useState<"live" | "cached" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [evidenceFor, setEvidenceFor] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<[number, number] | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const page = useMemo(
    () => PAGES.find((p) => p.pageNo === selectedPage) ?? PAGES[0],
    [selectedPage]
  );

  const clearTimers = useCallback(() => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  }, []);

  const analyse = useCallback(async () => {
    clearTimers();
    setPhase("loading");
    setError(null);
    setMentions([]);
    setCandidates([]);
    setRevealedCount(0);
    setActiveIndex(0);
    setEvidenceFor(null);
    setHighlighted(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNo: selectedPage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "extraction failed");

      const ms = data.mentions as Mention[];
      const cands = buildCandidates(ms, ANCHORS, BASELINE);
      setSource(data.source);
      setMentions(ms);
      setCandidates(cands);

      if (ms.length === 0) {
        setPhase("done");
        return;
      }

      setPhase("revealing");
      ms.forEach((_, i) => {
        const t = setTimeout(() => {
          setRevealedCount(i + 1);
          setActiveIndex(i);
          setHighlighted(ms[i].passageOffset);
        }, i * REVEAL_MS);
        timers.current.push(t);
      });
      timers.current.push(
        setTimeout(() => setPhase("done"), ms.length * REVEAL_MS + 800)
      );
    } catch (e) {
      setError((e as Error).message);
      setPhase("error");
    }
  }, [selectedPage, clearTimers]);

  const stages: MapStage[] = useMemo(
    () =>
      candidates.slice(0, revealedCount).map((c) => ({
        centroid: c.centroid,
        radiusM: c.uncertaintyRadiusM,
        status: c.status,
        matchedName: c.matchedBaselineFeature?.name ?? null,
        animate: true,
      })),
    [candidates, revealedCount]
  );

  const highlightedMention = evidenceFor !== null ? mentions[evidenceFor] : null;
  const highlightedCandidate =
    evidenceFor !== null ? candidates[evidenceFor] : null;

  return (
    <main className="mx-auto flex max-w-[1400px] flex-col gap-3 p-4">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold">Discovery Engine</h1>
        <span className="text-sm text-zinc-500">
          ASI, List of Muhammadan and Hindu Monuments, Delhi Province, Vol 1 (1916)
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium">Page</label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(Number(e.target.value))}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm"
        >
          {PAGES.map((p) => (
            <option key={p.pageNo} value={p.pageNo}>
              Scan {p.pageNo}
            </option>
          ))}
        </select>
        <button
          onClick={analyse}
          disabled={phase === "loading" || phase === "revealing"}
          className="rounded bg-red-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
        >
          {phase === "loading"
            ? "Reading page..."
            : phase === "revealing"
              ? "Resolving..."
              : "Analyse"}
        </button>
        {source && (
          <span className="rounded bg-zinc-100 px-2 py-1 font-mono text-xs">
            {source === "cached" ? "cached" : "live"}
          </span>
        )}
      </div>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
          <button
            onClick={analyse}
            className="ml-3 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <section className="min-h-[480px] rounded border border-zinc-200 bg-white p-3">
          <h2 className="mb-2 text-sm font-semibold text-zinc-500">Page {page.pageNo}</h2>
          <div className="relative mb-3 h-56 w-full overflow-hidden rounded border border-zinc-200">
            <Image
              src={page.imageUrl}
              alt={`Scan n${page.pageNo}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
          <div className="h-64 overflow-y-auto rounded border border-zinc-200 bg-zinc-50 p-2 text-[11px] leading-relaxed">
            {highlighted ? (
              <>
                {page.text.slice(0, highlighted[0])}
                <mark className="bg-yellow-200">{page.text.slice(highlighted[0], highlighted[1])}</mark>
                {page.text.slice(highlighted[1])}
              </>
            ) : (
              page.text
            )}
          </div>
        </section>

        <section className="min-h-[480px] rounded border border-zinc-200 bg-white p-3">
          <h2 className="mb-2 text-sm font-semibold text-zinc-500">
            Mentions ({mentions.length})
          </h2>
          <div className="space-y-2">
            {mentions.slice(0, revealedCount).map((m, i) => {
              const c = candidates[i];
              const isActive = i === activeIndex;
              return (
                <div
                  key={m.id}
                  className={`rounded border p-3 text-sm transition-all ${
                    isActive ? "border-red-400 bg-red-50" : "border-zinc-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold uppercase tracking-wide">{m.name}</div>
                      <div className="text-xs text-zinc-500">
                        {m.type} {m.period ? `- ${m.period}` : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => setEvidenceFor(i)}
                      className="whitespace-nowrap text-xs font-medium text-red-700 underline"
                    >
                      see evidence
                    </button>
                  </div>
                  {c?.centroid ? (
                    <div className="mt-1 text-xs text-zinc-600">
                      confidence {c.confidence.total.toFixed(2)} - radius {c.uncertaintyRadiusM}m -{" "}
                      {c.status === "matched_existing" ? "on today's map" : "not on today's map"}
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-amber-700">
                      unresolvable - no anchor match
                    </div>
                  )}
                </div>
              );
            })}
            {phase === "loading" && (
              <div className="animate-pulse rounded border border-zinc-200 p-3 text-sm text-zinc-400">
                Reading the archive...
              </div>
            )}
            {phase === "done" && mentions.length === 0 && (
              <div className="p-3 text-sm text-zinc-500">
                No structures described on this page.
              </div>
            )}
          </div>
        </section>

        <section className="min-h-[480px] rounded border border-zinc-200 bg-white p-3">
          <h2 className="mb-2 text-sm font-semibold text-zinc-500">Map</h2>
          <div className="h-[420px] overflow-hidden rounded border border-zinc-200">
            <DiscoverMap
              stages={stages}
              activeIndex={Math.max(0, activeIndex)}
              initialCenter={[77.235, 28.65]}
            />
          </div>
        </section>
      </div>

      {highlightedMention && (
        <EvidencePanel
          mention={highlightedMention}
          candidate={highlightedCandidate}
          pageImage={page.imageUrl}
          onClose={() => setEvidenceFor(null)}
        />
      )}
    </main>
  );
}