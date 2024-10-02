const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textShadow: {
        DEFAULT: '2.9px 1px 1px var(--tw-shadow-color), 0 0 1em var(--tw-shadow-color), 0 0 0.2em cyan',
        dark: '2.9px 1px 1px var(--tw-shadow-color), 0 0 1em var(--tw-shadow-color), 0 0 0.2em cyan',
        light: '2.9px 1px 1px var(--tw-shadow-color), 0 0 1em var(--tw-shadow-color), 0 0 0.2em black',
      },
      colors: {
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
      }
    },

  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
          {
            'text-shadow': (value) => ({
              textShadow: value,
            }),
          },
          { values: theme('textShadow') }
      )
    }),
  ],
}
