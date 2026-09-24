import type { Metadata } from "next";
import { site } from "./site";
import { ogLocales, locales, type Locale } from "./i18n/config";

/**
 * Builds canonical + hreflang alternates and OG metadata for a route.
 * `path` is either shared by every locale or, for localised slugs, given per locale.
 */
export function localizedMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string | Record<Locale, string>;
  title: string;
  description: string;
}): Metadata {
  const pathFor = (l: Locale) => (typeof path === "string" ? path : path[l]);
  const canonical = `${site.baseUrl}/${locale}${pathFor(locale)}`;
  const languages = Object.fromEntries([
    ...locales.map((l) => [l, `${site.baseUrl}/${l}${pathFor(l)}`]),
    ["x-default", `${site.baseUrl}/fr${pathFor("fr")}`],
  ]);

  const fullTitle = `${title} | ${site.name}`;
  // Pages that set `openGraph` drop the file-based image, so reference it explicitly.
  const images = [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: site.name }];

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
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
