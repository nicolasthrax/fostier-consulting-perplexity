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
