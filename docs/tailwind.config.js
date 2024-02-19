/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Permanent Marker", "cursive"],
        sans: ["Rubik", "ui-sans-serif", "sans-serif"],
      },
      screens: {
        tall: { raw: "(min-height: 800px)" },
        xtall: { raw: "(min-height: 900px)" },
      },
    },
  },
  plugins: [],
};
