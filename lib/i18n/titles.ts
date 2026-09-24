import type { Locale } from "./config";

/**
 * Page-specific <title> topics. The layout template appends " | Fostier Consulting".
 * Each topic mirrors the page's <h1>, front-loads its keyword, and keeps the full
 * title between 50 and 60 characters (FR/EN). Chinese titles are kept to a similar
 * rendered width (~35–40 characters) since CJK glyphs are roughly twice as wide.
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
  }
> = {
  fr: {
    home: "Patrimoine international à Hong Kong",
    services: "Services : patrimoine, impôts, Chine",
    about: "Relation de conseil France–Hong Kong",
    notice: "Mentions légales et éditeur du site",
    privacy: "Politique de confidentialité du site",
    terms: "Conditions d'utilisation du site",
    cookies: "Politique relative aux cookies",
    notFound: "Erreur 404 : contenu introuvable",
  },
  en: {
    home: "International wealth advice, Hong Kong",
    services: "Services: wealth, tax, China trade",
    about: "France–Hong Kong advisory relationship",
    notice: "Legal notice and site publisher",
    privacy: "Privacy policy and your data rights",
    terms: "Terms of use and advice disclaimer",
    cookies: "Cookie policy and consent management",
    notFound: "Error 404: the content was not found",
  },
  zh: {
    home: "香港国际化财富规划与法语财务咨询",
    services: "服务：财富规划、税务、保险与中法商务",
    about: "联结法国与香港的财务顾问关系",
    notice: "法律声明与网站发布者信息",
    privacy: "隐私政策与个人资料使用说明",
    terms: "使用条款：本网站的使用规则",
    cookies: "Cookie 政策与同意管理说明",
    notFound: "错误 404：未找到您要访问的内容",
  },
};

export const getPageTitles = (locale: Locale) => pageTitles[locale] ?? pageTitles.fr;

/**
 * <title> topics for the service pages, in `services.items` order. Same rules as
 * above: keyword first, full title (with " | Fostier Consulting") at 60 characters or fewer.
 */
export const serviceTitles: Record<Locale, string[]> = {
  fr: [
    "Conseil en investissement à Hong Kong",
    "Déclaration fiscale à Hong Kong",
    "Épargne et banque à Hong Kong",
    "Assurance santé et vie à Hong Kong",
    "Interprétariat français–chinois",
    "Recherche de fournisseurs en Chine",
    "Partenaire français pour la Chine",
  ],
  en: [
    "Investment advice in Hong Kong",
    "Hong Kong tax return preparation",
    "Savings and banking in Hong Kong",
    "Health and life insurance, Hong Kong",
    "French–Chinese interpreter, Hong Kong",
    "Supplier sourcing in mainland China",
    "French partner for business in China",
  ],
  zh: [
    "香港投资咨询与资产组合规划",
    "香港个人税务申报与准备",
    "香港储蓄账户与银行开户",
    "香港健康保险与人寿保险",
    "法语、普通话及粤语口译服务",
    "中国供应商寻源",
    "助力中国商品进入法国市场",
  ],
};
