import type { Locale } from "./i18n/config";
import { site } from "./site";

/**
 * JSON-LD for a professional financial-services business.
 * Only verifiable organisation details are included — no fabricated
 * ratings, reviews, prices, addresses or regulatory credentials.
 */
export function organisationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    telephone: site.phoneDisplay,
    url: `${site.baseUrl}/${locale}`,
    areaServed: { "@type": "Place", name: "Hong Kong" },
    availableLanguage: ["French", "English"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneDisplay,
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
  };
}
