import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ALL_FACT_SHEETS } from '../../../content/factsheets';

const requestSchema = z.object({
  pointId: z.string().min(1),
  question: z.string().min(1).max(500),
});

const responseSchema = {
  type: 'object',
  properties: {
    answer: {
      type: 'string',
    },
    citedLineIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['answer', 'citedLineIds'],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          answer: 'Invalid question.',
          citedLineIds: [],
          grounded: false,
        },
        { status: 400 }
      );
    }

    const { pointId, question } = parsed.data;

    const factSheet = ALL_FACT_SHEETS.find(
      (sheet) => sheet.pointId === pointId
    );

    if (!factSheet) {
      return NextResponse.json(
        {
          answer: "The fact sheet for this place doesn't cover that.",
          citedLineIds: [],
          grounded: false,
        },
        { status: 200 }
      );
    }

    const known = new Set(factSheet.lines.map((line) => line.id));

    const facts = factSheet.lines
      .map(
        (line) =>
          `ID: ${line.id}\nFact: ${line.text}\nSource: ${line.source}`
      )
      .join('\n\n');

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You answer questions about a heritage monument.

You MUST use only the supplied Fact Sheet.
Do not use outside knowledge.
Do not invent dates, names, measurements, interpretations, or historical details.

If the supplied facts do not answer the question, say that the fact sheet does not cover it and return an empty citedLineIds array.

Every factual claim in the answer must be supported by one or more supplied fact IDs.

Return JSON only in this exact shape:
{
  "answer": "short clear answer",
  "citedLineIds": ["fact_id"]
}

FACT SHEET:
${facts}

QUESTION:
${question}
`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const text = result.text ?? '';

    let parsedResponse: {
      answer: string;
      citedLineIds: string[];
    };

    try {
      parsedResponse = JSON.parse(text);
    } catch {
      return NextResponse.json({
        answer: "I can't answer that from the sources I have.",
        citedLineIds: [],
        grounded: false,
      });
    }

    const citedLineIds = Array.isArray(parsedResponse.citedLineIds)
      ? parsedResponse.citedLineIds.filter(
          (id): id is string => typeof id === 'string'
        )
      : [];

    if (!citedLineIds.every((id) => known.has(id))) {
      return NextResponse.json({
        answer: "I can't answer that from the sources I have.",
        citedLineIds: [],
        grounded: false,
      });
    }

    return NextResponse.json({
      answer:
        typeof parsedResponse.answer === 'string'
          ? parsedResponse.answer
          : "I can't answer that from the sources I have.",
      citedLineIds,
      grounded: true,
    });
  } catch (error) {
    console.error('Ask API error:', error);

    return NextResponse.json(
      {
        answer: 'The place knowledge service is temporarily unavailable.',
        citedLineIds: [],
        grounded: false,
      },
      { status: 500 }
    );
  }
}