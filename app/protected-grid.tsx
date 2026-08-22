"use client";

import { useInView } from "./use-in-view";

const COLS = 52;
const ROWS = 25;
const RECORDED = COLS * ROWS;
const PROTECTED = 174;

// one square for every monument the survey recorded, and the 174 that are protected today
export default function ProtectedGrid() {
  const [ref, state] = useInView<HTMLDivElement>();
  const rows = Array.from({ length: ROWS }, (_, row) => row);

  return (
    <div ref={ref} data-grid={state}>
      <svg
        viewBox={`0 0 ${COLS * 5} ${ROWS * 5}`}
        className="w-full"
        role="img"
        aria-label={`${RECORDED} squares, one for each monument the survey recorded. ${PROTECTED} of them, shown filled, are centrally protected today.`}
      >
        {rows.map((row) => (
          <g key={row} className="grid-row" style={{ animationDelay: `${row * 45}ms` }}>
            {Array.from({ length: COLS }, (_, col) => {
              const index = row * COLS + col;
              const kept = index < PROTECTED;
              return (
                <rect
                  key={col}
                  x={col * 5}
                  y={row * 5}
                  width={3}
                  height={3}
                  fill={kept ? "#9A3412" : "none"}
                  stroke={kept ? "none" : "#9A8F7C"}
                  strokeWidth={0.6}
                />
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
