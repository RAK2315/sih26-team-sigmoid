import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ANCHORS } from "@/content/anchors";
import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import volume from "@/content/pages/zafar-hasan-v2.json";
import type { BaselineFeature } from "@/lib/discovery/baseline";
import { buildCandidates } from "@/lib/discovery/candidates";
import { extractMentions } from "@/lib/discovery/extract";
import type { AnalyseResult } from "@/lib/types";

export const runtime = "nodejs";

const Body = z.object({ volumeId: z.literal("zafar-hasan-v2"), pageNo: z.number().int() });

let baselineCache: BaselineFeature[] | null = null;

async function loadBaseline(): Promise<BaselineFeature[] | null> {
  if (baselineCache) return baselineCache;
  try {
    const raw = await readFile(join(process.cwd(), "content", "baseline.geojson"), "utf8");
    baselineCache = (JSON.parse(raw) as { features: BaselineFeature[] }).features;
    return baselineCache;
  } catch {
    // without the Modern Baseline every Candidate would read as a Representation Gap, which
    // is a claim we cannot make, so the caller serves the cached Page instead
    return null;
  }
}

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const { volumeId, pageNo } = parsed.data;
  const page = volume.pages.find((p) => p.pageNo === pageNo);
  if (!page) return NextResponse.json({ error: "no_such_page", pageNo }, { status: 404 });

  const cached = DISCOVERY_CACHE[`${volumeId}-${pageNo}`] ?? null;

  let reason = "";
  const baseline = await loadBaseline();
  if (baseline === null) reason = "the Modern Baseline could not be read";
  if (baseline) {
    const extracted = await extractMentions(pageNo, page.text);
    if (!extracted.ok) reason = extracted.reason;
    if (extracted.ok) {
      const { mentions, modelId } = extracted.extraction;
      const live: AnalyseResult = {
        source: "live",
        modelId,
        pageNo,
        mentions,
        candidates: buildCandidates({ mentions, anchors: ANCHORS, baseline, volumeId }),
      };
      return NextResponse.json(live);
    }
  }

  if (cached) {
    return NextResponse.json({
      ...cached,
      source: "cached",
      fallbackReason: reason,
    } satisfies AnalyseResult);
  }

  return NextResponse.json({ error: "unavailable", pageNo }, { status: 503 });
}
