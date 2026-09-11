import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { locales } from "@/lib/i18n/config";

const routes = ["", "/services", "/about", "/privacy", "/cookies", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${site.baseUrl}/${locale}${route}`,
      lastModified: now,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${site.baseUrl}/${l}${route}`])),
      },
    }))
  );
}
