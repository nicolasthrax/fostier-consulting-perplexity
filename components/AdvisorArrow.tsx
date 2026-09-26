"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

export function AdvisorArrow({ label }: { label: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#advisor"
      aria-label={label}
      className={`focus-ring fixed bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-sm bg-navy p-2.5 text-white transition-all duration-300 hover:bg-fred-700 ${
        hidden ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
      }`}
    >
      <ArrowDown
        className="h-5 w-5"
        aria-hidden="true"
      />
    </a>
  );
}
