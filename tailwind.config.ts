import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        pretendard: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        caprasimo: ['Caprasimo', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        DEFAULT: '-0.025em',
      },
      lineHeight: {
        DEFAULT: '1.4',
      },
      colors: {
        brand: {
          green: '#2D5016',
          'green-light': '#4A7C2C',
          brown: '#5C4033',
          'brown-light': '#8B6F47',
          beige: '#D4C5B9',
          'beige-light': '#E8DDD3',
          black: '#1A1A1A',
          grey: '#6B7280',
          'grey-light': '#9CA3AF',
          primary: '#2768ec',
          'primary-dark': '#1a52c8',
          'primary-light': '#5a8ef2',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
