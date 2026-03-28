/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Agri Green (Premium Natural Leaf) - Primary
        primary: {
          50: '#f1f8f3',
          100: '#deefe3',
          200: '#bfded0',
          300: '#95c6ae',
          400: '#67a686',
          500: '#468b6c',
          600: '#346f54',
          700: '#2a5944',
          800: '#244838',
          900: '#1e3c2f',
          950: '#0f211a',
        },
        // Harvest Amber (Warm Wheat/Clay) - Secondary
        secondary: {
          50: '#fdf8f0',
          100: '#fbeedb',
          200: '#f7dcb7',
          300: '#f2c388',
          400: '#eaa053',
          500: '#e38229',
          600: '#d5681c',
          700: '#b14d18',
          800: '#8c3d18',
          900: '#713416',
          950: '#3c1809',
        },
        // Sun Gold - Accent
        accent: {
          400: '#f5c347',
          500: '#eab308',
          600: '#ca8a04',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}