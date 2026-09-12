/**
 * Founder profile for the About page, keyed by locale (fr / en / zh).
 * Kept outside the shared dictionary so the advisory bio can evolve
 * without touching site-wide content.
 */

import type { Locale } from "@/lib/i18n/config";

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
}

export interface FounderProfile {
  heading: string;
  name: string;
  role: string;
  location: string;
  portraitAlt: string;
  highlights: string[];
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
    portraitAlt: "Portrait de Lucie Xiong — photo à fournir",
    highlights: [
      "Français courant",
      "Clientèle privée & HNWI",
      "Investissement international",
      "Paris → Hong Kong",
    ],
    bio: [
      "Fondatrice de Fostier Consulting, Lucie accompagne des particuliers exigeants — dont une clientèle fortunée — à Hong Kong, Macao et en Chine continentale : investissement, épargne, assurance santé et vie, retraite.",
      "Économiste diplômée de l'université Fudan (Shanghai), formée en France (Groupe ESG) et passée par le siège parisien de HSBC, elle parle un français parfait. En février 2026, l'UFE Hong Kong l'a invitée à présenter les traditions du Nouvel An chinois à la communauté française.",
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
        role: "Gestion de patrimoine — siège de Paris",
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
        degree: "Diplôme de niveau Master (Bac+5)",
        school: "Groupe ESG",
        location: "Paris, France",
      },
      {
        degree: "Diplôme en économie",
        school: "Université Fudan",
        location: "Shanghai, Chine",
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
    heading: "Your adviser",
    name: "Lucie Xiong",
    role: "Founder",
    location: "Hong Kong · Formerly Paris",
    portraitAlt: "Portrait of Lucie Xiong — photo to be supplied",
    highlights: [
      "Fluent French",
      "Private & HNW clients",
      "International investing",
      "Paris → Hong Kong",
    ],
    bio: [
      "Founder of Fostier Consulting, Lucie advises discerning private clients — including high-net-worth individuals — across Hong Kong, Macau and mainland China on investment, savings, health and life insurance, and retirement planning.",
      "An economics graduate of Fudan University (Shanghai), educated in France (ESG Group) and seasoned at HSBC's Paris head office, she speaks fluent French. In February 2026, UFE Hong Kong invited her to present Chinese New Year traditions to the French community.",
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
        role: "Wealth management — Paris head office",
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
        degree: "Master's-level business degree (Bac+5)",
        school: "ESG Group",
        location: "Paris, France",
      },
      {
        degree: "Degree in Economics",
        school: "Fudan University",
        location: "Shanghai, China",
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
    portraitAlt: "Lucie Xiong 的照片 —— 待提供",
    highlights: [
      "法语流利",
      "高净值客户服务",
      "跨境国际投资",
      "巴黎 → 香港",
    ],
    bio: [
      "作为 Fostier Consulting 创始人，Lucie 为香港、澳门及中国内地的高要求个人客户（包括高净值人士）提供投资、储蓄、健康与人寿保险及退休规划咨询。",
      "Lucie 毕业于上海复旦大学经济专业，曾赴法国深造（ESG 集团），并就职于汇丰银行巴黎总部，法语流利。2026 年 2 月，UFE Hong Kong 邀请她为在港法国社群讲解中国春节习俗。",
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
        role: "财富管理 —— 巴黎总部",
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
      },
      {
        degree: "经济学学位",
        school: "复旦大学",
        location: "中国上海",
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

export const getFounder = (locale: Locale): FounderProfile =>
  profiles[locale] ?? profiles.fr;
