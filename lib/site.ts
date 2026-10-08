/**
 * Single source of truth for verifiable business facts.
 * Update these values once and every CTA, footer, schema and page updates.
 */

export const site = {
  name: "Fostier Consulting",
  /** Registered company name, as on the Hong Kong Business Registration certificate. */
  legalName: "FOSTIER CONSULTING LIMITED",
  /** Short form clients use; schema `alternateName` on the organisation and website. */
  alternateName: "FC",
  city: "Hong Kong",
  phoneDisplay: "+852 6537 4439",
  phoneHref: "tel:+85265374439",
  /** WhatsApp Business line, separate from the Hong Kong voice-call number above. */
  whatsappDisplay: "+86 198 7587 8198",
  /** Digits only, as wa.me expects: country code, no plus sign or spaces. */
  whatsappNumber: "8619875878198",
  email: "lucie@fostierconsulting.com",
  emailHref: "mailto:lucie@fostierconsulting.com",
  founder: "Lucie Fostier",
  /** Second point of contact for when the founder is unavailable. */
  backupContact: {
    name: "Nicolas Fostier",
    email: "nicolas@fostierconsulting.com",
    emailHref: "mailto:nicolas@fostierconsulting.com",
  },
  logoPath: "/brand/fostier-consulting-logo.png",
  district: "West Kowloon",
  foundingYear: "2015",
  /** Founding month, ISO 8601 (year-month), for schema `foundingDate`. */
  foundingDate: "2015-05",
  /** Hong Kong Business Registration number. */
  brn: "38375423",
  linkedinUrl: "https://www.linkedin.com/company/fostierconsulting",
  /**
   * Google Business Profile, as a coordinate-free CID link (place ID 0x3316948d47b1f653).
   * It is a service-area profile: no street address or map pin is published, and the
   * old /maps/place URL carried a pin in the New Territories rather than West Kowloon.
   */
  googleBusinessUrl: "https://maps.google.com/?cid=3681293079936104019",
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
