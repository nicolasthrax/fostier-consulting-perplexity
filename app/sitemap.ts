import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { hreflangs, locales, localePath, type Locale } from "@/lib/i18n/config";
import { serviceSlugs } from "@/lib/i18n/service-slugs";
import { guidePaths, hasGuides, updatedOf, visibleGuides } from "@/lib/guides";

/**
 * Real revision dates for `lastmod`. Legal dates mirror the "Last updated" line
 * on each legal page (lib/i18n/content.ts); everything else follows site.contentUpdated.
 */
const legalUpdated: Record<string, string> = {
  "/privacy": "2026-10-01",
  "/cookies": "2026-09-30",
  "/terms": "2026-09-30",
  "/legal-notice": "2026-09-30",
};

const sharedRoutes = ["", "/services", "/about", "/privacy", "/cookies", "/terms", "/legal-notice"];

/** Each route as its path per locale (service pages have localised slugs). */
const routes: Record<Locale, string>[] = [
  ...sharedRoutes.map((r) => Object.fromEntries(locales.map((l) => [l, r])) as Record<Locale, string>),
  ...serviceSlugs.map(
    (s) => Object.fromEntries(locales.map((l) => [l, `/services/${s[l]}`])) as Record<Locale, string>
  ),
];

const entry = (locale: Locale, paths: Partial<Record<Locale, string>>, lastModified: string) => {
  const available = locales.filter((l) => paths[l] !== undefined);
  const xDefault = paths.fr !== undefined ? "fr" : available[0];
  return {
    url: `${site.baseUrl}${localePath(locale, paths[locale]!)}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries([
        ...available.map((l) => [hreflangs[l], `${site.baseUrl}${localePath(l, paths[l]!)}`]),
        ["x-default", `${site.baseUrl}${localePath(xDefault, paths[xDefault]!)}`],
      ]),
    },
  };
};

/** Guides: the index in every locale, and each guide in the languages it exists in (unlisted translations included). */
function guideEntries(): MetadataRoute.Sitemap {
  if (!hasGuides()) return [];
  const newest = visibleGuides().map((g) => g.updated).sort().at(-1)!;
  const index = Object.fromEntries(locales.map((l) => [l, "/guides"])) as Record<Locale, string>;
  return [
    ...locales.map((l) => entry(l, index, newest)),
    ...visibleGuides().flatMap((g) => {
      const paths = guidePaths(g);
      return locales.filter((l) => paths[l]).map((l) => entry(l, paths, updatedOf(g, l)));
    }),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${site.baseUrl}${localePath(locale, route[locale])}`,
      lastModified: legalUpdated[route.fr] ?? site.contentUpdated,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [hreflangs[l], `${site.baseUrl}${localePath(l, route[l])}`]),
          ["x-default", `${site.baseUrl}${localePath("fr", route.fr)}`],
        ]),
      },
    }))
  ), ...guideEntries()];
}
