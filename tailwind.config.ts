import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // A full 0-100 opacity scale, in whole percent.
      //
      // Tailwind's DEFAULT scale is 5-step (5, 10, 15, 20 …), and a modifier outside
      // it silently compiles to nothing — no warning, no error, no CSS. This design
      // leans on fine gradations for its hairlines and panel fills, and 109 class
      // occurrences across the site used values like /12, /14, /18, /22, /72 that were
      // therefore emitting NOTHING. The visible result was not "slightly off": with no
      // `border-color` rule, Tailwind's preflight default (#e5e7eb) applied, so every
      // intended faint-gold hairline shipped as a light grey line on near-black, and
      // every `bg-ink-900/72` panel shipped fully transparent.
      //
      // Declaring the whole range removes the failure mode rather than the symptom.
      // JIT only emits the combinations actually used, so this costs nothing.
      // tests/design-tokens.test.ts fails if a modifier outside this scale reappears.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
      ),
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
        // The primary button's fill. The terminal stop used to be #8A6A23, against
        // which the button's own near-black label measured 3.93:1 — below the 4.5:1
        // WCAG AA threshold for text this size. Text sitting over the bottom-right of
        // every primary CTA on the site was therefore failing contrast. #A8842F is
        // 5.66:1 and still reads as a deep gold.
        "gold-sheen":
          "linear-gradient(135deg, #E8D9A8 0%, #D4AF37 40%, #A8842F 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
