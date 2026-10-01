/**
 * Recruitment portal settings shared by the form, the API and the admin board.
 * Edit job listings and screening questions here; wording lives in ./i18n.ts.
 */
import { DEFAULT_CAREERS_LOCALE, careersCopy, type CareersLocale, type Localized } from "./i18n";

/** Internal route the portal is served from. A secret public slug can be set with CAREERS_PORTAL_SLUG (see middleware.ts). */
export const PORTAL_BASE = "/careers";
export const API_BASE = `${PORTAL_BASE}/api`;

/** Path candidates see in their browser (server components only: reads a server env var). French, the default, has no prefix. */
export function publicBase(lang: CareersLocale = DEFAULT_CAREERS_LOCALE) {
  const slug = process.env.CAREERS_PORTAL_SLUG?.replace(/^\/+|\/+$/g, "");
  return `${slug ? `/${slug}` : PORTAL_BASE}${lang === DEFAULT_CAREERS_LOCALE ? "" : `/${lang}`}`;
}

// 4 MB: Vercel functions reject request bodies over 4.5 MB, multipart overhead included.
export const MAX_CV_BYTES = 4 * 1024 * 1024;
export const CV_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;
export type CvExtension = keyof typeof CV_TYPES;

/**
 * Unsuccessful applications and their CVs are deleted automatically after this
 * many days (the PCPD's HR code allows up to two years; the candidate notice says 12 months).
 */
export const RETENTION_DAYS = 365;

export type Option = {
  value: string;
  label: Localized;
  /** A knockout answer is not rejected; it is flagged on the admin board for a person to review. */
  knockout?: boolean;
};

export const workAuthorizationOptions: Option[] = [
  { value: "hk-permanent", label: { en: "Hong Kong permanent resident", fr: "Résident permanent de Hong Kong" } },
  {
    value: "hk-visa",
    label: {
      en: "Valid Hong Kong visa with the right to work (work, dependant, IANG…)",
      fr: "Visa de Hong Kong valide autorisant à travailler (travail, dépendant, IANG…)",
    },
  },
  {
    value: "student-visa",
    label: {
      en: "Non-local student in Hong Kong (student visa)",
      fr: "Étudiant non local à Hong Kong (visa étudiant)",
    },
    // Not rejected: student visas limit outside work, so a person checks each case.
    knockout: true,
  },
  {
    value: "needs-sponsorship",
    label: { en: "Would need visa sponsorship", fr: "J'aurais besoin d'un parrainage de visa" },
    knockout: true,
  },
  {
    value: "remote-other",
    label: { en: "Based outside Hong Kong, remote only", fr: "Basé hors de Hong Kong, à distance uniquement" },
    knockout: true,
  },
];

export const commissionOptions: Option[] = [
  {
    value: "yes",
    label: {
      en: "Yes, I'm comfortable with commission-only pay and no base salary",
      fr: "Oui, une rémunération uniquement à la commission, sans salaire fixe, me convient",
    },
  },
  { value: "no", label: { en: "No, I need a base salary", fr: "Non, j'ai besoin d'un salaire fixe" }, knockout: true },
];

/**
 * Job listings. Candidates can only apply through one of these, at
 * /careers/jobs/<slug> (French) or /careers/en/jobs/<slug> (English). Set
 * `open: false` to stop accepting applications without losing the listing's
 * past candidates on the admin board.
 */
export type JobSection = { heading?: string; body?: string; items?: string[] };

export type Job = {
  slug: string;
  title: Localized;
  location: Localized;
  type: Localized;
  summary: Localized;
  /** Body of the listing page, in headed sections. */
  sections: Record<CareersLocale, JobSection[]>;
  /** Legal points about pay, licensing and conduct, shown under the description. */
  terms: Record<CareersLocale, string[]>;
  open: boolean;
};

export const jobs: Job[] = [
  {
    // Adapted from the LinkedIn posting (linkedin.com/jobs/view/4472502059).
    slug: "financial-consultant",
    title: { en: "Financial consultant (internship)", fr: "Consultant financier (stage)" },
    location: { en: "Hong Kong · Hybrid", fr: "Hong Kong · Hybride" },
    type: { en: "Commission only", fr: "Rémunération à la commission" },
    summary: {
      en: "Introduce our investment and financial planning services to new private clients. Flexible hours, for students and young adults in Hong Kong.",
      fr: "Présentez nos services d'investissement et de planification financière à de nouveaux clients privés. Horaires flexibles, pour étudiants et jeunes adultes à Hong Kong.",
    },
    sections: {
      en: [
        {
          heading: "About the role",
          body: "We are looking for motivated students and young adults to introduce our investment and financial planning services to new private clients and help grow our client base. This is a commission-based internship with flexible hours and a hybrid working arrangement in Hong Kong.",
        },
        {
          heading: "Location requirement",
          body: "You must currently live or study in Hong Kong. This is a hybrid role, so you must be able to attend in-person meetings and events in Hong Kong. We are unable to consider applicants based outside Hong Kong.",
        },
        {
          heading: "What you will do",
          items: [
            "Connect with prospective private clients through LinkedIn, networking and referrals.",
            "Introduce our investment and financial planning services and book consultations.",
            "Build and maintain your own pipeline of leads.",
          ],
        },
        {
          heading: "What we are looking for",
          items: [
            "Students or young adults currently living or studying in Hong Kong. Any major, no experience required.",
            "Strong communication skills and a self-starter attitude.",
            "Comfortable with sales and outreach.",
          ],
        },
        {
          heading: "What you get",
          items: [
            "Commission on every client you bring in (commission only, no base salary).",
            "Hands-on experience in financial services sales.",
            "Flexible hours and training from our team.",
          ],
        },
      ],
      fr: [
        {
          heading: "Le poste",
          body: "Nous recherchons des étudiants et jeunes adultes motivés pour présenter nos services d'investissement et de planification financière à de nouveaux clients privés et contribuer au développement de notre clientèle. Il s'agit d'un stage rémunéré à la commission, avec des horaires flexibles et un fonctionnement hybride à Hong Kong.",
        },
        {
          heading: "Lieu",
          body: "Vous devez actuellement vivre ou étudier à Hong Kong. Le poste étant hybride, vous devez pouvoir participer à des rendez-vous et événements en personne à Hong Kong. Nous ne pouvons pas étudier les candidatures de personnes basées hors de Hong Kong.",
        },
        {
          heading: "Vos missions",
          items: [
            "Entrer en contact avec de futurs clients privés via LinkedIn, le réseautage et les recommandations.",
            "Présenter nos services d'investissement et de planification financière, et fixer des rendez-vous de consultation.",
            "Constituer et suivre votre propre portefeuille de prospects.",
          ],
        },
        {
          heading: "Profil recherché",
          items: [
            "Étudiants ou jeunes adultes vivant ou étudiant actuellement à Hong Kong. Toutes filières, aucune expérience requise.",
            "Excellentes qualités de communication et esprit d'initiative.",
            "À l'aise avec la vente et la prospection.",
          ],
        },
        {
          heading: "Ce que nous offrons",
          items: [
            "Une commission sur chaque client que vous nous apportez (uniquement à la commission, sans salaire fixe).",
            "Une expérience concrète de la vente dans les services financiers.",
            "Des horaires flexibles et une formation par notre équipe.",
          ],
        },
      ],
    },
    terms: {
      en: [
        "Pay is commission only: there is no base salary. The terms of engagement are confirmed in writing before you start.",
        "This role introduces our services and books consultations; it does not involve advising on insurance or investment products, which in Hong Kong requires a licence from the Insurance Authority or the Securities and Futures Commission.",
        "Outreach to prospective clients must follow Hong Kong's privacy and direct marketing rules. We show you how as part of your training.",
      ],
      fr: [
        "La rémunération se fait uniquement à la commission : il n'y a pas de salaire fixe. Les conditions de la collaboration sont confirmées par écrit avant votre début.",
        "Ce poste consiste à présenter nos services et à fixer des rendez-vous ; il n'implique pas de conseiller sur des produits d'assurance ou d'investissement, ce qui nécessite à Hong Kong une licence de l'Insurance Authority ou de la Securities and Futures Commission.",
        "La prospection doit respecter les règles de Hong Kong en matière de données personnelles et de marketing direct. Nous vous les expliquons pendant votre formation.",
      ],
    },
    open: true,
  },
];

export const findJob = (slug: string) => jobs.find((j) => j.slug === slug);
export const openJob = (slug: string) => {
  const job = findJob(slug);
  return job?.open ? job : undefined;
};

export const pipelineStages = [
  { value: "applied", label: "Applied" },
  { value: "reviewing", label: "Reviewing" },
  { value: "screened", label: "Screened" },
  { value: "interview", label: "Interview" },
  { value: "decision", label: "Decision" },
] as const;
export type Stage = (typeof pipelineStages)[number]["value"];
export const isStage = (v: unknown): v is Stage => pipelineStages.some((s) => s.value === v);

/** Options as sent to the browser: labels in one language, knockout flags left out. */
export type PublicOption = { value: string; label: string };
export const publicOptions = (options: Option[], lang: CareersLocale): PublicOption[] =>
  options.map(({ value, label }) => ({ value, label: label[lang] }));

export const labelFor = (options: { value: string; label: string | Localized }[], value: string, lang: CareersLocale = "en") => {
  const label = options.find((o) => o.value === value)?.label;
  return label === undefined ? value : typeof label === "string" ? label : label[lang];
};

/** Fields the candidate fills in, as sent to the API (the CV travels alongside as a file). */
export type ApplicationInput = {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  commissionOnly: string;
};

export type ApplicationRecord = ApplicationInput & {
  id: string;
  /** Language the candidate applied in. */
  lang: CareersLocale;
  /** The listing applied through; the English title is copied so it survives edits to the listing. */
  jobSlug: string;
  jobTitle: string;
  submittedAt: string;
  updatedAt: string;
  status: Stage;
  knockouts: string[];
  cv: { file: string; originalName: string; size: number; type: string } | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()\-.]{6,20}$/;

const isHttpUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

/** Field-level validation, run in the browser per step and again on the server. */
export function validateFields(
  input: Partial<ApplicationInput>,
  lang: CareersLocale = "en"
): Partial<Record<keyof ApplicationInput, string>> {
  const m = careersCopy[lang].errors;
  const e: Partial<Record<keyof ApplicationInput, string>> = {};
  const v = (k: keyof ApplicationInput) => (input[k] ?? "").trim();

  if (v("fullName").length < 2) e.fullName = m.fullName;
  else if (v("fullName").length > 120) e.fullName = m.fullNameLong;
  if (!EMAIL_RE.test(v("email"))) e.email = m.email;
  if (!PHONE_RE.test(v("phone"))) e.phone = m.phone;
  const linkedin = v("linkedinUrl");
  if (!linkedin) e.linkedinUrl = m.linkedinMissing;
  else if (!isHttpUrl(linkedin) || !/(^|\.)linkedin\.com$/i.test(new URL(linkedin).hostname)) e.linkedinUrl = m.linkedin;
  const portfolio = v("portfolioUrl");
  if (portfolio && !isHttpUrl(portfolio)) e.portfolioUrl = m.portfolio;

  if (!workAuthorizationOptions.some((o) => o.value === v("workAuthorization"))) e.workAuthorization = m.workAuthorization;
  if (!commissionOptions.some((o) => o.value === v("commissionOnly"))) e.commissionOnly = m.commissionOnly;

  return e;
}

/** Returns an error message, or null when the file is acceptable. */
export function validateCvMeta(name: string, size: number, lang: CareersLocale = "en"): string | null {
  const m = careersCopy[lang].errors;
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext !== "pdf" && ext !== "docx") return m.cvType;
  if (size === 0) return m.cvEmpty;
  if (size > MAX_CV_BYTES) return m.cvSize;
  return null;
}

/** Knockout labels, in English for the admin board. */
export function knockoutsFor(input: Pick<ApplicationInput, "workAuthorization" | "commissionOnly">): string[] {
  return [
    workAuthorizationOptions.find((o) => o.value === input.workAuthorization),
    commissionOptions.find((o) => o.value === input.commissionOnly),
  ]
    .filter((o): o is Option => !!o?.knockout)
    .map((o) => o.label.en);
}
