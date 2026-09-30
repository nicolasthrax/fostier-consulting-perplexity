import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * AI crawlers are named explicitly so their access is a stated choice, not an
 * accident of the wildcard. A crawler follows only the most specific group that
 * matches it, so every group repeats the same disallow list. None of these paths
 * exist today; they are reserved so a future admin or private API stays unindexed.
 */
const disallow = ["/admin", "/api/private", "/dashboard"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/", disallow },
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: `${site.baseUrl}/sitemap.xml`,
  };
}
