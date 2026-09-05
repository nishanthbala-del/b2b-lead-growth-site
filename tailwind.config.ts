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
      // intended faint hairline shipped as a light grey line, and every `/72` panel
      // shipped fully transparent.
      //
      // Declaring the whole range removes the failure mode rather than the symptom.
      // JIT only emits the combinations actually used, so this costs nothing.
      // tests/design-tokens.test.ts fails if a modifier outside this scale reappears.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
      ),

      // ---------------------------------------------------------------------
      // THE PALETTE IS SEMANTIC, AND LIGHT. Replaced the near-black `ink-*` /
      // `bone` / `gold-*` set on 2026-09-05.
      //
      // WHY THE NAMES CHANGED TOO. The obvious way to relight a site is to leave
      // the class names alone and redefine what they mean — but that ships a
      // stylesheet where `bg-ink-950` paints white and `text-bone` paints black,
      // and the next person to read it is entitled to believe the names. Every
      // token below says what it is FOR, so a card is `bg-surface`, a hairline is
      // `border-line`, and body copy is `text-ink` regardless of what colour those
      // resolve to later.
      //
      // WHY LIGHT AT ALL. The old scheme was #0A0A0B with a gold accent and a
      // Didone display face — the visual grammar of high-ticket coaching, not of
      // the B2B consulting this business actually sells to an HVAC contractor in
      // New Jersey. It also hid its own structure: `bg-ink-950/50` composited over
      // an ink-950 page is EXACTLY the page colour (1.00:1), so fourteen elements
      // written as cards rendered as nothing at all, and the whole card system
      // rested on gold hairlines measuring 1.17:1.
      //
      // EVERY VALUE BELOW IS CONTRAST-CHECKED against the surface it sits on:
      //   ink on paper 18.20:1 · subtle on paper 7.26:1 · accent on paper 5.04:1
      //   white on accent 5.04:1 · control border on paper 3.53:1 (WCAG 1.4.11)
      // Re-run those numbers before changing any of them.
      // ---------------------------------------------------------------------
      colors: {
        // Surfaces, lightest first. A card must be visible against the page
        // WITHOUT relying on its border — that was the old system's whole failure.
        paper: "#FFFFFF",
        surface: "#F8F7F4",
        "surface-2": "#F1EFEA",

        // Lines. `line` is a hairline between blocks; `line-strong` divides
        // sections; `control` is the minimum for an interactive boundary, and it
        // is a separate token precisely so a form input never borrows the
        // decorative one. WCAG 1.4.11 wants 3:1 for a control boundary, and an
        // empty text field the visitor cannot find is a conversion defect before
        // it is an accessibility one.
        line: "#E4E1DA",
        "line-strong": "#C9C4B8",
        control: "#8C887F",

        // Type. `ink` is the strong dark headline/body colour the brief asks for;
        // `subtle` is secondary copy and still clears AA on both surfaces.
        ink: "#15151A",
        subtle: "#56565F",

        // THE ONE RESTRAINED ACCENT. Deep bronze — the same hue family as the
        // previous gold, so the favicon, the OG card and the logo stay coherent,
        // but dark enough to be legible as text on white rather than a glow on
        // black. `accent-strong` is for small text and `accent-soft` is the only
        // sanctioned tint fill. There is deliberately no second accent: a status
        // colour that is a near-neighbour of the brand colour is how the old
        // "this probably isn't a fit" warning ended up amber-on-amber.
        accent: "#8A6A23",
        "accent-strong": "#6F5420",
        "accent-soft": "#FAF5E9",

        // Reserved for genuine negative/attention states so they can never be
        // confused with the brand accent.
        warn: "#8A3B12",
        "warn-soft": "#FDF0E8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Real, soft elevation. The old `panel` was a black shadow on a black
        // page, which produced literally no visible effect at two of its usages.
        card: "0 1px 2px rgba(21, 21, 26, 0.04), 0 1px 3px rgba(21, 21, 26, 0.06)",
        lift: "0 4px 12px rgba(21, 21, 26, 0.06), 0 12px 32px rgba(21, 21, 26, 0.08)",
      },
      backgroundImage: {
        // The primary button's fill, kept as a very slight vertical shade rather
        // than the old 135deg three-stop sheen: white text measures 5.04:1 on the
        // flat accent and must not drop below that anywhere across the gradient,
        // so both stops are within one step of each other.
        "accent-fill": "linear-gradient(180deg, #96742A 0%, #8A6A23 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
