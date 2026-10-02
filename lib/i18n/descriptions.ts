import type { Locale } from "./config";

/**
 * Meta descriptions, one per page and locale. Each is unique and says what the
 * page covers, who it is for and where. FR/EN stay between 120 and 155 characters;
 * Chinese stays around 50–80 characters, which renders at a similar width.
 */
export const pageDescriptions: Record<
  Locale,
  { home: string; services: string; about: string; privacy: string; cookies: string; terms: string; notice: string }
> = {
  fr: {
    home: "Conseil en patrimoine, fiscalité, épargne et assurance à Hong Kong, en français, pour les résidents français en Asie. Par Lucie Fostier, fondatrice.",
    services: "Sept services à Hong Kong pour les résidents français : investissement, déclaration fiscale, épargne, assurance, interprétariat et projets France–Chine.",
    about: "Lucie Fostier, fondatrice de Fostier Consulting à Hong Kong : ex-AIA et HSBC, diplômée de l'Université Fudan, formée à l'ESG Paris. Parcours et presse.",
    privacy: "Comment Fostier Consulting traite les données partagées par e-mail, WhatsApp, WeChat ou téléphone, et vos droits au titre de la PDPO et du RGPD.",
    cookies: "Le site Fostier Consulting n'utilise que des cookies techniques strictement nécessaires : aucun cookie publicitaire, analytique ou de réseau social.",
    terms: "Conditions d'utilisation du site Fostier Consulting : information générale, pas de conseil personnalisé, statut réglementaire, risques et droit applicable.",
    notice: "Mentions légales de Fostier Consulting : éditeur établi à Central, Hong Kong (BR 38375423), directrice de la publication Lucie Fostier.",
  },
  en: {
    home: "Wealth, tax, savings and insurance advice in Hong Kong, in French, for French residents in Asia. Personal support from founder Lucie Fostier.",
    services: "Seven services in Hong Kong for French residents: investment, tax returns, savings, insurance, interpreting, China sourcing and France–China projects.",
    about: "Meet Lucie Fostier, founder of Fostier Consulting in Hong Kong: formerly at AIA and HSBC, a Fudan University graduate, educated at ESG Paris.",
    privacy: "How Fostier Consulting handles what you share by email, WhatsApp, WeChat or phone, and your rights under Hong Kong's PDPO and the EU GDPR.",
    cookies: "The Fostier Consulting website uses only strictly necessary technical cookies: no advertising, analytics or social-media cookies are set.",
    terms: "Terms of use for the Fostier Consulting website: general information only, no personalised advice, regulatory status, investment risk, governing law.",
    notice: "Legal notice for Fostier Consulting: publisher in Central, Hong Kong (Business Registration No. 38375423), publication director Lucie Fostier.",
  },
  zh: {
    home: "Fostier Consulting 立足香港，为在亚洲的法国居民提供法语财富规划、税务、储蓄与保险咨询，由创始人 Lucie Fostier 亲自服务。",
    services: "Fostier Consulting 的七项服务：投资规划、香港报税、储蓄开户、保险、法中口译、中国供应商寻源，以及法国创业者的对华商务对接。",
    about: "认识 Fostier Consulting 创始人 Lucie Fostier：曾任职友邦保险（AIA）与汇丰银行，毕业于复旦大学，曾就读巴黎 ESG 商学院。",
    privacy: "Fostier Consulting 如何处理您通过电邮、WhatsApp、微信或电话提供的个人资料，以及您在香港《个人资料（私隐）条例》及欧盟 GDPR 下的权利。",
    cookies: "Fostier Consulting 网站仅使用运行所必需的技术性 Cookie，不设置任何广告、分析或社交媒体 Cookie。",
    terms: "Fostier Consulting 网站使用条款：仅供一般参考，不构成个性化建议，并说明监管身份、投资风险及适用法律。",
    notice: "Fostier Consulting 网站法律声明：发布方设立于香港中环（商业登记号码 38375423），出版负责人为 Lucie Fostier。",
  },
};

/** Service page descriptions, in `services.items` order. */
export const serviceDescriptions: Record<Locale, string[]> = {
  fr: [
    "Conseil en investissement à Hong Kong pour les résidents français : revue de portefeuille, stratégie, allocation d'actifs et planification de long terme.",
    "Préparation et dépôt de votre déclaration de revenus à Hong Kong pour les résidents français : documents, calendrier fiscal et suivi administratif.",
    "Ouverture de comptes d'épargne et démarches bancaires à Hong Kong pour les résidents français : stratégie, dossier de demande, documents et suivi.",
    "Assurance santé et vie à Hong Kong pour les résidents français et leur famille : analyse des besoins, comparaison de contrats et recommandation.",
    "Interprète français, mandarin et cantonais à Hong Kong et en Chine continentale pour vos rendez-vous bancaires, administratifs et d'affaires.",
    "Recherche de fournisseurs en Chine avec un interlocuteur français : sélection, vérification, négociation en chinois, échantillons et suivi de commande.",
    "Un partenaire français en Chine pour importer vers la France : mise en relation, négociation, contrôle qualité et coordination logistique.",
  ],
  en: [
    "Investment advice in Hong Kong for French residents: portfolio review, investment strategy, asset allocation and long-term wealth planning.",
    "Hong Kong personal tax return preparation and filing for French residents: document organisation, tax-calendar guidance and admin support.",
    "Savings and bank account applications in Hong Kong for French residents: savings strategy, application preparation, documents and follow-up.",
    "Health and life insurance in Hong Kong for French residents and their families: needs analysis, policy comparison and a clear recommendation.",
    "French, Mandarin and Cantonese interpreter in Hong Kong and mainland China for banking, administrative, legal and business meetings.",
    "Supplier sourcing in mainland China with a French contact: shortlisting, background checks, negotiation in Chinese, samples and order follow-up.",
    "A French partner in China for importing into France: introductions to Chinese partners, negotiation, quality control and shipping coordination.",
  ],
  zh: [
    "为在港法国居民提供投资咨询：投资组合审查、投资策略制定、资产配置讨论及长期财富规划。",
    "协助在港法国居民准备并提交香港个人报税表：文件整理、报税日程提醒及行政沟通协助。",
    "协助在港法国居民开立储蓄及银行账户：储蓄策略、申请材料准备、所需文件指导及进度跟进。",
    "为在港法国居民及其家庭提供健康与人寿保险咨询：保险需求分析、保单比较与推荐。",
    "在香港及中国内地提供法语、普通话及粤语口译，陪同银行、行政、法律及商务会面。",
    "中国供应商寻源：需求梳理、供应商筛选、企业背景核查、中文谈判、样品与验厂协调及订单跟进。",
    "助力法国创业者开展对华项目：寻找中国合作伙伴、谈判签约协助、发货前质检及发往法国的物流协调。",
  ],
};
