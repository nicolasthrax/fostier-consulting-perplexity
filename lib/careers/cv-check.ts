import { inflateRawSync } from "node:zlib";
import type { CvExtension } from "./config";

/**
 * Looks for things in a CV that can act when the file is opened, so the candidate's
 * page can say to open it with care (in a browser preview, or Word's Protected View).
 * Best effort: it reads what is in plain sight (a PDF's compressed objects aren't
 * unpacked), so no warning never means a file is safe. Never throws.
 */
export function cvWarnings(data: Buffer, ext: CvExtension): string[] {
  try {
    return ext === "pdf" ? pdfWarnings(data) : docxWarnings(data);
  } catch {
    return ["could not be fully checked"];
  }
}

// ——— PDF ———

const PDF_ACTIVE: [RegExp, string][] = [
  [/\/(JavaScript|JS)\b/, "contains JavaScript"],
  [/\/Launch\b/, "can try to launch a program"],
  [/\/EmbeddedFiles?\b/, "has files embedded in it"],
  [/\/(RichMedia|XFA)\b/, "has interactive content (Flash or an XFA form)"],
];

function pdfWarnings(data: Buffer) {
  // Names can hide behind #xx escapes (/J#61vaScript is /JavaScript).
  const text = data.toString("latin1").replace(/#([0-9A-Fa-f]{2})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
  return PDF_ACTIVE.filter(([re]) => re.test(text)).map(([, warning]) => warning);
}

// ——— Word (.docx, a ZIP of XML parts) ———

/** Relationship types that reach outside the file when Word opens it (hyperlinks are fine). */
const DOCX_EXTERNAL: [RegExp, string][] = [
  [/\/attachedTemplate$/, "loads a template from the internet when opened"],
  [/\/(subDocument|frame)$/, "pulls in another document from the internet"],
  [/\/(oleObject|package)$/, "links to an object outside the file"],
  [/\/image$/, "loads images from the internet (this can tell the sender when and where it was opened)"],
];

/** Largest part unpacked: relationship files are a few KB, so this stops a ZIP bomb. */
const MAX_PART = 1024 * 1024;

type Entry = { name: string; method: number; compressed: number; offset: number };

function docxWarnings(data: Buffer) {
  const entries = zipEntries(data);
  if (!entries) return ["isn't a readable Word file"];
  const warnings = new Set<string>();
  for (const e of entries) {
    if (/(^|\/)vbaProject\.bin$/i.test(e.name)) warnings.add("contains macros");
    else if (/^word\/embeddings\//i.test(e.name)) warnings.add("has files or objects embedded in it");
    else if (e.name.endsWith(".rels")) {
      const xml = entryText(data, e);
      if (xml === null) {
        warnings.add("could not be fully checked");
        continue;
      }
      for (const rel of xml.match(/<Relationship\b[^>]*>/g) ?? []) {
        if (!/TargetMode\s*=\s*["']External["']/.test(rel)) continue;
        const type = /Type\s*=\s*["']([^"']*)["']/.exec(rel)?.[1] ?? "";
        const match = DOCX_EXTERNAL.find(([re]) => re.test(type));
        if (match) warnings.add(match[1]);
      }
    }
  }
  return [...warnings];
}

/**
 * Whether a ZIP is a Word package (the package's content types and a word/ folder): any ZIP
 * starts with the same bytes, so a renamed archive would pass the signature check alone.
 * Null when the directory can't be read (ZIP64, some streaming writers): such a file may
 * still be a real CV, so it is accepted with cvWarnings' "isn't a readable Word file".
 */
export function isWordPackage(data: Buffer): boolean | null {
  const entries = zipEntries(data);
  if (!entries) return null;
  const names = entries.map((e) => e.name);
  return names.includes("[Content_Types].xml") && names.some((n) => n.startsWith("word/"));
}

/** The ZIP's central directory (no ZIP64: CVs are at most 4 MB), or null if it isn't a ZIP. */
function zipEntries(buf: Buffer): Entry[] | null {
  // The end-of-directory record is 22 bytes, followed by a comment of up to 64 KB.
  let end = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 0xffff); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      end = i;
      break;
    }
  }
  if (end < 0) return null;
  const count = buf.readUInt16LE(end + 10);
  let p = buf.readUInt32LE(end + 16);
  const entries: Entry[] = [];
  for (let n = 0; n < count; n++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== 0x02014b50) return null;
    const nameLength = buf.readUInt16LE(p + 28);
    entries.push({
      method: buf.readUInt16LE(p + 10),
      compressed: buf.readUInt32LE(p + 20),
      offset: buf.readUInt32LE(p + 42),
      name: buf.toString("utf8", p + 46, p + 46 + nameLength),
    });
    p += 46 + nameLength + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  return entries;
}

/** One part's text, or null if it can't be read (unknown compression, or larger than MAX_PART). */
function entryText(buf: Buffer, e: Entry): string | null {
  const p = e.offset;
  if (p + 30 > buf.length || buf.readUInt32LE(p) !== 0x04034b50) return null;
  const start = p + 30 + buf.readUInt16LE(p + 26) + buf.readUInt16LE(p + 28);
  const raw = buf.subarray(start, start + e.compressed);
  if (e.method === 0) return raw.length <= MAX_PART ? raw.toString("utf8") : null;
  if (e.method !== 8) return null;
  try {
    return inflateRawSync(raw, { maxOutputLength: MAX_PART }).toString("utf8");
  } catch {
    return null;
  }
}
