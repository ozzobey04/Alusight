/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c870',
          dark: '#a07828',
          50:  '#fdf8ec',
          100: '#f9efce',
          200: '#f2dc8f',
          300: '#eac95c',
          400: '#d4a853',
          500: '#c9a84c',
          600: '#a07828',
          700: '#7a5818',
          800: '#5a3e10',
          900: '#3a2808',
        },
        ozzo: {
          950: '#05050d',
          900: '#080810',
          800: '#0d0d1a',
          700: '#12121f',
          600: '#181828',
          500: '#1e1e30',
          400: '#252540',
          300: '#303050',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.8s ease forwards',
        'scale-in': 'scaleIn 0.5s ease forwards',
        'counter': 'counterSpin 2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
