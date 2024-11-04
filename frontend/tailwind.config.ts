import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryFont: '#F5F5F5',       // Soft White for text
        accentFont: '#FFD700',        // Gold for accents
        mainBg: '#181818',            // Dark Gray for main background
        secondaryBg: '#282828',       // Medium Dark Gray for secondary background
        cardBg: '#383838',            // Darker Gray for card background
        thinBorder: '#505050',        // Medium Gray for borders
        accentBorder: '#FFD700',      // Gold for accent borders
        buttonBg: '#FFD700',          // Gold for buttons
        buttonText: '#181818',        // Dark Gray for button text
        iconColor: '#FFD700',         // Gold for icons
        highlightBg: '#303030',       // Darker Gray for highlights
        inputBg: '#282828',           // Medium Dark Gray for inputs
      },
      backgroundImage: {
        'navbar-gradient': 'linear-gradient(90deg, #282828, #505050)',
        'main-gradient': 'linear-gradient(180deg, #181818, #282828)',
      },
    },
  },
  plugins: [],
};
export default config;
