/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#E0F2FE',
          DEFAULT: '#0061FF',
          dark: '#0047BB',
          accent: '#60A5FA',
        },
        water: {
          light: '#BAE6FD',
          DEFAULT: '#0EA5E9',
          dark: '#0369A1',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 10s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}