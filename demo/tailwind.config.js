/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ui: ['Quicksand', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Playfair Display', 'serif'],
        thena: ['Syne', 'sans-serif'],
        'thena-mono': ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
