# VIRASAT

*विरासत · Stand where it happened.*

**Smart India Hackathon 2026, internal round. Theme: Heritage & Culture. Team Sigmoid, JSS University.**

---

Archival heritage records contain thousands of historically significant Indian sites missing from modern maps and tourism platforms. Our system extracts, maps and contextualizes these forgotten sites, surfacing them for expert verification and for visitors on the ground.

**Problem statement:** Reconnecting India's archival heritage records with on-ground visitor experience.

## The short version

Between 1916 and 1922 the Archaeological Survey of India catalogued roughly **1,300 monuments in Delhi**. Today about **174** are centrally protected. The rest did not all disappear. They stopped being findable: unmarked, unmapped, unexplained.

VIRASAT is two engines over one heritage record.

**Discovery** reads the archival record, pulls out every structure a page mentions, converts its written location into a modern coordinate with an honest uncertainty radius, and checks whether anything on today's map sits inside it. If nothing does, we have surfaced a **Representation Gap**.

**Experience** puts a visitor at a heritage site. When they are close to a structure, facing it, and have stood still for three seconds, it begins telling them about itself. No search, no typing, no guide.

The two connect: a verified Candidate from the archive becomes a place a visitor can walk to and hear.

## Start here

| Read | Why |
|---|---|
| **[VIRASAT-project-brief.pdf](./docs/VIRASAT-project-brief.pdf)** | **Everyone reads this first.** 19 pages, the whole project: problem, vocabulary, architecture, features, the demo, the risks, house rules. |
| [CONTEXT.md](./CONTEXT.md) | The shared vocabulary. Use these exact words. |
| [plan/teammate-briefs/](./plan/teammate-briefs/) | Five independent build briefs, one per person. |

## Who is building what

| Brief | Feature | Owner |
|---|---|---|
| core | Map navigation, location tracking, geofencing, the Threshold Crossing | Rehaan |
| [1](./plan/teammate-briefs/BRIEF-1-discovery-engine.md) | Discovery engine: archival page to pins on a map | Shantanu |
| [2](./plan/teammate-briefs/BRIEF-2-authority-dashboard.md) | Authority dashboard: the Candidate review queue | Lakshita |
| [3](./plan/teammate-briefs/BRIEF-3-route-planner.md) | Route planner: interests and time to an ordered walk | Ananya |
| [4](./plan/teammate-briefs/BRIEF-4-narration-system.md) | Narration: audio, transcript, personas, grounded Q&A | Krishna |
| [5](./plan/teammate-briefs/BRIEF-5-explore-and-hidden-heritage.md) | Explore, Hidden Heritage, landing page | Vishnu |

Each brief is standalone. Build it as your own Next.js app with `create-next-app`. You do not need this repo to build, and nothing you write can break it.

**These documents are live.** If something changes, it changes here first. Pull before you start a work session.

## Three rules

1. **Copy `lib/types.ts` verbatim** from your brief. Do not rename a field, do not change a type, do not add one because it seemed useful.
2. **Coordinates are `[lng, lat]` everywhere.** GeoJSON order. Leaflet wants `[lat, lng]`, which is backwards, so the flip happens in exactly one helper and nowhere else. This is the bug you are most likely to ship.
3. **Run your brief's "Verify your build" section before opening the PR** and paste its output into the description. If something does not pass, say so rather than hiding it.

## The one principle

> **Show the evidence, or don't show it at all.**

Every pin, fact, confidence number and status must expose where it came from within one interaction. If a feature cannot show its evidence, it does not get built. No exceptions, and none "just for the demo".

## Two phrases we never use

**"discovered a monument"** and **"AI found"**. Nothing here discovers anything. The archive recorded it, we projected it, a Reviewer confirms it. Say *surfaced a Candidate* or *identified a Representation Gap*.

This is not pedantry. A judge will attack any claim that an AI decided what heritage is, and the vocabulary is how we stay out of that argument.

## Submitting work

Your app goes into [`contrib/`](./contrib/), which is excluded from the build, typecheck, tests and deploy. Nothing there can break anything, so every PR that follows the rules gets merged.

```bash
gh repo fork https://github.com/RAK2315/sih26-team-sigmoid --clone
cd sih26-team-sigmoid
git checkout -b brief-N-<name>-<yourname>
mkdir -p contrib/brief-N-<name>-<yourname>
# copy your app in, then
git diff --staged | grep -iE "api[_-]?key|secret|token"   # must print nothing
git add contrib/ && git commit -m "contrib: ..." && git push -u origin HEAD
gh pr create --fill
```

A PR is accepted when every changed file sits inside your own `contrib/` folder, no credential is in the diff, and there is no `node_modules/`, `.next/` or media over 5MB. That is the whole bar.

## House style

- **No em dashes.** No en dashes. Use a simple hyphen with spaces around it, or restructure the sentence. This applies to UI copy and spoken narration too, where an em dash also makes text-to-speech pause strangely.
- Simple and boring beats clever. No abstraction until something is needed twice.
- No `any`, no `@ts-ignore`.
- Every external call has its fallback in the same function, not in a wrapper.
- Never invent a requirement. If you are guessing, say so out loud.

## Stack

Next.js 16.3.1 · React 19 · Tailwind 4.3.3 · Leaflet 1.9.4 + react-leaflet 5.0.0 · @turf/turf 7.4.0 · Supabase 2.112.3 · @google/genai 2.17.1 · Vitest 4.1.11 · zod 4.4.3

No component library. No PostGIS. No Python service. One repo, one deploy.

## Sources and licensing

- **Archaeological Survey of India, _List of Muhammadan and Hindu Monuments, Delhi Province_, Vols. I-III (1916-1922).** Public domain, via the Internet Archive (`in.ernet.dli.2015.70478`, `.69530`, `.69531`).
- **OpenStreetMap** contributors, via the Overpass API. ODbL.
- **CARTO** basemaps. Attribution required.
- **Wikimedia Commons** imagery. Public domain by age, or CC-BY-SA with credit shown at point of use.

No generated or AI-reconstructed imagery of real monuments exists anywhere in this project, and none will.
