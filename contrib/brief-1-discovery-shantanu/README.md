# Brief 1 - Discovery Engine

Turns one page of a 1916 ASI survey of Delhi into pins on a modern map.

The Archaeological Survey of India published a monument-by-monument survey of
Delhi between 1916 and 1922, recording roughly 1,300 structures. This app reads
a page, extracts each structure mentioned, converts its written location into a
coordinate with an honest uncertainty radius, and checks whether anything on
today's map sits inside that radius. If nothing does, that is a
Representation Gap: something the record knew about that no modern map shows.

It produces Candidates for a human to review. Nothing automated goes past
`candidate`.

## Run it

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000/discover, pick a page, hit Analyse.

## Verify

```bash
pnpm verify        # asserts, then prints "verify: all assertions passed"
pnpm test          # vitest, all green
pnpm typecheck     # tsc --noEmit, no errors
pnpm build         # production build succeeds
```

## Ingest (run once, output is committed)

```bash
pnpm ingest          # downloads 20 page scans + texts into content/ and public/pages/
pnpm pull-baseline   # downloads today's OSM historic/heritage features into content/baseline.geojson
```

Set a free Gemini key in `.env.local` (see `.env.example` if present):

```
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.7-flash
GEMINI_TIMEOUT_MS=8000
```

Then build the extraction cache (one page every 7 seconds, ~2.5 min):

```bash
pnpm build-cache
```

The cache is what lets the demo survive bad wifi. At runtime the app never
calls archive.org, Overpass or Gemini in a loop.

## How it works

- `lib/extract.ts` sends a page to Gemini with a zod schema, validates, and
  falls back to `content/cache/page-{n}.json` on any failure.
- `lib/resolve.ts` resolves a spatial clue ("200 yards north of Kotla
  Firoz Shah") into `[lng, lat]` plus an uncertainty radius. Unknown anchors
  return `null` - it never guesses.
- `lib/baseline.ts` checks today's map inside the radius.
- `lib/confidence.ts` scores five named parts (weights sum to 1.0).
- `lib/pipeline.ts` assembles Candidates; a `matched_existing` result proves
  the pipeline finds real things.

Every claim traces to a page image and an exact passage. Every coordinate
carries a visible uncertainty radius. Confidence is five parts, never one
opaque number.