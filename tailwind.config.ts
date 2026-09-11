import type { Config } from "tailwindcss";

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
          50: "#EEF1FB",
          100: "#D9DFF5",
          700: "#001B73",
          800: "#001452",
          900: "#000D38",
        },
        fred: "#ED2939",
        ink: "#111827",
        slate: "#1F2937",
        parchment: "#F8F8F6",
        line: "#E5E7EB",
        muted: "#6B7280",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "72rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,24,39,.04), 0 8px 24px rgba(17,24,39,.06)",
        lift: "0 2px 4px rgba(17,24,39,.05), 0 16px 40px rgba(0,35,149,.10)",
      },
    },
  },
  plugins: [],
};

export default config;
