"use client";

import { useEffect, useState } from "react";

const zones = [
  { city: "Paris", tz: "Europe/Paris" },
  { city: "Hong Kong", tz: "Asia/Hong_Kong" },
] as const;

function timeParts(tz: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "--";
  return { h: get("hour"), m: get("minute") };
}

/** Live local time in Paris and Hong Kong. Renders placeholders on the server to avoid hydration drift. */
export function DualClock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <dl className={`grid grid-cols-2 gap-px ${className}`}>
      {zones.map(({ city, tz }) => {
        const t = now ? timeParts(tz, now) : { h: "--", m: "--" };
        return (
          <div key={tz} className="flex flex-col gap-1">
            <dt className="text-sm font-medium opacity-75">{city}</dt>
            <dd className="tabular font-serif text-5xl leading-none tracking-tight sm:text-6xl">
              <time suppressHydrationWarning>
                {t.h}
                <span className="blink-colon">:</span>
                {t.m}
              </time>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
