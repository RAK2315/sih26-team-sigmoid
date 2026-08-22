import type { CandidateStatus, StoredCandidate } from "@/lib/types";

const TERMINALS: { status: CandidateStatus; label: string; colour: string }[] = [
  { status: "verified", label: "Verified", colour: "text-state-verified" },
  { status: "matched_existing", label: "Already on today's map", colour: "text-state-matched" },
  { status: "rejected", label: "Rejected", colour: "text-state-rejected" },
];

function Box({
  label,
  count,
  colour,
  emphasis,
}: {
  label: string;
  count: number | null;
  colour: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`min-w-[9rem] border bg-paper-raised px-3 py-2 ${
        emphasis ? "border-madder" : "border-ink-faint/50"
      }`}
    >
      <span className={`font-archive block text-[11px] tracking-widest uppercase ${colour}`}>
        {label}
      </span>
      {count !== null && (
        <span className="font-display text-2xl leading-none text-ink">{count}</span>
      )}
    </div>
  );
}

export default function AuthorityHeader({ candidates }: { candidates: StoredCandidate[] }) {
  const count = (status: CandidateStatus) => candidates.filter((c) => c.status === status).length;

  return (
    <header className="border-b border-ink-faint/40 bg-paper-sunk px-6 py-8 lg:px-12">
      <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
        The reviewer&apos;s desk
      </p>
      <h1 className="font-display mt-2 text-4xl leading-tight text-ink lg:text-5xl">
        Nothing automated gets past <span className="text-madder italic">Candidate</span>
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
        The pipeline can go as far as proposing a Candidate with a radius and a source. It can
        never say a monument exists. Only a person here moves one further, and every move is
        written to a record that cannot be edited.
      </p>

      <div className="mt-6 overflow-x-auto">
        <div className="flex min-w-max items-center gap-3">
          <Box label="Candidate" count={count("candidate")} colour="text-state-candidate" />

          {/* the whole point of the page is that a person stands on this arrow */}
          <div className="flex flex-col items-center px-1 text-ink-faint">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-madder" fill="none" stroke="currentColor" strokeWidth={1.2}>
              <circle cx="12" cy="4" r="2.4" />
              <path d="M12 7v8 M12 15l-3 6 M12 15l3 6 M6 10h12" />
            </svg>
            <span className="font-archive mt-1 text-[10px] tracking-widest text-madder uppercase">
              a person
            </span>
          </div>

          <Box label="Under review" count={count("under_review")} colour="text-state-review" emphasis />

          <span aria-hidden className="h-px w-8 bg-ink-faint/50" />

          <div className="flex flex-col gap-2">
            {TERMINALS.map((t) => (
              <Box key={t.status} label={t.label} count={count(t.status)} colour={t.colour} />
            ))}
          </div>
        </div>
      </div>

      <p className="font-archive mt-4 text-[11px] text-ink-faint">
        Automation stops at the first box. Everything to the right of it is a person&apos;s
        judgement.
      </p>
    </header>
  );
}
