/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#86A789",
        secondary: "#D2E3C8",
        warning: "#F1C27B",
        abu: "#638889",
      },
    },
  },
  plugins: [],
};
