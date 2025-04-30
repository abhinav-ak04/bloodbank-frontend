
  // client/tailwind.config.js
  module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          red: {
            50: '#ffeaef',
            100: '#ffd5e0',
            200: '#ffabc2',
            300: '#ff82a3',
            400: '#ff5885',
            500: '#ff2e66',
            600: '#e91e63', // Primary red
            700: '#c2185b', // Darker red
            800: '#9c1352',
            900: '#760e3e',
          },
        },
      },
    },
    plugins: [],
  }