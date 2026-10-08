import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cjkChars } from "../scripts/zh-serif-chars.mjs";

const root = join(__dirname, "..");
const files = (dir: string): string[] =>
  readdirSync(join(root, dir)).flatMap((name) => {
    const path = join(dir, name);
    return statSync(join(root, path)).isDirectory() ? files(path) : /\.(ts|tsx)$/.test(name) ? [path] : [];
  });

describe("Chinese serif subset", () => {
  it("covers every CJK character in the site's copy", () => {
    const used = cjkChars(["lib", "app", "components"].flatMap(files).map((f) => readFileSync(join(root, f), "utf8")).join(""));
    const subset = new Set(readFileSync(join(root, "scripts/zh-serif-chars.txt"), "utf8").trim());
    // If this fails, run `npm run zh-font` and commit the regenerated files.
    expect(used.filter((c) => !subset.has(c)).join("")).toBe("");
  });

  it("points every @font-face at a file in public/fonts", () => {
    const css = readFileSync(join(root, "app/zh-serif.css"), "utf8");
    const urls = [...css.matchAll(/url\("\/(fonts\/[^"]+)"\)/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(existsSync(join(root, "public", url))).toBe(true);
  });
});
