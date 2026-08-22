# Rehearsal

Every number here was measured, not estimated. Re-measure if content changes.

## Before you start

- Open the deployed URL in a **fresh browser profile**. Your dev profile has already granted
  audio, location and everything else, so it lies to you about what a judge sees.
- Do **not** press Analyse in the sixty seconds before you go on. Both model providers bind on
  tokens per minute and a recent call spends the budget the demo needs.
- Load `/explore` once to warm Supabase. A free project that has been idle answers slowly on the
  first request.
- Check the volume on the room's output before the slot, not during it.

## What the two engines cost, measured

| | |
|---|---|
| Narration, History | 11 clips, 403s total, mean 37s, longest Rang Mahal at 44s |
| Narration, Architecture | 11 clips, 363s total, mean 33s, longest Diwan-i-Aam at 38s |
| Narration, Kids | 11 clips, 186s total, mean 17s, longest Diwan-i-Khas at 22s |
| Route at 10 minutes | 3 stops, 9 min, 8 left out |
| Route at 15 minutes | 7 stops, 14 min, 4 left out |
| Route at 30 minutes | 11 stops, 20 min, none left out |
| Analyse, live | 3.5s to 5.7s measured against production |
| Analyse, cached | 0.7s to 1.3s |
| Analyse, model timeout then cache | about 9s |

The Route is the same for every Persona on purpose. Only the telling changes.

## The full run, about 8 minutes

**1. `/` - 30s.** The Survey catalogued roughly 1,300 monuments in Delhi. About 174 are protected
today. Read the five figures off the page; they are counted out of the data at build time, so they
are never stale. Say the one rule out loud: show the evidence, or do not show it at all.

**2. `/explore` - 45s.** Eleven Heritage Sites. Open Hidden Heritage. Point at the one entry with a
green tick: that is a Candidate a Reviewer confirmed, and its line says which scan it came from.
Point at an entry marked **editorial**: that is our opinion and it says so. Do not skip that
contrast, it is the whole pitch in five seconds.

**3. `/site/red-fort/plan` - 30s.** Pick History and Architecture, pick **15 minutes**. Say: seven
Heritage Points, four left out to fit. Then pick 30 and say: eleven. The budget has to visibly do
something or it reads as decoration.

**4. `/site/red-fort/tour` - 2m 30s.** Begin tour, which also unlocks audio.

- Walk toward Lahori Gate and stop **facing away**. The panel names the failing condition: facing
  away by N degrees. Nothing plays. This is the beat that proves it is not a proximity circle.
- Turn to face it. The ring fills over three seconds and it starts speaking on its own.
- Point at the transcript following the voice sentence by sentence. If the room has no audio this
  is your whole narration and it still works.
- Drag the Then and Now divider on Lahori Gate. Then walk to Naubat Khana and drag that one: same
  building, same angle, 161 years apart, and the arcaded court on both sides is gone.
- Switch Persona to Kids where you stand. Same place, different telling, same Route.

**5. `/discover` - 2m.** Pick a Page from the shelf, using the placed-count on the right to avoid
the nineteen that place nothing. Press Analyse.

- A passage of 1919 English highlights in the page text.
- It becomes a pin with a circle, and the circle is wide because the clue is vague. Say that: a
  wide circle is an honest answer and a bare pin is not.
- Open Evidence. Page, passage, Anchor, the four parts of the radius, the baseline check.
- **Press Analyse again immediately.** It comes back `cached` and prints why: `groq http 429;
  gemini http 429`. Say: it is rate limited, it says so, and it still answers from the copy
  committed with the app. This is a scored point, not a failure.

**6. `/authority` - 1m 15s.** The queue. Move a Candidate to under review and then verified. Say
that nothing automated ever gets past Candidate, and that the move is written to an append-only
trail. Then go back to `/explore` and show it now standing in Hidden Heritage with a green tick.
That is the two halves of the product touching.

**7. Close - 30s.** `/attributions`. Every image, author, date and licence on one page, and the
line that says no image of a real monument in this project was generated.

## The four minute cut, for when the slot is shorter

`/site/red-fort/plan` at 15 minutes, straight into the Walk for one Threshold Crossing with the
facing-away beat, then `/discover` on one Page with the Evidence panel, then `/authority` to verify
and back to `/explore` to see it land.

Drops: the landing page, Persona switching, Then and Now, attributions and the phone.

## Deliberate failures, all confirmed working

Trigger these on purpose during a rehearsal. Each one has been run against a built server.

| Break | What you should see |
|---|---|
| Both model providers rate limited | `cached` chip on `/discover` and the reason printed under it |
| Supabase unreachable | `stale` chip on the queue, 32 Candidates from the committed seed |
| Supabase unreachable, then verify | 503 and a line saying nothing was recorded. It does **not** fake the badge |
| Supabase unreachable, during a Walk | The Walk continues, and the panel counts the crossings it could not log |
| Wifi off entirely | Offline banner naming what still works. Route, audio and the engine are all local |
| A Page that places nothing | The map says why the map is empty, rather than looking broken |
| A passage the model composed | The card refuses it in red. 2 of 123 Mentions are refused this way |

## The wifi-off rehearsal, R5

Run it once for real.

```
pnpm build
pnpm start
```

Then turn the wifi off and open `http://localhost:3000`.

Working: every route, the whole Walk, all 36 audio clips, the trigger engine, the Page scans and
their text, `/discover` falling back to the committed cache, `/authority` falling back to the seed.

Not working, and say so rather than hiding it: map tiles that were not already in the browser
cache, because they come from CARTO. The offline banner says this in those words.

## Android checklist, F5

Against the deployed URL, because geolocation needs HTTPS and localhost on a phone is not that.

1. Open `/site/red-fort/tour`, press Begin tour, then press **Simulated** so it reads **Phone**.
2. Android asks for location. Allow it. The panel should say it is waiting for the first fix, and
   the simulated marker stays on screen until one arrives.
3. When the fix lands the marker turns red and its tooltip carries the accuracy in metres.
4. Turn the phone through a full circle. The facing cone should follow. If it does not, the panel
   should be saying there is no compass on this device.
5. Press **Phone** again to go back to Simulated. The marker should become draggable again.
6. Refuse the permission on a second attempt and confirm the panel says the walk stays simulated
   rather than sitting silent.

### Proving live tracking without being at Red Fort

Press **Phone**, wait for a real fix, then press **Bring it here**. The whole site slides under
your real position, keeping every distance and bearing between Heritage Points exactly as they
are in Delhi. Walk about seventy metres, turn to face the first one, stand still for three
seconds, and it speaks.

Say out loud what is real and what is not, because that is the point of the demo. Real: the
satellites, the compass, the Approach Ring test, the Facing test, the Dwell timer, the audio, and
the row it writes to the Walk log marked `gps` rather than `sim`. Not real: the coordinates,
which are translated. Nothing about the tracking is simulated, only the location of the Fort.

Afterwards, open `/authority` and scroll to the Walk log. The crossing you just made is recorded
with its location source. That is the evidence that a real phone drove it, and it is the answer
to a judge who asks whether the GPS half actually works.

Standing still must not reset Dwell. If it does, the deadband is too small. It is derived from
the engine's own drift tolerance in `lib/location/config.ts`, so widening it is a code change
and a deploy, not a dashboard toggle. See the note below.

## If something goes wrong on stage

- **A Threshold Crossing will not fire.** The panel names the failing condition; read it out and
  fix it. If it is still wrong, every Heritage Point in the list is tappable and plays on demand.
  That fallback is the one to reach for on stage.

  **Do not plan on changing `NEXT_PUBLIC_FACING_TOLERANCE_DEG` or `NEXT_PUBLIC_DWELL_MS` during
  the slot.** `plan/06-risks.md` R1 says these loosen the trigger from the Vercel dashboard with
  no rebuild. That is wrong and it was wrong when it was written. Next inlines every
  `NEXT_PUBLIC_` variable at build time, which `lib/location/config.ts` says in its own comment,
  so changing one in the dashboard does nothing until a redeploy finishes. Budget a minute or
  two for that, or set them before you go on.
- **No audio in the room.** The transcript carries the whole Narration. Say that this is why it
  exists.
- **Analyse is rate limited.** That is the demo beat above. Use it.
- **Someone asks about authentication on `/authority`.** It is open, it is documented, RLS permits
  only status updates and event inserts and never deletes, and the events table is append-only so
  tampering is visible. It is one Supabase email link and it was deliberately not this week's hour.
  Do not claim it is secured.
