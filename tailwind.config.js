/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '551px',
      },
    },
    
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

