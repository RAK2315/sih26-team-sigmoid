import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { narrationTexts } from "../content/narrations";
import { narrationId, narrationTextHash } from "../lib/narration/id";
import type { NarrationText } from "../lib/types";

const run = promisify(execFile);

// the default read is slow for a walking tour, so nudge it up
const RATE = "+18%";

const VOICES: Record<string, string> = {
  "history.en": "en-IN-PrabhatNeural",
  "architecture.en": "en-IN-PrabhatNeural",
  "kids.en": "en-IN-NeerjaNeural",
  "history.hi": "hi-IN-MadhurNeural",
  "architecture.hi": "hi-IN-MadhurNeural",
  "kids.hi": "hi-IN-SwaraNeural",
};

interface Rendered {
  audioUrl: string;
  durationSec: number;
  sentences: string[];
  cues: number[];
  voice: string;
  textHash: string;
}

function seconds(stamp: string): number {
  const [h, m, s] = stamp.replace(",", ".").split(":");
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

// edge-tts writes one subtitle cue per sentence, so its own split is what the transcript follows
function parseCues(vtt: string): { sentences: string[]; cues: number[]; end: number } {
  const sentences: string[] = [];
  const cues: number[] = [];
  let end = 0;
  const blocks = vtt.split(/\r?\n\r?\n/);
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const timing = lines.find((l) => l.includes("-->"));
    if (!timing) continue;
    const [from, to] = timing.split("-->").map((t) => t.trim());
    const text = lines.slice(lines.indexOf(timing) + 1).join(" ").trim();
    if (text.length === 0) continue;
    sentences.push(text);
    cues.push(Number(seconds(from).toFixed(3)));
    end = Math.max(end, seconds(to));
  }
  return { sentences, cues, end };
}

async function main() {
  const scratch = join(tmpdir(), "threshold-render");
  await mkdir(scratch, { recursive: true });
  const rendered: Record<string, Rendered> = {};

  for (const narration of narrationTexts) {
    const id = narrationId(narration);
    const voice = VOICES[`${narration.persona}.${narration.lang}`];
    if (!voice) throw new Error(`no voice for ${narration.persona}.${narration.lang}`);

    const text = narration.sentences.join(" ");
    const mp3 = join(scratch, "clip.mp3");
    const vtt = join(scratch, "clip.vtt");

    await run("python", [
      "-m", "edge_tts",
      "-v", voice,
      "-t", text,
      "--rate", RATE,
      "--write-media", mp3,
      "--write-subtitles", vtt,
    ]);

    const parsed = parseCues(await readFile(vtt, "utf-8"));
    if (parsed.sentences.length !== narration.sentences.length) {
      console.log(`  note: ${id} rendered as ${parsed.sentences.length} spoken lines from ${narration.sentences.length} written ones`);
    }

    const dir = join("public", "audio", ...narration.pointId.split("/"));
    await mkdir(dir, { recursive: true });
    const file = `${narration.persona}.${narration.lang}.${narration.kind}.mp3`;
    await writeFile(join(dir, file), await readFile(mp3));

    rendered[id] = {
      audioUrl: `/audio/${narration.pointId}/${file}`,
      durationSec: Number(parsed.end.toFixed(3)),
      sentences: parsed.sentences,
      cues: parsed.cues,
      voice,
      textHash: narrationTextHash(narration.sentences),
    };
    console.log(`  ${id}  ${parsed.end.toFixed(1)}s  ${parsed.cues.length} cues  ${voice}`);
  }

  await writeFile("content/narrations/rendered.json", JSON.stringify(rendered, null, 2) + "\n");
  await rm(scratch, { recursive: true, force: true });
  console.log(`wrote content/narrations/rendered.json with ${Object.keys(rendered).length} clips`);
}

main();
