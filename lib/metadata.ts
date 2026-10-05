import type { Metadata } from "next";
import { site } from "./site";
import { hreflangs, ogLocales, locales, localePath, type Locale } from "./i18n/config";

/**
 * Appends " | Fostier Consulting" unless the title already starts with the brand (the
 * home page) or ends with a brand suffix (e.g. " | Fostier" or " | Fostier Consulting
 * Hong Kong"), so the brand is never doubled.
 */
export const withBrand = (title: string) =>
  title.startsWith(site.name) || /\|\s*Fostier\b[^|]*$/.test(title) ? title : `${title} | ${site.name}`;

/**
 * Builds canonical + hreflang alternates and OG metadata for a route.
 * `path` is either shared by every locale or given per locale; a page that only
 * exists in some locales (e.g. an untranslated guide) passes just those.
 */
export function localizedMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
}: {
  locale: Locale;
  path: string | Partial<Record<Locale, string>>;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const pathFor = (l: Locale) => (typeof path === "string" ? path : path[l]);
  const available = locales.filter((l) => pathFor(l) !== undefined);
  const canonical = `${site.baseUrl}${localePath(locale, pathFor(locale) ?? "")}`;
  const defaultLocale = available.includes("fr") ? "fr" : locale;
  const languages = Object.fromEntries([
    ...available.map((l) => [hreflangs[l], `${site.baseUrl}${localePath(l, pathFor(l)!)}`]),
    ["x-default", `${site.baseUrl}${localePath(defaultLocale, pathFor(defaultLocale) ?? "")}`],
  ]);

  const fullTitle = withBrand(title);
  // Pages that set `openGraph` drop the file-based image, so reference it explicitly.
  const images = [{ url: `${site.baseUrl}/${locale}/opengraph-image`, width: 1200, height: 630, alt: site.name }];
  // With a metadataBase, Next prints the site root as "https://…com" (no slash), unlike
  // the sitemap. Pages that link the root (the home pages) drop it, so every URL
  // returned here must stay absolute.
  const linksRoot = Object.values(languages).includes(`${site.baseUrl}/`);

  return {
    ...(linksRoot && { metadataBase: null }),
    title: { absolute: fullTitle },
    description,
    alternates: { canonical, languages },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: site.name,
      locale: ogLocales[locale],
      type,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
