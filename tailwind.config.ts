import type { Config } from "tailwindcss";

const config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#C9FB00',
        background: {
          DEFAULT: '#000000',
          input: '#333333',
        },
        text: {
          DEFAULT: '#FFFFFF',
          input: '#FFFFFF',
        },
        button: {
          bg: '#000000',
          border: '#C9FB00',
          text: '#FFFFFF',
        },
      },
      fontSize: {
        'xs-mobile': ['0.75rem', { lineHeight: '1rem' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.25rem' }],
        'base-mobile': ['1rem', { lineHeight: '1.5rem' }],
        'lg-mobile': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl-mobile': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl-mobile': ['1.5rem', { lineHeight: '2rem' }],
      },
      spacing: {
        'mobile': '1rem',
        'desktop': '1.5rem',
      },
      borderRadius: {
        'mobile': '0.5rem',
        'desktop': '0.75rem',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;