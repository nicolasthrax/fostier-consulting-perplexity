import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { hreflangs, locales, type Locale } from "@/lib/i18n/config";
import { serviceSlugs } from "@/lib/i18n/service-slugs";

/**
 * Real revision dates for `lastmod`. Legal dates mirror the "Last updated" line
 * on each legal page (lib/i18n/content.ts); everything else follows site.contentUpdated.
 */
const legalUpdated: Record<string, string> = {
  "/privacy": "2026-09-24",
  "/cookies": "2026-09-11",
  "/terms": "2026-09-24",
  "/legal-notice": "2026-09-27",
};

const sharedRoutes = ["", "/services", "/about", "/privacy", "/cookies", "/terms", "/legal-notice"];

/** Each route as its path per locale (service pages have localised slugs). */
const routes: Record<Locale, string>[] = [
  ...sharedRoutes.map((r) => Object.fromEntries(locales.map((l) => [l, r])) as Record<Locale, string>),
  ...serviceSlugs.map(
    (s) => Object.fromEntries(locales.map((l) => [l, `/services/${s[l]}`])) as Record<Locale, string>
  ),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${site.baseUrl}/${locale}${route[locale]}`,
      lastModified: legalUpdated[route.fr] ?? site.contentUpdated,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [hreflangs[l], `${site.baseUrl}/${l}${route[l]}`]),
          ["x-default", `${site.baseUrl}/fr${route.fr}`],
        ]),
      },
    }))
  );
}
