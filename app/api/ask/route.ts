import { NextResponse } from "next/server";
import { z } from "zod";
import { factSheetForPoint } from "@/content/factsheets";
import { generateJson } from "@/lib/ai/model";
import type { FactSheetLine } from "@/lib/types";

export const runtime = "nodejs";

const Body = z.object({
  pointId: z.string().min(1),
  question: z.string().trim().min(3).max(300),
});

const Answer = z.object({
  answer: z.string(),
  citedLineIds: z.array(z.string()),
});

const SYSTEM = `You answer a visitor's question about one heritage structure, using only the Fact Sheet given to you.

The Fact Sheet is the whole of what may be said. You have no other knowledge of this place, and any date, measurement, name or story that is not in it does not exist for the purpose of this answer.

Rules:
- Every claim in the answer must come from one of the numbered facts, and you must list the id of each fact you used.
- If the facts do not answer the question, say so plainly in the answer and return an empty citedLineIds array. That is a correct outcome, not a failure.
- Never cite an id that is not in the list you were given.
- Two or three sentences at most. Plain words. No em dashes.`;

// models reach for typographic dashes and this project uses none of them anywhere
function plainDashes(text: string): string {
  return text.replace(/[‐‑‒]/g, "-").replace(/\s*[–—]\s*/g, " - ");
}

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const { pointId, question } = parsed.data;
  const sheet = factSheetForPoint(pointId);
  if (!sheet) return NextResponse.json({ error: "no_fact_sheet" }, { status: 404 });

  const facts = sheet.lines.map((line) => `${line.id}: ${line.text}`).join("\n");
  const result = await generateJson(
    {
      system: SYSTEM,
      user: `Question: ${question}\n\nFact Sheet:\n${facts}`,
      jsonSchema: z.toJSONSchema(Answer, { io: "output" }) as Record<string, unknown>,
      schemaName: "grounded_answer",
    },
    Answer,
  );

  if (!result.ok) {
    return NextResponse.json({
      grounded: false,
      answer: "No model answered, so there is nothing to show. Nothing is guessed here.",
      cited: [],
      reason: result.reason,
      modelId: "",
    });
  }

  const known = new Map(sheet.lines.map((line) => [line.id, line]));
  const cited: FactSheetLine[] = [];
  let invented = false;
  for (const id of result.value.citedLineIds) {
    const line = known.get(id);
    if (line === undefined) {
      invented = true;
      break;
    }
    cited.push(line);
  }

  // an id that is not on the Fact Sheet means the answer was composed, so the whole answer goes
  if (invented) {
    return NextResponse.json({
      grounded: false,
      answer:
        "The model cited a source that is not on this Fact Sheet, so the answer was thrown away rather than shown. This guard is why you can trust the rest of the page.",
      cited: [],
      modelId: result.modelId,
    });
  }

  // no citation means nothing supports it, and an unsupported answer is not shown at all
  if (cited.length === 0) {
    return NextResponse.json({
      grounded: false,
      answer: "The Fact Sheet for this place does not cover that.",
      cited: [],
      modelId: result.modelId,
    });
  }

  return NextResponse.json({
    grounded: true,
    answer: plainDashes(result.value.answer),
    cited: cited.map((line) => ({ id: line.id, text: line.text, source: line.source })),
    modelId: result.modelId,
  });
}
