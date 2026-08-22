import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ANCHORS } from "@/content/anchors";
import type { BaselineFeature } from "@/lib/discovery/baseline";
import { buildCandidates } from "@/lib/discovery/candidates";
import { extractMentions } from "@/lib/discovery/extract";
import type { AnalyseResult } from "@/lib/types";

export const runtime = "nodejs";

// the same pipeline the shelf runs, pointed at whatever a visitor pastes in. there is no Page
// behind it and no cached copy to fall back on, so a model that will not answer says so.
const Body = z.object({ text: z.string().trim().min(40).max(6000) });

let baselineCache: BaselineFeature[] | null = null;

async function loadBaseline(): Promise<BaselineFeature[] | null> {
  if (baselineCache) return baselineCache;
  try {
    const raw = await readFile(join(process.cwd(), "content", "baseline.geojson"), "utf8");
    baselineCache = (JSON.parse(raw) as { features: BaselineFeature[] }).features;
    return baselineCache;
  } catch {
    // without the Modern Baseline every Candidate would read as a Representation Gap, which
    // is a claim we cannot make
    return null;
  }
}

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const baseline = await loadBaseline();
  if (baseline === null) {
    return NextResponse.json(
      { error: "unavailable", reason: "the Modern Baseline could not be read" },
      { status: 503 },
    );
  }

  const extracted = await extractMentions(0, parsed.data.text);
  if (!extracted.ok) {
    return NextResponse.json({ error: "unavailable", reason: extracted.reason }, { status: 503 });
  }

  const { mentions, modelId } = extracted.extraction;
  const result: AnalyseResult = {
    source: "live",
    modelId,
    pageNo: 0,
    mentions,
    candidates: buildCandidates({ mentions, anchors: ANCHORS, baseline, volumeId: "pasted" }),
  };
  return NextResponse.json(result);
}
