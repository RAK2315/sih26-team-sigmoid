// every name is one the survey actually printed, drifting past at reading speed
export default function NameMarquee({ names }: { names: string[] }) {
  const half = Math.ceil(names.length / 2);
  const rows = [names.slice(0, half), names.slice(half)];

  return (
    <div
      className="relative overflow-hidden py-6"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
      aria-hidden="true"
    >
      {rows.map((row, i) => (
        <div key={i} className={`flex w-max ${i === 0 ? "marquee" : "marquee-slow mt-3"}`}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {row.map((name) => (
                <span
                  key={`${copy}-${name}`}
                  className="font-display flex items-center gap-6 px-6 text-2xl whitespace-nowrap text-ink-faint lg:text-3xl"
                >
                  {name}
                  <span className="h-1 w-1 shrink-0 bg-madder/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
