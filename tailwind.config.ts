import type { Config } from "tailwindcss";

const config = {
  darkMode: 'class', // Changed from 'media' to 'class' for manual control
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#C9FB00', // Your specified accent color
        background: {
          DEFAULT: '#000000', // Black background
          input: '#333333', // Dark grey for input backgrounds
        },
        text: {
          DEFAULT: '#FFFFFF', // White text
          input: '#FFFFFF', // White text for inputs
        },
        button: {
          bg: '#000000', // Black background for buttons
          border: '#C9FB00', // Accent color for button borders
          text: '#FFFFFF', // White text for buttons
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;