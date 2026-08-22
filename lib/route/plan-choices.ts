import type { InterestTag, Persona } from "@/lib/types";

export const PLAN_KEY = "virasat.plan.v1";

export const PERSONAS: { persona: Persona; label: string; note: string }[] = [
  { persona: "history", label: "History", note: "What happened here, and when" },
  { persona: "architecture", label: "Architecture", note: "How it was built, and why that way" },
  { persona: "kids", label: "Kids", note: "Shorter, and told as a story" },
];

export interface PlanChoices {
  interests: InterestTag[];
  budgetMinutes: number;
  persona: Persona;
}
