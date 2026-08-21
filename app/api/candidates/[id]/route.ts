import { NextResponse } from "next/server";
import { z } from "zod";
import { moveCandidate } from "@/lib/store/candidates";
import { canTransition } from "@/lib/store/transitions";
import type { CandidateStatus } from "@/lib/types";

export const runtime = "nodejs";

const STATUSES = [
  "extracted", "geo_resolved", "candidate",
  "under_review", "verified", "rejected", "matched_existing",
] as const;

const Body = z.object({
  fromStatus: z.enum(STATUSES),
  toStatus: z.enum(STATUSES),
  note: z.string().max(500).nullable().default(null),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const { fromStatus, toStatus, note } = parsed.data;
  if (!canTransition(fromStatus as CandidateStatus, toStatus as CandidateStatus)) {
    return NextResponse.json(
      { error: "illegal_transition", from: fromStatus, to: toStatus },
      { status: 409 },
    );
  }

  const moved = await moveCandidate(id, fromStatus, toStatus, note);
  // without the database the decision cannot be recorded, and pretending otherwise would show
  // a Reviewer a verdict that survives until they reload
  if (!moved) return NextResponse.json({ error: "unavailable", id }, { status: 503 });

  return NextResponse.json({ id, status: toStatus });
}
