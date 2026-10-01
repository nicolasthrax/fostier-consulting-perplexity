/**
 * Recruitment portal settings shared by the form, the API and the admin board.
 * Edit job listings and screening questions here; wording lives in ./i18n.ts.
 */
import { careersCopy, type CareersLocale, type Localized } from "./i18n";

/** Internal route the portal is served from. A secret public slug can be set with CAREERS_PORTAL_SLUG (see middleware.ts). */
export const PORTAL_BASE = "/careers";
export const API_BASE = `${PORTAL_BASE}/api`;

/** Path candidates see in their browser (server components only: reads a server env var). English has no prefix. */
export function publicBase(lang: CareersLocale = "en") {
  const slug = process.env.CAREERS_PORTAL_SLUG?.replace(/^\/+|\/+$/g, "");
  return `${slug ? `/${slug}` : PORTAL_BASE}${lang === "en" ? "" : `/${lang}`}`;
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
 * /careers/jobs/<slug> (English) or /careers/fr/jobs/<slug> (French). Set
 * `open: false` to stop accepting applications without losing the listing's
 * past candidates on the admin board.
 */
export type Job = {
  slug: string;
  title: Localized;
  location: Localized;
  type: Localized;
  summary: Localized;
  /** Paragraphs shown on the listing page. */
  description: Record<CareersLocale, string[]>;
  /** Legal points about pay and licensing, shown under the description. */
  terms: Record<CareersLocale, string[]>;
  open: boolean;
};

export const jobs: Job[] = [
  {
    // Placeholder listing: replace with the real job description.
    slug: "financial-advisor",
    title: { en: "Financial advisor", fr: "Conseiller financier" },
    location: { en: "Hong Kong (Central)", fr: "Hong Kong (Central)" },
    type: { en: "Commission only", fr: "Rémunération à la commission" },
    summary: {
      en: "Advise clients in Hong Kong on savings, investment and retirement.",
      fr: "Conseillez des clients à Hong Kong sur leur épargne, leurs placements et leur retraite.",
    },
    description: {
      en: [
        "You will build and look after your own portfolio of clients in Hong Kong, helping them with savings, investment and retirement.",
        "We're looking for outgoing people who enjoy meeting others and find it easy to start a conversation.",
        "No experience is needed, and students are welcome to apply.",
      ],
      fr: [
        "Vous développerez et suivrez votre propre portefeuille de clients à Hong Kong, en les accompagnant sur leur épargne, leurs placements et leur retraite.",
        "Nous recherchons des personnes ouvertes, qui aiment les rencontres et engagent facilement la conversation.",
        "Aucune expérience n'est requise, et les étudiants sont les bienvenus.",
      ],
    },
    terms: {
      en: [
        "Pay is commission only: there is no base salary. The terms of engagement are confirmed in writing before you start.",
        "Advising clients on insurance or investment products in Hong Kong requires a licence from the Insurance Authority or the Securities and Futures Commission. You will need to hold the relevant licence before advising clients.",
      ],
      fr: [
        "La rémunération se fait uniquement à la commission : il n'y a pas de salaire fixe. Les conditions de la collaboration sont confirmées par écrit avant votre début.",
        "À Hong Kong, conseiller des clients sur des produits d'assurance ou d'investissement nécessite une licence de l'Insurance Authority ou de la Securities and Futures Commission. Vous devrez détenir la licence requise avant de conseiller des clients.",
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
