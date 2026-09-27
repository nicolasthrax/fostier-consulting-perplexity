/**
 * Single source of truth for verifiable business facts.
 * Update these values once and every CTA, footer, schema and page updates.
 */

export const site = {
  name: "Fostier Consulting",
  city: "Hong Kong",
  phoneDisplay: "+852 6537 4439",
  phoneHref: "tel:+85265374439",
  whatsappNumber: "85265374439",
  email: "lucie@fostierconsulting.com",
  emailHref: "mailto:lucie@fostierconsulting.com",
  founder: "Lucie Fostier",
  logoPath: "/brand/fostier-consulting-logo.png",
  district: "Central",
  foundingYear: "2015",
  /** Hong Kong Business Registration number. */
  brn: "38375423",
  linkedinUrl: "https://www.linkedin.com/company/fostierconsulting",
  /** Google Business Profile (tracking parameters removed). It is a service-area profile, so no street address or coordinates are published. */
  googleBusinessUrl:
    "https://www.google.com/maps/place/Fostier+Consulting/@22.3527242,114.1394,11z/data=!3m1!4b1!4m6!3m5!1s0x8471bfe9babca44b:0x3316948d47b1f653!8m2!3d22.3527242!4d114.1394!16s%2Fg%2F11w3g_crxl",
  ufePartnerUrl: "https://www.ufehongkong.hk/partenaires/fostier-consulting",
  ufeArticleUrl: "https://www.ufehongkong.hk/actualite/les-secrets-du-nouvel-an-chinois-avec-lucie",
  /** Public marketing domain. */
  baseUrl: "https://www.fostierconsulting.com",
  /**
   * Last content revision of the service and About pages (ISO date). Shown under
   * their titles and used for `dateModified` and the sitemap — bump it when that copy changes.
   */
  contentUpdated: "2026-09-27",
} as const;

export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
