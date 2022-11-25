/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "var(--dark)",
        light: "var(--light)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "accent-0": "var(--accent-0)",
        "accent-1": "var(--accent-1)",
        "accent-2": "var(--accent-2)",
        "accent-3": "var(--accent-3)",
        "accent-4": "var(--accent-4)",
        "accent-5": "var(--accent-5)",
        "accent-6": "var(--accent-6)",
        "accent-7": "var(--accent-7)",
        "accent-8": "var(--accent-8)",
        "accent-9": "var(--accent-9)",
      },
      boxShadow: {
        "3xl": "0 0 6px rgba(0, 0, 0, 0.5)",
      },
      screens: {
        desktop: "900px", //var(--desktop)
        tablet: "600px", //var(--tablet)
        mobile: "480px", // var(--mobile)
        xs: "320px", // var(--xs)
      },
    },
  },
  plugins: [],
};
