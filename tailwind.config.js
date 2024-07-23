/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: "#86A789",
        secondary: "#D2E3C8",
        warning: "#F1C27B",
        abu: "#638889",
        dark: "#212529",
        dark2: "#25282b",
      },
    },
  },
  plugins: [],
};
