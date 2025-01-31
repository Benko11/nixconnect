import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: { display: ["MS-DOS", "monospace"] },
    colors: {
      default: {
        primary: "var(--primary-colour)",
        secondary: "var(--secondary-colour)",
        accent: "var(--accent-colour)",
        neutral: "var(--neutral-colour)",
        error: "var(--error-colour)",
        light: "var(--light-colour)",
        dark: "var(--dark-colour)",
        background: "#0B0C0E",
      },
    },
  },
  plugins: [],
} satisfies Config;
