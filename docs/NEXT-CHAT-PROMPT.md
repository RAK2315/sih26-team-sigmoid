# Prompt for the next chat

Copy everything below the line into a new session.

---

Project: VIRASAT (formerly THRESHOLD), SIH 2026 internal round, theme Heritage and Culture.
Working dir: `D:\Projects\0. Sih 2026`
Live: https://sih26-team-sigmoid.vercel.app

## Read these first, in this order

```
docs/STATUS.md            where the build is, 18 decisions the plan does not contain,
                          11 known issues ranked by demo risk. Read this first.
CLAUDE.md                 house rules, comment style, the seven seams, the PR policy
CONTEXT.md                vocabulary. Use these exact terms.
docs/adr/0001-0006        settled decisions. Do not relitigate without saying so.
docs/REHEARSAL.md         measured timings, the run sheet, the deliberate-failure table
docs/STITCH-PROMPTS.md    the design brief the current header bands came from
plan/04-design-system.md  tokens, layouts, the seven component states
plan/06-risks.md          R13 is scope creep. It is the one you will trigger.
docs/stitch frontend/     Stitch's generated screens. screen.png and code.html per page.
                          Take structure from these, never their copy: it invents
                          "satellite telemetry" and other things we do not do.
```

## State

Phases 0 through 7 are done, deployed and verified. `pnpm typecheck` clean, `pnpm test`
55 passing, `pnpm check:content` clean, `pnpm build` green, every route curled against
production. Three teammate PRs are merged into `contrib/`, which is excluded from
tsconfig, vitest and the Vercel deploy.

Routes: `/`, `/vision`, `/explore`, `/site/red-fort/plan`, `/site/red-fort/tour`,
`/discover`, `/authority`, `/attributions`.

## The job

The owner's words: **"the frontend is really still boring, no animation no nothing."**
That is the whole task. The information architecture and the copy are now good. The
visual execution is not. Do not rewrite content, do not add features, do not touch
`lib/`. This is a presentation-layer job.

### Work in this order

**1. The signature discovery sequence on `/discover`.** This is the highest value item
and it is mostly staging, not new logic. Every piece already exists; they just update
independently instead of reading as one move. Make pressing Analyse feel like one
cinematic sequence:

```
scan page visible
   -> the passage lights up in the page text, sweeping left to right
   -> a line or arc connects that passage to the map
   -> the Uncertainty Radius lands wide and contracts to its real size
   -> the Mention card arrives under it
```

`app/globals.css` already has `highlight-sweep`, `rise`, `ink-in`, `rule-draw` and a
`.stagger` helper, all switched off under `prefers-reduced-motion`. The contraction
animation is the one the design system explicitly says must still show its end state
when motion is reduced.

**2. The trigger panel on the tour.** It is the object that explains the entire product
and it currently renders as three lines of small grey text. `docs/STITCH-PROMPTS.md`
section 4 specifies it as an instrument panel: three conditions listed vertically, each
with a live value and a filled or hollow marker, green when met, amber when not, and the
whole panel turning green and reading SPEAKING when all three hold. Build that.

**3. The Dwell ring.** When the visitor is holding position, the ring around them should
fill clockwise over three seconds like a progress arc. It exists but it is not beautiful,
and it is the signature animation of the product.

**4. Mobile.** `/explore` was fixed. Check `/discover` and `/authority` at 390px: both
are three-column desktop layouts and the Evidence panel slides in from the right, which
has nowhere to go on a phone. The tour rail is long; consider the three tabs the design
system originally specified, but read the note in `plan/04-design-system.md` about why
one rail shipped before changing it.

**5. Page transitions.** Navigating between routes is currently a hard cut.

### Rules that are not negotiable

- **No em dashes or en dashes anywhere**, including UI copy. Hyphen with spaces.
- **No `any`, no `@ts-ignore`.**
- Comments: one line, plain language, why not what, only where the reason is not obvious.
- **No new dependency** for animation. There is a small keyframe layer in `globals.css`
  and it is enough. Framer Motion is not worth 40 KB here.
- Every animation must be disabled under `prefers-reduced-motion`. Two of them carry
  information, so the reduced path must still show the end state.
- Do not touch the five tested modules: `location/engine`, `route/planner`,
  `discovery/{resolve,baseline,confidence}`, `store/transitions`. They are closed.
- Do not move anything out of `contrib/`. Porting means a deliberate rewrite in a
  separate commit with credit. See CLAUDE.md.
- `pnpm lint` fails on seven pre-existing Phase 3 errors. Leave them.
- Typecheck, test and `check:content` as you go. Commit as you go. Curl the Vercel URL
  after pushing, because a green local build is not a green deploy.

### Say no to

The owner will ask for the heritage knowledge graph, food-heritage routes, artisan
profiles and a community economic layer. Those are R13 almost word for word. They are
already argued for properly on `/vision` as a clearly labelled roadmap, which is where
they belong. Building them would put a working demo at risk on the last day. Say so.

## Three things worth porting from `contrib/`, if there is time after the above

1. **`contrib/brief-4-narration-Krishna-Agarwal/app/api/ask/route.ts`** is a working
   grounded Ask box, which is F12 and the only unbuilt MVP feature. Its citation guard is
   right: it collects the known Fact Sheet line ids and discards the whole answer if the
   model cites one that does not exist. Two things to fix when porting: it must go through
   `lib/ai/model.ts` rather than calling `@google/genai` directly, which is seam 2, and an
   empty `citedLineIds` currently returns `grounded: true` because `[].every()` is true.
2. **`contrib/brief-3-planner-ananya/components/RoutePreview.tsx`** splits a Route into
   walking time and listening time before the visitor commits. Our `Route` already carries
   `walkSecFromPrevious` and `narrationSec` per stop, so read those rather than re-deriving.
3. **`contrib/brief-1-discovery-shantanu/content/anchors.ts`** has richer period alias
   lists than ours. Aliases only. Its coordinates have no `source` field and porting them
   would weaken ours.

## Open, and needing a human

- Two stopwatched rehearsals, one with wifi off. `docs/REHEARSAL.md`.
- Android GPS verification against the deployed URL. Checklist in the same file, including
  **Bring it here**, which slides the site under your real position so live tracking can be
  proved anywhere.
- One narration line is our inference rather than the survey's. Known issue 10.

Confirm what you have read, say back what you think the job is, then start with the
discovery sequence.
