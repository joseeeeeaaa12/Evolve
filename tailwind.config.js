/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'evolve-dark': '#0a0a0b',
        'evolve-gray': '#1a1a1b',
        'evolve-light-gray': '#2a2a2b',
        'evolve-blue': '#00d4ff',
        'evolve-green': '#00ff88',
        'evolve-text': '#ffffff',
        'evolve-text-muted': '#a0a0a0'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-green': 'pulseGreen 2s infinite'
      }
    },
  },
  plugins: [],
}