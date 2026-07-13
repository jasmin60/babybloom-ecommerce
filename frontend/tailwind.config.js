/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bloom: {
          pink: '#F5E6E3',        /* Soft Linen Blush */
          pinkDark: '#A37B73',    /* Heritage Editorial Rose */
          blue: '#E3ECF5',        /* Clean Slate Blue tint */
          blueDark: '#6E8B9E',    /* Muted Steel Accent */
          mint: '#EBF2EE',        /* Soft Muted Sage */
          mintDark: '#608070',    /* Deep Botanical Sage */
          cream: '#FBF9F6',      /* Luxury Linen Canvas White */
          charcoal: '#1E1A19',   /* Deep Charcoal Onyx Matte Black */
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '0px', /* Professional high-end editorial uses flat crisp sharp borders */
      },
    },
  },
  plugins: [],
};