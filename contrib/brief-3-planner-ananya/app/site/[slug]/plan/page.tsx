"use client";

import { useEffect, useMemo, useState } from "react";
import RoutePreview from "../../../../components/RoutePreview";
import { RED_FORT_ENTRANCE, RED_FORT_POINTS } from "../../../../content/red-fort";
import { planRoute } from "../../../../lib/planner";
import type { InterestTag, Persona, PlanInput } from "../../../../lib/types";

const PLAN_KEY = "threshold.plan.v1";

const INTERESTS: { value: InterestTag; label: string }[] = [
  { value: "history", label: "History" },
  { value: "architecture", label: "Architecture" },
  { value: "culture_traditions", label: "Culture" },
  { value: "military", label: "Military" },
  { value: "religion", label: "Religion" },
];

const BUDGETS: { value: PlanInput["budgetMin"]; label: string }[] = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 90, label: "90 min" },
  { value: 240, label: "Half day" },
];

const PERSONAS: { value: Persona; label: string; note: string }[] = [
  { value: "history", label: "History lover", note: "What happened here" },
  { value: "architecture", label: "Architecture", note: "How it was built" },
  { value: "kids", label: "For children", note: "Shorter stories" },
];

function isBudget(value: unknown): value is PlanInput["budgetMin"] {
  return value === 30 || value === 45 || value === 90 || value === 240;
}

function isPersona(value: unknown): value is Persona {
  return value === "history" || value === "architecture" || value === "kids";
}

export default function PlanPage() {
  const [interests, setInterests] = useState<InterestTag[]>([]);
  const [budgetMin, setBudgetMin] = useState<PlanInput["budgetMin"]>(45);
  const [persona, setPersona] = useState<Persona>("history");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(PLAN_KEY);
    if (!raw) return;

    try {
      const stored: unknown = JSON.parse(raw);
      if (typeof stored !== "object" || stored === null) return;
      const candidate = stored as { interests?: unknown; budgetMin?: unknown; persona?: unknown };
      if (Array.isArray(candidate.interests) && candidate.interests.every((tag): tag is InterestTag =>
        INTERESTS.some((interest) => interest.value === tag),
      )) {
        setInterests(candidate.interests);
      }
      if (isBudget(candidate.budgetMin)) setBudgetMin(candidate.budgetMin);
      if (isPersona(candidate.persona)) setPersona(candidate.persona);
    } catch {
      window.sessionStorage.removeItem(PLAN_KEY);
    }
  }, []);

  const route = useMemo(
    () => planRoute({
      points: RED_FORT_POINTS,
      interests,
      budgetMin,
      persona,
      startAt: RED_FORT_ENTRANCE,
    }),
    [interests, budgetMin, persona],
  );

  function toggleInterest(tag: InterestTag) {
    setInterests((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  function beginTour() {
    window.sessionStorage.setItem(PLAN_KEY, JSON.stringify({ interests, budgetMin, persona }));
    setSaved(true);
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-stone-50 px-5 py-10 text-stone-900 sm:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-amber-800 uppercase">Threshold · Red Fort</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Plan your walk</h1>
      <p className="mt-3 max-w-2xl text-stone-600">
        Choose what draws you here, how long you have, and how you want each Heritage Point told.
      </p>

      <section className="mt-8 space-y-8 border border-stone-300 bg-white p-5 shadow-sm sm:p-7">
        <fieldset>
          <legend className="text-lg font-semibold">What draws you here?</legend>
          <p className="mt-1 text-sm text-stone-600">Pick any, or none for every Heritage Point.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTERESTS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={interests.includes(value)}
                onClick={() => toggleInterest(value)}
                className={`rounded border px-3 py-2 text-sm font-medium transition ${
                  interests.includes(value)
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-amber-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold">How long do you have?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGETS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={budgetMin === value}
                onClick={() => setBudgetMin(value)}
                className={`rounded border px-3 py-2 text-sm font-medium transition ${
                  budgetMin === value
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-amber-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold">Who is listening?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {PERSONAS.map(({ value, label, note }) => (
              <button
                key={value}
                type="button"
                aria-pressed={persona === value}
                onClick={() => setPersona(value)}
                className={`rounded border p-3 text-left transition ${
                  persona === value
                    ? "border-amber-800 bg-amber-50 text-stone-900"
                    : "border-stone-300 bg-white text-stone-700 hover:border-amber-700"
                }`}
              >
                <span className="block font-medium">{label}</span>
                <span className="mt-1 block text-xs text-stone-600">{note}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-5">
          <p className="text-xs text-stone-500">
            Start: Lahori Gate entrance · [{RED_FORT_ENTRANCE[0]}, {RED_FORT_ENTRANCE[1]}]
          </p>
          <button
            type="button"
            onClick={beginTour}
            className="rounded bg-amber-800 px-5 py-3 font-semibold text-white transition hover:bg-amber-900"
          >
            Begin tour →
          </button>
        </div>
        {saved && <p className="text-sm text-emerald-700">Choices saved for this browser session.</p>}
      </section>

      <RoutePreview route={route} points={RED_FORT_POINTS} persona={persona} startAt={RED_FORT_ENTRANCE} />
    </main>
  );
}
