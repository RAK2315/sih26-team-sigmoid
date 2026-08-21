"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLAN_KEY } from "@/lib/route/plan-choices";
import type { HeritageSite, InterestTag, Persona } from "@/lib/types";

const INTERESTS: { tag: InterestTag; label: string }[] = [
  { tag: "history", label: "History" },
  { tag: "architecture", label: "Architecture" },
  { tag: "culture_traditions", label: "Culture and traditions" },
  { tag: "military", label: "Military" },
  { tag: "religion", label: "Religion" },
];

// the whole of Red Fort fits in about 20 minutes, so anything above 30 chose the same eleven
// Heritage Points and the control looked broken. these are the budgets that actually decide.
const BUDGETS = [
  { minutes: 10, label: "10 minutes" },
  { minutes: 15, label: "15 minutes" },
  { minutes: 30, label: "30 minutes" },
  { minutes: 90, label: "As long as it takes" },
];

const PERSONAS: { persona: Persona; label: string; note: string }[] = [
  { persona: "history", label: "History", note: "What happened here, and when" },
  { persona: "architecture", label: "Architecture", note: "How it was built, and why that way" },
  { persona: "kids", label: "Kids", note: "Shorter, and told as a story" },
];

export default function PlanForm({ site }: { site: HeritageSite }) {
  const router = useRouter();
  const [interests, setInterests] = useState<InterestTag[]>([]);
  const [budgetMinutes, setBudgetMinutes] = useState(30);
  const [persona, setPersona] = useState<Persona>("history");

  function toggle(tag: InterestTag) {
    setInterests(interests.includes(tag) ? interests.filter((t) => t !== tag) : [...interests, tag]);
  }

  function begin() {
    sessionStorage.setItem(PLAN_KEY, JSON.stringify({ interests, budgetMinutes, persona }));
    router.push(`/site/${site.id}/tour`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">Plan your walk</p>
      <h1 className="font-display mt-1 text-5xl leading-none text-ink">{site.name}</h1>
      {site.nameLocal && <p className="font-deva text-xl text-ink-muted">{site.nameLocal}</p>}

      <section className="mt-8">
        <h2 className="font-display text-2xl text-ink">What interests you?</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Pick none and you get everything. This decides which Heritage Points are on your Route,
          not how they are told.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTERESTS.map(({ tag, label }) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`border px-3 py-1.5 text-sm ${
                interests.includes(tag)
                  ? "border-madder bg-madder text-paper"
                  : "border-ink-faint/50 text-ink-muted hover:border-madder hover:text-madder"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-ink">How long do you have?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {BUDGETS.map(({ minutes, label }) => (
            <button
              key={minutes}
              type="button"
              onClick={() => setBudgetMinutes(minutes)}
              className={`border px-3 py-1.5 text-sm ${
                budgetMinutes === minutes
                  ? "border-madder bg-madder text-paper"
                  : "border-ink-faint/50 text-ink-muted hover:border-madder hover:text-madder"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-ink">Who is listening?</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {PERSONAS.map(({ persona: value, label, note }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPersona(value)}
              className={`border p-3 text-left ${
                persona === value
                  ? "border-madder bg-madder text-paper"
                  : "border-ink-faint/50 text-ink-muted hover:border-madder"
              }`}
            >
              <span className="block text-sm">{label}</span>
              <span className="mt-1 block text-xs opacity-80">{note}</span>
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={begin}
        className="mt-10 border border-madder px-6 py-3 text-madder hover:bg-madder hover:text-paper"
      >
        Begin tour
      </button>
      <p className="font-archive mt-3 text-xs text-ink-faint">
        Your choices are kept for this browser session only.
      </p>
    </main>
  );
}
