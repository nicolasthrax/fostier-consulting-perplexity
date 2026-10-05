export const locales = ["fr", "en", "zh"] as const;
export type Locale = (typeof locales)[number];

/**
 * Home page path per locale. The French home is served at the domain root, so
 * Google reads the site name (WebSite structured data) from "/" itself.
 */
export const homePath = (locale: Locale) => (locale === "fr" ? "/" : `/${locale}`);

/** Path of `path` (e.g. "/about", or "" for the home page) in `locale`. */
export const localePath = (locale: Locale, path: string) => (path ? `/${locale}${path}` : homePath(locale));

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
