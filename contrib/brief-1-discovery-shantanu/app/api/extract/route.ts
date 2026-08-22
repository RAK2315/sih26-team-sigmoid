import { NextResponse } from "next/server";
import { PAGES } from "../../../content/pages";
import { extractMentions } from "../../../lib/extract";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const pageNo = Number(body?.pageNo);

  if (!Number.isInteger(pageNo)) {
    return NextResponse.json({ error: "pageNo is required" }, { status: 400 });
  }

  const page = PAGES.find((p) => p.pageNo === pageNo);
  if (!page) {
    return NextResponse.json(
      { error: `no ingested page ${pageNo}` },
      { status: 404 }
    );
  }

  try {
    const { mentions, source } = await extractMentions(page.text, pageNo);
    return NextResponse.json({ mentions, source });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 503 }
    );
  }
}