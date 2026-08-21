import type { CandidateStatus } from "@/lib/types";

// The whole review rule, in one place. ADR-0003: nothing automated may make any of these moves,
// which is why extracted and geo_resolved lead nowhere here.
const ALLOWED: Partial<Record<CandidateStatus, CandidateStatus[]>> = {
  candidate: ["under_review"],
  under_review: ["verified", "rejected", "matched_existing"],
  // reopened only when a Reviewer disputes the match
  matched_existing: ["under_review"],
};

export function nextStatuses(from: CandidateStatus): CandidateStatus[] {
  return ALLOWED[from] ?? [];
}

export function canTransition(from: CandidateStatus, to: CandidateStatus): boolean {
  return nextStatuses(from).includes(to);
}
