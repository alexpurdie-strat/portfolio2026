"use client";

import { useEffect, useState } from "react";

/*
 * The local time, bottom left of the load-in frame.
 *
 * Renders nothing until mounted: the server has no idea what time it is where
 * the reader is, and a clock that hydrates to a different value than it
 * rendered is a mismatch by construction.
 */
export function Clock({ className }: { className?: string }) {
  const [now, setNow] = useState<{ time: string; zone: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const time = d.toLocaleTimeString(undefined, { hour12: false });
      /* The reader's own offset, not a hardcoded one. */
      const offset = -d.getTimezoneOffset() / 60;
      const sign = offset >= 0 ? "+" : "−";
      setNow({ time, zone: `(GMT ${sign}${Math.abs(offset)})` });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className={className} suppressHydrationWarning>
      {now ? (
        <>
          {now.time} <span className="accent">{now.zone}</span>
        </>
      ) : (
        ""
      )}
    </p>
  );
}
