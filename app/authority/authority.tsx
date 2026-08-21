"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import EvidencePanel from "@/app/discover/evidence-panel";
import type { ShelfPage } from "@/app/discover/discover";
import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import { nextStatuses } from "@/lib/store/transitions";
import type { CandidateStatus, StoredCandidate } from "@/lib/types";
import WalkLog from "./walk-log";

const STATUS_COLOUR: Record<string, string> = {
  candidate: "text-state-candidate",
  under_review: "text-state-review",
  verified: "text-state-verified",
  rejected: "text-state-rejected",
  matched_existing: "text-state-matched",
};

const VERDICT_LABEL: Record<StoredCandidate["baselineVerdict"], string> = {
  matched_existing: "on today's map",
  representation_gap: "Representation Gap",
  inconclusive: "too wide to check",
};

type Filter = CandidateStatus | "all";

export default function Authority({
  volumeTitle,
  pages,
}: {
  volumeTitle: string;
  pages: ShelfPage[];
}) {
  const [candidates, setCandidates] = useState<StoredCandidate[]>([]);
  const [source, setSource] = useState<"live" | "stale" | "unreachable" | "loading">("loading");
  const [filter, setFilter] = useState<Filter>("candidate");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/candidates", { cache: "no-store" });
      const body = (await res.json()) as { source: "live" | "stale"; candidates: StoredCandidate[] };
      setCandidates(body.candidates);
      setSource(body.source);
    } catch {
      setSource("unreachable");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const shown = useMemo(
    () => (filter === "all" ? candidates : candidates.filter((c) => c.status === filter)),
    [candidates, filter],
  );

  const open = candidates.find((c) => c.id === openId) ?? null;

  async function move(candidate: StoredCandidate, to: CandidateStatus) {
    setBusy(candidate.id);
    setProblem(null);
    try {
      const res = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromStatus: candidate.status, toStatus: to, note: null }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error: string };
        setProblem(
          body.error === "unavailable"
            ? "The database did not accept that, so nothing was recorded."
            : `That move is not allowed: ${candidate.status} to ${to}.`,
        );
        return;
      }
      await load();
    } catch {
      setProblem("The database is unreachable, so nothing was recorded.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4">
        <header className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
              The queue
            </p>
            <h1 className="font-display text-2xl text-ink">Candidates awaiting a Reviewer</h1>
          </div>
          <span
            className={`font-archive text-[11px] ${source === "live" ? "text-verdigris" : "text-state-candidate"}`}
          >
            {source === "loading" ? "" : source === "unreachable" ? "offline" : source}
          </span>
        </header>

        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Nothing automated goes past Candidate. Every move below is a person&apos;s judgement, and
          each one is written to an append-only trail.
        </p>

        <nav className="mt-4 flex flex-wrap gap-2">
          {(["candidate", "under_review", "verified", "rejected", "matched_existing", "all"] as Filter[]).map(
            (f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`font-archive border px-2 py-1 text-[11px] ${
                  filter === f
                    ? "border-madder text-madder"
                    : "border-ink-faint/40 text-ink-muted hover:bg-paper-sunk"
                }`}
              >
                {f.replace(/_/g, " ")}{" "}
                {f !== "all" && candidates.filter((c) => c.status === f).length}
              </button>
            ),
          )}
        </nav>

        {problem && <p className="mt-3 text-sm text-madder">{problem}</p>}

        {source === "loading" && (
          <div className="mt-6 space-y-3">
            <div className="h-4 w-2/3 bg-paper-sunk" />
            <div className="h-4 w-1/2 bg-paper-sunk" />
            <div className="h-4 w-3/5 bg-paper-sunk" />
          </div>
        )}

        {source === "unreachable" && (
          <p className="mt-3 text-sm leading-relaxed text-madder">
            The queue could not be fetched at all, so this is empty because nothing was read, not
            because there is nothing to review. Check the connection and reload.
          </p>
        )}

        {source !== "loading" && source !== "unreachable" && shown.length === 0 && (
          <p className="mt-6 text-sm text-ink-muted">Nothing in this state.</p>
        )}

        <ul className="mt-4">
          {shown.map((c) => (
            <li
              key={c.id}
              className={`border-b border-ink-faint/20 py-3 ${c.id === openId ? "bg-paper-sunk" : ""}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setOpenId(c.id)}
                  className="font-display text-left text-lg leading-tight text-ink hover:text-madder"
                >
                  {c.name}
                </button>
                <span className={`font-archive text-[11px] tracking-wide uppercase ${STATUS_COLOUR[c.status]}`}>
                  {c.status.replace(/_/g, " ")}
                </span>
              </div>

              <p className="font-archive text-[11px] text-ink-faint">
                {c.structureType} &middot; scan {c.pageNo} &middot; {Math.round(c.uncertaintyRadiusM)} m
                &middot; {VERDICT_LABEL[c.baselineVerdict]} &middot; confidence{" "}
                {c.confidence.toFixed(2)}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpenId(c.id)}
                  className="font-archive border border-ink-faint/40 px-2 py-1 text-[11px] text-ink-muted hover:bg-paper-sunk"
                >
                  Evidence
                </button>
                {nextStatuses(c.status).map((to) => (
                  <button
                    key={to}
                    type="button"
                    disabled={busy === c.id}
                    onClick={() => move(c, to)}
                    className="font-archive border border-madder px-2 py-1 text-[11px] text-madder hover:bg-madder hover:text-paper disabled:opacity-40"
                  >
                    {to.replace(/_/g, " ")}
                  </button>
                ))}
                {nextStatuses(c.status).length === 0 && (
                  <span className="font-archive text-[11px] text-ink-faint">
                    terminal, nothing moves from here
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <WalkLog />
      </section>

      {open && <Evidence candidate={open} pages={pages} volumeTitle={volumeTitle} onClose={() => setOpenId(null)} />}
    </div>
  );
}

// the same panel /discover uses. the full Evidence lives in the committed cache, so it is looked
// up by id rather than stored a second time in the database.
function Evidence({
  candidate,
  pages,
  volumeTitle,
  onClose,
}: {
  candidate: StoredCandidate;
  pages: ShelfPage[];
  volumeTitle: string;
  onClose: () => void;
}) {
  const cached = DISCOVERY_CACHE[`${candidate.volumeId}-${candidate.pageNo}`];
  const full = cached?.candidates.find((c) => c.id === candidate.id) ?? null;
  const mention = cached?.mentions.find((m) => m.id === full?.mentionId) ?? null;
  const page = pages.find((p) => p.pageNo === candidate.pageNo);

  if (!full || !mention || !page) {
    return (
      <aside className="w-full border-l border-ink-faint/40 bg-paper-raised p-4 lg:w-96 lg:shrink-0">
        <p className="text-sm text-ink-muted">
          The Evidence for this Candidate is not in the committed cache, so it cannot be shown. It
          is not summarised or guessed at.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="font-archive mt-3 border border-ink-faint/40 px-2 py-1 text-xs text-ink-muted"
        >
          Close
        </button>
      </aside>
    );
  }

  return (
    <EvidencePanel
      mention={mention}
      candidate={{ ...full, status: candidate.status }}
      page={page}
      volumeTitle={volumeTitle}
      source="cached"
      modelId={cached.modelId}
      onClose={onClose}
    />
  );
}
