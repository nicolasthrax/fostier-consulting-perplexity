export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
};

export const ogLocales: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_HK",
};
