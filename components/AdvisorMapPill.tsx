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
      className="focus-ring group absolute bottom-4 left-4 block overflow-hidden rounded-full p-[1.5px]"
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 animate-spin [animation-duration:3.5s]"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0 72%, rgba(237,41,57,.9) 88%, rgba(10,132,255,.9) 96%, transparent 100%)",
        }}
      />
      <span className="relative inline-flex items-center gap-2 rounded-full bg-black/70 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-black/60">
        {labels[locale] ?? labels.en}
        <ArrowRight className="h-3.5 w-3.5 text-fred transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
