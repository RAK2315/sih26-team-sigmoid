"use client";

import { CONFIDENCE_WEIGHTS } from "@/lib/discovery/confidence";
import type { Candidate, ConfidenceParts, Mention } from "@/lib/types";
import { verdictLabel } from "./mention-card";
import type { ShelfPage } from "./discover";

const PART_LABELS: Record<keyof ConfidenceParts, string> = {
  clueSpecificity: "How exact the clue is",
  anchorPrecision: "How well the Anchor is pinned",
  sourceReliability: "How reliable the volume is",
  modernEvidence: "What today's map shows",
  crossSourceAgreement: "Agreement with a second volume",
};

const RADIUS_LABELS = {
  anchorPrecisionM: "The Anchor itself",
  bearingSpreadM: "A 45 degree compass point at this distance",
  distanceVaguenessM: "How loose the period unit is",
  floorTopUpM: "The floor under any radius",
} as const;

export default function EvidencePanel({
  mention,
  candidate,
  page,
  volumeTitle,
  source,
  modelId,
  onClose,
}: {
  mention: Mention;
  candidate: Candidate | null;
  page: ShelfPage;
  volumeTitle: string;
  source: "live" | "cached";
  modelId: string;
  onClose: () => void;
}) {
  return (
    <>
      {/* on a phone the panel covers the page, so there has to be somewhere to press to leave */}
      <button
        type="button"
        aria-label="Close the Evidence"
        onClick={onClose}
        className="fixed inset-0 z-[890] bg-ink/20 lg:hidden"
      />
      <aside className="sheet fixed inset-x-0 top-14 bottom-0 z-[900] flex flex-col overflow-y-auto border-t border-ink-faint/40 bg-paper-raised shadow-paper lg:static lg:inset-auto lg:z-auto lg:w-96 lg:shrink-0 lg:border-t-0 lg:border-l">
      <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-ink-faint/30 bg-paper-raised p-4">
        <div>
          <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">Evidence</p>
          <h2 className="font-display mt-1 text-2xl leading-tight text-ink">{mention.name}</h2>
          <p className="font-archive text-[11px] text-ink-faint">
            {verdictLabel(candidate)} &middot; read {source}
            {modelId && ` by ${modelId}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="font-archive shrink-0 border border-ink-faint/40 px-2 py-1 text-xs text-ink-muted hover:bg-paper-sunk"
        >
          Close
        </button>
      </header>

      <Section title="What the volume says">
        <p className="font-archive border-l-2 border-madder/40 pl-3 text-[12px] leading-relaxed text-ink">
          {mention.passage}
        </p>
        {mention.passageOffset === null && (
          <p className="mt-2 text-[11px] leading-relaxed text-madder">
            This run of characters does not appear on the page. It was composed rather than copied,
            so it is shown here and used for nothing.
          </p>
        )}
        <p className="mt-2 font-archive text-[11px] leading-relaxed text-ink-faint">
          {volumeTitle}, page {page.printedPageNo ?? page.pageNo} (scan {page.pageNo}). Public
          domain, via archive.org.
        </p>
      </Section>

      {!candidate ? (
        <Section title="Why it is not on the map">
          <p className="text-sm leading-relaxed text-ink-muted">
            {mention.passageOffset === null
              ? `The passage above cannot be found on the page, so the clue read out of it is not
                 something the survey printed. Nothing is placed from it.`
              : mention.spatialClue
                ? `The survey places this relative to ${mention.spatialClue.anchorName}, which is not
                   in the Anchor table, so there is nothing to measure from. Showing it anywhere
                   would be a guess.`
                : "The page records this structure without saying where it stands."}
          </p>
        </Section>
      ) : (
        <>
          <Section title="How the position was worked out">
            <Row label="Anchor" value={candidate.evidence.anchorName} />
            <Row
              label="Anchor position from"
              value={
                candidate.evidence.anchorSource === "approximate"
                  ? "no mapped feature, approximate"
                  : candidate.evidence.anchorSource
              }
            />
            <Row
              label="Direction"
              value={
                candidate.evidence.bearingDeg === null
                  ? "none given, so the centre is the Anchor"
                  : `${candidate.evidence.bearingDeg} degrees`
              }
            />
            <Row
              label="Distance"
              value={
                candidate.evidence.distanceM === null
                  ? "none given"
                  : `${Math.round(candidate.evidence.distanceM)} m`
              }
            />
            <Row
              label="Result"
              value={`${candidate.centroid[1].toFixed(5)}, ${candidate.centroid[0].toFixed(5)}`}
            />
          </Section>

          <Section title={`Uncertainty Radius, ${Math.round(candidate.uncertaintyRadiusM)} m`}>
            {(Object.keys(RADIUS_LABELS) as (keyof typeof RADIUS_LABELS)[]).map((key) => (
              <Row
                key={key}
                label={RADIUS_LABELS[key]}
                value={`${Math.round(candidate.evidence.radiusParts[key])} m`}
              />
            ))}
            <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
              These four add up to the circle on the map. Nothing else is in it.
            </p>
          </Section>

          <Section title="Checked against today's map">
            {candidate.evidence.baselineChecked.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Nothing in the Modern Baseline is anywhere near this.
              </p>
            ) : (
              candidate.evidence.baselineChecked.map((n) => (
                <Row
                  key={n.id}
                  label={n.name}
                  value={`${Math.round(n.distanceM)} m ${n.insideRadius ? "inside" : "outside"}`}
                />
              ))
            )}
            {candidate.evidence.baselineVerdict === "inconclusive" && (
              <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                The circle is wider than 500 m. At that size finding something inside it proves
                nothing and finding nothing proves nothing, so no verdict is claimed.
              </p>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
              Modern Baseline: 585 features from OpenStreetMap, pulled 2026-08-20. ODbL.
            </p>
          </Section>

          <Section title={`Confidence, ${candidate.confidence.total.toFixed(2)}`}>
            {(Object.keys(PART_LABELS) as (keyof ConfidenceParts)[]).map((key) => (
              <Row
                key={key}
                label={`${PART_LABELS[key]} (weight ${CONFIDENCE_WEIGHTS[key].toFixed(2)})`}
                value={candidate.confidence.parts[key].toFixed(2)}
              />
            ))}
            <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
              Agreement with a second volume is always nought until a second volume is read, so
              nothing here can score above {(1 - CONFIDENCE_WEIGHTS.crossSourceAgreement).toFixed(2)}.
            </p>
          </Section>

          <Section title="Status">
            <p className="text-sm leading-relaxed text-ink-muted">
              This is a {candidate.status.replace(/_/g, " ")}. Nothing automated goes further than
              this. Only a Reviewer moves it.
            </p>
          </Section>
        </>
      )}
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-ink-faint/20 p-4">
      <h3 className="font-archive mb-2 text-xs tracking-widest text-ink-faint uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5 text-[12px]">
      <span className="text-ink-muted">{label}</span>
      <span className="font-archive shrink-0 text-ink">{value}</span>
    </div>
  );
}
