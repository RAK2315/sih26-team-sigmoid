"use client";

import { useState } from "react";
import type { ThenNow } from "@/lib/types";

export default function ThenNowCard({ thenNow, name }: { thenNow: ThenNow; name: string }) {
  const [percent, setPercent] = useState(50);
  const { then, now } = thenNow;

  return (
    <div className="border border-ink-faint/40 bg-paper-raised p-4">
      <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
        Then and now &middot; {then.year} against {now.year}
      </p>

      <div className="relative mt-3 select-none overflow-hidden">
        <img src={now.url} alt={now.alt} className="block w-full" draggable={false} />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        >
          <img
            src={then.url}
            alt={then.alt}
            className="block h-full w-full object-cover"
            draggable={false}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-paper shadow-[0_0_0_1px_rgba(31,27,22,.4)]"
          style={{ left: `${percent}%` }}
        />

        <span className="pointer-events-none absolute top-2 left-2 bg-ink/70 px-1.5 py-0.5 font-archive text-[11px] text-paper">
          {then.year}
        </span>
        <span className="pointer-events-none absolute top-2 right-2 bg-ink/70 px-1.5 py-0.5 font-archive text-[11px] text-paper">
          {now.year}
        </span>

        {/* one control for mouse and keyboard both, because a bare drag handle is unreachable by tab */}
        <input
          type="range"
          min={0}
          max={100}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          aria-label={`Slide between ${then.year} and ${now.year} views of ${name}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{thenNow.note}</p>

      <p className="font-archive mt-2 text-[11px] leading-relaxed text-ink-faint">
        {then.year}: {then.author}, {then.licence}.
        <br />
        {now.year}: {now.author}, {now.licence}. Both via Wikimedia Commons.
      </p>
    </div>
  );
}
