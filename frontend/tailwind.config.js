/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"]
      },
      colors: {
        dark: {
          900: "#0a0a0f",
          800: "#12121a",
          700: "#1a1a2e",
          600: "#242442"
        },
        neon: {
          blue: "#00d4ff",
          purple: "#a855f7",
          green: "#22c55e",
          red: "#ef4444",
          yellow: "#eab308",
          pink: "#ec4899"
        }
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #00d4ff, 0 0 20px #00d4ff33" },
          "100%": { boxShadow: "0 0 20px #00d4ff, 0 0 60px #00d4ff33" }
        }
      }
    }
  },
  plugins: []
};
