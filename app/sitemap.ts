import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { locales, type Locale } from "@/lib/i18n/config";
import { serviceSlugs } from "@/lib/i18n/service-slugs";

const sharedRoutes = ["", "/services", "/about", "/privacy", "/cookies", "/terms", "/legal-notice"];

/** Each route as its path per locale (service pages have localised slugs). */
const routes: Record<Locale, string>[] = [
  ...sharedRoutes.map((r) => Object.fromEntries(locales.map((l) => [l, r])) as Record<Locale, string>),
  ...serviceSlugs.map(
    (s) => Object.fromEntries(locales.map((l) => [l, `/services/${s[l]}`])) as Record<Locale, string>
  ),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${site.baseUrl}/${locale}${route[locale]}`,
      lastModified: now,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [l, `${site.baseUrl}/${l}${route[l]}`]),
          ["x-default", `${site.baseUrl}/fr${route.fr}`],
        ]),
      },
    }))
  );
}
