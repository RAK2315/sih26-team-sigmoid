import { createHash } from "node:crypto";
import type { NarrationText } from "@/lib/types";

// the key into content/narrations/rendered.json, written by the renderer and read by everything
export function narrationId(n: NarrationText): string {
  return `${n.pointId}/${n.persona}.${n.lang}.${n.kind}`;
}

// the renderer stamps this and the checker compares it, so drifting apart would be silent
export function narrationTextHash(sentences: string[]): string {
  return createHash("sha256").update(sentences.join(" ")).digest("hex").slice(0, 16);
}
