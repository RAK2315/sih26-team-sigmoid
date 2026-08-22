// Line ornament borrowed from the buildings themselves: a four centred arch, a jali lattice,
// a lotus finial. Ink only, no fill, so they sit on paper the way a printed plate does.

export function MughalArch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <g className="draw-stroke">
        <path d="M14 280 V150 C14 78 52 26 100 12 C148 26 186 78 186 150 V280" />
        <path d="M30 280 V152 C30 90 60 46 100 32 C140 46 170 90 170 152 V280" />
        <path d="M100 12 V0" />
        <path d="M92 18 C92 8 100 2 100 2 C100 2 108 8 108 18 C108 24 104 28 100 28 C96 28 92 24 92 18 Z" />
        <path d="M14 280 H186" strokeWidth="1.5" />
        <path d="M48 280 V196 C48 160 70 132 100 122 C130 132 152 160 152 196 V280" opacity="0.5" />
      </g>
    </svg>
  );
}

// the eight pointed star that repeats across a carved screen, tiled as a band
export function JaliBand({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 48"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <pattern id="jali" width="48" height="48" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.9">
            <path d="M24 4 L34 14 L44 24 L34 34 L24 44 L14 34 L4 24 L14 14 Z" />
            <path d="M24 12 L36 24 L24 36 L12 24 Z" />
            <path d="M0 0 L14 14 M48 0 L34 14 M0 48 L14 34 M48 48 L34 34" />
          </g>
        </pattern>
      </defs>
      <rect width="480" height="48" fill="url(#jali)" />
    </svg>
  );
}

// a hairline rule with a lozenge in the middle, the way a printed volume breaks a section
export function RuleWithLozenge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M0 6 H176 M224 6 H400" />
      <path d="M200 1 L208 6 L200 11 L192 6 Z" />
    </svg>
  );
}

export function ChhatriRow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 120"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      {[60, 200, 340, 480].map((x, i) => (
        <g key={x} opacity={i % 2 === 0 ? 1 : 0.55}>
          <path d={`M${x - 34} 120 V70 M${x + 34} 120 V70`} />
          <path d={`M${x - 44} 70 H${x + 44}`} />
          <path d={`M${x - 40} 70 C${x - 40} 40 ${x - 18} 24 ${x} 24 C${x + 18} 24 ${x + 40} 40 ${x + 40} 70`} />
          <path d={`M${x} 24 V10`} />
          <path d={`M${x - 20} 120 V88 M${x} 120 V88 M${x + 20} 120 V88`} opacity="0.6" />
        </g>
      ))}
      <path d="M0 120 H600" strokeWidth="1.4" />
    </svg>
  );
}
