import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ef',
          200: '#b5c6dc',
          300: '#8bacc7',
          400: '#6192b3',
          500: '#3d7a9e',
          600: '#2d5f7f',
          700: '#1f4666',
          800: '#163144',
          900: '#0c1b26'
        },

        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        },

        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        },

        "dark-bg": {
          DEFAULT: colors.slate[900],
          secondary: colors.slate[800],
          tertiary: colors.slate[700]
        },
        "dark-text": {
          DEFAULT: colors.gray[100],
          secondary: colors.gray[300],
          muted: colors.gray[400]
        },

        "light-bg": {
          DEFAULT: colors.gray[50],
          secondary: colors.gray[100],
          tertiary: colors.gray[200]
        },
        "light-text": {
          DEFAULT: colors.gray[900],
          secondary: colors.gray[700],
          muted: colors.gray[500]
        },

        success: colors.green,
        warning: colors.amber,
        error: colors.red,
        info: colors.blue
      },

      fontSize: {
        '2xs': '0.625rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem'
      },

      boxShadow: {
        'light': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },

      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
  },
  plugins: [],
};
