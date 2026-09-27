import type { Config } from "tailwindcss";

// Tokens are documented in DESIGN.md. Neutrals are tinted towards the brand
// blue on purpose — avoid reintroducing Tailwind's stock grays.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#002395",
        nuit: "#0A1650",
        fred: {
          DEFAULT: "#ED2939",
          700: "#C81C2B",
        },
        ink: "#141A38",
        slate: "#353B5C",
        muted: "#5A6082",
        line: "#D9DCE8",
        mist: "#EEF1F8",
        // WeChat green, darkened from the brand #07C160 so the white icon clears 3:1 (4.45:1).
        wechat: { DEFAULT: "#058A42", 700: "#047A3A" },
      },
      fontFamily: {
        // Latin glyphs come from the web fonts; CJK falls through to the system fonts.
        serif: ["var(--font-serif)", "Songti SC", "STSong", "Noto Serif CJK SC", "Source Han Serif SC", "SimSun", "Georgia", "serif"],
        sans: ["var(--font-sans)", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "76rem",
      },
      boxShadow: {
        // Only for layers that float above the page (modal, tooltip).
        pop: "0 1px 0 rgba(20,26,56,.04), 0 18px 48px -12px rgba(10,22,80,.28)",
      },
    },
  },
  plugins: [],
};

export default config;
