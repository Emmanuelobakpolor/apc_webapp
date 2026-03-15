/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002C3D', // Dark blue from the sidebar
          hover: '#003F54',
          light: '#F5F9FA',
        },
        accent: {
          DEFAULT: '#476D7C', // Secondary blue/gray from buttons/tabs
          light: '#D9E2E5',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        card: {
          DEFAULT: '#FFFFFF',
          hover: '#FAFAFA',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [],
}
