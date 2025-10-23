/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx", 
    "./components/**/*.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}"
  ],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        'primary': '#E43636',
      },

      fontFamily:{
        "poppins-bold": ["Poppins-Bold"],
        "poppins-extralight": ["Poppins-ExtraLight"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-regular": ["Poppins-Regular"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "roboto-medium": ["Roboto-Medium"],
        "roboto-regular": ["Roboto-Regular"],
        "roboto-semibold-italic": ["Roboto-SemiBoldItalic"],
      },
    },
  },
  plugins: [],
}