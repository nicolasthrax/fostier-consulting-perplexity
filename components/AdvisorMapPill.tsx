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
const SWEEP_DURATION = 520;
const BLENDED_BLUE = "#1a75ff";

export function AdvisorMapPill({ locale }: { locale: string }) {
  const pillRef = useRef<HTMLSpanElement>(null);
  const basePathRef = useRef<SVGRectElement>(null);
  const sweepPathRef = useRef<SVGRectElement>(null);
  const glowId = useId().replace(/:/g, "");

  useEffect(() => {
    const pill = pillRef.current;
    const basePath = basePathRef.current;
    const sweepPath = sweepPathRef.current;
    if (!pill || !basePath || !sweepPath) return;

    let redStart = performance.now();
    let sweepStart: number | null = null;
    let frame = 0;

    const draw = () => {
      const { width, height } = pill.getBoundingClientRect();
      const inset = BORDER / 2;
      const radius = Math.max(0, height / 2 - inset);

      for (const path of [basePath, sweepPath]) {
        path.setAttribute("x", String(inset));
        path.setAttribute("y", String(inset));
        path.setAttribute("width", String(Math.max(0, width - BORDER)));
        path.setAttribute("height", String(Math.max(0, height - BORDER)));
        path.setAttribute("rx", String(radius));
        path.setAttribute("ry", String(radius));
      }
    };

    const animate = (now: number) => {
      const redElapsed = now - redStart;
      const redStrength = 0.5 + 0.5 * Math.sin((redElapsed / 900) * Math.PI * 2);
      basePath.style.strokeOpacity = sweepStart === null ? String(0.48 + 0.24 * redStrength) : "";

      if (sweepStart !== null) {
        const progress = Math.min(1, (now - sweepStart) / SWEEP_DURATION);
        const eased = 1 - Math.pow(1 - progress, 3);
        sweepPath.style.strokeDashoffset = String(-100 * eased);
        sweepPath.style.opacity = progress >= 1 ? "0" : "1";
        if (progress >= 1) sweepStart = null;
      }

      frame = requestAnimationFrame(animate);
    };

    const onMouseEnter = () => {
      sweepStart = performance.now();
      sweepPath.style.transition = "opacity 120ms ease-out";
      sweepPath.style.opacity = "1";
      basePath.style.transition = "stroke 520ms ease-out, stroke-opacity 520ms ease-out, stroke-width 520ms ease-out";
      basePath.style.stroke = "#0A84FF";
      basePath.style.strokeOpacity = ".92";
      basePath.style.strokeWidth = "1.65";
    };

    const onMouseLeave = () => {
      sweepStart = null;
      sweepPath.style.opacity = "0";
      sweepPath.style.strokeDashoffset = "0";
      basePath.style.transition = "stroke 420ms ease-out, stroke-opacity 420ms ease-out, stroke-width 420ms ease-out";
      basePath.style.stroke = "#ED2939";
      basePath.style.strokeOpacity = ".62";
      basePath.style.strokeWidth = String(BORDER);
      redStart = performance.now();
    };

    const observer = new ResizeObserver(draw);
    draw();
    observer.observe(pill);
    pill.addEventListener("mouseenter", onMouseEnter);
    pill.addEventListener("mouseleave", onMouseLeave);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      pill.removeEventListener("mouseenter", onMouseEnter);
      pill.removeEventListener("mouseleave", onMouseLeave);
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
            className="transition-all duration-500 ease-out"
          />

          <rect
            ref={sweepPathRef}
            fill="none"
            stroke={BLENDED_BLUE}
            strokeLinecap="round"
            strokeDasharray="23 77"
            pathLength="100"
            filter={`url(#${glowId})`}
            className="opacity-0"
          />
        </svg>

        {labels[locale] ?? labels.en}
        <ArrowRight className="h-3.5 w-3.5 text-fred transition-[color,transform] duration-500 ease-out group-hover:translate-x-0.5 group-hover:text-[#0A84FF]" />
      </span>
    </Link>
  );
}
