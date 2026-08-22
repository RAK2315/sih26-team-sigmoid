const STEPS = [
  { label: "Page", note: "A real leaf of the 1919 survey, scan and text" },
  { label: "Mention", note: "A passage on it that names a structure" },
  { label: "Spatial Clue", note: "Where the page says that structure stands" },
  { label: "Candidate", note: "A pin, and a circle saying how sure we are" },
];

function StepGlyph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1}>
      {index === 0 && <path d="M5 2h9l5 5v15H5z M14 2v5h5" />}
      {index === 1 && (
        <>
          <path d="M5 2h9l5 5v15H5z M14 2v5h5" />
          <path d="M8 13h8 M8 17h5" strokeWidth={1.5} />
        </>
      )}
      {index === 2 && (
        <>
          <circle cx="12" cy="12" r="7" />
          <path d="M12 1v4 M12 19v4 M1 12h4 M19 12h4" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </>
      )}
      {index === 3 && (
        <>
          <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}

export default function DiscoverHeader({ pageCount }: { pageCount: number }) {
  return (
    <header className="shrink-0 border-b border-ink-faint/40 bg-paper-sunk px-6 py-8 lg:px-12">
      <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">
        The researcher&apos;s desk
      </p>
      <h1 className="font-display mt-2 max-w-3xl text-4xl leading-tight text-ink lg:text-5xl">
        Watch a 1919 page become a place on the map
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
        This is Maulvi Zafar Hasan&apos;s survey of Delhi, published in 1919. Pick any of its{" "}
        {pageCount} Pages and press Analyse. Every structure the page names becomes a card, every
        location it describes becomes a pin with a circle showing how sure we are, and every step
        is inspectable.
      </p>

      <ol className="mt-6 grid gap-px border border-ink-faint/40 bg-ink-faint/40 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.label} className="flex gap-3 bg-paper-raised p-4">
            <span className="mt-0.5 shrink-0 text-madder">
              <StepGlyph index={i} />
            </span>
            <span>
              <span className="font-archive block text-[11px] tracking-widest text-ink uppercase">
                {step.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{step.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </header>
  );
}
