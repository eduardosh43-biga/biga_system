/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'biga-orange': '#f5821f',
        'biga-dark': '#1a1a1a',
        'biga-slate': '#374151',
        'biga-cream': '#fdfcf0',
      },
      backgroundImage: {
        'chalkboard': "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
      }
    },
  },
  plugins: [],
}