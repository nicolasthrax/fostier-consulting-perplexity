import type { Locale } from "./config";

/**
 * Risk warning shown in the global footer and on every service page.
 * General wording only: it makes no claim about licences or regulators.
 */
export const riskWarning: Record<Locale, { title: string; body: string }> = {
  fr: {
    title: "Avertissement sur les risques",
    body: "Tout investissement comporte des risques et vous pouvez perdre tout ou partie de votre capital. Les performances passées ne préjugent pas des performances futures. Les informations de ce site sont d'ordre général et ne constituent pas un conseil personnalisé. Avant toute décision, sollicitez un conseil fiscal et juridique indépendant, notamment sur votre résidence fiscale française.",
  },
  en: {
    title: "Risk warning",
    body: "Investments carry risk, and you may lose some or all of your capital. Past performance is no guide to future results. The information on this website is general and is not personalised advice. Before you act, seek independent tax and legal advice, including on your French tax residency.",
  },
  zh: {
    title: "风险提示",
    body: "投资涉及风险，您可能损失部分或全部本金。过往业绩不代表未来表现。本网站信息仅为一般性资料，不构成个性化建议。在作出任何决定之前，请就税务和法律事项（包括您在法国的税务居民身份）咨询独立专业人士。",
  },
};

/** Backup contact and UFE partnership: the trust block on the About page and the compact lines elsewhere. */
export const trustCopy: Record<
  Locale,
  {
    title: string;
    backupTitle: string;
    backupBody: string;
    backupShort: string;
    partnerTitle: string;
    partnerBody: string;
    partnerLink: string;
  }
> = {
  fr: {
    title: "Contacts et partenaire",
    backupTitle: "Contact de secours",
    backupBody: "Si Lucie est indisponible, écrivez à Nicolas Fostier : il prendra le relais de votre demande.",
    backupShort: "Si Lucie est indisponible :",
    partnerTitle: "Partenariat UFE Hong Kong",
    partnerBody: "Fostier Consulting est partenaire de l'UFE Hong Kong (Union des Français de l'Étranger). Retrouvez notre fiche sur le site de l'association.",
    partnerLink: "Voir notre fiche partenaire sur ufehongkong.hk",
  },
  en: {
    title: "Contacts and partner",
    backupTitle: "Backup contact",
    backupBody: "If Lucie is unavailable, write to Nicolas Fostier, who will pick up your request.",
    backupShort: "If Lucie is unavailable:",
    partnerTitle: "UFE Hong Kong partnership",
    partnerBody: "Fostier Consulting is a partner of UFE Hong Kong (Union des Français de l'Étranger). Our listing is on the association's website.",
    partnerLink: "See our partner listing on ufehongkong.hk",
  },
  zh: {
    title: "联系人与合作伙伴",
    backupTitle: "备用联系人",
    backupBody: "如 Lucie 暂时无法回复，请联系 Nicolas Fostier，他将接手处理您的咨询。",
    backupShort: "如 Lucie 暂时无法回复：",
    partnerTitle: "UFE 香港合作关系",
    partnerBody: "Fostier Consulting 是 UFE Hong Kong（法国海外侨民协会香港分会）的合作伙伴，我们的合作伙伴页面可在该协会网站查看。",
    partnerLink: "在 ufehongkong.hk 查看我们的合作伙伴页面",
  },
};
