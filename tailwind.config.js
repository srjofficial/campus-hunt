/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "#050505",
          "blood-red": "#8B0000",
          "neon-red": "#FF2E2E",
          gold: "#D4AF37",
          foreground: "#F5F5F5",
        },
        fontFamily: {
          cinematic: ['Orbitron', 'sans-serif'],
          body: ['Space Grotesk', 'Inter', 'sans-serif'],
        },
        // Custom animation definitions can go here
        animation: {
          glitch: "glitch 2s infinite linear alternate-reverse",
          "pulse-red": "pulseRed 3s infinite",
        },
        keyframes: {
          glitch: {
            "0%": { transform: "translate(0)" },
            "20%": { transform: "translate(-2px, 2px)" },
            "40%": { transform: "translate(-2px, -2px)" },
            "60%": { transform: "translate(2px, 2px)" },
            "80%": { transform: "translate(2px, -2px)" },
            "100%": { transform: "translate(0)" },
          },
          pulseRed: {
            "0%, 100%": { boxShadow: "0 0 10px #8B0000" },
            "50%": { boxShadow: "0 0 25px #FF2E2E" },
          }
        }
      },
    },
    plugins: [],
  }
