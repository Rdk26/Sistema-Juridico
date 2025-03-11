module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A3F54',
        secondary: '#3B82F6',
        destructive: {
          DEFAULT: '#dc2626', // Vermelho padrão
          foreground: '#ffffff', // Texto branco
        },
      }
    },
  },
  plugins: [],
}