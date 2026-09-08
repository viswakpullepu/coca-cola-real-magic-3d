/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coke: {
          red: {
            DEFAULT: '#F40009',
            light: '#FF1A24',
            dark: '#BA0007',
            deep: '#7A0005',
          },
          black: {
            DEFAULT: '#111111',
            pure: '#050505',
            surface: '#181818',
            elevated: '#242424',
            border: '#2E2E2E',
          },
          silver: {
            DEFAULT: '#E5E7EB',
            light: '#F3F4F6',
            dark: '#9CA3AF',
            metallic: '#D1D5DB',
          },
          gold: {
            DEFAULT: '#F59E0B',
            light: '#FBBF24',
            glow: '#FEF3C7',
          },
          cherry: {
            DEFAULT: '#D90429',
            dark: '#8B0000',
            glow: '#FF2A55',
          },
          y3000: {
            cyan: '#00F5D4',
            pink: '#FF0055',
            purple: '#7B2CBF',
            silver: '#E0AAFF',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 35px -5px rgba(244, 0, 9, 0.45)',
        'glow-cyan': '0 0 35px -5px rgba(0, 245, 212, 0.45)',
        'glow-gold': '0 0 35px -5px rgba(245, 158, 11, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fizz': 'fizz 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fizz: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'translateY(-60px) scale(1.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
