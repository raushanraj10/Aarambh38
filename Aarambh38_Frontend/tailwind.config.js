/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2s infinite linear",
        'fade-in-out': 'fadeInOut 4s ease-in-out',
      },
      keyframes: {
        shimmer: {
          "0%": {
            backgroundPosition: "-100% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        fadeInOut: {
          "0%, 100%": { opacity: 0 },
          "10%, 90%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
