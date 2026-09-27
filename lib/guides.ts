import type { Locale } from "./i18n/config";
import type { FaqItem } from "./i18n/faq";

/**
 * Practical guides (/[lang]/guides). A guide can exist in one language only;
 * hreflang, the sitemap and the language switcher only link the translations it has.
 *
 * To publish a guide:
 *   1. Write it below (FR first is fine), with real dates in ISO format.
 *   2. Preview with `npm run dev` — drafts render there, never in production builds.
 *   3. Set `status: "published"`. The guides index, the "Guides" nav link, the
 *      sitemap, llms.txt and the Article JSON-LD pick it up automatically.
 *   4. After deploying, run `npm run indexnow` and request indexing in Search Console.
 *
 * Write the first paragraph as a self-contained answer to the title's question, use
 * question-style headings, and keep facts dated and specific — this is what search
 * engines and AI assistants quote.
 */

export type GuideSection = { heading: string; paragraphs: string[]; list?: string[] };

export type GuideTranslation = {
  slug: string;
  title: string;
  /** <title> topic, ≤ 60 characters with " | Fostier Consulting" appended. */
  metaTitle: string;
  /** 120–155 characters (FR/EN), ~50–80 characters (ZH). */
  description: string;
  lead: string;
  sections: GuideSection[];
  faq?: FaqItem[];
};

export type Guide = {
  id: string;
  status: "draft" | "published";
  /** ISO dates. */
  published: string;
  updated: string;
  /** Index of the related service in `services.items`. */
  service?: number;
  translations: Partial<Record<Locale, GuideTranslation>>;
};

export const guides: Guide[] = [
  {
    id: "hong-kong-tax-return",
    status: "draft",
    published: "2026-10-01",
    updated: "2026-10-01",
    service: 1,
    translations: {
      fr: {
        slug: "declaration-impots-hong-kong-francais",
        title: "Déclarer ses revenus à Hong Kong quand on est Français",
        metaTitle: "Impôts à Hong Kong pour les Français : le guide",
        description:
          "[Brouillon] Qui doit déclarer à Hong Kong, quand arrive la déclaration, quels documents préparer et ce qu'il faut savoir côté France.",
        lead: "[Brouillon — à rédiger par Lucie] Deux phrases qui répondent directement à la question : qui doit déclarer, et ce que ce guide permet de faire.",
        sections: [
          {
            heading: "Qui doit remplir une déclaration à Hong Kong ?",
            paragraphs: ["[À rédiger : salariés, indépendants, cas des arrivées et départs en cours d'année.]"],
          },
          {
            heading: "Quand arrive la déclaration et quelle est la date limite ?",
            paragraphs: ["[À rédiger : calendrier de l'Inland Revenue Department, prolongations possibles.]"],
          },
          {
            heading: "Quels documents préparer ?",
            paragraphs: ["[À rédiger : introduction.]"],
            list: ["[Document 1]", "[Document 2]", "[Document 3]"],
          },
          {
            heading: "Faut-il aussi déclarer en France ?",
            paragraphs: ["[À rédiger : résidence fiscale, convention fiscale France–Hong Kong — renvoyer vers un professionnel habilité si besoin.]"],
          },
          {
            heading: "Comment Fostier Consulting vous accompagne",
            paragraphs: ["[À rédiger : ce que comprend l'accompagnement, en une ou deux phrases.]"],
          },
        ],
      },
    },
  },
];

/** Drafts are visible in `next dev` only, so Lucie can preview without publishing. */
const isVisible = (g: Guide) => g.status === "published" || process.env.NODE_ENV === "development";

export const visibleGuides = () => guides.filter(isVisible);

export const guidesIn = (locale: Locale) => visibleGuides().filter((g) => g.translations[locale]);

export const findGuide = (locale: Locale, slug: string) =>
  visibleGuides().find((g) => g.translations[locale]?.slug === slug);

/** Path per available locale, e.g. { fr: "/guides/declaration-…" }. */
export const guidePaths = (g: Guide): Partial<Record<Locale, string>> =>
  Object.fromEntries(Object.entries(g.translations).map(([l, t]) => [l, `/guides/${t!.slug}`]));

export const hasGuides = () => visibleGuides().length > 0;

export const guidesCopy: Record<
  Locale,
  { nav: string; title: string; metaTitle: string; intro: string; description: string; by: string; back: string; related: string; otherLanguages: string; languageName: Record<Locale, string> }
> = {
  fr: {
    nav: "Guides",
    title: "Guides pratiques",
    metaTitle: "Guides pratiques : vivre et investir à Hong Kong",
    intro: "Des réponses claires aux questions que se posent les résidents français à Hong Kong : impôts, banque, épargne, assurance et projets avec la Chine.",
    description: "Guides pratiques de Fostier Consulting pour les résidents français à Hong Kong : impôts, banque, épargne, assurance et projets entre la France et la Chine.",
    by: "Par",
    back: "Tous les guides",
    related: "Service associé",
    otherLanguages: "Dans d'autres langues",
    languageName: { fr: "En français", en: "En anglais", zh: "En chinois" },
  },
  en: {
    nav: "Guides",
    title: "Practical guides",
    metaTitle: "Practical guides: living and investing in Hong Kong",
    intro: "Clear answers to the questions French residents of Hong Kong ask: tax, banking, savings, insurance and projects with China.",
    description: "Practical guides from Fostier Consulting for French residents of Hong Kong: tax, banking, savings, insurance and projects between France and China.",
    by: "By",
    back: "All guides",
    related: "Related service",
    otherLanguages: "In other languages",
    languageName: { fr: "In French", en: "In English", zh: "In Chinese" },
  },
  zh: {
    nav: "指南",
    title: "实用指南",
    metaTitle: "实用指南：在香港生活与投资",
    intro: "为在港法国居民清晰解答常见问题：税务、银行、储蓄、保险及对华项目。",
    description: "Fostier Consulting 为在港法国居民撰写的实用指南：税务、银行、储蓄、保险及中法项目。",
    by: "作者",
    back: "全部指南",
    related: "相关服务",
    otherLanguages: "其他语言版本",
    languageName: { fr: "法语", en: "英语", zh: "中文" },
  },
};
