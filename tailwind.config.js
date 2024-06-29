/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'server.js',
    'public/*.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

