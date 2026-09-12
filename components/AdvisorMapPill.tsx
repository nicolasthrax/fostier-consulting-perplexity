"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useId, useRef } from "react";

const labels: Record<string, string> = {
  fr: "Rencontrer votre conseillère",
  en: "Meet your advisor",
  zh: "认识您的专属顾问",
};

const BORDER = 1.5;
const IDLE_DURATION = 3000;
const HOVER_SWEEP = 520;
const BLENDED_BLUE = "#1a75ff";

export function AdvisorMapPill({ locale }: { locale: string }) {
  const pillRef = useRef<HTMLSpanElement>(null);
  const basePathRef = useRef<SVGRectElement>(null);
  const pulsePathRef = useRef<SVGRectElement>(null);
  const glowId = useId().replace(/:/g, "");

  useEffect(() => {
    const pill = pillRef.current;
    const basePath = basePathRef.current;
    const pulsePath = pulsePathRef.current;
    if (!pill || !basePath || !pulsePath) return;

    let frame = 0;
    let idleStart = performance.now();
    let sweepStart: number | null = null;

    const draw = () => {
      const { width, height } = pill.getBoundingClientRect();
      const inset = BORDER / 2;
      const radius = Math.max(0, height / 2 - inset);

      for (const path of [basePath, pulsePath]) {
        path.setAttribute("x", String(inset));
        path.setAttribute("y", String(inset));
        path.setAttribute("width", String(Math.max(0, width - BORDER)));
        path.setAttribute("height", String(Math.max(0, height - BORDER)));
        path.setAttribute("rx", String(radius));
        path.setAttribute("ry", String(radius));
      }
    };

    const animate = (now: number) => {
      const elapsed = now - idleStart;
      const idling = sweepStart === null;
      const duration = idling ? IDLE_DURATION : HOVER_SWEEP;
      const progress = ((idling ? elapsed : now - sweepStart) % duration) / duration;
      const strength = 0.5 + 0.5 * Math.sin((elapsed / 420) * Math.PI * 2);

      pulsePath.style.strokeDashoffset = String(-100 * progress);
      pulsePath.style.strokeWidth = String(1.55 + 0.35 * strength);
      pulsePath.style.opacity = String(0.68 + 0.14 * strength);
      frame = requestAnimationFrame(animate);
    };

    const beginHover = () => {
      sweepStart = performance.now();
      pulsePath.style.transition = "opacity 220ms ease-out";
      pulsePath.style.opacity = "0";
    };

    const endHover = () => {
      sweepStart = null;
      idleStart = performance.now();
      pulsePath.style.transition = "";
      pulsePath.style.opacity = "";
    };

    const observer = new ResizeObserver(draw);
    draw();
    observer.observe(pill);
    pill.addEventListener("mouseenter", beginHover);
    pill.addEventListener("mouseleave", endHover);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      pill.removeEventListener("mouseenter", beginHover);
      pill.removeEventListener("mouseleave", endHover);
    };
  }, []);

  return (
    <Link
      href={`/${locale}/about`}
      className="focus-ring group absolute bottom-4 left-4 inline-flex rounded-full transition-transform duration-500 ease-out hover:scale-[1.05]"
    >
      <span
        ref={pillRef}
        className="relative inline-flex items-center gap-2 rounded-full bg-black/70 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors duration-500 group-hover:bg-black/60"
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            ref={basePathRef}
            fill="none"
            stroke="#ED2939"
            strokeOpacity=".62"
            strokeWidth={BORDER}
            className="transition-all duration-500 ease-out group-hover:stroke-[#0A84FF] group-hover:stroke-opacity-90"
          />

          <rect
            ref={pulsePathRef}
            fill="none"
            stroke={BLENDED_BLUE}
            strokeLinecap="round"
            strokeDasharray="23 77"
            pathLength="100"
            filter={`url(#${glowId})`}
            className="group-hover:opacity-0"
          />
        </svg>

        {labels[locale] ?? labels.en}
        <ArrowRight className="h-3.5 w-3.5 text-fred transition-[color,transform] duration-500 ease-out group-hover:translate-x-0.5 group-hover:text-[#0A84FF]" />
      </span>
    </Link>
  );
}
