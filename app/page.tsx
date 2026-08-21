import Link from "next/link";
import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import { narrationTexts } from "@/content/narrations";
import { points } from "@/content/points";
import { sites } from "@/content/sites";

// counted here rather than typed in, so the opening slide cannot drift from the build
const results = Object.values(DISCOVERY_CACHE);
const pageCount = results.length;
const mentionCount = results.reduce((n, r) => n + r.mentions.length, 0);
const candidateCount = results.reduce((n, r) => n + r.candidates.length, 0);
const gapCount = results.reduce(
  (n, r) => n + r.candidates.filter((c) => c.evidence.baselineVerdict === "representation_gap").length,
  0,
);
const matchedCount = results.reduce(
  (n, r) => n + r.candidates.filter((c) => c.evidence.baselineVerdict === "matched_existing").length,
  0,
);

const figures = [
  { value: pageCount, label: "Pages of a 1919 survey read" },
  { value: mentionCount, label: "Mentions pulled out of them" },
  { value: candidateCount, label: "placed as Candidates with a radius" },
  { value: matchedCount, label: "already on today's map" },
  { value: gapCount, label: "Representation Gaps" },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
        Team Sigmoid &middot; SIH 2026
      </p>

      <h1 className="font-display mt-4 text-7xl leading-none text-ink">THRESHOLD</h1>
      <p className="font-display mt-2 text-2xl text-madder italic">
        Cross it, and the place speaks.
      </p>

      <hr className="my-8 border-0 border-t border-ink-faint/40" />

      <div className="grid gap-8 md:grid-cols-2">
        <p className="text-base leading-relaxed text-ink-muted">
          Between 1916 and 1922 the Archaeological Survey of India catalogued roughly 1,300
          monuments in Delhi. About 174 are centrally protected today. The rest did not all
          disappear. They stopped being findable.
        </p>
        <p className="text-base leading-relaxed text-ink-muted">
          THRESHOLD reads what the archive already recorded, projects it back onto today&apos;s map
          with a radius that says how sure we are, and lets a place tell its own story to whoever is
          standing in front of it.
        </p>
      </div>

      <p className="font-display mt-8 border-l-2 border-madder pl-4 text-xl leading-snug text-ink">
        One rule governs everything here: show the evidence, or don&apos;t show it at all.
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-ink-faint/40 py-6 sm:grid-cols-5">
        {figures.map((figure) => (
          <div key={figure.label}>
            <dt className="font-display text-4xl leading-none text-ink">{figure.value}</dt>
            <dd className="font-archive mt-1 text-[11px] leading-tight text-ink-faint">
              {figure.label}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href="/explore"
          className="group block border border-ink-faint/40 bg-paper-raised p-5 hover:border-madder"
        >
          <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
            For the visitor
          </p>
          <h2 className="font-display mt-1 text-3xl text-ink group-hover:text-madder">Explore</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {sites.length} Heritage Sites across Delhi, {points.length} Heritage Points to walk
            between, {narrationTexts.length} Narrations that start on their own when you arrive and
            face them.
          </p>
        </Link>

        <Link
          href="/discover"
          className="group block border border-ink-faint/40 bg-paper-raised p-5 hover:border-madder"
        >
          <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
            For the researcher
          </p>
          <h2 className="font-display mt-1 text-3xl text-ink group-hover:text-madder">Discover</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Open any of {pageCount} real scanned Pages, watch a passage of 1919 English become a pin
            with an honest circle around it, and check every step of the working.
          </p>
        </Link>

        <Link
          href="/authority"
          className="group block border border-ink-faint/40 bg-paper-raised p-5 hover:border-madder"
        >
          <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
            For the reviewer
          </p>
          <h2 className="font-display mt-1 text-3xl text-ink group-hover:text-madder">Authority</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            A Candidate is as far as anything automated is allowed to go. Only a person moves one
            further, and every move is written down.
          </p>
        </Link>
      </div>

      <p className="font-archive mt-8 text-xs leading-relaxed text-ink-faint">
        Nothing on screen was invented by a model. Archival scans from archive.org, map data from
        OpenStreetMap, photographs from Wikimedia Commons.{" "}
        <Link href="/attributions" className="text-indigo underline hover:text-madder">
          Every source is listed
        </Link>
        .
      </p>
    </main>
  );
}
