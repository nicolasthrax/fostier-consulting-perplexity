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
  email: "yingfo@hotmail.com",
  emailHref: "mailto:yingfo@hotmail.com",
  founder: "Lucie Xiong",
  logoPath: "/brand/FOSTIER%20consulting.png",
  ufePartnerUrl: "https://www.ufehongkong.hk/partenaires/fostier-consulting",
  /** Public marketing domain — update to the production domain before launch. */
  baseUrl: "https://www.fostierconsulting.com",
} as const;

export type Locale = "fr" | "en";

export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
