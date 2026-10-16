import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApplicationRecord } from "@/lib/careers/config";
import { validInput, zip } from "./fixtures";

const deliver = vi.fn(async (_record: ApplicationRecord) => true);
vi.mock("next/server", async (original) => ({ ...(await original<typeof import("next/server")>()), after: vi.fn() }));
vi.mock("@/lib/careers/botid", () => ({ blockedAsBot: async () => false }));
vi.mock("@/lib/careers/deliver", () => ({ deliverApplication: (record: ApplicationRecord) => deliver(record) }));
vi.mock("@/lib/careers/email", () => ({ sendApplicationEmails: vi.fn() }));

const { POST } = await import("@/app/careers/api/apply/route");

const PDF = Buffer.from("%PDF-1.4\n%%EOF\n");

function apply(fields: Record<string, string> = {}, cv: File | null = new File([PDF], "cv.pdf")) {
  const body = new FormData();
  for (const [k, v] of Object.entries({ ...validInput(), job: "financial-consultant", lang: "en", consent: "yes", ...fields })) body.append(k, v);
  if (cv) body.append("cv", cv);
  return POST(new Request("http://localhost/careers/api/apply", { method: "POST", body }));
}

beforeEach(() => deliver.mockClear());

describe("POST /careers/api/apply", () => {
  it("stores a valid application with its reference", async () => {
    const res = await apply();
    expect(res.status).toBe(200);
    const { id } = await res.json();
    expect(deliver).toHaveBeenCalledOnce();
    expect(deliver.mock.calls[0][0]).toMatchObject({ id, fullName: "Alice Martin", status: "applied" });
  });

  it("answers the honeypot without a reference, and stores nothing", async () => {
    const res = await apply({ company_website: "https://spam.example" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("removes control and bidi characters from answers and the CV's name", async () => {
    await apply({ fullName: "Alice‮ Martin\u0000" }, new File([PDF], "cv‮fdp.pdf"));
    const record = deliver.mock.calls[0][0];
    expect(record.fullName).toBe("Alice Martin");
    expect(record.cv?.originalName).toBe("cvfdp.pdf");
  });

  it("refuses a ZIP renamed .docx, but keeps a Word file whose directory it can't read", async () => {
    const otherZip = zip({ "photo.jpg": "x" });
    expect((await apply({}, new File([otherZip], "cv.docx"))).status).toBe(400);
    expect(deliver).not.toHaveBeenCalled();

    const unreadable = Buffer.concat([Buffer.from("504b0304", "hex"), Buffer.alloc(40)]);
    expect((await apply({}, new File([unreadable], "cv.docx"))).status).toBe(200);
    expect(deliver.mock.calls[0][0]).toMatchObject({ cv: { warnings: ["isn't a readable Word file"] } });
  });
});
