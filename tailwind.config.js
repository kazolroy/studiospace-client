/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0c0a',
        panel: '#171512',
        raised: '#1f1c18',
        line: '#2d2921',
        amber: { DEFAULT: '#f2a33a', soft: '#f7c279', deep: '#c9801c' },
        cream: '#f6f0e4',
        mute: '#a59c8a',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: { glow: '0 0 40px -8px rgba(242,163,58,0.45)' },
      keyframes: {
        sweep: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        rise: { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: { sweep: 'sweep 1.8s linear infinite', rise: 'rise .5s ease both' },
    },
  },
  plugins: [],
};
