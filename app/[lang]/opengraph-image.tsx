import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { locales, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** A headline line is a list of runs; `em` runs are set in italic (Latin scripts only). */
type Run = string | { em: string };

/**
 * The card copy, written as one message in three languages: the same two-line headline
 * and the same subtitle, broken at fixed points so every locale has the same layout.
 */
const copy: Record<Locale, { lines: [Run[], Run[]]; subtitle: string }> = {
  fr: {
    lines: [["Votre patrimoine, conseillé"], [{ em: "en français" }, " à Hong Kong."]],
    subtitle: "Conseil financier et fiscal aux résidents français en Asie.",
  },
  en: {
    lines: [["Wealth advice ", { em: "in French" }, ","], ["here in Hong Kong."]],
    subtitle: "Investment and tax advice for French residents in Asia.",
  },
  zh: {
    lines: [["在香港，"], ["用法语为您规划财富。"]],
    subtitle: "为在亚洲的法国居民提供投资与税务建议。",
  },
};

const runText = (run: Run) => (typeof run === "string" ? run : run.em);

/**
 * Fetch a Google Fonts family subset to `text` at build time (TTF, which Satori reads).
 * Returns null on failure so the card still renders with the default font.
 */
async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`);
    const src = res.ok ? (await res.text()).match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1] : undefined;
    const font = src ? await fetch(src) : null;
    return font?.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Locale };
  const { lines, subtitle } = copy[lang];
  const runs = lines.flat();
  const plain = runs.filter((r) => typeof r === "string").map(runText).join("") + subtitle;
  const italic = runs.filter((r) => typeof r !== "string").map(runText).join("");

  // Night skyline with the logo, text-free; the copy is set on top of it.
  const background = await readFile(join(process.cwd(), "lib/og-background.jpg"));
  const [serif, serifItalic, cjk] = await Promise.all([
    lang === "zh" ? null : loadGoogleFont("Newsreader:opsz,wght@72,400", plain),
    italic ? loadGoogleFont("Newsreader:ital,opsz,wght@1,72,400", italic) : null,
    lang === "zh" ? loadGoogleFont("Noto+Serif+SC:wght@500", plain) : null,
  ]);
  const fonts = [
    serif && { name: "Newsreader", data: serif, weight: 400 as const, style: "normal" as const },
    serifItalic && { name: "Newsreader", data: serifItalic, weight: 400 as const, style: "italic" as const },
    cjk && { name: "Noto Serif SC", data: cjk, weight: 500 as const, style: "normal" as const },
  ].filter((f) => !!f);
  const fontFamily = cjk ? "Noto Serif SC" : "Newsreader";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${background.toString("base64")}`}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div style={{ position: "absolute", top: 271, left: 100, display: "flex", flexDirection: "column" }}>
          <div style={{ width: 72, height: 4, background: "#ff3131" }} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: 20, fontSize: 64, lineHeight: 1.1, color: "#ffffff" }}>
            {lines.map((line, i) => (
              <div key={i} style={{ display: "flex", whiteSpace: "pre" }}>
                {line.map((run, j) =>
                  typeof run === "string" ? <span key={j}>{run}</span> : <span key={j} style={{ fontStyle: "italic" }}>{run.em}</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "#c5ccea" }}>{subtitle}</div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
