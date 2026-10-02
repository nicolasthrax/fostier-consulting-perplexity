import type { ApplicationInput, ApplicationRecord } from "@/lib/careers/config";

export const validInput = (over: Partial<ApplicationInput> = {}): ApplicationInput => ({
  fullName: "Alice Martin",
  email: "alice@example.com",
  phone: "+852 6123 4567",
  linkedinUrl: "",
  portfolioUrl: "",
  workAuthorization: "hk-permanent",
  commissionOnly: "yes",
  adult: "yes",
  university: "HKU",
  ...over,
});

/** An ID whose timestamp is `daysAgo` days in the past (matches storage's SAFE_ID). */
export const idDaysAgo = (daysAgo: number, suffix = "a") =>
  `${(Date.now() - daysAgo * 86_400_000).toString(36)}-${suffix.repeat(12).slice(0, 12)}`;

let counter = 0;
/** A fresh valid id: current time plus a unique hex suffix. */
export const freshId = () => `${Date.now().toString(36)}-${(++counter).toString(16).padStart(12, "0")}`;

export const record = (over: Partial<ApplicationRecord> = {}): ApplicationRecord => {
  const id = over.id ?? freshId();
  return {
    ...validInput(),
    id,
    lang: "en",
    jobSlug: "financial-consultant",
    jobTitle: "Financial consultant (internship)",
    submittedAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    status: "applied",
    knockouts: [],
    cv: { file: `${id}.pdf`, originalName: "cv.pdf", size: 3, type: "application/pdf" },
    ...over,
  };
};
