"use client";

import Image from "next/image";
import type { Candidate, Mention } from "@/lib/types";
import { CONFIDENCE_WEIGHTS } from "@/lib/confidence";

interface Props {
  mention: Mention | null;
  candidate: Candidate | null;
  pageImage: string | null;
  onClose: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  extracted: "Extracted only. Not resolved to a location.",
  candidate: "Candidate. Recorded once, nothing on today's map inside the radius.",
  matched_existing: "Matched an existing mapped feature.",
  under_review: "Under review by a human.",
  verified: "Verified.",
  rejected: "Rejected.",
};

export default function EvidencePanel({
  mention,
  candidate,
  pageImage,
  onClose,
}: Props) {
  if (!mention) return null;

  const clue = mention.spatialClue;
  const parts = candidate?.confidence.parts;

  return (
    <div className="fixed inset-0 z-[1200] flex items-start justify-center bg-black/50 p-4 pt-16">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 text-zinc-900 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{mention.name}</h2>
            <p className="text-sm text-zinc-500">
              {mention.type} {mention.period ? `- ${mention.period}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded border border-zinc-300 px-2 py-1 text-sm hover:bg-zinc-100"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            {pageImage && (
              <Image
                src={pageImage}
                alt="Page scan"
                width={400}
                height={600}
                className="w-full rounded border border-zinc-200"
              />
            )}
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-semibold text-zinc-700">Passage (verbatim)</div>
              <p className="italic">&ldquo;{mention.passage}&rdquo;</p>
            </div>

            <div>
              <div className="font-semibold text-zinc-700">Spatial clue as written</div>
              {clue ? (
                <p>
                  {clue.bearing ? `${clue.bearing} ` : ""}
                  {clue.distanceValue !== null ? `${clue.distanceValue} ${clue.distanceUnit}` : ""}
                  {clue.distanceValue !== null || clue.bearing ? " of " : ""}
                  {clue.anchorName}
                </p>
              ) : (
                <p className="text-zinc-500">No spatial clue in the record.</p>
              )}
            </div>

            <div>
              <div className="font-semibold text-zinc-700">Resolved position</div>
              {candidate?.centroid ? (
                <p className="font-mono">
                  {candidate.centroid[0].toFixed(5)}, {candidate.centroid[1].toFixed(5)}
                  <span className="text-zinc-500">
                    {" "} - uncertainty radius {candidate.uncertaintyRadiusM}m
                  </span>
                </p>
              ) : (
                <p className="text-amber-700">
                  Unresolvable. No anchor match found; shown without a guess.
                </p>
              )}
            </div>

            <div>
              <div className="font-semibold text-zinc-700">Baseline check</div>
              {candidate?.matchedBaselineFeature ? (
                <p>
                  Found: {candidate.matchedBaselineFeature.name} (
                  {candidate.matchedBaselineFeature.distanceM.toFixed(0)}m from centroid)
                </p>
              ) : candidate?.centroid ? (
                <p>Nothing on today&rsquo;s map inside the radius. Representation Gap.</p>
              ) : (
                <p className="text-zinc-500">No position to check against.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-zinc-200 pt-4">
          <div className="mb-2 font-semibold text-zinc-700">Confidence breakdown</div>
          {parts ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th>Part</th>
                  <th>Value</th>
                  <th>Weight</th>
                  <th>Product</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["sourceReliability", parts.sourceReliability],
                    ["clueSpecificity", parts.clueSpecificity],
                    ["anchorPrecision", parts.anchorPrecision],
                    ["crossSourceAgreement", parts.crossSourceAgreement],
                    ["modernEvidence", parts.modernEvidence],
                  ] as const
                ).map(([key, value]) => {
                  const w = CONFIDENCE_WEIGHTS[key];
                  return (
                    <tr key={key} className="border-t border-zinc-100">
                      <td className="py-1">{key}</td>
                      <td className="font-mono">{value.toFixed(2)}</td>
                      <td className="font-mono">{w.toFixed(2)}</td>
                      <td className="font-mono">{(value * w).toFixed(3)}</td>
                    </tr>
                  );
                })}
                <tr className="border-t border-zinc-200 font-bold">
                  <td className="py-1">Total</td>
                  <td />
                  <td className="font-mono">1.00</td>
                  <td className="font-mono">{candidate?.confidence.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-zinc-500">Not computed.</p>
          )}
          <p className="mt-3 text-xs text-zinc-500">
            Status: {candidate ? STATUS_LABEL[candidate.status] ?? candidate.status : "not built"}
          </p>
        </div>
      </div>
    </div>
  );
}