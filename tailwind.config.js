/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1E2A5A",
          soft: "#F8FAFC",
          cyan: "#E6FBF7",
          teal: "#2EE6C5",
          gray: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};
