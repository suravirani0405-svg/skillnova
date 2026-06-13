/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--brand-primary, #22c55e)',
        'brand-secondary': 'var(--brand-secondary, #10b981)',
        'brand-accent': 'var(--brand-accent, #059669)',
      }
    },
  },
  plugins: [],
}
