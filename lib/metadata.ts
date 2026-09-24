import type { Metadata } from "next";
import { site } from "./site";
import { ogLocales, locales, type Locale } from "./i18n/config";

/** Builds canonical + hreflang alternates and OG metadata for a route. */
export function localizedMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const canonical = `${site.baseUrl}/${locale}${path}`;
  const languages = Object.fromEntries([
    ...locales.map((l) => [l, `${site.baseUrl}/${l}${path}`]),
    ["x-default", `${site.baseUrl}/fr${path}`],
  ]);

  const fullTitle = `${title} | ${site.name}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical, languages },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: site.name,
      locale: ogLocales[locale],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
