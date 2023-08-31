/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./**/*.html', './**/*.js'],
 // You can specify the files to scan for classes here
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")
],
  daisyui: {
    themes: ["retro"], // This will include only the 'Retro' theme
  },
}
