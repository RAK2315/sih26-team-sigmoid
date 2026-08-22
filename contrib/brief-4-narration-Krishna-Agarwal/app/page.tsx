'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_NARRATIONS } from '../content/narrations';
import { ALL_LIVING_TRADITIONS } from '../content/traditions';
import { ALL_FACT_SHEETS } from '../content/factsheets';
import { AudioNarrationPlayer, unlockAudio } from '../lib/player';
import type { Narration, Persona } from '../lib/types';
import TranscriptPanel from '../components/TranscriptPanel';

const POINTS = [
  {
    id: 'red-fort/diwan-i-aam',
    name: 'Diwan-i-Aam',
    short: 'Hall of Public Audience',
  },
  {
    id: 'red-fort/diwan-i-khas',
    name: 'Diwan-i-Khas',
    short: 'Hall of Private Audience',
  },
  {
    id: 'red-fort/lahori-gate',
    name: 'Lahori Gate',
    short: 'Main western gateway',
  },
  {
    id: 'red-fort/rang-mahal',
    name: 'Rang Mahal',
    short: 'Palace of Colours',
  },
] as const;

const PERSONAS: { id: Persona; label: string }[] = [
  { id: 'history', label: 'History' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'kids', label: 'Kids' },
];

function findNarration(
  pointId: string,
  persona: Persona,
  kind: 'approach' | 'inside'
): Narration | undefined {
  return ALL_NARRATIONS.find(
    (n) =>
      n.pointId === pointId &&
      n.persona === persona &&
      n.lang === 'en' &&
      n.kind === kind
  );
}

export default function Home() {
  const [pointId, setPointId] = useState<string>(POINTS[0].id);
  const [persona, setPersona] = useState<Persona>('history');
  const [kind, setKind] = useState<'approach' | 'inside'>('approach');

  const [activeSentence, setActiveSentence] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [showAsk, setShowAsk] = useState(false);
  const [question, setQuestion] = useState('');
  const [askAnswer, setAskAnswer] = useState<{
    answer: string;
    citedLineIds: string[];
    grounded: boolean;
  } | null>(null);
  const [asking, setAsking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<AudioNarrationPlayer | null>(null);

  const narration = useMemo(
    () => findNarration(pointId, persona, kind),
    [pointId, persona, kind]
  );

  const factSheet = useMemo(
    () => ALL_FACT_SHEETS.find((f) => f.pointId === pointId),
    [pointId]
  );

  const tradition = ALL_LIVING_TRADITIONS[pointId];

  useEffect(() => {
    if (!audioRef.current) return;

    const player = new AudioNarrationPlayer(audioRef.current);
    playerRef.current = player;

    const unsubscribeSentence = player.onSentence((index) => {
      setActiveSentence(index);
    });

    const unsubscribeEnded = player.onEnded(() => {
      setIsPlaying(false);
      setIsPaused(false);
    });

    return () => {
      unsubscribeSentence();
      unsubscribeEnded();
      player.stop();
    };
  }, []);

  useEffect(() => {
    setActiveSentence(0);
    setIsPlaying(false);
    setIsPaused(false);
    setAskAnswer(null);
  }, [pointId, persona, kind]);

  const playNarration = () => {
    if (!narration || !audioRef.current || !playerRef.current) return;

    unlockAudio(audioRef.current);

    window.setTimeout(() => {
      playerRef.current?.play(narration);
      setActiveSentence(0);
      setIsPlaying(true);
      setIsPaused(false);
    }, 100);
  };

  const pauseNarration = () => {
    playerRef.current?.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const resumeNarration = () => {
    playerRef.current?.resume();
    setIsPlaying(true);
    setIsPaused(false);
  };

  const switchPersona = (nextPersona: Persona) => {
    if (!audioRef.current || !playerRef.current) return;

    const nextNarration = findNarration(pointId, nextPersona, kind);

    if (!nextNarration) return;

    playerRef.current.stop();

    setPersona(nextPersona);
    setActiveSentence(0);
    setIsPlaying(false);
    setIsPaused(false);
  };

  const selectPoint = (nextPointId: string) => {
    playerRef.current?.stop();

    setPointId(nextPointId);
    setPersona('history');
    setKind('approach');
    setActiveSentence(0);
    setIsPlaying(false);
    setIsPaused(false);
    setShowAsk(false);
    setQuestion('');
    setAskAnswer(null);
  };

  const selectApproach = () => {
    playerRef.current?.stop();

    setKind('approach');
    setActiveSentence(0);
    setIsPlaying(false);
    setIsPaused(false);
  };

  const selectInside = () => {
    playerRef.current?.stop();

    setKind('inside');
    setPersona('history');
    setActiveSentence(0);
    setIsPlaying(false);
    setIsPaused(false);
  };

  const submitQuestion = async () => {
    if (!question.trim() || asking) return;

    setAsking(true);
    setAskAnswer(null);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pointId,
          question: question.trim(),
        }),
      });

      const data = await response.json();
      setAskAnswer(data);
    } catch {
      setAskAnswer({
        answer: 'I could not reach the place knowledge service.',
        citedLineIds: [],
        grounded: false,
      });
    } finally {
      setAsking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3efe5] text-stone-900">
      <audio ref={audioRef} preload="auto" />

      <header className="border-b border-stone-300 bg-[#211b16] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            Red Fort · Delhi
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Voices of the Red Fort
          </h1>

          <p className="mt-3 max-w-2xl text-stone-300">
            Explore each heritage point through history, architecture, and
            child-friendly narration, with the transcript always visible.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-stone-300 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Heritage Points
          </h2>

          <div className="space-y-2">
            {POINTS.map((point) => {
              const selected = point.id === pointId;

              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => selectPoint(point.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selected
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-stone-200 hover:border-amber-400 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-semibold">{point.name}</div>
                  <div className="mt-1 text-sm text-stone-500">
                    {point.short}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-stone-300 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wider text-amber-700">
                  Selected heritage point
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  {POINTS.find((p) => p.id === pointId)?.name}
                </h2>
              </div>

              <div className="flex rounded-xl bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={selectApproach}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    kind === 'approach'
                      ? 'bg-white shadow-sm'
                      : 'text-stone-500'
                  }`}
                >
                  Approach
                </button>

                <button
                  type="button"
                  onClick={selectInside}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    kind === 'inside'
                      ? 'bg-white shadow-sm'
                      : 'text-stone-500'
                  }`}
                >
                  Inside
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500">
                Narration style
              </p>

              <div
                className={`grid gap-2 ${
                  kind === 'inside' ? 'sm:grid-cols-1' : 'sm:grid-cols-3'
                }`}
              >
                {PERSONAS.filter(
                  (item) => kind === 'approach' || item.id === 'history'
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => switchPersona(item.id)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      persona === item.id
                        ? 'border-amber-600 bg-amber-100 text-amber-900'
                        : 'border-stone-300 hover:border-amber-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {isPlaying ? (
                <button
                  type="button"
                  onClick={pauseNarration}
                  className="rounded-xl bg-stone-800 px-6 py-3 font-semibold text-white hover:bg-stone-900"
                >
                  ⏸ Pause
                </button>
              ) : isPaused ? (
                <button
                  type="button"
                  onClick={resumeNarration}
                  disabled={!narration}
                  className="rounded-xl bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ▶ Resume
                </button>
              ) : (
                <button
                  type="button"
                  onClick={playNarration}
                  disabled={!narration}
                  className="rounded-xl bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ▶ Play narration
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAsk((value) => !value)}
                className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold hover:bg-stone-50"
              >
                Ask about this place
              </button>
            </div>

            {narration && (
              <div className="mt-4 text-sm text-stone-500">
                {Math.round(narration.durationSec)} seconds ·{' '}
                {narration.sentences.length} transcript sentences
              </div>
            )}
          </div>

          {narration && (
            <TranscriptPanel
              narration={narration}
              player={playerRef.current ?? undefined}
              activeIndex={activeSentence}
            />
          )}

          {tradition && (
            <section className="rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                Living tradition
              </p>

              <h3 className="mt-2 text-2xl font-bold">{tradition.name}</h3>

              <p className="mt-3 leading-7 text-stone-700">
                {tradition.text}
              </p>

              <span className="mt-4 inline-block rounded-full bg-stone-100 px-3 py-1 text-sm font-medium capitalize text-stone-700">
                Status: {tradition.status}
              </span>
            </section>
          )}

          {factSheet && (
            <section className="rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">Source facts</h3>

              <div className="mt-4 space-y-3">
                {factSheet.lines.map((line) => (
                  <div key={line.id} className="rounded-xl bg-stone-50 p-4">
                    <p className="leading-6 text-stone-800">{line.text}</p>

                    <p className="mt-2 text-xs text-stone-500">
                      Source: {line.source}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {showAsk && (
            <section className="rounded-2xl border border-stone-300 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">Ask about this place</h3>

              <p className="mt-1 text-sm text-stone-500">
                Answers are grounded only in this point&apos;s Fact Sheet.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      submitQuestion();
                    }
                  }}
                  placeholder="Ask a question about this place..."
                  className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-600"
                />

                <button
                  type="button"
                  onClick={submitQuestion}
                  disabled={asking || !question.trim()}
                  className="rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {asking ? 'Asking...' : 'Ask'}
                </button>
              </div>

              {askAnswer && (
                <div className="mt-5 rounded-xl bg-stone-50 p-4">
                  <p className="leading-7">{askAnswer.answer}</p>

                  {askAnswer.grounded &&
                    askAnswer.citedLineIds.length > 0 &&
                    factSheet && (
                      <div className="mt-4 border-t border-stone-200 pt-4">
                        <p className="text-sm font-semibold">Sources used</p>

                        <div className="mt-2 space-y-2">
                          {askAnswer.citedLineIds.map((id) => {
                            const line = factSheet.lines.find(
                              (item) => item.id === id
                            );

                            if (!line) return null;

                            return (
                              <div
                                key={id}
                                className="rounded-lg border border-stone-200 bg-white p-3 text-sm"
                              >
                                <p>{line.text}</p>

                                <p className="mt-1 text-xs text-stone-500">
                                  {line.source}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}