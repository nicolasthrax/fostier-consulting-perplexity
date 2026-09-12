"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const labels: Record<string, string> = {
  fr: "Rencontrer votre conseillère",
  en: "Meet your advisor",
  zh: "认识您的专属顾问",
};

export function AdvisorMapPill({ locale }: { locale: string }) {
  return (
    <Link
      href={`/${locale}/about`}
      className="focus-ring group absolute bottom-4 left-4 inline-flex rounded-full"
    >
      <span className="relative inline-flex items-center gap-2 rounded-full border-[1.5px] border-fred bg-black/70 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-black/60">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <filter id="advisor-blue-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect
            x="1.5"
            y="1.5"
            width="97"
            height="97"
            rx="50"
            ry="50"
            pathLength="100"
            fill="none"
            stroke="#0A84FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="9 91"
            filter="url(#advisor-blue-glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-100"
              dur="2.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.72;1;0.72"
              dur="1.1s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
        {labels[locale] ?? labels.en}
        <ArrowRight className="h-3.5 w-3.5 text-fred transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
