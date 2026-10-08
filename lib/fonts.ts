import { Newsreader, Bricolage_Grotesque } from "next/font/google";

// Newsreader is drawn by Production Type (Paris); its optical-size axis gives
// high-contrast display cuts for headlines and sturdier text cuts for quotes.
// Upright only: the design never uses italics, and the italic file alone is ~147 KB.
// `opsz` stays (headlines rely on it) and costs ~74 KB: without it the latin file is ~58 KB.
// Only `latin` is preloaded; it covers French accents, œ and €.
export const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
  // next/font has no metrics for Newsreader, so it can't build a size-adjusted fallback
  // (it logs an error and skips it). The serif stack in tailwind.config.ts falls back to Georgia.
  adjustFontFallback: false,
});

// Bricolage Grotesque (Mathieu Triay) — body copy and UI.
// Weight axis only: the sans is set at text sizes (display type is Newsreader), where
// the default optical size (14) is what `opsz` would pick anyway, and dropping the
// axis cuts the latin file from ~77 KB to ~41 KB.
// (Google serves the full weight range whatever range is asked for, and static
// weights cost more than the one variable file, so `weight` stays variable.)
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  style: ["normal"],
  variable: "--font-sans",
  display: "swap",
});

// Chinese sans uses the system CJK fonts listed in tailwind.config.ts. Web-font Noto SC
// put ~128 KB of render-blocking @font-face CSS on every page, FR and EN included.
// The Chinese serif is a self-hosted Noto Serif SC subset instead (app/zh-serif.css,
// built by `npm run zh-font`): iOS has no Chinese serif, so iPhones fell back to PingFang.
