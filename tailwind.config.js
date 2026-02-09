/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mural-azul': '#2563EB',
        'mural-verde': '#22C55E',
      }
    },
  },
  plugins: [],
}