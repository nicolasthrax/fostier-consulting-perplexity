import type { Locale } from "./config";

/**
 * Contact page copy, keyed by locale. Phone numbers and addresses come from
 * `site` (lib/site.ts); only the wording lives here. There is deliberately no
 * street address: meetings are by appointment, in person or online.
 */

/** Header and footer link label. Kept separate so the client header only pulls in this record. */
export const contactNav: Record<Locale, string> = {
  fr: "Contact",
  en: "Contact",
  zh: "联系我们",
};

export const contactCopy: Record<
  Locale,
  {
    title: string;
    lead: string;
    reachTitle: string;
    phone: string;
    whatsapp: string;
    primaryEmail: string;
    backupEmail: string;
    backupNote: string;
    practicalTitle: string;
    areaLabel: string;
    area: string;
    languagesLabel: string;
    languages: string;
    appointmentsLabel: string;
    appointments: string;
  }
> = {
  fr: {
    title: "Contacter Fostier Consulting",
    lead: "Fostier Consulting accompagne les expatriés francophones à Hong Kong pour leur patrimoine, leur fiscalité, leur épargne, leur retraite, leurs assurances et leurs démarches bancaires. Écrivez-nous sur WhatsApp, appelez-nous ou envoyez un e-mail : nous revenons vers vous pour convenir d'un rendez-vous, en personne ou en ligne.",
    reachTitle: "Nous joindre",
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    primaryEmail: "E-mail principal",
    backupEmail: "E-mail de secours",
    backupNote: "si Lucie est indisponible",
    practicalTitle: "Informations pratiques",
    areaLabel: "Zone d'intervention",
    area: "Hong Kong et Shenzhen",
    languagesLabel: "Langues",
    languages: "Français, anglais, mandarin et cantonais",
    appointmentsLabel: "Rendez-vous",
    appointments: "Uniquement sur rendez-vous — rendez-vous en ligne possibles.",
  },
  en: {
    title: "Contact Fostier Consulting",
    lead: "Fostier Consulting helps French-speaking expats in Hong Kong with wealth and financial planning, tax, savings, retirement, insurance and banking. Send us a WhatsApp message, call or email, and we will get back to you to arrange an appointment, in person or online.",
    reachTitle: "Get in touch",
    phone: "Phone",
    whatsapp: "WhatsApp",
    primaryEmail: "Primary email",
    backupEmail: "Backup email",
    backupNote: "if Lucie is unavailable",
    practicalTitle: "Practical details",
    areaLabel: "Service area",
    area: "Hong Kong and Shenzhen",
    languagesLabel: "Languages",
    languages: "French, English, Mandarin and Cantonese",
    appointmentsLabel: "Appointments",
    appointments: "By appointment only — online appointments available.",
  },
  zh: {
    title: "联系 Fostier Consulting",
    lead: "Fostier Consulting 为在香港的法语外籍人士提供财富与财务规划、税务、储蓄、退休、保险及银行事务方面的指导。欢迎通过 WhatsApp、电话或电邮与我们联系，我们会回复您并安排线下或线上会面。",
    reachTitle: "联系方式",
    phone: "电话",
    whatsapp: "WhatsApp",
    primaryEmail: "主要电邮",
    backupEmail: "备用电邮",
    backupNote: "Lucie 不便时联系",
    practicalTitle: "实用信息",
    areaLabel: "服务地区",
    area: "香港及深圳",
    languagesLabel: "服务语言",
    languages: "法语、英语、普通话及粤语",
    appointmentsLabel: "会面方式",
    appointments: "仅限预约，亦可安排线上会面。",
  },
};
