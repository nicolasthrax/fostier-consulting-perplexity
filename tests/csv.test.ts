import { describe, expect, it } from "vitest";
import { applicationsCsv, csvCell } from "@/lib/careers/csv";
import { record } from "./fixtures";

describe("csvCell", () => {
  it("leaves plain values alone", () => {
    expect(csvCell("Alice Martin")).toBe("Alice Martin");
    expect(csvCell("")).toBe("");
  });

  it("quotes values with commas, quotes or newlines", () => {
    expect(csvCell("Martin, Alice")).toBe('"Martin, Alice"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("line1\nline2")).toBe('"line1\nline2"');
    expect(csvCell("line1\r\nline2")).toBe('"line1\r\nline2"');
  });

  it.each(["=SUM(A1)", "+852 6123", "-1", "@cmd"])("neutralises the formula-like value %j", (v) => {
    expect(csvCell(v)).toBe(`'${v}`);
  });

  it("neutralises and quotes a formula containing a comma", () => {
    expect(csvCell("=HYPERLINK(a,b)")).toBe(`"'=HYPERLINK(a,b)"`);
  });
});

describe("applicationsCsv", () => {
  const csv = applicationsCsv([
    record({ id: "r1", fullName: "Zoé, Dupont", phone: "+852 6123 4567", knockouts: ["A", "B"] }),
    record({ id: "r2", fullName: "Bob" }),
  ]);

  it("starts with a BOM and ends with CRLF", () => {
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("has a header row then one CRLF-separated row per application", () => {
    const lines = csv.slice(1).split("\r\n");
    expect(lines.pop()).toBe("");
    expect(lines).toHaveLength(3);
    expect(lines[0].startsWith("Reference,Submitted,Position,Status,Full name,Email,Phone")).toBe(true);
    expect(lines[1].startsWith("r1,")).toBe(true);
    expect(lines[1]).toContain('"Zoé, Dupont"');
    expect(lines[1]).toContain("'+852 6123 4567");
    expect(lines[1]).toContain("A; B");
    expect(lines[2].startsWith("r2,")).toBe(true);
  });

  it("writes only the header for no applications", () => {
    expect(applicationsCsv([]).slice(1).split("\r\n")).toHaveLength(2);
  });
});
