"use client";

import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // starts false so the server and the first client render agree, then corrects itself
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="shrink-0 border-b border-state-candidate/50 bg-paper-sunk px-6 py-2">
      <p className="text-sm leading-relaxed text-ink">
        <span className="font-archive mr-2 text-[11px] tracking-widest text-state-candidate uppercase">
          offline
        </span>
        The Walk still works: the Route, every Narration and the whole trigger engine are on this
        device. Map tiles you have not already loaded will not draw, and reading a new Page falls
        back to what is stored in the app.
      </p>
    </div>
  );
}
