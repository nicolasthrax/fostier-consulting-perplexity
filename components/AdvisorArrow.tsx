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
      className={`focus-ring fixed bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-full p-2 text-navy transition-all duration-300 hover:text-navy-800 ${
        hidden ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
      }`}
    >
      <ArrowDown
        className="h-7 w-7 animate-bounce drop-shadow-[0_0_10px_rgba(0,35,149,0.55)]"
        aria-hidden="true"
      />
    </a>
  );
}
