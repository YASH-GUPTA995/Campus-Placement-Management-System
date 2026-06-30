/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1E3A5F", 50: "#EFF6FF", 100: "#DBEAFE", 500: "#2563EB", 600: "#1d4ed8" },
      },
    },
  },
  plugins: [],
};
