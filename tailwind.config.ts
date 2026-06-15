import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#071522",
        navy: "#0B2134",
        panel: "#102B40",
        gold: "#D7A93B",
        ivory: "#F5F2E9",
        mist: "#A9B7C4",
        cyan: "#6ED8E0",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Arial", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(110, 216, 224, 0.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;
