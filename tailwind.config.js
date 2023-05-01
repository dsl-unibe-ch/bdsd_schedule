/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,js}"],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

