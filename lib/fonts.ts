import { Newsreader, Bricolage_Grotesque } from "next/font/google";

// Newsreader is drawn by Production Type (Paris); its optical-size axis gives
// high-contrast display cuts for headlines and sturdier text cuts for quotes.
// Upright only: the design never uses italics, and the italic file alone is ~147 KB.
export const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal"],
  variable: "--font-serif",
  display: "swap",
});

// Bricolage Grotesque (Mathieu Triay) — body copy and UI.
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-sans",
  display: "swap",
});

// Chinese uses the system CJK fonts listed in tailwind.config.ts. Web-font Noto SC
// put ~128 KB of render-blocking @font-face CSS on every page, FR and EN included.
