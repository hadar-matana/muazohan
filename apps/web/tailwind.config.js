/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          black: '#191414',
          white: '#FFFFFF',
          gray: {
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#B3B3B3',
            400: '#727272',
            500: '#535353',
            600: '#404040',
            700: '#282828',
            800: '#181818',
            900: '#121212',
          }
        }
      }
    },
  },
  plugins: [],
}