"use client";

import { TRIGGER_CONFIG } from "@/lib/location/config";
import type { TriggerStatus } from "@/lib/location/engine";
import type { Fix, HeritagePoint } from "@/lib/types";

function reason(status: TriggerStatus | undefined): string {
  if (!status || !status.inRing) return "too far away";
  if (status.fired && status.dwellMs >= TRIGGER_CONFIG.dwellMs) return "already spoken";
  if (!status.facing) return `facing away by ${Math.round(status.offByDeg ?? 0)} degrees`;
  if (status.driftM > TRIGGER_CONFIG.dwellDriftM) return "still moving";
  const remaining = (TRIGGER_CONFIG.dwellMs - status.dwellMs) / 1000;
  if (remaining > 0) return `${remaining.toFixed(1)}s more`;
  return "speaking";
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
  const near = points.filter((p) => statuses.find((s) => s.pointId === p.id)?.inRing);

  return (
    <div className="border border-ink-faint/40 bg-paper-raised p-4">
      <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
        {live ? `Live position from this device, ${Math.round(fix.accuracyM)} m accuracy` : "Field simulation"}
      </p>
      {near.length === 0 ? (
        <p className="mt-2 text-sm text-ink-muted">
          {live
            ? "Not inside any Approach Ring. Walk towards a Heritage Point and turn to face it."
            : "Not inside any Approach Ring. Drag yourself onto the map, or press the arrow keys to turn and step."}
        </p>
      ) : (
        <ul className="mt-2 space-y-1">
          {near.map((point) => {
            const status = statuses.find((s) => s.pointId === point.id);
            return (
              <li key={point.id} className="flex justify-between gap-3 text-sm">
                <span className="text-ink">{point.name}</span>
                <span className="font-archive text-xs text-madder">{reason(status)}</span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="font-archive mt-3 text-xs leading-relaxed text-ink-faint">
        A Heritage Point speaks when you are inside its Approach Ring, facing within{" "}
        {TRIGGER_CONFIG.facingToleranceDeg} degrees, and have stood still for{" "}
        {TRIGGER_CONFIG.dwellMs / 1000} seconds.
      </p>
    </div>
  );
}
