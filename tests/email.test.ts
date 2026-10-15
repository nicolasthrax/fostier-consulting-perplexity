import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendApplicationEmails } from "@/lib/careers/email";
import { record } from "./fixtures";

const fetchMock = vi.fn<typeof fetch>();
let errors: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.CAREERS_EMAIL_FROM = "Careers <careers@example.com>";
  errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
  delete process.env.RESEND_API_KEY;
  delete process.env.CAREERS_EMAIL_FROM;
  errors.mockRestore();
});

describe("sendApplicationEmails", () => {
  it("logs Resend's status and error code, never its message, which can quote the recipient", async () => {
    const email = "alice@example.com";
    fetchMock.mockImplementation(async () =>
      Response.json({ statusCode: 422, name: "validation_error", message: `Invalid \`to\` field: ${email}` }, { status: 422 })
    );
    await sendApplicationEmails(record({ email }), "Financial consultant");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const logged = JSON.stringify(errors.mock.calls);
    expect(logged).toContain("Resend responded 422 (validation_error)");
    expect(logged).not.toContain(email);
  });

  it("copes with an error that has no JSON body", async () => {
    fetchMock.mockImplementation(async () => new Response("Bad gateway", { status: 502 }));
    await sendApplicationEmails(record(), "Financial consultant");
    expect(JSON.stringify(errors.mock.calls)).toContain("Resend responded 502");
  });
});
