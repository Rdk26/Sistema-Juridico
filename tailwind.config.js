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
        primary: '#2A3F54',
        secondary: '#3B82F6',
        destructive: '#ef4444',
      }
    },
  },
  plugins: [],
}