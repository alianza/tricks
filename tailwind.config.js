/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
    extend: {
      screens: {
        xsm: '420px',
        touch: { raw: '(hover: none)' },
      },
      spacing: {
        header: '5rem',
        footer: '3rem',
        desktopNav: '18rem',
      },
    },
  },
};
