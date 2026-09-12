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
const PULSE_LENGTH = 17;
const DURATION = 5600;

export function AdvisorMapPill({ locale }: { locale: string }) {
  const pillRef = useRef<HTMLSpanElement>(null);
  const redPathRef = useRef<SVGRectElement>(null);
  const bluePathRef = useRef<SVGRectElement>(null);
  const glowId = useId().replace(/:/g, "");

  useEffect(() => {
    const pill = pillRef.current;
    const redPath = redPathRef.current;
    const bluePath = bluePathRef.current;
    if (!pill || !redPath || !bluePath) return;

    let frame = 0;
    let start = 0;

    const draw = () => {
      const { width, height } = pill.getBoundingClientRect();
      const inset = BORDER / 2;
      const radius = Math.max(0, height / 2 - inset);

      for (const path of [redPath, bluePath]) {
        path.setAttribute("x", String(inset));
        path.setAttribute("y", String(inset));
        path.setAttribute("width", String(Math.max(0, width - BORDER)));
        path.setAttribute("height", String(Math.max(0, height - BORDER)));
        path.setAttribute("rx", String(radius));
        path.setAttribute("ry", String(radius));
      }
    };

    const animate = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = (elapsed % DURATION) / DURATION;
      const pulse = 0.5 + 0.5 * Math.sin((elapsed / 700) * Math.PI * 2);
      bluePath.style.strokeDashoffset = String(-100 * progress);
      bluePath.style.strokeWidth = String(BORDER + 0.25 + 0.35 * pulse);
      bluePath.style.opacity = String(0.82 + 0.18 * pulse);
      frame = requestAnimationFrame(animate);
    };

    const observer = new ResizeObserver(draw);
    draw();
    observer.observe(pill);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <Link
      href={`/${locale}/about`}
      className="focus-ring group absolute bottom-4 left-4 inline-flex rounded-full"
    >
      <span
        ref={pillRef}
        className="relative inline-flex items-center gap-2 rounded-full bg-black/70 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-black/60"
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.35" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect
            ref={redPathRef}
            fill="none"
            stroke="#ED2939"
            strokeOpacity=".62"
            strokeWidth={BORDER}
          />
          <rect
            ref={bluePathRef}
            fill="none"
            stroke="#0A84FF"
            strokeLinecap="round"
            strokeDasharray={`${PULSE_LENGTH} ${100 - PULSE_LENGTH}`}
            pathLength="100"
            filter={`url(#${glowId})`}
          />
        </svg>
        {labels[locale] ?? labels.en}
        <ArrowRight className="h-3.5 w-3.5 text-fred transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
