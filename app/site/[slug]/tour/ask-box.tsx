"use client";

import { useEffect, useState } from "react";

interface Cited {
  id: string;
  text: string;
  source: string;
}

interface Reply {
  grounded: boolean;
  answer: string;
  cited: Cited[];
  modelId: string;
}

// F12. The Fact Sheet is the whole of what may be said, and an answer with no line behind it
// is thrown away rather than shown.
export default function AskBox({ pointId, pointName }: { pointId: string; pointName: string }) {
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [reply, setReply] = useState<Reply | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  // a question about the Naubat Khana makes no sense once the Visitor is at the Moti Masjid
  useEffect(() => {
    setReply(null);
    setProblem(null);
    setQuestion("");
  }, [pointId]);

  async function ask(event: React.FormEvent) {
    event.preventDefault();
    if (question.trim().length < 3 || asking) return;
    setAsking(true);
    setReply(null);
    setProblem(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pointId, question }),
      });
      if (!res.ok) {
        setProblem("Nothing is written for this Heritage Point, so there is nothing to ask.");
        return;
      }
      setReply((await res.json()) as Reply);
    } catch {
      setProblem("The question never reached the server. Check the connection and ask again.");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="border border-ink-faint/40 bg-paper-raised p-4">
      <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
        Ask about this place
      </p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        Answered from the Fact Sheet for {pointName} and from nothing else. If the answer is not
        in there you will be told so.
      </p>

      <form onSubmit={ask} className="mt-3 flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={300}
          placeholder="How tall is it?"
          className="min-w-0 flex-1 border border-ink-faint/40 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
        />
        <button
          type="submit"
          disabled={asking || question.trim().length < 3}
          className="font-archive shrink-0 border border-madder px-3 py-2 text-[11px] tracking-widest text-madder uppercase transition-colors duration-200 hover:bg-madder hover:text-paper disabled:opacity-40"
        >
          {asking ? "Reading" : "Ask"}
        </button>
      </form>

      {asking && <p className="breathe mt-3 text-sm text-ink-muted">Reading the Fact Sheet.</p>}
      {problem && <p className="mt-3 text-sm leading-relaxed text-madder">{problem}</p>}

      {reply && (
        <div className="mt-3">
          <p
            className={`text-sm leading-relaxed ${reply.grounded ? "text-ink" : "text-ink-muted"}`}
          >
            {reply.answer}
          </p>

          {reply.grounded ? (
            <>
              <p className="font-archive mt-3 text-[10px] tracking-[0.2em] text-verdigris uppercase">
                Every line it stands on
              </p>
              <ul className="mt-1">
                {reply.cited.map((line) => (
                  <li key={line.id} className="border-t border-ink-faint/20 py-2">
                    <p className="text-[12px] leading-relaxed text-ink">{line.text}</p>
                    <p className="font-archive mt-0.5 text-[10px] leading-relaxed text-ink-faint">
                      {line.source}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="font-archive mt-2 text-[10px] tracking-[0.2em] text-state-candidate uppercase">
              Not grounded, so nothing is claimed
            </p>
          )}

          {reply.modelId && (
            <p className="font-archive mt-2 text-[10px] text-ink-faint">
              read by {reply.modelId}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
