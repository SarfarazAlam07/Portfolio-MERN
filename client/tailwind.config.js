/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        textMain: "var(--text-main)",
        textMuted: "var(--text-muted)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        borderColor: "var(--border)",
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      }
    },
  },
  plugins: [],
}