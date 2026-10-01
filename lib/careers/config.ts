/**
 * Recruitment portal settings shared by the form, the API and the admin board.
 * Edit the screening questions here; nothing else needs to change.
 */

/** Internal route the portal is served from. A secret public slug can be set with CAREERS_PORTAL_SLUG (see middleware.ts). */
export const PORTAL_BASE = "/careers-portal";
export const API_BASE = `${PORTAL_BASE}/api`;

export const MAX_CV_BYTES = 5 * 1024 * 1024;
export const CV_TYPES = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;
export type CvExtension = keyof typeof CV_TYPES;

export const MAX_MOTIVATION_WORDS = 250;

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

export const roleOptions: Option[] = [
  { value: "financial-analyst", label: "Financial analyst" },
  { value: "client-advisor", label: "Client advisor (French-speaking)" },
  { value: "operations-associate", label: "Operations & compliance associate" },
  { value: "business-development", label: "Business development (France–China)" },
  { value: "intern", label: "Internship" },
  { value: "open", label: "Open application" },
];

/** Candidates below this (except for internships) are flagged as a knockout. */
export const MIN_YEARS_EXPERIENCE = 1;
export const MIN_YEARS_EXEMPT_ROLES = ["intern", "open"];

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

export const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

/** Fields the candidate fills in, as sent to the API (the CV travels alongside as a file). */
export type ApplicationInput = {
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  workAuthorization: string;
  role: string;
  yearsExperience: string;
  motivation: string;
};

export type ApplicationRecord = Omit<ApplicationInput, "yearsExperience"> & {
  id: string;
  submittedAt: string;
  updatedAt: string;
  yearsExperience: number;
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
  if (!roleOptions.some((o) => o.value === v("role"))) e.role = "Select the role you are applying for.";
  const years = Number(v("yearsExperience"));
  if (v("yearsExperience") === "" || !Number.isFinite(years) || years < 0 || years > 60)
    e.yearsExperience = "Enter a number of years between 0 and 60.";
  const words = countWords(v("motivation"));
  if (words < 20) e.motivation = "Write at least 20 words.";
  else if (words > MAX_MOTIVATION_WORDS) e.motivation = `Keep your answer to ${MAX_MOTIVATION_WORDS} words or fewer (currently ${words}).`;

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

export function knockoutsFor(input: Pick<ApplicationInput, "workAuthorization" | "role"> & { yearsExperience: number }): string[] {
  const k: string[] = [];
  const auth = workAuthorizationOptions.find((o) => o.value === input.workAuthorization);
  if (auth?.knockout) k.push(auth.label);
  if (input.yearsExperience < MIN_YEARS_EXPERIENCE && !MIN_YEARS_EXEMPT_ROLES.includes(input.role))
    k.push(`Under ${MIN_YEARS_EXPERIENCE} year of experience`);
  return k;
}
