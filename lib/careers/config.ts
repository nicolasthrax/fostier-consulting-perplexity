/**
 * Recruitment portal settings shared by the form, the API and the admin board.
 * Edit the screening questions here; nothing else needs to change.
 */

/** Internal route the portal is served from. A secret public slug can be set with CAREERS_PORTAL_SLUG (see middleware.ts). */
export const PORTAL_BASE = "/careers-portal";
export const API_BASE = `${PORTAL_BASE}/api`;

/** Path candidates see in their browser (server components only: reads a server env var). */
export function publicBase() {
  const slug = process.env.CAREERS_PORTAL_SLUG?.replace(/^\/+|\/+$/g, "");
  return slug ? `/${slug}` : PORTAL_BASE;
}

export const MAX_CV_BYTES = 5 * 1024 * 1024;
export const CV_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;
export type CvExtension = keyof typeof CV_TYPES;

export type Option = {
  value: string;
  label: string;
  /** A knockout answer is not rejected; it is flagged on the admin board. */
  knockout?: boolean;
};

export const workAuthorizationOptions: Option[] = [
  { value: "hk-permanent", label: "Hong Kong permanent resident" },
  { value: "hk-visa", label: "Valid Hong Kong work visa / dependant visa with right to work" },
  { value: "needs-sponsorship", label: "Would need visa sponsorship", knockout: true },
  { value: "remote-other", label: "Based outside Hong Kong, remote only", knockout: true },
];

export const commissionOptions: Option[] = [
  { value: "yes", label: "Yes, I'm comfortable with commission-only pay and no base salary" },
  { value: "no", label: "No, I need a base salary", knockout: true },
];

/**
 * Job listings. Candidates can only apply through one of these, at
 * /careers-portal/jobs/<slug>. Set `open: false` to stop accepting applications
 * without losing the listing's past candidates on the admin board.
 */
export type Job = {
  slug: string;
  title: string;
  location: string;
  type: string;
  summary: string;
  /** Paragraphs shown on the listing page. */
  description: string[];
  open: boolean;
};

export const jobs: Job[] = [
  {
    // Placeholder listing: replace with the real job description.
    slug: "financial-advisor",
    title: "Financial advisor",
    location: "Hong Kong (Central)",
    type: "Commission only",
    summary: "Advise French-speaking clients in Hong Kong on savings, investment and retirement.",
    description: [
      "You will build and look after a portfolio of French-speaking clients in Hong Kong, helping them with savings, investment, retirement and cross-border tax questions.",
      "This role is paid on commission only: there is no base salary.",
      "We are looking for someone fluent in French and English, at ease with numbers, and comfortable building their own client base.",
    ],
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

export const labelFor = (options: Option[], value: string) => options.find((o) => o.value === value)?.label ?? value;

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
  /** The listing applied through; the title is copied so it survives edits to the listing. */
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
export function validateFields(input: Partial<ApplicationInput>): Partial<Record<keyof ApplicationInput, string>> {
  const e: Partial<Record<keyof ApplicationInput, string>> = {};
  const v = (k: keyof ApplicationInput) => (input[k] ?? "").trim();

  if (v("fullName").length < 2) e.fullName = "Enter your full name.";
  else if (v("fullName").length > 120) e.fullName = "Keep your name under 120 characters.";
  if (!EMAIL_RE.test(v("email"))) e.email = "Enter a valid email address, like name@example.com.";
  if (!PHONE_RE.test(v("phone"))) e.phone = "Enter a phone number with country code, like +852 6123 4567.";
  const linkedin = v("linkedinUrl");
  if (!linkedin) e.linkedinUrl = "Enter your LinkedIn profile URL.";
  else if (!isHttpUrl(linkedin) || !/(^|\.)linkedin\.com$/i.test(new URL(linkedin).hostname))
    e.linkedinUrl = "Enter a linkedin.com profile URL, starting with https://.";
  const portfolio = v("portfolioUrl");
  if (portfolio && !isHttpUrl(portfolio)) e.portfolioUrl = "Enter a full URL starting with https://, or leave it empty.";

  if (!workAuthorizationOptions.some((o) => o.value === v("workAuthorization")))
    e.workAuthorization = "Select your work authorisation status.";
  if (!commissionOptions.some((o) => o.value === v("commissionOnly")))
    e.commissionOnly = "Tell us whether commission-only pay works for you.";

  return e;
}

/** Returns an error message, or null when the file is acceptable. */
export function validateCvMeta(name: string, size: number): string | null {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext !== "pdf" && ext !== "docx") return "Upload a PDF or Word (.docx) file.";
  if (size === 0) return "That file is empty.";
  if (size > MAX_CV_BYTES) return "The file is larger than 5 MB.";
  return null;
}

export function knockoutsFor(input: Pick<ApplicationInput, "workAuthorization" | "commissionOnly">): string[] {
  return [
    workAuthorizationOptions.find((o) => o.value === input.workAuthorization),
    commissionOptions.find((o) => o.value === input.commissionOnly),
  ]
    .filter((o): o is Option => !!o?.knockout)
    .map((o) => o.label);
}
