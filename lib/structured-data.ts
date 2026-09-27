import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/get-dictionary";
import { serviceSlugs } from "./i18n/service-slugs";
import { getFounder, FOUNDER_PORTRAIT_SRC } from "./i18n/founder";
import type { FaqItem } from "./i18n/faq";
import { guidesCopy, type Guide } from "./guides";
import { site } from "./site";

/**
 * JSON-LD for a professional financial-services business.
 * Only verifiable organisation details are included — no fabricated
 * ratings, reviews, prices, addresses or regulatory credentials.
 */

const orgId = `${site.baseUrl}/#organization`;
const websiteId = `${site.baseUrl}/#website`;
const personId = `${site.baseUrl}/#lucie-fostier`;
const languages = ["French", "English", "Mandarin", "Cantonese"];
const inLanguage: Record<Locale, string> = { fr: "fr", en: "en", zh: "zh-Hans" };

const serviceUrl = (locale: Locale, index: number) =>
  `${site.baseUrl}/${locale}/services/${serviceSlugs[index][locale]}`;

/** Site-wide graph: the website, the business and its founder, linked by @id. */
export function organisationJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  const founder = getFounder(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.baseUrl,
        name: site.name,
        publisher: { "@id": orgId },
        inLanguage: ["fr", "en", "zh-Hans"],
      },
      {
        "@type": "FinancialService",
        "@id": orgId,
        name: site.name,
        description: dict.meta.siteDescription,
        url: `${site.baseUrl}/${locale}`,
        logo: `${site.baseUrl}${site.logoPath}`,
        image: `${site.baseUrl}${site.logoPath}`,
        telephone: site.phoneHref.replace("tel:", ""),
        email: site.email,
        foundingDate: site.foundingYear,
        identifier: { "@type": "PropertyValue", propertyID: "Hong Kong Business Registration Number", value: site.brn },
        // Service-area business: district only, matching the Google Business Profile.
        address: { "@type": "PostalAddress", addressLocality: site.district, addressRegion: "Hong Kong", addressCountry: "HK" },
        hasMap: site.googleBusinessUrl,
        areaServed: [
          { "@type": "City", name: "Hong Kong" },
          { "@type": "City", name: "Macau" },
          { "@type": "Country", name: "China" },
        ],
        availableLanguage: languages,
        founder: { "@id": personId },
        sameAs: [site.linkedinUrl, site.googleBusinessUrl, site.ufePartnerUrl],
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
      },
      {
        "@type": "Person",
        "@id": personId,
        name: founder.name,
        jobTitle: founder.role,
        url: `${site.baseUrl}/${locale}/about#advisor`,
        image: `${site.baseUrl}${encodeURI(FOUNDER_PORTRAIT_SRC)}`,
        worksFor: { "@id": orgId },
        workLocation: { "@type": "Place", name: `${site.district}, Hong Kong` },
        alumniOf: founder.education.map((ed) => ({ "@type": "EducationalOrganization", name: ed.school })),
        knowsLanguage: languages,
        subjectOf: {
          "@type": "Article",
          headline: founder.press.title.replace(/^[«“「]\s*|\s*[»”」]$/g, ""),
          url: founder.press.url,
          publisher: { "@type": "Organization", name: "UFE Hong Kong" },
        },
      },
    ],
  };
}

/** About page: marks it as the founder's profile page. */
export function aboutJsonLd(locale: Locale) {
  const url = `${site.baseUrl}/${locale}/about`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": url,
    url,
    inLanguage: inLanguage[locale],
    isPartOf: { "@id": websiteId },
    mainEntity: { "@id": personId },
    dateModified: site.contentUpdated,
  };
}

export function serviceJsonLd(locale: Locale, index: number) {
  const dict = getDictionary(locale);
  const service = dict.services.items[index];
  const url = serviceUrl(locale, index);
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: service.title,
      inLanguage: inLanguage[locale],
      isPartOf: { "@id": websiteId },
      about: { "@id": `${url}#service` },
      dateModified: site.contentUpdated,
    },
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

/** Guide article: authored by the founder, published by the business. */
export function guideJsonLd(locale: Locale, guide: Guide) {
  const tr = guide.translations[locale]!;
  const url = `${site.baseUrl}/${locale}/guides/${tr.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: tr.title,
      description: tr.description,
      url,
      mainEntityOfPage: url,
      inLanguage: inLanguage[locale],
      datePublished: guide.published,
      dateModified: guide.updated,
      author: { "@id": personId },
      publisher: { "@id": orgId },
      isPartOf: { "@id": websiteId },
      image: `${site.baseUrl}/${locale}/opengraph-image`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: site.name, item: `${site.baseUrl}/${locale}` },
        { "@type": "ListItem", position: 2, name: guidesCopy[locale].title, item: `${site.baseUrl}/${locale}/guides` },
        { "@type": "ListItem", position: 3, name: tr.title, item: url },
      ],
    },
  ];
}

/** FAQPage for a visible FAQ block — the questions and answers must match the page. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
