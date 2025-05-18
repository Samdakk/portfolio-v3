/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./sections/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        dark: '#1F2937',
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
  corePlugins: {
    preflight: true,
  },
  important: true,
  safelist: [
    'hero-title',
    'typing-effect',
    'cube',
    'section',
    'custom-cursor',
    'cursor-dot',
    'focus:ring-2',
    'focus:ring-primary',
    'focus:border-primary',
    'transition-colors',
    'border-gray-300',
    'rounded-lg',
    'px-4',
    'py-3',
    'w-full'
  ]
} 