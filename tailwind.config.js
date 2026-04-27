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

          cyan: "linear-gradient(135deg, #FD610D 0%, #FF8800 100%)",
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
