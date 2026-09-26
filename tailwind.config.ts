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
        navy: {
          DEFAULT: "#002395",
          50: "#EEF1F8",
          100: "#D6DCF0",
          700: "#001B73",
          800: "#001452",
          900: "#000D38",
        },
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
      },
      fontFamily: {
        serif: ["var(--font-serif)", "var(--font-serif-zh)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "var(--font-sans-zh)", "system-ui", "sans-serif"],
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
