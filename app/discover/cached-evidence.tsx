"use client";

import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import volume from "@/content/pages/zafar-hasan-v2.json";
import type { StoredCandidate } from "@/lib/types";
import EvidencePanel from "./evidence-panel";

// the full Evidence lives in the committed cache, so it is looked up by id rather than stored a
// second time in the database. shared by Authority and by the green pins on Explore.
export default function CachedEvidence({
  candidate,
  onClose,
}: {
  candidate: StoredCandidate;
  onClose: () => void;
}) {
  const cached = DISCOVERY_CACHE[`${candidate.volumeId}-${candidate.pageNo}`];
  const full = cached?.candidates.find((c) => c.id === candidate.id) ?? null;
  const mention = cached?.mentions.find((m) => m.id === full?.mentionId) ?? null;
  const raw = volume.pages.find((p) => p.pageNo === candidate.pageNo);

  if (!full || !mention || !raw) {
    return (
      <aside className="sheet fixed inset-x-0 top-14 bottom-0 z-[900] overflow-y-auto border-t border-ink-faint/40 bg-paper-raised p-4 lg:static lg:inset-auto lg:z-auto lg:w-96 lg:shrink-0 lg:border-t-0 lg:border-l">
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
      page={{
        pageNo: raw.pageNo,
        printedPageNo: raw.printedPageNo,
        imageUrl: raw.imageUrl,
        text: raw.text,
        placed: cached.candidates.length,
      }}
      volumeTitle={volume.title}
      source="cached"
      modelId={cached.modelId}
      onClose={onClose}
    />
  );
}
