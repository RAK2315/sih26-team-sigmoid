import type { ArchiveImage } from "@/lib/types";

// A four centred arch used as a window. The plates sit inside the opening and change on a slow
// cycle, so the hero holds still without being still.
export default function ArchWindow({
  plates,
  className,
}: {
  plates: ArchiveImage[];
  className?: string;
}) {
  const cycle = 21;

  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden="true">
      <defs>
        <clipPath id="arch-opening">
          <path d="M30 300 V152 C30 90 60 44 100 30 C140 44 170 90 170 152 V300 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#arch-opening)">
        <rect x="30" y="30" width="140" height="270" fill="var(--color-paper-sunk)" />
        {plates.map((plate, i) => (
          <image
            key={plate.url}
            href={plate.url}
            x="10"
            y="10"
            width="180"
            height="310"
            preserveAspectRatio="xMidYMid slice"
            className="plate-cycle"
            style={{ animationDelay: `${(i * cycle) / plates.length}s` }}
          />
        ))}
        <rect x="30" y="30" width="140" height="270" fill="var(--color-paper)" opacity="0.2" />
      </g>

      <g
        className="arch-draw"
        fill="none"
        stroke="var(--color-ink-faint)"
        strokeWidth="1"
        opacity="0.85"
      >
        <path d="M30 300 V152 C30 90 60 44 100 30 C140 44 170 90 170 152 V300" />
        <path d="M16 300 V150 C16 80 52 30 100 14 C148 30 184 80 184 150 V300" opacity="0.6" />
        <path d="M100 14 V0 M92 20 C92 10 100 4 100 4 C100 4 108 10 108 20 C108 26 104 30 100 30 C96 30 92 26 92 20 Z" />
      </g>
    </svg>
  );
}
