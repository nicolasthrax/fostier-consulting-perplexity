"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { careersCopy, type CareersLocale } from "@/lib/careers/i18n";

/**
 * A not-found page gets no params, so the language comes from the path: English when
 * "en" follows the portal base (/careers/en/…, /<slug>/en/…, or the internal /careers/en/…).
 */
export function CareersNotFound({ listings }: { listings: Record<CareersLocale, string> }) {
  const lang = (usePathname() ?? "").split("/")[2] === "en" ? "en" : "fr";
  const t = careersCopy[lang];
  return (
    <div className="container-site py-16 sm:py-24">
      <div className="mx-auto max-w-2xl space-y-5">
        <h1 className="h-serif text-4xl leading-[1.05] sm:text-5xl">{t.notFound.title}</h1>
        <p className="text-[17px] leading-[1.7] text-slate sm:text-lg">{t.notFound.body}</p>
        <Link href={listings[lang]} className="focus-ring inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="link-underline">{t.job.back}</span>
        </Link>
      </div>
    </div>
  );
}
