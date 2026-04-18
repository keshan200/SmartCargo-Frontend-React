module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"], 
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      borderRadius: {
        '5xl': '5rem',
      },
      colors: {
        customDark: "#0C1224",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
