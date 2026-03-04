module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        'rarity-silver': '#C8AA6E',
        'rarity-gold': '#F0B232',
        'rarity-prismatic': '#E84057',
        'dark-bg': '#0A0E1A',
        'dark-card': '#0F1923',
        'dark-border': '#1E2D3D',
        'dark-hover': '#162030',
        'accent-blue': '#0BC4E3',
      },
      fontFamily: {
        'beaufort': ['Beaufort for LOL', 'serif'],
      }
    }
  },
  plugins: []
};
