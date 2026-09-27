export const locales = ["fr", "en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  zh: "中文",
};

/** hreflang / BCP 47 codes. URLs keep the short /zh prefix; the content is Simplified Chinese. */
export const hreflangs: Record<Locale, string> = {
  fr: "fr",
  en: "en",
  zh: "zh-Hans",
};

export const ogLocales: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_HK",
  zh: "zh_CN",
};
