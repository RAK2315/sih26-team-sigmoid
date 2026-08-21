import { createHash } from "node:crypto";
import { narrationTexts } from "@/content/narrations";
import rendered from "@/content/narrations/rendered.json";
import type { Narration, NarrationText } from "@/lib/types";

interface RenderedClip {
  audioUrl: string;
  durationSec: number;
  sentences: string[];
  cues: number[];
  voice: string;
  textHash: string;
}

const clips = rendered as Record<string, RenderedClip>;

export function narrationId(n: NarrationText): string {
  return `${n.pointId}/${n.persona}.${n.lang}.${n.kind}`;
}

// the renderer stamps this and the checker compares it, so drifting apart would be silent
export function narrationTextHash(sentences: string[]): string {
  return createHash("sha256").update(sentences.join(" ")).digest("hex").slice(0, 16);
}

// a clip that has not been rendered yet still shows its transcript, it just has nothing to play
export const narrations: Narration[] = narrationTexts.map((text) => {
  const clip = clips[narrationId(text)];
  return {
    ...text,
    audioUrl: clip?.audioUrl ?? "",
    durationSec: clip?.durationSec ?? 0,
    sentences: clip?.sentences ?? text.sentences,
    cues: clip?.cues ?? [],
  };
});

export function narrationFor(
  pointId: string,
  persona: Narration["persona"],
  lang: Narration["lang"],
  kind: Narration["kind"],
): Narration | undefined {
  return narrations.find(
    (n) => n.pointId === pointId && n.persona === persona && n.lang === lang && n.kind === kind,
  );
}
