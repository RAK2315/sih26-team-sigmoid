import Link from "next/link";
import Reveal from "../reveal";
import { ANCHORS } from "@/content/anchors";
import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import { points } from "@/content/points";

export const metadata = { title: "Why this matters - VIRASAT" };

const results = Object.values(DISCOVERY_CACHE);
const traditions = points.flatMap((p) => (p.livingTradition ? [p.livingTradition] : []));

const LOOP = [
  { step: "Preserve", note: "A survey volume, a gazetteer, a district record. Paper that already exists." },
  { step: "Understand", note: "Read it into structure: a name, a period, and where it says the thing stood." },
  { step: "Discover", note: "Compare that against today's map. What is missing is the finding." },
  { step: "Map", note: "A pin, and a circle wide enough to be honest about the doubt." },
  { step: "Experience", note: "Someone walks there, and the place tells them what happened." },
  { step: "Connect", note: "The craft, the trade and the ritual the building was made for." },
];

const LAYERS = [
  { name: "Monument", note: "the stone that survived" },
  { name: "Architecture", note: "why it is shaped like that" },
  { name: "Craft", note: "the hands that cut and set it" },
  { name: "Community", note: "who kept doing it" },
  { name: "Tradition", note: "what they did there, and when" },
  { name: "Festival", note: "the year it was measured by" },
  { name: "Food", note: "what was cooked and sold around it" },
  { name: "Music", note: "what was played, and at which hour" },
];

function Built({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 border-t border-ink-faint/25 py-2.5">
      <span className="font-archive mt-0.5 shrink-0 text-[10px] tracking-widest text-state-verified uppercase">
        built
      </span>
      <span className="text-sm leading-relaxed text-ink">{children}</span>
    </li>
  );
}

function Next({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 border-t border-ink-faint/25 py-2.5">
      <span className="font-archive mt-0.5 shrink-0 text-[10px] tracking-widest text-ink-faint uppercase">
        next
      </span>
      <span className="text-sm leading-relaxed text-ink-muted">{children}</span>
    </li>
  );
}

export default function Vision() {
  const living = traditions.filter((t) => t.status === "living").length;

  return (
    <main className="w-full">
      <section className="border-b border-ink-faint/40 bg-paper-sunk px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            What this is for
          </p>
          <h1 className="ink-in font-display mt-3 max-w-3xl text-5xl leading-[1.05] text-ink lg:text-6xl">
            Heritage is not only what was built. It is also what is still done.
          </h1>
          <p className="rise mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
            A monument that nobody can find is not preserved, it is only surviving. A craft that
            nobody can find is not preserved either. VIRASAT is one answer to both, because they
            are the same problem: heritage that exists but is not discoverable.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-12">
        <Reveal>
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            Where the visitors go
          </p>
          <h2 className="font-display mt-2 text-4xl leading-tight text-ink">
            Tourism and heritage are the same argument
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <p className="text-base leading-relaxed text-ink-muted">
              Delhi has roughly 1,300 recorded monuments. Almost every visitor sees the same five.
              The concentration is not an accident: those five are the ones with a road, a ticket
              counter, a sign, and a page on the internet. Everything else is invisible in the way
              that matters, which is that you cannot find it, and if you did find it nothing there
              would tell you what it was.
            </p>
            <p className="text-base leading-relaxed text-ink-muted">
              That is why the Walk is not a gimmick. A place with no signage and no guide can still
              speak, if the visitor&apos;s own phone knows where they are standing. Attention is
              what funds preservation. Spread the attention and you spread the reason to keep the
              thing standing. A stepwell that fifty people a week walk to is a stepwell somebody
              has a reason to repair.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-ink-faint/40 bg-paper-raised px-6 py-14 lg:px-12">
        <Reveal>
          <div className="mx-auto w-full max-w-5xl">
            <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
              The whole loop
            </p>
            <h2 className="font-display mt-2 text-4xl leading-tight text-ink">
              Paper goes in one end and a person walking goes out the other
            </h2>
            <ol className="stagger mt-8 grid gap-px bg-ink-faint/40 sm:grid-cols-2 lg:grid-cols-3">
              {LOOP.map((item, i) => (
                <li key={item.step} className="bg-paper-raised p-5">
                  <span className="font-archive text-[10px] tracking-[0.2em] text-madder">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-1 text-2xl text-ink">{item.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.note}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-12">
        <Reveal>
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            The part a photograph cannot hold
          </p>
          <h2 className="font-display mt-2 text-4xl leading-tight text-ink">
            A building is the visible end of a practice
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            Somebody cut the marble screen at the Khas Mahal in the plane of the wall, because a
            screen like that cannot be assembled from pieces. Somebody set coloured stone into
            sockets chiselled out of the piers of the Diwan-i-Khas, and workshops in Agra still do
            it by hand. The building is the surviving end of a chain that runs through people.
          </p>

          <ol className="stagger mt-8 border-t border-ink-faint/40">
            {LAYERS.map((layer, i) => (
              <li
                key={layer.name}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-ink-faint/25 py-3"
                style={{ paddingLeft: `${i * 0.9}rem` }}
              >
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-verdigris" />
                <span className="font-display text-xl text-ink">{layer.name}</span>
                <span className="font-archive text-[11px] text-ink-faint">{layer.note}</span>
              </li>
            ))}
          </ol>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
            Every one of the {points.length} Heritage Points in this build already carries a Living
            Tradition, and {living} of them are still practised today. That is the layer that turns
            a monument list into a record of a culture, and it is the layer that a visitor can
            actually meet, because a craft has somebody doing it.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-ink-faint/40 bg-paper-sunk px-6 py-14 lg:px-12">
        <Reveal>
          <div className="mx-auto w-full max-w-5xl">
            <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
              Honest about the line
            </p>
            <h2 className="font-display mt-2 text-4xl leading-tight text-ink">
              What runs today, and what comes after
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
              The one rule applies to our own roadmap too. Everything marked built is running on
              this site right now and you can go and use it. Everything marked next is honest
              intention and nothing more.
            </p>

            <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-2">
              <ul className="border-b border-ink-faint/25">
                <Built>
                  {results.length} Pages of an actual 1919 survey read into structured Mentions,
                  with the passage checked against the scan before anything is placed.
                </Built>
                <Built>
                  Spatial Clues resolved against {ANCHORS.length} Anchors into pins
                  with an Uncertainty Radius, then checked against a Modern Baseline pulled from
                  OpenStreetMap.
                </Built>
                <Built>
                  A Reviewer queue where a person, never the pipeline, decides. Every move written
                  to a table that cannot be edited.
                </Built>
                <Built>
                  A Walk that speaks on its own when you are close, facing, and have stood still,
                  from real GPS or a simulation, with the transcript following the voice.
                </Built>
                <Built>
                  Living Tradition on every Heritage Point, and Then-and-Now on four of them from
                  Wikimedia Commons with every licence named.
                </Built>
              </ul>

              <ul className="border-b border-ink-faint/25">
                <Next>
                  A heritage graph, so a monument links to the craft, the craft to the community,
                  and the community to the festival and the food. Today those links are written in
                  prose rather than modelled.
                </Next>
                <Next>
                  Trails chosen by cultural domain rather than by monument. Choose food heritage and
                  get a market, a kitchen and a trade route instead of five buildings.
                </Next>
                <Next>
                  Verified artisan profiles, so a visitor near a workshop can be told it is there.
                  Preservation that pays for itself is the only kind that lasts.
                </Next>
                <Next>
                  More volumes and more cities. The pipeline is not Delhi-shaped; the content is.
                </Next>
                <Next>
                  Hindi, then more languages. The data model is already keyed by language and the
                  voices exist. It needs a reader who can check the translation.
                </Next>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-12">
        <Reveal>
          <blockquote className="border-l-2 border-madder pl-6">
            <p className="font-display text-3xl leading-snug text-ink lg:text-4xl">
              We take India&apos;s forgotten heritage out of the archive, put it back on the map,
              and let people stand where it happened.
            </p>
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/discover"
              className="border border-madder px-5 py-2.5 text-sm text-madder transition-colors hover:bg-madder hover:text-paper"
            >
              See it read a page
            </Link>
            <Link
              href="/explore"
              className="border border-ink-faint/50 px-5 py-2.5 text-sm text-ink-muted transition-colors hover:border-madder hover:text-madder"
            >
              See it on the map
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
