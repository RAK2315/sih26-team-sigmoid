import type { LivingTradition } from "@/lib/types";

const STATUS: Record<LivingTradition["status"], { word: string; colour: string; note: string }> = {
  living: { word: "still practised", colour: "text-state-verified", note: "someone does this today" },
  dormant: { word: "dormant", colour: "text-state-candidate", note: "the craft survives, this use of it does not" },
  lost: { word: "lost", colour: "text-state-rejected", note: "nobody does this any more" },
};

// three threads for a practice that carries on, cut short as it stops being done
function Thread({ status }: { status: LivingTradition["status"] }) {
  const drawn = status === "living" ? 3 : status === "dormant" ? 2 : 1;
  return (
    <svg viewBox="0 0 40 24" className="h-6 w-10" fill="none" stroke="currentColor" strokeWidth={1}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M2 ${6 + i * 6}q5 -4 10 0t10 0t10 0t6 0`}
          strokeDasharray={i < drawn ? undefined : "2 3"}
          opacity={i < drawn ? 1 : 0.45}
        />
      ))}
    </svg>
  );
}

export default function LivingTraditionCard({ tradition }: { tradition: LivingTradition }) {
  const status = STATUS[tradition.status];

  return (
    <section className="border-l-2 border-verdigris bg-verdigris/[0.05] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-archive text-xs tracking-[0.2em] text-verdigris uppercase">
          Living tradition
        </p>
        <span className="text-verdigris/70">
          <Thread status={tradition.status} />
        </span>
      </div>

      <h2 className="font-display mt-1 text-2xl leading-tight text-ink">{tradition.name}</h2>

      <p className={`font-archive mt-1 text-[11px] tracking-widest uppercase ${status.colour}`}>
        {status.word}
        <span className="ml-2 tracking-normal text-ink-faint normal-case">{status.note}</span>
      </p>

      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{tradition.text}</p>

      <p className="font-archive mt-3 border-t border-verdigris/20 pt-2 text-[11px] leading-relaxed text-ink-faint">
        Heritage that is done rather than built. It is the part of a place that a photograph
        cannot hold.
      </p>
    </section>
  );
}
