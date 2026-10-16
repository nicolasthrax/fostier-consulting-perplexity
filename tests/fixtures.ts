import { deflateRawSync } from "node:zlib";
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

/** A minimal ZIP (CRCs left at 0: the check doesn't verify them). */
export function zip(files: Record<string, string | Buffer>, method: 0 | 8 = 8) {
  const parts: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const raw = Buffer.from(content);
    const data = method === 8 ? deflateRawSync(raw) : raw;
    const nameBuf = Buffer.from(name);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(method, 8);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(method, 10);
    entry.writeUInt32LE(data.length, 20);
    entry.writeUInt32LE(raw.length, 24);
    entry.writeUInt16LE(nameBuf.length, 28);
    entry.writeUInt32LE(offset, 42);
    parts.push(local, nameBuf, data);
    central.push(entry, nameBuf);
    offset += 30 + nameBuf.length + data.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(central.length / 2, 8);
  end.writeUInt16LE(central.length / 2, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, directory, end]);
}
