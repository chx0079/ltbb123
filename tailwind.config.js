/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#2e87ad",
        "primary-dark": "#236a8a",
        "background-dark": "#0f171d",
        "profit-green": "#a3e635",
        "loss-red": "#f87171",
        "gold": "#fbbf24",
        "card-dark": "#1a1a1a",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-slight': 'bounce-slight 2s infinite',
        'type-left': 'type-left 0.5s infinite alternate',
        'type-right': 'type-right 0.5s infinite alternate-reverse',
        'float-up': 'float-up 1s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: .7, filter: 'brightness(1.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-slight': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'type-left': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-10deg) translateY(1px)' },
        },
        'type-right': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(10deg) translateY(1px)' },
        },
        'float-up': {
          '0%': { transform: 'translate(-50%, 0)', opacity: 1 },
          '100%': { transform: 'translate(-50%, -20px)', opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
