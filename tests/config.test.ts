import { describe, expect, it } from "vitest";
import {
  RETAINED_STAGES,
  ageLabel,
  duplicateCounts,
  duplicatesOf,
  initialStatus,
  knockoutsFor,
  validateFields,
} from "@/lib/careers/config";
import { record, validInput } from "./fixtures";

describe("validateFields", () => {
  it("accepts a complete, valid application", () => {
    expect(validateFields(validInput())).toEqual({});
  });

  it("accepts a phone number with country code and spaces", () => {
    expect(validateFields(validInput({ phone: "+852 6123 4567" })).phone).toBeUndefined();
  });

  it.each(["------", "(+) .", "+1 23", "abc123456", ""])("rejects the phone number %j", (phone) => {
    expect(validateFields(validInput({ phone })).phone).toEqual(expect.any(String));
  });

  it("requires adult to be yes or no, with an error message", () => {
    expect(validateFields(validInput({ adult: "yes" })).adult).toBeUndefined();
    expect(validateFields(validInput({ adult: "no" })).adult).toBeUndefined();
    for (const adult of ["", "maybe", "18"]) {
      const errors = validateFields(validInput({ adult }));
      expect(errors).toHaveProperty("adult");
      expect(errors.adult, `message for adult=${JSON.stringify(adult)}`).toEqual(expect.any(String));
    }
  });

  it("treats LinkedIn as optional but requires linkedin.com when given", () => {
    expect(validateFields(validInput({ linkedinUrl: "" })).linkedinUrl).toBeUndefined();
    expect(validateFields(validInput({ linkedinUrl: "https://www.linkedin.com/in/alice" })).linkedinUrl).toBeUndefined();
    expect(validateFields(validInput({ linkedinUrl: "https://linkedin.com/in/alice" })).linkedinUrl).toBeUndefined();
    expect(validateFields(validInput({ linkedinUrl: "https://example.com/in/alice" })).linkedinUrl).toEqual(expect.any(String));
    expect(validateFields(validInput({ linkedinUrl: "https://notlinkedin.com/in/alice" })).linkedinUrl).toEqual(expect.any(String));
    expect(validateFields(validInput({ linkedinUrl: "linkedin.com/in/alice" })).linkedinUrl).toEqual(expect.any(String));
  });

  it("requires the university and limits it to 150 characters", () => {
    expect(validateFields(validInput({ university: "" })).university).toEqual(expect.any(String));
    expect(validateFields(validInput({ university: "   " })).university).toEqual(expect.any(String));
    expect(validateFields(validInput({ university: "x".repeat(150) })).university).toBeUndefined();
    expect(validateFields(validInput({ university: "x".repeat(151) })).university).toEqual(expect.any(String));
  });

  it("returns messages in the requested language", () => {
    const en = validateFields(validInput({ phone: "------" }), "en").phone;
    const fr = validateFields(validInput({ phone: "------" }), "fr").phone;
    expect(en).not.toEqual(fr);
  });
});

describe("knockoutsFor", () => {
  const base = { workAuthorization: "hk-permanent", commissionOnly: "yes", adult: "yes" };

  it("flags nothing for a clean application", () => {
    expect(knockoutsFor(base)).toEqual([]);
  });

  it("flags candidates under 18", () => {
    expect(knockoutsFor({ ...base, adult: "no" })).toEqual(["No, I am under 18"]);
  });

  it.each(["needs-sponsorship", "remote-other", "student-visa"])("flags work authorisation %s", (workAuthorization) => {
    expect(knockoutsFor({ ...base, workAuthorization })).toHaveLength(1);
  });

  it("flags a refusal of commission-only pay", () => {
    expect(knockoutsFor({ ...base, commissionOnly: "no" })).toEqual(["No, I need a base salary"]);
  });

  it("lists several flags together", () => {
    expect(knockoutsFor({ workAuthorization: "needs-sponsorship", commissionOnly: "no", adult: "no" })).toHaveLength(3);
  });
});

describe("initialStatus", () => {
  it("rejects candidates who need a base salary", () => {
    expect(initialStatus({ commissionOnly: "no" })).toBe("rejected");
  });
  it("starts everyone else in applied", () => {
    expect(initialStatus({ commissionOnly: "yes" })).toBe("applied");
  });
});

describe("duplicatesOf / duplicateCounts", () => {
  const a = record({ id: "a", email: "Alice@Example.com", submittedAt: "2026-03-01T00:00:00Z" });
  const b = record({ id: "b", email: " alice@example.com ", submittedAt: "2026-01-01T00:00:00Z" });
  const otherJob = record({ id: "c", email: "alice@example.com", jobSlug: "other-job" });
  const other = record({ id: "d", email: "bob@example.com" });
  const all = [a, b, otherJob, other];

  it("matches the email case-insensitively, on the same job only, excluding itself, oldest first", () => {
    expect(duplicatesOf(a, all).map((r) => r.id)).toEqual(["b"]);
    expect(duplicatesOf(b, all).map((r) => r.id)).toEqual(["a"]);
    expect(duplicatesOf(otherJob, all)).toEqual([]);
    expect(duplicatesOf(other, all)).toEqual([]);
  });

  it("counts the other applications per email and job", () => {
    const count = duplicateCounts(all);
    expect(count(a)).toBe(1);
    expect(count(b)).toBe(1);
    expect(count(otherJob)).toBe(0);
    expect(count(other)).toBe(0);
  });
});

describe("ageLabel", () => {
  it("uses the yes/no answer on new applications", () => {
    expect(ageLabel({ adult: "yes" })).toBe("Yes, I am 18 or over");
    expect(ageLabel({ adult: "no" })).toBe("No, I am under 18");
  });
  it("falls back to the exact age on older applications", () => {
    expect(ageLabel({ adult: "", age: "21" })).toContain("21");
    expect(ageLabel({ adult: undefined as unknown as string, age: "21" })).toContain("21");
  });
  it("shows a dash when neither is set", () => {
    expect(ageLabel({ adult: "" })).toBe("—");
  });
});

describe("RETAINED_STAGES", () => {
  it("keeps offers and hires only", () => {
    expect([...RETAINED_STAGES].sort()).toEqual(["hired", "offer"]);
  });
});
