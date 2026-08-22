import Link from "next/link";
import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import { IMAGES } from "@/content/images";
import { narrationTexts } from "@/content/narrations";
import { points } from "@/content/points";
import { sites } from "@/content/sites";
import ThenNowCard from "./site/[slug]/tour/then-now";
import ArchWindow from "./arch-window";
import Counted from "./counted";
import { ChhatriRow, JaliBand, RuleWithLozenge } from "./motifs";
import NameMarquee from "./name-marquee";
import SetType from "./set-type";
import Parallax from "./parallax";
import ProtectedGrid from "./protected-grid";
import Reveal from "./reveal";

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

const traditions = points.filter((p) => p.livingTradition !== null);
const lahoriGate = points.find((p) => p.id === "red-fort/lahori-gate");

const STATUS_COLOUR: Record<string, string> = {
  living: "text-verdigris",
  dormant: "text-state-candidate",
  lost: "text-state-rejected",
};

const DOORS = [
  {
    href: "/explore",
    kicker: "For the visitor",
    title: "Explore",
    image: IMAGES["sites/qutub-complex"],
    body: `${sites.length} Heritage Sites across Delhi and ${points.length} Heritage Points to walk between. ${narrationTexts.length} Narrations that begin on their own when you arrive and turn to face the building.`,
  },
  {
    href: "/traditions",
    kicker: "For the curious",
    title: "Traditions",
    image: IMAGES["traditions/naubat"],
    body: `${traditions.length} Living Traditions the archive recorded and the buildings still hold. Some are still done every day, some are dormant, and some are gone. Each one says which.`,
  },
  {
    href: "/discover",
    kicker: "For the researcher",
    title: "Discover",
    image: IMAGES["plates/chandni-chowk-1858"],
    body: `Open any of ${results.length} real scanned Pages, watch a passage of 1919 English become a pin with an honest circle around it, and check every step of the working.`,
  },
];

const PIPELINE = ["Archive Page", "Mention", "Candidate", "Reviewer", "Visitor"];

const HERO_PLATES = [
  IMAGES["plates/musamman-burj"],
  IMAGES["plates/chandni-chowk-1858"],
  IMAGES["plates/east-face"],
  IMAGES["plates/jahangir-darbar"],
];

// real names off the 1919 pages, deduplicated, for the band that drifts past
const RECORDED_NAMES = [
  ...new Set(
    results
      .flatMap((r) => r.mentions.map((m) => m.name.replace(/\.$/, "").trim()))
      .filter((name) => name.length > 2 && name.toLowerCase() !== "unknown"),
  ),
];

export default function Home() {
  return (
    <main className="w-full">
      <section className="relative overflow-hidden border-b border-ink-faint/40">
        <Parallax speed={0.14} className="pointer-events-none absolute inset-x-0 -top-24 bottom-0">
          <div
            aria-hidden
            className="h-[130%] w-full bg-cover bg-center opacity-[0.10]"
            style={{
              backgroundImage: `url(${IMAGES["plates/palace-from-metcalfe-house"].url})`,
              maskImage: "linear-gradient(to bottom, black 10%, transparent 88%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 88%)",
            }}
          />
        </Parallax>

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pt-16 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-12 lg:pt-20 lg:pb-16">
          <div>
            <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
              Team Sigmoid &middot; SIH 2026 &middot; Heritage and Culture
            </p>
            <h1 className="font-display mt-5 text-7xl leading-[0.85] text-ink lg:text-[7.5rem]">
              <SetType text="VIRASAT" />
            </h1>
            <p
              className="rise font-deva mt-2 text-3xl leading-tight text-ink-muted lg:text-4xl"
              style={{ animationDelay: ".3s" }}
            >
              विरासत
            </p>
            <RuleWithLozenge className="rule-draw mt-6 h-3 w-full max-w-sm text-madder/60" />
            <p
              className="rise font-display mt-5 text-2xl text-madder italic lg:text-3xl"
              style={{ animationDelay: ".46s" }}
            >
              Stand where it happened.
            </p>
            <p
              className="rise mt-5 max-w-lg text-base leading-relaxed text-ink-muted"
              style={{ animationDelay: ".58s" }}
            >
              Virasat is what is handed down. Not only what was built, but what is still done.
              This reads a century-old survey of Delhi, puts what it recorded back on
              today&apos;s map, and lets each place speak to whoever is standing in front of it.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: ".7s" }}>
              <Link
                href="/explore"
                className="border border-madder bg-madder px-6 py-3 text-sm text-paper transition-all duration-200 hover:-translate-y-0.5 hover:bg-transparent hover:text-madder"
              >
                Walk a site
              </Link>
              <Link
                href="/traditions"
                className="border border-ink-faint/50 px-6 py-3 text-sm text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-madder hover:text-madder"
              >
                See what is still done
              </Link>
            </div>
          </div>

          <div className="relative order-first lg:order-none">
            <ArchWindow
              plates={HERO_PLATES}
              className="mx-auto h-[46vh] w-auto max-w-full lg:h-[68vh]"
            />
            <p className="font-archive mt-2 text-center text-[10px] leading-relaxed text-ink-faint">
              Four plates of Delhi, 1620 to 1858, all public domain and all credited on
              Attributions
            </p>
          </div>
        </div>

        <div className="relative border-t border-ink-faint/25 bg-paper-raised/60">
          <p className="font-archive px-6 pt-5 text-center text-[10px] tracking-[0.2em] text-ink-faint uppercase lg:px-12">
            Named on the forty pages we read
          </p>
          <NameMarquee names={RECORDED_NAMES} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-12 lg:py-24">
        <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
              What went missing
            </p>
            <h2 className="font-display mt-3 text-4xl leading-tight text-ink lg:text-5xl">
              One thousand three hundred recorded.
              <br />
              <span className="text-madder">One hundred and seventy four protected.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Between 1916 and 1922 the Archaeological Survey of India catalogued roughly 1,300
              monuments in Delhi. About 174 are centrally protected today. The rest did not all
              disappear. They stopped being findable, which for a monument is most of the way to
              the same thing.
            </p>
            <p className="font-archive mt-4 text-[11px] leading-relaxed text-ink-faint">
              Every filled square is protected. Every hollow one was written down once and left to
              the street it stands on.
            </p>
          </div>
          <div>
            <ProtectedGrid />
          </div>
        </Reveal>
      </section>

      <section className="border-y border-ink-faint/40 bg-paper-raised">
        <Reveal className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-12">
          <blockquote className="border-l-2 border-madder pl-6">
            <p className="font-display text-3xl leading-snug text-ink lg:text-5xl">
              One rule governs everything here: show the evidence, or don&apos;t show it at all.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
              Nothing on this site makes a claim without a route to where the claim came from. A
              projected position carries the circle it might be wrong by. A narrated fact carries
              the page it was read off. A monument stays a Candidate until a person says otherwise.
            </p>
          </blockquote>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-12 lg:py-24">
        <Reveal>
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            Heritage that is done, not only built
          </p>
          <h2 className="font-display mt-3 max-w-3xl text-4xl leading-tight text-ink lg:text-5xl">
            A building is the part that stayed still. The rest is what people kept doing in it.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            {traditions.length} Living Traditions sit against the Heritage Points that hold them.
            The drums that kept the hours are dormant. The stone inlay is still cut by hand. The
            zenana is gone. Each card says which of the three it is, and why we think so.
          </p>
        </Reveal>

        <Reveal className="stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {traditions.slice(0, 6).map((point) => {
            const tradition = point.livingTradition!;
            return (
              <article
                key={point.id}
                className="group flex flex-col border border-ink-faint/40 bg-paper-raised"
              >
                {tradition.image && (
                  <div className="aspect-[4/3] overflow-hidden bg-paper-sunk">
                    <img
                      src={tradition.image.url}
                      alt={tradition.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <span
                    className={`font-archive text-[10px] tracking-[0.2em] uppercase ${STATUS_COLOUR[tradition.status]}`}
                  >
                    {tradition.status}
                  </span>
                  <h3 className="font-display mt-1 text-2xl leading-tight text-ink">
                    {tradition.name}
                  </h3>
                  <p className="font-archive mt-1 text-[11px] text-ink-faint">{point.name}</p>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-muted">
                    {tradition.text}
                  </p>
                </div>
              </article>
            );
          })}
        </Reveal>

        <Reveal className="mt-8">
          <Link
            href="/traditions"
            className="font-archive border border-ink-faint/50 px-5 py-2.5 text-[11px] tracking-widest text-ink uppercase transition-colors duration-200 hover:border-madder hover:text-madder"
          >
            All {traditions.length} Living Traditions
          </Link>
        </Reveal>
      </section>

      <JaliBand className="h-10 w-full text-ink-faint/35" />

      {lahoriGate?.thenNow && (
        <section className="border-y border-ink-faint/40 bg-paper-raised">
          <Reveal className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:px-12">
            <div>
              <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
                The same ground, a century apart
              </p>
              <h2 className="font-display mt-3 text-4xl leading-tight text-ink lg:text-5xl">
                Drag the line.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                {lahoriGate.thenNow.note}
              </p>
              <p className="font-archive mt-4 text-[11px] leading-relaxed text-ink-faint">
                Both photographs are on Wikimedia Commons and both are credited on the
                Attributions page. No image of a real monument in this project was generated.
              </p>
            </div>
            <ThenNowCard thenNow={lahoriGate.thenNow} name={lahoriGate.name} />
          </Reveal>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-12 lg:py-24">
        <Reveal>
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            What forty pages produced
          </p>
          <h2 className="font-display mt-3 text-4xl leading-tight text-ink lg:text-5xl">
            The finding, in five numbers
          </h2>
        </Reveal>

        <Reveal>
          <dl className="stagger mt-10 grid grid-cols-2 border-t border-ink-faint/40 lg:grid-cols-5">
            {FIGURES.map((figure) => (
              <div
                key={figure.label}
                className="border-b border-ink-faint/25 px-2 py-6 lg:border-r lg:border-b-0 lg:px-6"
              >
                <p className="font-archive text-[11px] tracking-[0.2em] text-ink-faint uppercase">
                  {figure.kicker}
                </p>
                <dt className="font-display mt-1 text-5xl leading-none text-ink lg:text-6xl">
                  <Counted value={figure.value} />
                </dt>
                <dd className="mt-2 text-xs leading-tight text-ink-muted">{figure.label}</dd>
              </div>
            ))}
            <div className="col-span-2 border-b border-ink-faint/25 bg-madder/[0.07] px-2 py-6 lg:col-span-1 lg:border-b-0 lg:px-6">
              <p className="font-archive text-[11px] tracking-[0.2em] text-madder uppercase">
                The finding
              </p>
              <dt className="font-display mt-1 text-5xl leading-none text-madder lg:text-6xl">
                <Counted value={GAPS} />
              </dt>
              <dd className="mt-2 text-xs leading-tight text-ink-muted">
                Representation Gaps
                <br />
                <span className="text-ink-faint">recorded once, unmapped now</span>
              </dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <section className="relative overflow-hidden border-y border-ink-faint/40 bg-paper-sunk">
        <ChhatriRow className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-ink-faint/30" />
        <Reveal className="relative mx-auto w-full max-w-6xl px-6 py-16 lg:px-12">
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            How one place travels through the system
          </p>
          <ol className="stagger mt-6 flex flex-wrap items-center gap-x-3 gap-y-4">
            {PIPELINE.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span aria-hidden className={`h-1.5 w-1.5 ${i === 2 ? "bg-madder" : "bg-ink"}`} />
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
          <p className="mt-5 max-w-3xl pb-16 text-sm leading-relaxed text-ink-muted">
            Three screens, one line. A Candidate is the furthest any automated step may go.{" "}
            <Link href="/vision" className="text-indigo underline hover:text-madder">
              Why this matters
            </Link>
            .
          </p>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-12 lg:py-24">
        <Reveal className="stagger grid gap-5 md:grid-cols-3">
          {DOORS.map((door, i) => (
            <Link
              key={door.href}
              href={door.href}
              className="group flex flex-col border border-ink-faint/40 bg-paper-raised transition-colors duration-300 hover:border-madder"
            >
              <div className="aspect-[3/2] overflow-hidden bg-paper-sunk">
                <img
                  src={door.image.url}
                  alt={door.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-archive text-[11px] tracking-[0.2em] text-ink-faint uppercase">
                  {String(i + 1).padStart(2, "0")} &middot; {door.kicker}
                </p>
                <h2 className="font-display mt-2 text-4xl text-ink group-hover:text-madder">
                  {door.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{door.body}</p>
                <span className="font-archive mt-5 inline-block text-[11px] tracking-widest text-madder uppercase">
                  Open &rarr;
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </section>

      <footer className="border-t border-ink-faint/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-12">
          <p className="font-archive text-xs leading-relaxed text-ink-faint">
            Nothing on screen was invented by a model. Archival scans from archive.org, map data
            from OpenStreetMap, photographs and plates from Wikimedia Commons.{" "}
            <Link href="/attributions" className="text-indigo underline hover:text-madder">
              Every source is listed
            </Link>
            . Reviewers work the Candidate queue on{" "}
            <Link href="/authority" className="text-indigo underline hover:text-madder">
              Authority
            </Link>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
