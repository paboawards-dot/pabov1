import type { Config } from "tailwindcss";

// Tokens de couleur définis dans le cahier des charges (Bloc "Identité visuelle")
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pabo: {
          bg: "#000000",          // fond principal — noir pur
          gold: "#D4A63A",        // accent primaire
          bordeaux: "#6E1E1E",    // accent secondaire (usage modéré)
          cream: "#F5F0E6",       // texte clair
          muted: "#A89E8C",       // texte secondaire
          card: "#0a0a0a",        // fond des cartes
          border: "#262626",      // bordures discrètes
        },
        admin: {
          bg: "#F5F5F4",
          text: "#1c1917",
        },
      },
      borderRadius: {
        pabo: "13px", // radius bouton standard (12-14px, cf. règles boutons)
      },
    },
  },
  plugins: [],
};

export default config;
