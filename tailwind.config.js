/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '400px',
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
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primarylight: '#16a34a',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animationDuration: {
        1000: '1000ms',
        2000: '2000ms',
        3000: '3000ms',
        4000: '4000ms',
        5000: '5000ms',
      },
      animationDelay: {
        '00005': '0.5ms',
        1000: '1000ms',
        2000: '2000ms',
        3000: '3000ms',
        4000: '4000ms',
        5000: '5000ms',
      },
      keyframes: {
        zoomIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0.1' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(200%)' },
          '100%': { transform: 'translateX(30%)' },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        zoomIn: 'zoomIn ease-in',
        zoomOut: 'zoomOut ease-in',
        slideIn: 'slideIn ease-in',
        fadeIn: 'fadeIn ease-in',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-animation')],
};
