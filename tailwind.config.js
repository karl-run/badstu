/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'highlight': 'inset 0 0 0 1px hsla(0,0%,100%,.1)',
        'highlight-white': 'inset 0 0 0 1px hsla(0,0%,100%,.1)',
      },
    },
  },
  plugins: [],
};
