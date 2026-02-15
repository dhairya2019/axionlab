/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0e",
        accent: "#ff1f3d",
        muted: "#888888",
        surface: "#1a1a1a",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        condensed: ["Inter Tight", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};