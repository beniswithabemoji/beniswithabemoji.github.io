/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [require("flowbite/plugin")],
};
