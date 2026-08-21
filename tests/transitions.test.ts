import { describe, expect, test } from "vitest";
import { canTransition, nextStatuses } from "@/lib/store/transitions";
import type { CandidateStatus } from "@/lib/types";

const ALL: CandidateStatus[] = [
  "extracted", "geo_resolved", "candidate",
  "under_review", "verified", "rejected", "matched_existing",
];

describe("moving a Candidate through review", () => {
  test("a Candidate can only be picked up for review", () => {
    expect(canTransition("candidate", "under_review")).toBe(true);
    for (const to of ALL.filter((s) => s !== "under_review")) {
      expect(canTransition("candidate", to), to).toBe(false);
    }
  });

  test("a Reviewer looking at one may verify, reject or call it already mapped", () => {
    expect(canTransition("under_review", "verified")).toBe(true);
    expect(canTransition("under_review", "rejected")).toBe(true);
    expect(canTransition("under_review", "matched_existing")).toBe(true);
  });

  test("verified and rejected are the end of the road", () => {
    for (const to of ALL) {
      expect(canTransition("verified", to), `verified -> ${to}`).toBe(false);
      expect(canTransition("rejected", to), `rejected -> ${to}`).toBe(false);
    }
  });

  test("a disputed match can be reopened, and only reopened", () => {
    expect(canTransition("matched_existing", "under_review")).toBe(true);
    for (const to of ALL.filter((s) => s !== "under_review")) {
      expect(canTransition("matched_existing", to), to).toBe(false);
    }
  });

  test("nothing automated may reach into the review states", () => {
    // ADR-0003: the pipeline stops at candidate, so these are not transitions anyone may make
    for (const from of ["extracted", "geo_resolved"] as CandidateStatus[]) {
      for (const to of ALL) expect(canTransition(from, to), `${from} -> ${to}`).toBe(false);
    }
  });

  test("nothing may transition to itself", () => {
    for (const status of ALL) expect(canTransition(status, status), status).toBe(false);
  });

  test("nextStatuses lists exactly what canTransition allows", () => {
    for (const from of ALL) {
      const allowed = ALL.filter((to) => canTransition(from, to));
      expect(nextStatuses(from).slice().sort(), from).toEqual(allowed.sort());
    }
  });
});
