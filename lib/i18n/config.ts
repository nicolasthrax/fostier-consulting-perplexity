export const locales = ["fr", "en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  zh: "中文",
};

export const ogLocales: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_HK",
  zh: "zh_CN",
};
