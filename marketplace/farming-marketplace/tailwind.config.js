module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-green)',
        secondary: 'var(--secondary-green)',
        accent: 'var(--accent-green)',
        gold: 'var(--primary-gold)',
        goldAccent: 'var(--accent-gold)',
        sand: 'var(--desert-sand)',
        algerianRed: 'var(--algerian-red)',
        // Gradients as utilities
        gradientPrimary: 'var(--gradient-primary)',
        gradientGold: 'var(--gradient-gold)',
        gradientHero: 'var(--gradient-hero)',
        agriculturalGreen: '#4CAF50',
        soilBrown: '#8B4513',
        skyBlue: '#87CEEB',
      },
      fontFamily: {
        arabic: ['Cairo', 'Almarai', 'sans-serif'],
        display: ['Almarai', 'Cairo', 'sans-serif'],
        latin: ['Inter', 'sans-serif'],
      },
      spacing: {
        'section': '4.5rem',
        'container': '1.5rem',
      },
    },
  },
  plugins: [],
}
