/**
 * Founder profile for the About page, keyed by locale (fr / en / zh).
 * Kept outside the shared dictionary so the advisory bio can evolve
 * without touching site-wide content.
 */

import type { Locale } from "@/lib/i18n/config";

export const FOUNDER_PORTRAIT_SRC =
  "/brand/89EE7D74-C846-4FCE-8943-5E73CBBF2890_1_201_a.jpeg";

export interface FounderExperience {
  role: string;
  company: string;
  location: string;
  current?: boolean;
  detail: string;
}

export interface FounderEducation {
  degree: string;
  school: string;
  location: string;
  logo: string;
  key: "esg" | "fudan";
}

export interface UniversityHighlight {
  title: string;
  text: string;
  /** Key credential shown large in the pop-up header. */
  stat: { value: string; label: string };
}

export interface FounderProfile {
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
  press: {
    outlet: string;
    title: string;
    date: string;
    text: string;
    linkLabel: string;
    url: string;
  };
}

const UFE_ARTICLE_URL =
  "https://www.ufehongkong.hk/actualite/les-secrets-du-nouvel-an-chinois-avec-lucie";

const profiles: Record<Locale, FounderProfile> = {
  fr: {
    heading: "Votre conseillère",
    name: "Lucie Xiong",
    role: "Fondatrice",
    location: "Hong Kong · Auparavant Paris",
    portraitAlt: "Portrait de Lucie Xiong, fondatrice de Fostier Consulting",
    bio: [
      "Fondatrice de Fostier Consulting, Lucie accompagne des particuliers exigeants — dont une clientèle fortunée — à Hong Kong, Macao et en Chine continentale : investissement, épargne, assurance santé et vie, retraite.",
      "Économiste diplômée de l'Université Fudan (Shanghai), formée au Groupe ESG (Paris) et passée par HSBC, elle parle un français parfait. En février 2026, l'UFE Hong Kong l'a invitée à présenter les traditions du Nouvel An chinois à la communauté française.",
    ],
    experienceTitle: "Expérience",
    experience: [
      {
        role: "Fondatrice",
        company: "Fostier Consulting",
        location: "Hong Kong",
        current: true,
        detail:
          "Conseil en investissement, épargne, assurance santé et vie, et planification de la retraite pour des particuliers à Hong Kong, Macao et en Chine continentale.",
      },
      {
        role: "Senior Wealth Management Manager",
        company: "AIA",
        location: "Hong Kong & Macao",
        current: false,
        detail:
          "Gestion de patrimoine et assurance pour une clientèle privée et fortunée, à Hong Kong et Macao.",
      },
      {
        role: "Gestion de patrimoine",
        company: "HSBC",
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
        school: "Groupe ESG",
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
    },
  },
  en: {
    heading: "Your advisor",
    name: "Lucie Xiong",
    role: "Founder",
    location: "Hong Kong · Formerly Paris",
    portraitAlt: "Portrait of Lucie Xiong, founder of Fostier Consulting",
    bio: [
      "Founder of Fostier Consulting, Lucie advises discerning private clients — including high-net-worth individuals — across Hong Kong, Macau and mainland China on investment, savings, health and life insurance, and retirement planning.",
      "An economics graduate of Fudan University (Shanghai), educated at ESG Group (Paris) and seasoned at HSBC, she speaks fluent French. In February 2026, UFE Hong Kong invited her to present Chinese New Year traditions to the French community.",
    ],
    experienceTitle: "Experience",
    experience: [
      {
        role: "Founder",
        company: "Fostier Consulting",
        location: "Hong Kong",
        current: true,
        detail:
          "Advice on investment, savings, health and life insurance, and retirement planning for private clients in Hong Kong, Macau and mainland China.",
      },
      {
        role: "Senior Wealth Management Manager",
        company: "AIA",
        location: "Hong Kong & Macau",
        current: false,
        detail:
          "Wealth management and insurance for private and high-net-worth clients across Hong Kong and Macau.",
      },
      {
        role: "Wealth management",
        company: "HSBC",
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
        school: "ESG Group",
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
    },
  },
  zh: {
    heading: "您的专属顾问",
    name: "Lucie Xiong",
    role: "创始人",
    location: "中国香港 · 曾常驻法国巴黎",
    portraitAlt: "Lucie Xiong（Fostier Consulting 创始人）的照片",
    bio: [
      "作为 Fostier Consulting 创始人，Lucie 为香港、澳门及中国内地的高要求个人客户（包括高净值人士）提供投资、储蓄、健康与人寿保险及退休规划咨询。",
      "Lucie 毕业于复旦大学（上海）经济学专业，曾就读于 ESG 集团（巴黎），并就职于汇丰银行，法语流利。2026 年 2 月，UFE Hong Kong 邀请她为在港法国社群讲解中国春节习俗。",
    ],
    experienceTitle: "职业经历",
    experience: [
      {
        role: "创始人",
        company: "Fostier Consulting",
        location: "中国香港",
        current: true,
        detail:
          "为香港、澳门及中国内地的个人客户提供投资、储蓄、健康与人寿保险及退休规划咨询。",
      },
      {
        role: "Senior Wealth Management Manager",
        company: "AIA（友邦保险）",
        location: "香港及澳门",
        current: false,
        detail:
          "在香港及澳门为私人及高净值客户提供财富管理与保险服务。",
      },
      {
        role: "财富管理",
        company: "汇丰银行（HSBC）",
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
        school: "ESG 集团",
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
      title: "Groupe ESG",
      stat: { value: "6–7", label: "RNCP" },
      text: "Membre du réseau international Galileo Global Education. Les programmes ESG délivrent des titres RNCP de niveaux 6 et 7 reconnus par l'État français.",
    },
  },
  en: {
    fudan: {
      title: "Fudan University",
      stat: { value: "#26", label: "QS 2027" },
      text: "Ranked #26 globally in the QS World University Rankings 2027 — one of China’s leading research universities.",
    },
    esg: {
      title: "ESG Group",
      stat: { value: "6–7", label: "RNCP" },
      text: "Part of Galileo Global Education’s international network. ESG programmes award French state-recognised RNCP Level 6 and 7 qualifications.",
    },
  },
  zh: {
    fudan: {
      title: "复旦大学",
      stat: { value: "第 26 位", label: "QS 2027" },
      text: "在 2027 年 QS 世界大学排名中位列全球第 26 位 —— 中国顶尖的研究型大学之一。",
    },
    esg: {
      title: "ESG 集团",
      stat: { value: "6–7", label: "RNCP 级别" },
      text: "伽利利全球教育集团（Galileo Global Education）国际网络成员，ESG 课程颁发法国国家认可的 RNCP 6 级与 7 级文凭。",
    },
  },
};

export const getFounder = (locale: Locale): FounderProfile =>
  profiles[locale] ?? profiles.fr;
