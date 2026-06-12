/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#22c55e',
          secondary: '#10b981',
          accent: '#059669',
          dark: '#000000',
        }
      }
    },
  },
  plugins: [],
}
