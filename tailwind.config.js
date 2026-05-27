/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-light': '#eae3d5',
        'bg-dark': '#070707',
        'text-dark': '#221f1d',
        'text-light': '#f5efe6',
        'paper-color': '#dfd4be',
        'paper-color-left': '#d8cca4',
        'paper-color-right': '#d8cca4',
        'paper-color-bottom': '#cbbfa7',
        'paper-color-top-outer': '#ebdcb9',
        'paper-color-top-inner': '#d3c7b0',
        'gold-primary': '#c3a67d',
        'gold-light': '#ebd6ba',
        'gold-dark': '#8b6e4b',
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
