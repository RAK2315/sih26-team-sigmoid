import { NextResponse } from "next/server";
import { recentCrossings } from "@/lib/store/walks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const crossings = await recentCrossings();
  // an empty list and an unreachable database look the same on screen unless we say which
  if (crossings === null) return NextResponse.json({ reachable: false, crossings: [] });
  return NextResponse.json({ reachable: true, crossings });
}
