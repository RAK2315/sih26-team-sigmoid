import Link from "next/link";
import { points } from "@/content/points";
import { sites } from "@/content/sites";
import type { HeritagePoint, TraditionStatus } from "@/lib/types";
import Reveal from "../reveal";
import { JaliBand, RuleWithLozenge } from "../motifs";

export const metadata = {
  title: "Living Traditions - VIRASAT",
  description: "The practices these places hold, and whether they are still done.",
};

const held = points.filter((p) => p.livingTradition !== null);

const GROUPS: { status: TraditionStatus; title: string; blurb: string; colour: string }[] = [
  {
    status: "living",
    title: "Still done",
    colour: "text-verdigris",
    blurb:
      "These are not history. Somebody did them this week, here or somewhere close, and the building is the reason they are still worth doing.",
  },
  {
    status: "dormant",
    title: "Dormant",
    colour: "text-state-candidate",
    blurb:
      "The practice survives but not here. The skill exists, the occasion does not, and the room it was made for stands empty.",
  },
  {
    status: "lost",
    title: "Lost",
    colour: "text-state-rejected",
    blurb:
      "Nobody does this any more. The room is the last evidence that it ever happened, which is exactly why the room matters.",
  },
];

function siteOf(point: HeritagePoint) {
  return sites.find((s) => s.id === point.siteId);
}

export default function Traditions() {
  return (
    <main className="w-full">
      <header className="border-b border-ink-faint/40 bg-paper-sunk px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
            Heritage that is done, not built
          </p>
          <h1 className="ink-in font-display mt-3 max-w-4xl text-5xl leading-[0.95] text-ink lg:text-7xl">
            The building is the part that stayed still
          </h1>
          <RuleWithLozenge className="rule-draw mt-6 h-3 w-full max-w-md text-madder/60" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink">
            A monument list records walls. It does not record the drums that kept the hours from
            the gallery over the gate, or the stone still cut by hand in the same technique, or the
            bazaar that has been trading under the same vault for three hundred years.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            {held.length} Living Traditions, each tied to the Heritage Point that holds it, each
            marked with what is honestly true of it now. We do not claim a practice is alive
            because it would be nicer if it were.
          </p>

          <ul className="stagger mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {GROUPS.map((group) => (
              <li key={group.status} className="flex items-baseline gap-2">
                <span className={`font-display text-3xl leading-none ${group.colour}`}>
                  {held.filter((p) => p.livingTradition!.status === group.status).length}
                </span>
                <span className="font-archive text-[11px] tracking-[0.2em] text-ink-muted uppercase">
                  {group.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {GROUPS.map((group, groupIndex) => {
        const inGroup = held.filter((p) => p.livingTradition!.status === group.status);
        if (inGroup.length === 0) return null;

        return (
          <section
            key={group.status}
            className={groupIndex % 2 === 1 ? "border-y border-ink-faint/40 bg-paper-raised" : ""}
          >
            <div className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-12 lg:py-20">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <h2 className={`font-display text-4xl leading-none lg:text-5xl ${group.colour}`}>
                    {group.title}
                  </h2>
                  <span className="font-archive text-[11px] tracking-[0.2em] text-ink-faint uppercase">
                    {inGroup.length} of {held.length}
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                  {group.blurb}
                </p>
              </Reveal>

              <div className="mt-10 space-y-12">
                {inGroup.map((point, i) => {
                  const tradition = point.livingTradition!;
                  const site = siteOf(point);
                  return (
                    <Reveal
                      key={point.id}
                      className={`grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10 ${
                        i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                      }`}
                    >
                      {tradition.image ? (
                        <figure className="border border-ink-faint/40 bg-paper">
                          <img
                            src={tradition.image.url}
                            alt={tradition.image.alt}
                            loading="lazy"
                            decoding="async"
                            className="block aspect-[4/3] w-full object-cover"
                          />
                          <figcaption className="font-archive border-t border-ink-faint/25 px-3 py-2 text-[10px] leading-relaxed text-ink-faint">
                            {tradition.image.author}, {tradition.image.year} &middot;{" "}
                            {tradition.image.licence} &middot;{" "}
                            <a
                              href={tradition.image.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline hover:text-madder"
                            >
                              Wikimedia Commons
                            </a>
                          </figcaption>
                        </figure>
                      ) : (
                        <div className="border border-dashed border-ink-faint/40 p-6">
                          <p className="font-archive text-[11px] leading-relaxed text-ink-faint">
                            No photograph of this practice is on Commons under a licence we can
                            use, so none is shown rather than one that shows something else.
                          </p>
                        </div>
                      )}

                      <div>
                        <span
                          className={`font-archive text-[10px] tracking-[0.25em] uppercase ${group.colour}`}
                        >
                          {tradition.status}
                        </span>
                        <h3 className="font-display mt-2 text-3xl leading-tight text-ink lg:text-4xl">
                          {tradition.name}
                        </h3>
                        <p className="font-archive mt-2 text-[11px] tracking-wide text-ink-faint">
                          Held by {point.name}
                          {point.nameLocal ? ` (${point.nameLocal})` : ""}
                          {site ? `, ${site.name}` : ""}
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-ink-muted">
                          {tradition.text}
                        </p>
                        {site && site.pointIds.length > 0 && (
                          <Link
                            href={`/site/${site.id}/tour`}
                            className="font-archive mt-5 inline-block border border-ink-faint/50 px-4 py-2 text-[11px] tracking-widest text-ink uppercase transition-colors duration-200 hover:border-madder hover:text-madder"
                          >
                            Walk to it &rarr;
                          </Link>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <JaliBand className="h-10 w-full text-ink-faint/35" />

      <section className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-12">
        <p className="font-archive text-xs leading-relaxed text-ink-faint">
          Status is an editorial judgement, not a measurement, and it is labelled as one. The
          practices are described from the same Fact Sheets the Narrations are built on. Every
          photograph is credited above and on{" "}
          <Link href="/attributions" className="text-indigo underline hover:text-madder">
            Attributions
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
