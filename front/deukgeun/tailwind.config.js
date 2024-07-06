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
      "light-black": "#4E4C4F",
      "floral-white": "#f7f5f2",
      ...colors,
    },
    fontFamily: {
      sans: ['"Noto Sans Kr"', "sans-serif"],
    },
    extend: {
      keyframes: {
        jelly: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(0.9, 1.1)" },
          "50%": { transform: "scale(1.1, 0.9)" },
          "75%": { transform: "scale(0.95, 1.05)" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(-15deg)" },
        },
        fadeInOut: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
        propel: {
          "0%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(25%)" },
          "40%": { transform: "translateX(-25%)" },
          "60%": { transform: "translateX(25%)" },
          "100%": { transform: "translateX(-25%)" },
        },
      },
      animation: {
        wave: "wave 0.5s ease-in-out infinite",
        fadeInOut: "fadeInOut 2s infinite",
        jelly: "jelly 0.5s",
      },
    },
    variants: {
      extend: {
        animation: ["hover"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
