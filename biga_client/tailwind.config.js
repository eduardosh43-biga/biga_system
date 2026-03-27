/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'biga-red': '#e11d48', // Color personalizado para tu marca
        }
      },
    },
    plugins: [],
  }