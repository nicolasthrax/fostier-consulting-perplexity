import { homePath, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/get-dictionary";
import { serviceSlugs } from "./i18n/service-slugs";
import { getFounder, FOUNDER_PORTRAIT_SRC } from "./i18n/founder";
import type { FaqItem } from "./i18n/faq";
import { guidesCopy, updatedOf, type Guide } from "./guides";
import { site } from "./site";

/**
 * JSON-LD for a professional financial-services business.
 * Only verifiable organisation details are included — no fabricated
 * ratings, reviews, prices, opening hours or regulatory credentials. It is a
 * service-area business seen by appointment, so no address or geo either.
 *
 * The organisation is described once, in the site-wide graph from the layout;
 * every other node points at it by `@id`.
 */

const orgId = `${site.baseUrl}/#organization`;
const websiteId = `${site.baseUrl}/#website`;
const personId = `${site.baseUrl}/#lucie-fostier`;
const logoId = `${site.baseUrl}/#logo`;
/** Root URL with its trailing slash: the canonical form of the home page. */
const rootUrl = `${site.baseUrl}/`;
const languages = ["French", "English", "Mandarin", "Cantonese"];
/** Language codes for `knowsLanguage`: Chinese as the site's `zh-Hans` locale, plus Cantonese (`yue`). */
const languageCodes = ["fr", "en", "zh-Hans", "yue"];
/** UFE Hong Kong, the French business association the firm partners with (a separate entity). */
const ufe = { "@type": "Organization", name: "UFE Hong Kong" };
const inLanguage: Record<Locale, string> = { fr: "fr", en: "en", zh: "zh-Hans" };

const serviceUrl = (locale: Locale, index: number) =>
  `${site.baseUrl}/${locale}/services/${serviceSlugs[index][locale]}`;

/** Serialises JSON-LD for a <script> tag; escaping `<` stops copy from closing the tag early. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** Site-wide graph: the website, the business and its founder, linked by @id. */
export function organisationJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  const founder = getFounder(locale);
  const logoUrl = `${site.baseUrl}${site.logoPath}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["FinancialService", "ProfessionalService"],
        "@id": orgId,
        name: site.name,
        legalName: site.legalName,
        alternateName: site.alternateName,
        url: rootUrl,
        logo: { "@type": "ImageObject", "@id": logoId, url: logoUrl, contentUrl: logoUrl, caption: site.name },
        image: { "@id": logoId },
        description: dict.meta.siteDescription,
        foundingDate: site.foundingDate,
        founder: { "@id": personId },
        telephone: site.phoneDisplay,
        email: site.email,
        areaServed: [
          { "@type": "City", name: "Hong Kong" },
          { "@type": "City", name: "Shenzhen" },
        ],
        knowsLanguage: languageCodes,
        contactPoint: [
          {
            "@type": "ContactPoint",
            name: site.founder,
            contactType: "customer service",
            telephone: site.phoneDisplay,
            email: site.email,
            url: `https://wa.me/${site.whatsappNumber}`,
            areaServed: ["HK", "CN"],
            availableLanguage: languages,
          },
          // Backup contact for when the founder is unavailable.
          {
            "@type": "ContactPoint",
            name: site.backupContact.name,
            email: site.backupContact.email,
            contactType: "customer service",
          },
        ],
        identifier: { "@type": "PropertyValue", propertyID: "Hong Kong Business Registration Number", value: site.brn },
        // UFE is a separate organisation, so it is a membership rather than a sameAs.
        memberOf: ufe,
        sameAs: [site.linkedinUrl, site.googleBusinessUrl],
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
        "@type": "WebSite",
        "@id": websiteId,
        url: rootUrl,
        name: site.name,
        alternateName: site.alternateName,
        inLanguage: ["fr", "en", "zh-Hans"],
        publisher: { "@id": orgId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: founder.name,
        jobTitle: founder.role,
        url: `${site.baseUrl}/${locale}/about#advisor`,
        image: `${site.baseUrl}${encodeURI(FOUNDER_PORTRAIT_SRC)}`,
        worksFor: { "@id": orgId },
        alumniOf: founder.education.map((ed) => ({ "@type": "EducationalOrganization", name: ed.school })),
        knowsLanguage: languages,
        subjectOf: {
          "@type": "Article",
          headline: founder.press.title.replace(/^[«“「]\s*|\s*[»”」]$/g, ""),
          url: founder.press.url,
          publisher: ufe,
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
        { "@type": "ListItem", position: 1, name: site.name, item: `${site.baseUrl}${homePath(locale)}` },
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
      dateModified: updatedOf(guide, locale),
      ...(guide.tags?.length ? { keywords: guide.tags.join(", ") } : {}),
      author: { "@id": personId },
      publisher: { "@id": orgId },
      isPartOf: { "@id": websiteId },
      image: `${site.baseUrl}/${locale}/opengraph-image`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: site.name, item: `${site.baseUrl}${homePath(locale)}` },
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
