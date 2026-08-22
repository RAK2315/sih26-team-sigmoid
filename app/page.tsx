import Link from "next/link";
import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import { narrationTexts } from "@/content/narrations";
import { points } from "@/content/points";
import { sites } from "@/content/sites";

// counted here rather than typed in, so the opening slide cannot drift from the build
const results = Object.values(DISCOVERY_CACHE);
const candidates = results.flatMap((r) => r.candidates);
const verdict = (kind: string) =>
  candidates.filter((c) => c.evidence.baselineVerdict === kind).length;

const FIGURES = [
  { kicker: "Read", value: results.length, label: "Pages of a 1919 survey" },
  { kicker: "Extracted", value: results.reduce((n, r) => n + r.mentions.length, 0), label: "Mentions" },
  { kicker: "Placed", value: candidates.length, label: "Candidates with a radius" },
  { kicker: "Matched", value: verdict("matched_existing"), label: "already on today's map" },
];

const GAPS = verdict("representation_gap");

const DOORS = [
  {
    href: "/explore",
    kicker: "For the visitor",
    title: "Explore",
    body: `${sites.length} Heritage Sites across Delhi and ${points.length} Heritage Points to walk between. ${narrationTexts.length} Narrations that begin on their own when you arrive and turn to face the building.`,
  },
  {
    href: "/discover",
    kicker: "For the researcher",
    title: "Discover",
    body: `Open any of ${results.length} real scanned Pages, watch a passage of 1919 English become a pin with an honest circle around it, and check every step of the working.`,
  },
  {
    href: "/authority",
    kicker: "For the reviewer",
    title: "Authority",
    body: "A Candidate is as far as anything automated is allowed to go. Only a person moves one further, and every move is written down where it cannot be edited.",
  },
];

const PIPELINE = ["Archive Page", "Mention", "Candidate", "Reviewer", "Visitor"];

export default function Home() {
  return (
    <main className="w-full">
      <section className="relative overflow-hidden border-b border-ink-faint/40">
        {/* Murray photographed this gate in 1858 and it is already credited on /attributions */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-cover bg-center opacity-[0.14] lg:block"
          style={{
            backgroundImage: "url(/images/then-now/red-fort-lahori-gate.then.jpg)",
            maskImage: "linear-gradient(to right, transparent, black 55%)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 55%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            Team Sigmoid &middot; SIH 2026
          </p>
          <h1 className="ink-in font-display mt-5 text-7xl leading-[0.9] text-ink lg:text-8xl">
            VIRASAT
          </h1>
          <p className="rise font-deva mt-1 text-3xl leading-tight text-ink-muted lg:text-4xl" style={{ animationDelay: ".18s" }}>
            विरासत
          </p>
          <p className="rise font-display mt-4 text-2xl text-madder italic lg:text-3xl" style={{ animationDelay: ".30s" }}>
            Stand where it happened.
          </p>
          <p className="rise font-archive mt-4 max-w-lg text-xs leading-relaxed text-ink-faint" style={{ animationDelay: ".42s" }}>
            Virasat is what is handed down. Not only what was built, but what is still done.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-archive border-t border-ink-faint/40 pt-3 text-xs tracking-[0.2em] text-ink-faint uppercase">
              What went missing
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Between 1916 and 1922 the Archaeological Survey of India catalogued roughly 1,300
              monuments in Delhi. About 174 are centrally protected today. The rest did not all
              disappear. They stopped being findable.
            </p>
          </div>
          <div>
            <p className="font-archive border-t border-ink-faint/40 pt-3 text-xs tracking-[0.2em] text-ink-faint uppercase">
              What we do about it
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              VIRASAT reads what the archive already recorded, projects it back onto
              today&apos;s map with a radius that says how sure we are, has a person confirm each
              one, and then lets the place tell its own story to whoever is standing in front of
              it.
            </p>
          </div>
        </div>

        <blockquote className="mt-14 border-l-2 border-madder pl-6">
          <p className="font-display text-3xl leading-snug text-ink lg:text-4xl">
            One rule governs everything here: show the evidence, or don&apos;t show it at all.
          </p>
        </blockquote>
      </section>

      <section className="border-y border-ink-faint/40 bg-paper-raised">
        <dl className="stagger mx-auto grid w-full max-w-6xl grid-cols-2 lg:grid-cols-5">
          {FIGURES.map((figure) => (
            <div
              key={figure.label}
              className="border-b border-ink-faint/25 px-6 py-6 lg:border-r lg:border-b-0 lg:px-8"
            >
              <p className="font-archive text-[11px] tracking-[0.2em] text-ink-faint uppercase">
                {figure.kicker}
              </p>
              <dt className="font-display mt-1 text-5xl leading-none text-ink">{figure.value}</dt>
              <dd className="mt-2 text-xs leading-tight text-ink-muted">{figure.label}</dd>
            </div>
          ))}
          <div className="col-span-2 bg-madder/[0.06] px-6 py-6 lg:col-span-1 lg:px-8">
            <p className="font-archive text-[11px] tracking-[0.2em] text-madder uppercase">
              The finding
            </p>
            <dt className="font-display mt-1 text-5xl leading-none text-madder">{GAPS}</dt>
            <dd className="mt-2 text-xs leading-tight text-ink-muted">
              Representation Gaps
              <br />
              <span className="text-ink-faint">recorded once, unmapped now</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-12">
        <div className="stagger grid gap-4 md:grid-cols-3">
          {DOORS.map((door, i) => (
            <Link
              key={door.href}
              href={door.href}
              className="group block border border-ink-faint/40 bg-paper-raised p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-madder hover:bg-paper-sunk/40"
            >
              <p className="font-archive text-[11px] tracking-[0.2em] text-ink-faint uppercase">
                {String(i + 1).padStart(2, "0")} &middot; {door.kicker}
              </p>
              <h2 className="font-display mt-2 text-4xl text-ink group-hover:text-madder">
                {door.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{door.body}</p>
              <span className="font-archive mt-5 inline-block text-[11px] tracking-widest text-madder uppercase">
                Open &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-faint/40 bg-paper-raised">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-12">
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            How one place travels through the system
          </p>
          <ol className="stagger mt-5 flex flex-wrap items-center gap-x-3 gap-y-4">
            {PIPELINE.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 ${i === 2 ? "bg-madder" : "bg-ink"}`}
                  />
                  <span
                    className={`font-archive text-[11px] tracking-widest uppercase ${
                      i === 2 ? "text-madder" : "text-ink"
                    }`}
                  >
                    {step}
                  </span>
                </span>
                {i < PIPELINE.length - 1 && (
                  <span aria-hidden className="h-px w-10 bg-ink-faint/50 sm:w-16" />
                )}
              </li>
            ))}
          </ol>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted">
            Three screens, one line. A Candidate is the furthest any automated step may go.{" "}
            <Link href="/vision" className="text-indigo underline hover:text-madder">
              Why this matters
            </Link>
            .
          </p>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-12">
        <p className="font-archive text-xs leading-relaxed text-ink-faint">
          Nothing on screen was invented by a model. Archival scans from archive.org, map data
          from OpenStreetMap, photographs from Wikimedia Commons.{" "}
          <Link href="/attributions" className="text-indigo underline hover:text-madder">
            Every source is listed
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
