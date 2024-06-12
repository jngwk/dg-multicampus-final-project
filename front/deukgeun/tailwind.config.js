/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "peach-fuzz": "#ffbe98",
      "bright-orange": "#fe8742",
      "grayish-red": "#9f8d8d",
      "light-gray": "#E6E6E6",
      ...colors,
    },
    fontFamily: {
      sans: ['"Noto Sans Kr"', "sans-serif"],
    },
    extend: {
      keyframes: {
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(-15deg)" },
        },
      },
      animation: {
        wave: "wave 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
