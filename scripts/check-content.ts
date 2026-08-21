import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { ANCHORS } from "../content/anchors";
import { factSheets } from "../content/factsheets";
import { narrationTexts } from "../content/narrations";
import rendered from "../content/narrations/rendered.json";
import { points } from "../content/points";
import { sites } from "../content/sites";

const problems: string[] = [];

function fail(where: string, what: string) {
  problems.push(`${where}: ${what}`);
}

function checkShape(where: string, schema: z.ZodType, value: unknown) {
  const parsed = schema.safeParse(value);
  if (parsed.success) return;
  for (const issue of parsed.error.issues) {
    fail(where, `${issue.path.join(".") || "(root)"} ${issue.message}`);
  }
}

const coord = z.tuple([z.number().min(76).max(78), z.number().min(28).max(29)]);

const siteSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  nameLocal: z.string().min(1).optional(),
  depth: z.enum(["deep", "shallow"]),
  period: z.string().min(1),
  centroid: coord,
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  pointIds: z.array(z.string()),
  blurb: z.string().min(20),
  representationScore: z.number().min(0).max(1),
  coordSource: z.string().min(1),
});

const zoneSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(coord).min(4)).min(1),
});

// alt text is required on both halves because a divider that only says before and after
// describes nothing to a screen reader
const archiveImageSchema = z.object({
  url: z.string().startsWith("/images/"),
  alt: z.string().min(40),
  year: z.string().min(4),
  author: z.string().min(2),
  licence: z.string().min(2),
  sourceUrl: z.string().url().startsWith("https://commons.wikimedia.org/"),
});

const pointSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
  siteId: z.string(),
  name: z.string().min(1),
  nameLocal: z.string().min(1).optional(),
  tags: z.array(z.enum(["history", "architecture", "culture_traditions", "military", "religion"])).min(1),
  importance: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  zone: zoneSchema,
  centroid: coord,
  livingTradition: z
    .object({
      name: z.string().min(1),
      text: z.string().min(40),
      status: z.enum(["living", "dormant", "lost"]),
    })
    .nullable(),
  thenNow: z
    .object({
      then: archiveImageSchema,
      now: archiveImageSchema,
      note: z.string().min(30),
    })
    .optional(),
});

const factSheetSchema = z.object({
  id: z.string().min(1),
  pointId: z.string(),
  lines: z
    .array(z.object({ id: z.string().min(1), text: z.string().min(10), source: z.string().min(3) }))
    .min(3),
  sources: z
    .array(
      z.object({
        label: z.string().min(3),
        url: z.string().url().optional(),
        kind: z.enum(["asi", "archive", "book", "wikipedia"]),
      }),
    )
    .min(1),
});

const narrationSchema = z.object({
  pointId: z.string(),
  persona: z.enum(["history", "architecture", "kids"]),
  lang: z.enum(["en", "hi"]),
  kind: z.enum(["approach", "inside"]),
  sentences: z.array(z.string().min(5)).min(2),
  factSheetId: z.string().min(1),
});

const anchorSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  centroid: coord,
  precisionM: z.number().positive(),
  source: z.string().min(1),
});

const clipSchema = z.object({
  audioUrl: z.string().startsWith("/audio/"),
  durationSec: z.number().positive(),
  sentences: z.array(z.string()).min(1),
  cues: z.array(z.number()).min(1),
  voice: z.string().min(1),
  textHash: z.string().length(16),
});

const pointIds = new Set(points.map((p) => p.id));
const factSheetIds = new Set(factSheets.map((f) => f.id));

for (const site of sites) {
  checkShape(`site ${site.id}`, siteSchema, site);
  const [west, south, east, north] = site.bbox;
  if (site.centroid[0] < west || site.centroid[0] > east || site.centroid[1] < south || site.centroid[1] > north) {
    fail(`site ${site.id}`, "centroid sits outside its own bbox");
  }
  for (const id of site.pointIds) {
    if (!pointIds.has(id)) fail(`site ${site.id}`, `names a Heritage Point that does not exist: ${id}`);
  }
  // a filled pin promises points to walk between, so depth has to match what is there
  if (site.depth === "deep" && site.pointIds.length < 3) {
    fail(`site ${site.id}`, `is marked deep with ${site.pointIds.length} Heritage Points`);
  }
  if (site.depth === "shallow" && site.pointIds.length > 0) {
    fail(`site ${site.id}`, "is marked shallow but has Heritage Points");
  }
}

const siteIds = new Set(sites.map((s) => s.id));
for (const point of points) {
  checkShape(`point ${point.id}`, pointSchema, point);
  if (!siteIds.has(point.siteId)) fail(`point ${point.id}`, `belongs to no Heritage Site: ${point.siteId}`);
  const site = sites.find((s) => s.id === point.siteId);
  if (site && !site.pointIds.includes(point.id)) {
    fail(`point ${point.id}`, `is not listed by ${site.id}`);
  }
  const ring = point.zone.coordinates[0];
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) fail(`point ${point.id}`, "zone ring is not closed");
  if (!factSheets.some((f) => f.pointId === point.id)) fail(`point ${point.id}`, "has no Fact Sheet");
  if (point.thenNow) {
    for (const half of [point.thenNow.then, point.thenNow.now]) {
      if (!existsSync(join("public", half.url))) {
        fail(`point ${point.id}`, `Then-vs-Now image missing: ${half.url}`);
      }
    }
  }
}

for (const sheet of factSheets) {
  checkShape(`fact sheet ${sheet.id}`, factSheetSchema, sheet);
  if (!pointIds.has(sheet.pointId)) fail(`fact sheet ${sheet.id}`, `describes no Heritage Point: ${sheet.pointId}`);
  const lineIds = sheet.lines.map((l) => l.id);
  if (new Set(lineIds).size !== lineIds.length) fail(`fact sheet ${sheet.id}`, "has repeated line ids");
}

const clips = rendered as Record<string, z.infer<typeof clipSchema>>;
for (const narration of narrationTexts) {
  const id = `${narration.pointId}/${narration.persona}.${narration.lang}.${narration.kind}`;
  checkShape(`narration ${id}`, narrationSchema, narration);
  if (!pointIds.has(narration.pointId)) fail(`narration ${id}`, "speaks for no Heritage Point");
  if (!factSheetIds.has(narration.factSheetId)) fail(`narration ${id}`, `cites no Fact Sheet: ${narration.factSheetId}`);

  const clip = clips[id];
  if (!clip) {
    fail(`narration ${id}`, "has no rendered clip");
    continue;
  }
  checkShape(`clip ${id}`, clipSchema, clip);
  if (!existsSync(join("public", clip.audioUrl))) fail(`clip ${id}`, `audio file missing: ${clip.audioUrl}`);
  if (clip.cues.length !== clip.sentences.length) fail(`clip ${id}`, "has a cue for every sentence but one count differs");
  // if the text moved and the audio did not, the transcript drifts out from under the voice
  const hash = createHash("sha256").update(narration.sentences.join(" ")).digest("hex").slice(0, 16);
  if (hash !== clip.textHash) fail(`clip ${id}`, "text has changed since the audio was rendered");
}

const anchorIds = new Set<string>();
for (const anchor of ANCHORS) {
  checkShape(`anchor ${anchor.id}`, anchorSchema, anchor);
  if (anchorIds.has(anchor.id)) fail(`anchor ${anchor.id}`, "id is used twice");
  anchorIds.add(anchor.id);
}

if (problems.length > 0) {
  console.error(`check:content found ${problems.length} problems\n`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `check:content clean - ${sites.length} sites, ${points.length} Heritage Points, ` +
    `${factSheets.length} Fact Sheets, ${narrationTexts.length} Narrations, ${ANCHORS.length} Anchors`,
);
