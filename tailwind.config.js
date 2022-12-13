/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/layouts/**/*.{ts,tsx}',
    './src/modules/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1080px',
      xl: '1380px',
      '2xl': '1536px',
      '3xl': '1600px',
    },
    fontFamily: {
      sans: ['Helvetica', 'Arial', 'sans-serif'],
      roboto: ['Roboto Condensed', 'sans-serif'],
      pacifico: ['Pacifico', 'cursive'],
      raleway: ['Raleway', 'sans-serif'],
      comfortaa: ['Comfortaa', 'cursive'],
    },
    extend: {
      colors: {
        primary: '#15803d',
        primarylight: '#16a34a',
      },
      animationDuration: {
        1000: '1000ms',
        2000: '2000ms',
        3000: '3000ms',
        4000: '4000ms',
        5000: '5000ms',
      },
      animationDelay: {
        00005: '0.5ms',
        1000: '1000ms',
        2000: '2000ms',
        3000: '3000ms',
        4000: '4000ms',
        5000: '5000ms',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0.1' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(200%)' },
          '100%': { transform: 'translateX(30%)' },
        },
      },
      animation: {
        slideIn: 'slideIn ease-in',
        fadeIn: 'fadeIn ease-in',
      },
    },
  },
  plugins: [require('tailwindcss-animation')],
};
