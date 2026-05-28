/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['Oswald', 'sans-serif'], body: ['DM Sans', 'sans-serif'] }
    }
  },
  plugins: []
};
