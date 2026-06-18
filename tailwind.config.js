/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './404.html', './privacy.html', './assets/**/*.js'],
  theme: {
    extend: {
      screens: { xs: '375px' },
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        },
        cta: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0D9488',
          600: '#0F766E',
          700: '#115E59'
        },
        accent: {
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8'
        },
        heading: '#1E293B',
        surface: {
          page: '#F7F9FC',
          muted: '#F1F5F9',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        soft: '0 2px 16px -2px rgba(30, 58, 95, 0.07)',
        card: '0 8px 28px -6px rgba(30, 58, 95, 0.10)',
        glow: '0 12px 40px -8px rgba(30, 58, 138, 0.18)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
