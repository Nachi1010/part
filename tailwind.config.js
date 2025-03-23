/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2vw",
      screens: {
        "2xl": "90vw",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        dark: {
          DEFAULT: "#1E293B",
          light: "#334155",
          darker: "#0F172A",
        },
        primary: {
          DEFAULT: "#1E293B",
          light: "#334155",
          dark: "#0F172A",
          glow: "#6366F1",
        },
        accent: {
          DEFAULT: "#DBA642",
          light: "#F6D58A",
          dark: "#B7853B",
          glow: "#FDE68A",
        },
        royal: {
          DEFAULT: "#6366F1",
          light: "#818CF8",
          dark: "#4F46E5",
          glow: "#C7D2FE",
        },
        gold: {
          DEFAULT: "#DBA642",
          light: "#F6D58A",
          dark: "#B7853B",
          glow: "#FDE68A",
        },
        secondary: {
          DEFAULT: "#020617",
          foreground: "#F8FAFC",
        },
      },
      textColor: {
        default: "hsl(var(--foreground))",
      },
      backgroundColor: {
        default: "hsl(var(--background))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
  ],
}

