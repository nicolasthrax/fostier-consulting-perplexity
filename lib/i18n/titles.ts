import type { Locale } from "./config";

/**
 * Page-specific <title> topics. `withBrand` (lib/metadata.ts) appends " | Fostier Consulting"
 * unless the entry already ends with a brand suffix (" | Fostier…"), which is how a
 * title can use the shorter " | Fostier" or the longer " | Fostier Consulting Hong Kong",
 * or starts with the brand (the home page).
 * Each inner-page topic mirrors the page's <h1>, front-loads its keyword, and keeps the
 * full title between 50 and 60 characters (FR/EN). Chinese titles are kept to a similar
 * rendered width (~35–40 characters) since CJK glyphs are roughly twice as wide.
 *
 * The home title is brand-first ("Fostier Consulting | …", given in full) so the
 * homepage, not /about, ranks for the brand; it runs past 60 characters in FR/EN by
 * choice. Home, services, About and the service pages pair the brand with "Hong Kong"/"HK":
 * search engines otherwise fold "Fostier" into "Foster" (visibility audit, Sept 2026).
 */
export const pageTitles: Record<
  Locale,
  {
    home: string;
    services: string;
    about: string;
    notice: string;
    privacy: string;
    terms: string;
    cookies: string;
    notFound: string;
    /** Deliberately short ("Contact | Fostier Consulting"): the brand is the query for this page. */
    contact: string;
  }
> = {
  fr: {
    home: "Fostier Consulting | Conseil patrimonial des Français de Hong Kong",
    services: "Patrimoine, impôts et Chine à Hong Kong",
    about: "Lucie Fostier, fondatrice | Fostier Consulting Hong Kong",
    notice: "Mentions légales et éditeur du site",
    privacy: "Politique de confidentialité du site",
    terms: "Conditions d'utilisation du site",
    cookies: "Politique relative aux cookies",
    notFound: "Erreur 404 : contenu introuvable",
    contact: "Contact",
  },
  en: {
    home: "Fostier Consulting | Wealth & Tax Advice for French Expats in Hong Kong",
    services: "Wealth, tax and China services in HK",
    about: "Lucie Fostier, founder | Fostier Consulting Hong Kong",
    notice: "Legal notice and site publisher",
    privacy: "Privacy policy and your data rights",
    terms: "Terms of use and advice disclaimer",
    cookies: "Cookie policy and consent management",
    notFound: "Error 404: the content was not found",
    contact: "Contact",
  },
  zh: {
    home: "Fostier Consulting | 香港法国人财富与税务咨询",
    services: "香港财富、税务、保险与中法商务服务",
    about: "创始人 Lucie Fostier | Fostier Consulting Hong Kong",
    notice: "法律声明与网站发布者信息",
    privacy: "隐私政策与个人资料使用说明",
    terms: "使用条款：本网站的使用规则",
    cookies: "Cookie 政策与同意管理说明",
    notFound: "错误 404：未找到您要访问的内容",
    contact: "联系我们",
  },
};

export const getPageTitles = (locale: Locale) => pageTitles[locale] ?? pageTitles.fr;

/**
 * <title> topics for the service pages, in `services.items` order. Same rules as
 * above: keyword first, "Hong Kong" in every title, full title (with its brand suffix)
 * at 60 characters or fewer.
 */
export const serviceTitles: Record<Locale, string[]> = {
  fr: [
    "Investissement et portefeuille à HK",
    "Déclaration d'impôts à Hong Kong en français | Fostier",
    "Épargne et banque à Hong Kong",
    "Assurance santé pour Français à Hong Kong | Fostier",
    "Interprète français–chinois à Hong Kong",
    "Fournisseurs en Chine, depuis Hong Kong",
    "Partenaire français en Chine, depuis HK",
  ],
  en: [
    "Investment and portfolio planning, HK",
    "Hong Kong tax return help, in French",
    "Savings and banking in Hong Kong",
    "Health insurance for French expats in HK | Fostier",
    "French–Chinese interpreter, Hong Kong",
    "China supplier sourcing from Hong Kong",
    "French partner for China, based in HK",
  ],
  zh: [
    "香港投资与资产组合规划",
    "香港个人税务申报与准备",
    "香港储蓄账户与银行开户",
    "香港健康保险与人寿保险",
    "香港法语、普通话及粤语口译服务",
    "立足香港的中国供应商寻源",
    "立足香港：法国创业者的中国商务伙伴",
  ],
};
