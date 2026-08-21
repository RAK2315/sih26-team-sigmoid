import { NextResponse } from "next/server";
import seed from "@/content/candidates.seed.json";
import { listCandidates } from "@/lib/store/candidates";
import type { StoredCandidate } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const live = await listCandidates();
  // Supabase pauses when idle, so the committed snapshot stands in and the screen says stale
  if (live === null) {
    return NextResponse.json({ source: "stale", candidates: seed as StoredCandidate[] });
  }
  return NextResponse.json({ source: "live", candidates: live });
}
