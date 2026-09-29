/**
 * Founder profile for the About page, keyed by locale (fr / en / zh).
 * Kept outside the shared dictionary so the advisory bio can evolve
 * without touching site-wide content.
 */

import type { Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";

export const FOUNDER_PORTRAIT_SRC = "/brand/lucie-fostier-portrait.jpeg";

interface FounderExperience {
  role: string;
  company: string;
  location: string;
  current?: boolean;
  /** e.g. "Since 2015"; only shown when known. */
  period?: string;
  detail: string;
  logo?: string;
}

interface FounderEducation {
  degree: string;
  school: string;
  location: string;
  logo: string;
  key: "esg" | "fudan";
}

interface UniversityHighlight {
  title: string;
  text: string;
  /** Key credential shown large in the pop-up header. */
  stat: { value: string; label: string };
}

interface FounderProfile {
  heading: string;
  name: string;
  role: string;
  location: string;
  portraitAlt: string;
  bio: string[];
  experienceTitle: string;
  experience: FounderExperience[];
  educationTitle: string;
  education: FounderEducation[];
  pressTitle: string;
  /** Main press item. Also read by `aboutJsonLd` (structured data): keep the shape. */
  press: PressItem;
  /** Every press item shown on the About page, `press` first. */
  pressItems: PressItem[];
}

export interface PressItem {
  outlet: string;
  title: string;
  date: string;
  text: string;
  linkLabel: string;
  url: string;
  /** Outlet logo in /public; items without one render as text only. */
  logo?: string;
}

const UFE_ARTICLE_URL = site.ufeArticleUrl;

const profiles: Record<Locale, Omit<FounderProfile, "pressItems">> = {
  fr: {
    heading: "Votre conseillère",
    name: "Lucie Fostier",
    role: "Fondatrice",
    location: "Hong Kong · Auparavant Paris",
    portraitAlt: "Portrait de Lucie Fostier, fondatrice de Fostier Consulting",
    bio: [
      "Fondatrice de Fostier Consulting en 2015, Lucie accompagne des particuliers exigeants — dont une clientèle fortunée — à Hong Kong, Macao et en Chine continentale : investissement, épargne, assurance santé et vie, retraite.",
      "Économiste diplômée de l'Université Fudan (Shanghai), formée à l'école de commerce ESG (Paris) et passée par HSBC, elle parle un français parfait. En février 2026, l'UFE Hong Kong l'a invitée à présenter les traditions du Nouvel An chinois à la communauté française.",
    ],
    experienceTitle: "Expérience",
    experience: [
      {
        role: "Fondatrice",
        company: "Fostier Consulting",
        location: "Central, Hong Kong",
        current: true,
        period: "Depuis 2015",
        detail:
          "Conseil en investissement, épargne, assurance santé et vie, et planification de la retraite pour des particuliers à Hong Kong, Macao et en Chine continentale.",
      },
      {
        role: "Senior Wealth Management Manager",
        company: "AIA",
        logo: "/brand/aia-logo.png",
        location: "Hong Kong & Macao",
        current: false,
        detail:
          "Gestion de patrimoine et assurance pour une clientèle privée et fortunée, à Hong Kong et Macao.",
      },
      {
        role: "Gestion de patrimoine",
        company: "HSBC",
        logo: "/brand/hsbc-logo.svg",
        location: "Paris, France",
        current: false,
        detail:
          "Expérience au siège parisien d'un leader mondial de la banque, au service d'une clientèle patrimoniale exigeante.",
      },
    ],
    educationTitle: "Formation",
    education: [
      {
        degree: "Diplôme de niveau Master",
        school: "École de commerce ESG",
        location: "Paris, France",
        logo: "/brand/esg-logo.svg",
        key: "esg",
      },
      {
        degree: "Diplôme en économie",
        school: "Université Fudan",
        location: "Shanghai, Chine",
        logo: "/brand/fudan-logo.svg",
        key: "fudan",
      },
    ],
    pressTitle: "Dans la presse",
    press: {
      outlet: "UFE Hong Kong — Union des Français de l'Étranger",
      title: "« Les secrets du Nouvel An chinois avec Lucie »",
      date: "Février 2026",
      text: "Invitée par le Cercle Arts et Culture de l'UFE Hong Kong, Lucie a animé à Wan Chai une conférence destinée à la communauté française : origines et codes des enveloppes rouges, billets neufs, gestes d'étiquette et traditions du Nouvel An chinois.",
      linkLabel: "Lire l'article",
      url: UFE_ARTICLE_URL,
      logo: "/brand/ufe-logo.svg",
    },
  },
  en: {
    heading: "Your advisor",
    name: "Lucie Fostier",
    role: "Founder",
    location: "Hong Kong · Formerly Paris",
    portraitAlt: "Portrait of Lucie Fostier, founder of Fostier Consulting",
    bio: [
      "Founder of Fostier Consulting since 2015, Lucie advises discerning private clients — including high-net-worth individuals — across Hong Kong, Macau and mainland China on investment, savings, health and life insurance, and retirement planning.",
      "An economics graduate of Fudan University (Shanghai), educated at ESG business school (Paris) and seasoned at HSBC, she speaks fluent French. In February 2026, UFE Hong Kong invited her to present Chinese New Year traditions to the French community.",
    ],
    experienceTitle: "Experience",
    experience: [
      {
        role: "Founder",
        company: "Fostier Consulting",
        location: "Central, Hong Kong",
        current: true,
        period: "Since 2015",
        detail:
          "Advice on investment, savings, health and life insurance, and retirement planning for private clients in Hong Kong, Macau and mainland China.",
      },
      {
        role: "Senior Wealth Management Manager",
        company: "AIA",
        logo: "/brand/aia-logo.png",
        location: "Hong Kong & Macau",
        current: false,
        detail:
          "Wealth management and insurance for private and high-net-worth clients across Hong Kong and Macau.",
      },
      {
        role: "Wealth management",
        company: "HSBC",
        logo: "/brand/hsbc-logo.svg",
        location: "Paris, France",
        current: false,
        detail:
          "Experience at the Paris head office of a global banking leader, serving demanding wealth clients.",
      },
    ],
    educationTitle: "Education",
    education: [
      {
        degree: "Master's-level business degree",
        school: "ESG business school",
        location: "Paris, France",
        logo: "/brand/esg-logo.svg",
        key: "esg",
      },
      {
        degree: "Degree in Economics",
        school: "Fudan University",
        location: "Shanghai, China",
        logo: "/brand/fudan-logo.svg",
        key: "fudan",
      },
    ],
    pressTitle: "In the press",
    press: {
      outlet: "UFE Hong Kong — Union des Français de l'Étranger",
      title: "“The secrets of Chinese New Year, with Lucie”",
      date: "February 2026",
      text: "Invited by UFE Hong Kong's Arts and Culture Circle, Lucie hosted a talk in Wan Chai for the French community: the origins and etiquette of red envelopes, brand-new banknotes, and the traditions of Chinese New Year. Article in French.",
      linkLabel: "Read the article",
      url: UFE_ARTICLE_URL,
      logo: "/brand/ufe-logo.svg",
    },
  },
  zh: {
    heading: "您的专属顾问",
    name: "Lucie Fostier",
    role: "创始人",
    location: "中国香港 · 曾常驻法国巴黎",
    portraitAlt: "Lucie Fostier（Fostier Consulting 创始人）的照片",
    bio: [
      "作为 Fostier Consulting 创始人（2015 年创立），Lucie 为香港、澳门及中国内地的高要求个人客户（包括高净值人士）提供投资、储蓄、健康与人寿保险及退休规划咨询。",
      "Lucie 毕业于复旦大学（上海）经济学专业，曾就读于法国 ESG 商学院（巴黎），并就职于汇丰银行，法语流利。2026 年 2 月，UFE Hong Kong 邀请她为在港法国社群讲解中国春节习俗。",
    ],
    experienceTitle: "职业经历",
    experience: [
      {
        role: "创始人",
        company: "Fostier Consulting",
        location: "香港中环",
        current: true,
        period: "2015 年至今",
        detail:
          "为香港、澳门及中国内地的个人客户提供投资、储蓄、健康与人寿保险及退休规划咨询。",
      },
      {
        role: "Senior Wealth Management Manager",
        company: "AIA（友邦保险）",
        logo: "/brand/aia-logo.png",
        location: "香港及澳门",
        current: false,
        detail:
          "在香港及澳门为私人及高净值客户提供财富管理与保险服务。",
      },
      {
        role: "财富管理",
        company: "汇丰银行（HSBC）",
        logo: "/brand/hsbc-logo.svg",
        location: "法国巴黎",
        current: false,
        detail:
          "任职于全球领先银行集团的巴黎总部，服务于要求严苛的财富客户。",
      },
    ],
    educationTitle: "教育背景",
    education: [
      {
        degree: "硕士阶段商科学位",
        school: "ESG 商学院",
        location: "法国巴黎",
        logo: "/brand/esg-logo.svg",
        key: "esg",
      },
      {
        degree: "经济学学位",
        school: "复旦大学",
        location: "中国上海",
        logo: "/brand/fudan-logo.svg",
        key: "fudan",
      },
    ],
    pressTitle: "媒体报道",
    press: {
      outlet: "UFE Hong Kong —— 法国海外侨民协会香港分会",
      title: "「与 Lucie 一起探寻中国春节的习俗」",
      date: "2026 年 2 月",
      text: "受 UFE Hong Kong 文化艺术俱乐部的邀请，Lucie 在湾仔为法国社群主讲春节习俗讲座：红包的起源与礼仪、新钞讲究及春节传统。（原文为法语）",
      linkLabel: "阅读原文（法语）",
      url: UFE_ARTICLE_URL,
      logo: "/brand/ufe-logo.svg",
    },
  },
};

export const UNIVERSITY_HIGHLIGHTS: Record<Locale, Record<"esg" | "fudan", UniversityHighlight>> = {
  fr: {
    fudan: {
      title: "Université Fudan",
      stat: { value: "26e", label: "QS 2027" },
      text: "Classée 26e au niveau mondial dans le classement QS World University Rankings 2027 — l'une des principales universités de recherche en Chine.",
    },
    esg: {
      title: "École de commerce ESG",
      stat: { value: "6–7", label: "RNCP" },
      text: "École de commerce française, membre du réseau international Galileo Global Education. Les programmes ESG délivrent des titres de niveaux 6 et 7 inscrits au RNCP (Répertoire national des certifications professionnelles), reconnus par l'État français.",
    },
  },
  en: {
    fudan: {
      title: "Fudan University",
      stat: { value: "#26", label: "QS 2027" },
      text: "Ranked #26 globally in the QS World University Rankings 2027 — one of China’s leading research universities.",
    },
    esg: {
      title: "ESG business school",
      stat: { value: "6–7", label: "RNCP" },
      text: "French business school, part of Galileo Global Education’s international network. ESG programmes award French state-recognised Level 6 and 7 qualifications listed on the RNCP (France's national register of professional certifications).",
    },
  },
  zh: {
    fudan: {
      title: "复旦大学",
      stat: { value: "第 26 位", label: "QS 2027" },
      text: "在 2027 年 QS 世界大学排名中位列全球第 26 位 —— 中国顶尖的研究型大学之一。",
    },
    esg: {
      title: "ESG 商学院",
      stat: { value: "6–7", label: "RNCP 级别" },
      text: "法国商学院，伽利略全球教育集团（Galileo Global Education）国际网络成员，ESG 课程颁发法国国家认可、列入 RNCP（法国国家职业资格认证目录）的 6 级与 7 级文凭。",
    },
  },
};

/**
 * Agenda listing of the same UFE talk on lepetitjournal.com Hong Kong
 * (published 1 February 2026, event on 9 February 2026). Verified 2026-09-29.
 */
const LPJ_LISTING_URL =
  "https://lepetitjournal.com/hong-kong/agenda/conferences/les-secrets-du-nouvel-an-chinois-une-conference-pour-tout-comprendre-";

const morePress: Record<Locale, PressItem[]> = {
  fr: [
    {
      outlet: "lepetitjournal.com Hong Kong",
      title: "« Les secrets du Nouvel An chinois… Une conférence pour tout comprendre ! »",
      date: "Février 2026",
      text: "L'agenda de lepetitjournal.com Hong Kong a annoncé la conférence animée par Lucie pour le Cercle Art & Culture de l'UFE, le 9 février 2026 à Wan Chai.",
      linkLabel: "Lire l'annonce",
      url: LPJ_LISTING_URL,
    },
  ],
  en: [
    {
      outlet: "lepetitjournal.com Hong Kong",
      title: "“The secrets of Chinese New Year… A talk to understand it all!”",
      date: "February 2026",
      text: "The events listings of lepetitjournal.com Hong Kong announced the talk Lucie gave for UFE's Arts and Culture Circle on 9 February 2026 in Wan Chai. Listing in French.",
      linkLabel: "Read the listing",
      url: LPJ_LISTING_URL,
    },
  ],
  zh: [
    {
      outlet: "lepetitjournal.com 香港版",
      title: "「春节的秘密……一场讲座带您全面了解！」",
      date: "2026 年 2 月",
      text: "法语媒体 lepetitjournal.com 香港版在活动日历中预告了 Lucie 于 2026 年 2 月 9 日在湾仔为 UFE 文化艺术俱乐部主讲的讲座。（原文为法语）",
      linkLabel: "阅读预告（法语）",
      url: LPJ_LISTING_URL,
    },
  ],
};

export const getFounder = (locale: Locale): FounderProfile => {
  const profile = profiles[locale] ?? profiles.fr;
  return { ...profile, pressItems: [profile.press, ...(morePress[locale] ?? morePress.fr)] };
};
