/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./app/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'kingdom': {
          dark: '#1e293b',
          darker: '#0f172a',
          slate: '#334155',
          border: '#64748b',
        }
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
      }
    },
  },
  plugins: [],
}
