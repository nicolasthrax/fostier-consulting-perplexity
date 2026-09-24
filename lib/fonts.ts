import { Playfair_Display, Inter, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Chinese fallbacks: listed after the Latin fonts, so Latin glyphs still come
// from Playfair/Inter and CJK chunks are only downloaded on pages that use them.
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
