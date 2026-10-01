"use client";

import { usePathname } from "next/navigation";
import type { CareersLocale } from "@/lib/careers/i18n";

/**
 * Links to the same page in the other language. Works from the browser's path,
 * so it follows a custom CAREERS_PORTAL_SLUG: /<base>[/fr]/rest.
 */
export function LanguageSwitch({ lang, label }: { lang: CareersLocale; label: string }) {
  const parts = (usePathname() || "/careers").split("/").filter(Boolean);
  const [base = "careers", ...rest] = parts;
  if (rest[0] === "fr" || rest[0] === "en") rest.shift();
  const target: CareersLocale = lang === "fr" ? "en" : "fr";
  const href = "/" + [base, ...(target === "fr" ? ["fr"] : []), ...rest].join("/");
  return (
    <a href={href} hrefLang={target} lang={target} className="focus-ring text-sm font-semibold text-navy link-underline">
      {label}
    </a>
  );
}
