module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'calc-dark': '#1a1a1a',
        'calc-button': '#2d2d2d',
        'calc-primary': '#3b82f6',
        'calc-secondary': '#4f46e5',
      }
    },
  },
  plugins: [],
}