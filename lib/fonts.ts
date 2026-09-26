import { Newsreader, Bricolage_Grotesque, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";

// Newsreader is drawn by Production Type (Paris); its optical-size axis gives
// high-contrast display cuts for headlines and sturdier text cuts for quotes.
export const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
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

// Chinese fallbacks: listed after the Latin fonts, so Latin glyphs still come
// from Newsreader/Bricolage and CJK chunks are only downloaded on pages that use them.
export const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "500", "600"],
  variable: "--font-serif-zh",
  display: "swap",
  preload: false,
});

export const notoSansSC = Noto_Sans_SC({
  variable: "--font-sans-zh",
  display: "swap",
  preload: false,
});
