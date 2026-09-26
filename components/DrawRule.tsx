"use client";

import { useEffect, useRef, useState } from "react";

/** A 1px rule that draws itself from the left the first time it scrolls into view. */
export function DrawRule({ className = "bg-line" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} aria-hidden="true" data-shown={shown} className={`draw-rule h-px ${className}`} />;
}
