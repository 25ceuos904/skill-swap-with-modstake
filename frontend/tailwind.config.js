/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#F8F1F5',
          card: '#E1CBD7',
          primary: '#C38EB4',
          'primary-hover': '#B37AA4',
          secondary: '#86A8CF',
          'secondary-hover': '#6F93BE',
          text: '#26425A',
          muted: '#5A7288',
          border: '#D4B8C9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
