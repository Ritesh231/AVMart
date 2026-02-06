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
          navy: "#1A2550",
          teal: "#49D1B1",
          cyan: "#00E9BE",
          soft: "#E6F7F3",
          gray: "#94A3B8",
          blue: "#DCF0FF",
          green: "#57FB6866",
        },
      },
    },
  },
  plugins: [],
};
