import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: { display: ["MS-DOS"] },
    colors: {
      default: {
        primary: "hsl(220, 70%, 70%)",
        secondary: "hsl(12, 80%, 27%)",
        accent: "hsl(300, 80%, 30%)",
        neutral: "hsl(0, 0%, 20%)",
        error: "hsl(60, 100%, 50%)",
        light: "hsl(220, 5%, 90%)",
        dark: "hsl(220, 5%, 10%)",
        background: "#0B0C0E",
      },
    },
  },
  plugins: [],
} satisfies Config;
