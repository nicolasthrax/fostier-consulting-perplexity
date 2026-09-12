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
      className="focus-ring group absolute bottom-4 left-4 block rounded-full"
    >
      <span className="relative block overflow-hidden rounded-full bg-fred p-[1.5px]">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-[spin_2.8s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg 292deg, #0A84FF 304deg 330deg, transparent 342deg 360deg)",
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-[1.5px] rounded-full bg-black/70"
        />
        <span className="relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors group-hover:bg-white/[0.04]">
          {labels[locale] ?? labels.en}
          <ArrowRight className="h-3.5 w-3.5 text-fred transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
