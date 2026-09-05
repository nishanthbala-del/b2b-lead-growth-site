// Design-token drift.
//
// Tailwind fails SILENTLY on an out-of-scale opacity modifier: `border-gold-500/12`
// with no `12` in the opacity scale emits no CSS at all — no warning at build time,
// no error in the browser. The element then falls back to Tailwind preflight's
// default border colour (#e5e7eb), so an intended faint-gold hairline ships as a
// light grey line on a near-black page, and a `bg-ink-900/72` panel ships fully
// transparent. 109 class occurrences were in that state before this test existed.
//
// It is exactly the kind of defect that survives every code review: the class name
// reads correctly, the config looks fine, and nothing anywhere reports a problem.

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import tailwindConfig from "../tailwind.config.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const sourceFiles = [...walk(path.join(repoRoot, "app")), ...walk(path.join(repoRoot, "components"))];
const source = sourceFiles.map((f) => readFileSync(f, "utf8")).join("\n");

// Utilities that accept a `/<opacity>` modifier.
const MODIFIER_RE =
  /\b(?:bg|text|border|from|via|to|ring|divide|placeholder|accent|outline|shadow|fill|stroke|caret|decoration)-[a-z]+-?\d*\/(\d+)\b/g;

const opacityScale = new Set(
  Object.keys((tailwindConfig.theme?.extend?.opacity ?? {}) as Record<string, string>),
);

describe("tailwind opacity scale", () => {
  test("the config declares a full whole-percent scale", () => {
    // The 5-step default is what made the original bug possible. Anything narrower
    // than the full range re-opens it for the next value someone reaches for.
    for (let i = 0; i <= 100; i++) {
      assert.ok(opacityScale.has(String(i)), `opacity scale is missing ${i}`);
    }
  });

  test("every opacity modifier in the markup resolves to a scale value", () => {
    const bad = new Map<string, number>();
    for (const [full, value] of source.matchAll(MODIFIER_RE)) {
      if (!opacityScale.has(value!)) bad.set(full, (bad.get(full) ?? 0) + 1);
    }
    assert.deepEqual(
      [...bad.keys()],
      [],
      `these classes compile to NO CSS and will fall back to Tailwind's preflight defaults: ${[
        ...bad.entries(),
      ]
        .map(([c, n]) => `${c} (${n}x)`)
        .join(", ")}`,
    );
  });
});

describe("brand colour tokens", () => {
  const colors = (tailwindConfig.theme?.extend?.colors ?? {}) as Record<string, unknown>;

  test("the palette the markup uses is actually declared", () => {
    // A colour name with no token behind it fails the same silent way an out-of-scale
    // opacity does — the utility simply isn't generated.
    const declared = new Set<string>();
    for (const [name, value] of Object.entries(colors)) {
      if (typeof value === "string") declared.add(name);
      else for (const shade of Object.keys(value as Record<string, string>)) declared.add(`${name}-${shade}`);
    }
    const referenced = new Set(
      [
        ...source.matchAll(
          /\b(?:bg|text|border|from|via|to|ring|divide|placeholder|accent|outline|shadow)-(paper|surface-2|surface|line-strong|line|control|ink|subtle|accent-strong|accent-soft|accent|warn-soft|warn)\b/g,
        ),
      ].map((m) => m[1]!),
    );
    for (const token of referenced) {
      assert.ok(declared.has(token), `${token} is used in the markup but not declared in tailwind.config.ts`);
    }
  });

  test("no token from the retired dark palette survives in the markup", () => {
    // The 2026-09-05 relight replaced ink-*/bone/muted/gold-* with a semantic light
    // palette. A survivor does not throw — Tailwind just emits nothing for it — so the
    // element silently falls back to preflight and looks "slightly off" rather than
    // broken. Two did survive the first mechanical pass (`divide-gold-500/12` and
    // `accent-gold-400`) precisely because they used utility prefixes the rename script
    // had not enumerated.
    const survivors = [
      ...source.matchAll(
        /\b(?:bg|text|border|from|via|to|ring|divide|placeholder|accent|outline|shadow|fill|stroke|caret|decoration)-((?:ink|gold)-\d+|bone|muted)\b/g,
      ),
    ].map((m) => m[0]);
    assert.deepEqual(survivors, [], `retired dark-palette classes still in the markup: ${survivors.join(", ")}`);
  });

  // Contrast is a PROPERTY OF THE PAIR, not of a colour, so it belongs with the tokens
  // rather than in a visual review nobody re-runs. The dark palette this replaced failed
  // exactly here and shipped anyway: `bg-ink-950/50` over an ink-950 page composited to
  // the page colour itself (1.00:1), so fourteen elements written as cards rendered as
  // nothing, and the site's only conversion form had a 1.45:1 input boundary.
  describe("every token pair the design actually uses clears WCAG AA", () => {
    const hex = (name: string): string => {
      const v = colors[name];
      assert.equal(typeof v, "string", `token ${name} is missing from tailwind.config.ts`);
      return v as string;
    };
    const lum = (h: string): number => {
      const c = [0, 2, 4]
        .map((i) => parseInt(h.replace("#", "").slice(i, i + 2), 16) / 255)
        .map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
      return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
    };
    const ratio = (a: string, b: string): number => {
      const [x, y] = [lum(a), lum(b)];
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    };

    // [foreground, background, minimum]. 4.5 is AA for body text; 3 is AA for a
    // non-text UI boundary (WCAG 1.4.11) — which is why `control` exists separately
    // from `line`, so a form field can never borrow the decorative hairline.
    const PAIRS: Array<[string, string, number]> = [
      ["ink", "paper", 4.5],
      ["ink", "surface", 4.5],
      ["ink", "surface-2", 4.5],
      ["ink", "accent-soft", 4.5],
      ["subtle", "paper", 4.5],
      ["subtle", "surface", 4.5],
      ["subtle", "surface-2", 4.5],
      ["accent", "paper", 4.5],
      ["accent", "surface", 4.5],
      ["accent", "accent-soft", 4.5],
      ["accent-strong", "paper", 4.5],
      ["paper", "accent", 4.5],
      ["control", "paper", 3],
      ["control", "surface", 3],
    ];

    for (const [fg, bg, need] of PAIRS) {
      test(`${fg} on ${bg} >= ${need}:1`, () => {
        const r = ratio(hex(fg), hex(bg));
        assert.ok(r >= need, `${fg} on ${bg} is ${r.toFixed(2)}:1, below the ${need}:1 floor`);
      });
    }
  });
});
