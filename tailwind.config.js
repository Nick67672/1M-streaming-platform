/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#03A9F4',
        'primary-dark': '#0288D1',
        'primary-light': '#29B6F6',
      },
    },
  },
  plugins: [],
};