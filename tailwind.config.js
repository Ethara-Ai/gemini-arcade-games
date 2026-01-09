/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          brick: '#06b6d4', // Cyan-500
          tile: '#f59e0b',  // Amber-500
          snake: '#22c55e', // Green-500
          highlight: '#ec4899', // Pink-500
          dark: '#0a0a0a',
          glass: 'rgba(255, 255, 255, 0.05)',
          'glass-border': 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

