import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { z } from "zod";
import type { Mention } from "./types";

const SpatialClueSchema = z
  .object({
    anchorName: z.string(),
    bearing: z
      .enum([
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW",
        "adjacent",
        "within",
        "opposite",
      ])
      .nullable(),
    distanceValue: z.number().nullable(),
    distanceUnit: z
      .enum(["yards", "feet", "miles", "kos", "paces", "gaz"])
      .nullable(),
  })
  .nullable();

const MentionSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    "mosque",
    "tomb",
    "gateway",
    "fort_wall",
    "palace",
    "pavilion",
    "stepwell",
    "caravanserai",
    "garden",
    "bridge",
    "well",
    "temple",
    "madrasa",
    "hammam",
    "tower",
    "other",
  ]),
  period: z.string().nullable(),
  passage: z.string().min(1),
  spatialClue: SpatialClueSchema,
});

const ExtractionSchema = z.object({ mentions: z.array(MentionSchema) });

// The cache stores full Mentions (with id and passageOffset) plus the raw
// extracted fields, so a cache hit needs no re-derivation and no re-parse of
// model output.
const CachedMentionSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: MentionSchema.shape.type,
  period: z.string().nullable(),
  passage: z.string().min(1),
  passageOffset: z.tuple([z.number(), z.number()]),
  spatialClue: SpatialClueSchema,
});
const CachedExtractionSchema = z.object({
  mentions: z.array(CachedMentionSchema),
});

const PROMPT = `You are reading one page of "List of Muhammadan and Hindu Monuments, Delhi
Province" (Archaeological Survey of India, 1916). It is a catalogue of
structures in and around Delhi.

Extract every distinct structure the page describes.

Rules:
- Copy the "passage" VERBATIM from the text given. Do not paraphrase, do not fix
  spelling, do not correct OCR errors. It must appear character for character in
  the input, because it is used to locate the passage in the page.
- "anchorName" is the landmark the text measures FROM, written exactly as the
  text writes it. If the text names no landmark, spatialClue is null.
- Return null rather than guessing. "period": "probably Mughal" is wrong; return
  null. An uncertain field left null is correct; an invented one is not.
- Keep the original unit of distance. The text uses kos and gaz. Do NOT convert
  them to yards or metres.
- Bearings: use the eight compass tokens for directions. Use "adjacent" for
  adjoining or attached, "within" for inside or enclosed by, "opposite" for
  facing or across from.
- If the page is an index, a preface or a table of contents, return an empty
  mentions array.

Page text:
---
{PAGE_TEXT}
---`;

const root = path.resolve(__dirname, "..");
const cacheDir = path.join(root, "content", "cache");

function cachePath(pageNo: number): string {
  return path.join(cacheDir, `page-${pageNo}.json`);
}

export function readCache(
  pageNo: number
): { mentions: Mention[]; source: "cached" } | null {
  const p = cachePath(pageNo);
  if (!fs.existsSync(p)) return null;
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  const parsed = CachedExtractionSchema.safeParse(raw);
  if (!parsed.success) return null;
  return { mentions: parsed.data.mentions, source: "cached" };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`gemini timed out after ${ms}ms`)),
      ms
    );
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

export async function extractMentions(
  pageText: string,
  pageNo: number
): Promise<{ mentions: Mention[]; source: "live" | "cached" }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS ?? 8000);
  const model = process.env.GEMINI_MODEL ?? "gemini-3.7-flash";

  try {
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const ai = new GoogleGenAI({ apiKey });
    const res = await withTimeout(
      ai.models.generateContent({
        model,
        contents: PROMPT.replace("{PAGE_TEXT}", pageText),
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: z.toJSONSchema(ExtractionSchema),
        },
      }),
      timeoutMs
    );

    const text = res.text;
    if (!text) throw new Error("gemini returned no text");
    const parsed = ExtractionSchema.safeParse(JSON.parse(text));
    if (!parsed.success)
      throw new Error(`zod validation failed: ${parsed.error.message}`);

    const mentions = parsed.data.mentions
      .map((m, i) => {
        const start = pageText.indexOf(m.passage);
        if (start === -1) {
          console.warn(
            `[extract] dropping mention ${i}: passage not found in page`
          );
          return null;
        }
        return {
          ...m,
          id: `m_${pageNo}_${i + 1}`,
          passageOffset: [start, start + m.passage.length] as [number, number],
        };
      })
      .filter((m): m is Mention => m !== null);

    return { mentions, source: "live" };
  } catch (err) {
    console.warn(`[extract] live extraction failed: ${(err as Error).message}`);
    const cached = readCache(pageNo);
    if (cached) return cached;
    throw new Error(
      "Extraction unavailable. No Gemini key, a live call failed, and no cache exists for this page."
    );
  }
}