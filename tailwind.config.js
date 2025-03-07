/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        'green-500': '#22C55E',
        'green-600': '#16A34A',
      },
      fontFamily: {
        'sans': ['Poppins-Regular'],
        'medium': ['Poppins-Medium'],
        'semibold': ['Poppins-SemiBold'],
        'bold': ['Poppins-Bold'],
      }
    },
  },
  plugins: [],
}