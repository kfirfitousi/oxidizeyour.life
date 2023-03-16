const { fontFamily, screens } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
    screens: {
      xs: "480px",
      ...screens,
    },
  },
  plugins: [],
  darkMode: ["class", "[data-theme='dark']"],
};

module.exports = config;
