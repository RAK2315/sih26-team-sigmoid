"use client";

import { TRIGGER_CONFIG } from "@/lib/location/config";
import type { TriggerStatus } from "@/lib/location/engine";
import type { Fix, HeritagePoint } from "@/lib/types";

interface Reading {
  label: string;
  value: string;
  met: boolean;
}

const DWELL_S = TRIGGER_CONFIG.dwellMs / 1000;

function readings(status: TriggerStatus | null): Reading[] {
  if (status === null) {
    return [
      { label: "Inside Approach Ring", value: "no", met: false },
      { label: "Facing", value: "nothing near enough to face", met: false },
      { label: "Stood still", value: `0.0s of ${DWELL_S}s`, met: false },
    ];
  }

  const still = status.driftM <= TRIGGER_CONFIG.dwellDriftM;
  const off = Math.round(status.offByDeg ?? 0);

  return [
    {
      label: "Inside Approach Ring",
      value: status.inRing ? "yes" : "no",
      met: status.inRing,
    },
    {
      label: "Facing",
      value: status.facing
        ? status.offByDeg === null
          ? "no compass, counted as facing"
          : `on it, off by ${off} degrees`
        : `away by ${off} degrees`,
      met: status.facing,
    },
    {
      label: "Stood still",
      value: still
        ? `${(status.dwellMs / 1000).toFixed(1)}s of ${DWELL_S}s`
        : `moving, ${status.driftM.toFixed(1)} m of drift`,
      met: status.dwellMs >= TRIGGER_CONFIG.dwellMs,
    },
  ];
}

export default function TriggerPanel({
  points,
  statuses,
  live,
  fix,
}: {
  points: HeritagePoint[];
  statuses: TriggerStatus[];
  live: boolean;
  fix: Fix;
}) {
  // the panel reports on one Heritage Point, the one closest to speaking
  const near = points
    .map((point) => ({ point, status: statuses.find((s) => s.pointId === point.id) ?? null }))
    .filter((row) => row.status?.inRing === true)
    .sort((a, b) => (b.status?.dwellMs ?? 0) - (a.status?.dwellMs ?? 0));

  const subject = near[0] ?? null;
  const status = subject?.status ?? null;
  const rows = readings(status);
  const allMet = rows.every((r) => r.met);
  const spoken = allMet && status?.fired === true;
  const firstUnmet = rows.findIndex((r) => !r.met);
  const dwellPercent = Math.min(100, ((status?.dwellMs ?? 0) / TRIGGER_CONFIG.dwellMs) * 100);

  return (
    <div
      className={`border transition-colors duration-300 ${
        allMet ? "border-verdigris bg-verdigris/10" : "border-ink-faint/40 bg-paper-raised"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-ink-faint/25 px-4 py-2">
        <p className="font-archive text-[10px] tracking-[0.2em] text-ink-faint uppercase">
          {live ? `Phone, ${Math.round(fix.accuracyM)} m accuracy` : "Field simulation"}
        </p>
        <p
          className={`font-archive text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
            allMet ? "text-verdigris" : "text-state-candidate"
          }`}
        >
          {spoken ? "Spoken" : allMet ? "Speaking" : "Waiting"}
        </p>
      </div>

      <div className="px-4 pt-3">
        <p className="font-display text-lg leading-tight text-ink">
          {subject ? subject.point.name : "No Heritage Point in range"}
        </p>
        <p className="font-archive mt-0.5 text-[11px] text-ink-faint">
          {subject
            ? "Three conditions. All three, and it speaks."
            : live
              ? "Walk towards a Heritage Point and turn to face it."
              : "Drag yourself onto the map, or use the arrow keys to turn and step."}
        </p>
      </div>

      <ul className="mt-3 px-4 pb-1">
        {rows.map((row, index) => (
          <li
            key={row.label}
            className={`flex items-center gap-3 border-l-2 py-1.5 pl-2 transition-colors duration-300 ${
              row.met
                ? "border-verdigris/50"
                : index === firstUnmet
                  ? "border-state-candidate"
                  : "border-transparent"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full border transition-colors duration-300 ${
                row.met
                  ? "border-verdigris bg-verdigris"
                  : "border-state-candidate bg-transparent"
              }`}
              aria-hidden="true"
            />
            <span className="font-archive shrink-0 text-[10px] tracking-[0.16em] text-ink-muted uppercase">
              {row.label}
            </span>
            <span
              className={`font-archive ml-auto text-right text-[11px] transition-colors duration-300 ${
                row.met ? "text-verdigris" : "text-state-candidate"
              }`}
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>

      {/* the same three seconds the ring on the map is drawing */}
      <div className="mx-4 mb-3 h-[3px] bg-paper-sunk">
        <div
          className="h-full bg-madder transition-[width] duration-200 ease-linear"
          style={{ width: `${dwellPercent}%` }}
        />
      </div>

      <p className="font-archive border-t border-ink-faint/25 px-4 py-2 text-[10px] leading-relaxed text-ink-faint">
        A Heritage Point speaks when you are inside its Approach Ring, facing within{" "}
        {TRIGGER_CONFIG.facingToleranceDeg} degrees, and have stood still for {DWELL_S} seconds.
      </p>
    </div>
  );
}
