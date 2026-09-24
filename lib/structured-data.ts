import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/get-dictionary";
import { serviceSlugs } from "./i18n/service-slugs";
import { site } from "./site";

/**
 * JSON-LD for a professional financial-services business.
 * Only verifiable organisation details are included — no fabricated
 * ratings, reviews, prices, addresses or regulatory credentials.
 */

const orgId = `${site.baseUrl}/#organization`;
const languages = ["French", "English", "Chinese"];

export const serviceUrl = (locale: Locale, index: number) =>
  `${site.baseUrl}/${locale}/services/${serviceSlugs[index][locale]}`;

export function organisationJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": orgId,
    name: site.name,
    description: dict.meta.siteDescription,
    url: `${site.baseUrl}/${locale}`,
    logo: `${site.baseUrl}${site.logoPath}`,
    image: `${site.baseUrl}${site.logoPath}`,
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: "Hong Kong", addressCountry: "HK" },
    areaServed: [
      { "@type": "City", name: "Hong Kong" },
      { "@type": "City", name: "Macau" },
      { "@type": "Country", name: "China" },
    ],
    availableLanguage: languages,
    founder: { "@type": "Person", name: site.founder, jobTitle: "Founder" },
    sameAs: [site.ufePartnerUrl],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneHref.replace("tel:", ""),
      email: site.email,
      contactType: "customer service",
      availableLanguage: languages,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.services.pageTitle,
      itemListElement: dict.services.items.map((s, i) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: serviceUrl(locale, i) },
      })),
    },
  };
}

export function serviceJsonLd(locale: Locale, index: number) {
  const dict = getDictionary(locale);
  const service = dict.services.items[index];
  const url = serviceUrl(locale, index);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.title,
      description: service.short,
      url,
      serviceType: service.title,
      provider: { "@id": orgId },
      areaServed: { "@type": "City", name: "Hong Kong" },
      availableLanguage: languages,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: site.name, item: `${site.baseUrl}/${locale}` },
        { "@type": "ListItem", position: 2, name: dict.nav.services, item: `${site.baseUrl}/${locale}/services` },
        { "@type": "ListItem", position: 3, name: service.title, item: url },
      ],
    },
  ];
}
