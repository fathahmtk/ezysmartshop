import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        accent: "#06B6D4",
        mist: "#E2F4F8",
        shell: "#F8FAFC"
      },
      boxShadow: {
        card: "0 24px 80px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.12) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;

