import type { Locale } from "./config";

const updatedLabel: Record<Locale, string> = {
  fr: "Mis à jour le",
  en: "Updated",
  zh: "更新于",
};

const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB", zh: "zh-CN" };

/** "Updated 27 September 2026" in the page's language, from an ISO date. */
export function formatUpdated(locale: Locale, iso: string): string {
  const date = new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
  return `${updatedLabel[locale]} ${date}`;
}
