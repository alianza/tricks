/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
