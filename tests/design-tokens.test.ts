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
      [...source.matchAll(/\b(?:bg|text|border|from|via|to|ring|divide|placeholder|accent|outline)-((?:ink|gold)-\d+|bone|muted)\b/g)].map(
        (m) => m[1]!,
      ),
    );
    for (const token of referenced) {
      assert.ok(declared.has(token), `${token} is used in the markup but not declared in tailwind.config.ts`);
    }
  });
});
