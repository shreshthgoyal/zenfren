module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#507DBC',  // A soothing blue
        secondary: '#FFC107',  // A warm amber for buttons and highlights
        background: '#F0F4F8',  // A light background color
        chatBackground: '#ffffff',  // White background for chat area
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
