import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0A0B",
          900: "#111113",
          850: "#16161A",
          800: "#1D1D22",
          700: "#29292F",
        },
        gold: {
          500: "#C9A24B",
          400: "#D4AF37",
          200: "#E8D9A8",
        },
        bone: "#F5F1E8",
        muted: "#B8B3A8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 80px rgba(201, 162, 75, 0.18)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.42)",
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(135deg, #E8D9A8 0%, #D4AF37 40%, #8A6A23 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
