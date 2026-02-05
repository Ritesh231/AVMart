/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This ensures Tailwind scans all subfolders
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1E294B",
          teal: "#49D1B1",
          cyan: "#00F2B5",
          soft: "#E6F7F3",
          gray: "#94A3B8",
        },
      },
    },
  },
  plugins: [],
};
