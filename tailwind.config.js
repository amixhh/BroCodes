/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,jsx,mdx}",
    "./src/components/**/*.{js,jsx,mdx}",
    "./src/app/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        dark: '#1b1b1e',
        primary: '#ffaa00',
        secondary: '#6e44ff',
      },
      minWidth: {
        '74': '18.5rem',
      },
      maxWidth: {
        '54': '13.5rem',
      },
    },
  },
  plugins: [],
};

module.exports = config; 