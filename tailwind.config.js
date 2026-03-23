/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/client/**/*.{vue,ts}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Great Vibes', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FFFDF7',
          100: '#FFF9E8',
          200: '#FFF3D1',
          300: '#FFEAB3',
          400: '#FFE09A',
          500: '#FFD680',
        },
        gold: {
          300: '#F5D490',
          400: '#D4A853',
          500: '#B8860B',
          600: '#996F0A',
          700: '#7A5908',
        },
        sage: {
          50: '#F5F7F2',
          100: '#E8EDE0',
          200: '#D1DBC1',
          300: '#B3C49A',
          400: '#8FA872',
          500: '#6B8C4E',
          600: '#557038',
        },
        blush: {
          50: '#FFF5F5',
          100: '#FFE8E8',
          200: '#FFD4D4',
          300: '#FFADAD',
          400: '#FF8A8A',
          500: '#E86B6B',
        },
      },
    },
  },
  plugins: [],
}
