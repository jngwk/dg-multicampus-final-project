/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "peach-fuzz": "#ffbe98",
      "bright-orange": "#fe8742",
      "grayish-red":"#9f8d8d",
      "light-gray":"#E6E6E6",
      ...colors,
    },
    fontFamily: {
      sans: ["Noto Sans Kr"],
    },
    extend: {},
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
