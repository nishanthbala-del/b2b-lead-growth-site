// The original reference diagrams (the AI-search reference-asset pass, 2026-09-20).
//
// A diagram is the one surface on this site that a reader can see and a text-only client
// cannot. That asymmetry is exactly where a false claim survives longest: nobody greps a
// picture. These tests hold the properties that make a diagram safe to publish —
//
//   * it exists, and nothing ships an orphan asset or a dead <img>;
//   * it describes itself, so the file is usable when opened on its own;
//   * it carries no outcome claim and no price the offer has retired — the $750 tier lived
//     in shipped copy for weeks after it was retired, and a number baked into an image is
//     the hardest copy of all to find;
//   * it is inert: no script, no remote reference, nothing the CSP would have to forgive;
//   * and it never carries a fact alone — every Figure has a long alt for assistive
//     technology AND a visible caption for everyone else, and they are not the same words.

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import { plans } from "../lib/content.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const diagramDir = path.join(repoRoot, "public", "diagrams");

/** Every <Figure> in the app, with the attributes and caption it was written with. */
function figures() {
  const out: { file: string; src: string; alt: string; label: string; caption: string; width: number; height: number }[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".tsx")) {
        const src = readFileSync(full, "utf8");
        for (const m of src.matchAll(/<Figure\b([\s\S]*?)>([\s\S]*?)<\/Figure>/g)) {
          const attrs = m[1];
          const pick = (k: string) => (attrs.match(new RegExp(`${k}="([^"]+)"`)) ?? [])[1] ?? "";
          const num = (k: string) => Number((attrs.match(new RegExp(`${k}=\\{(\\d+)\\}`)) ?? [])[1] ?? NaN);
          out.push({
            file: path.relative(repoRoot, full),
            src: pick("src"),
            alt: pick("alt"),
            label: pick("label"),
            caption: m[2].replace(/\{[^}]*\}/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim(),
            width: num("width"),
            height: num("height"),
          });
        }
      }
    }
  };
  walk(path.join(repoRoot, "app"));
  return out;
}

const svgFiles = existsSync(diagramDir) ? readdirSync(diagramDir).filter((f) => f.endsWith(".svg")) : [];

describe("the reference diagrams exist and nothing is orphaned", () => {
  test("every diagram a page references is a real file", () => {
    const found = figures();
    assert.ok(found.length >= 2, "expected at least two reference diagrams in the app");
    for (const f of found) {
      assert.match(f.src, /^\/diagrams\/[a-z0-9-]+\.svg$/, `${f.file}: a diagram needs a descriptive, lowercase path`);
      assert.ok(
        existsSync(path.join(repoRoot, "public", f.src.replace(/^\//, ""))),
        `${f.file} references ${f.src}, which does not exist`,
      );
    }
  });

  test("every diagram file is actually used by a page", () => {
    const used = new Set(figures().map((f) => path.basename(f.src)));
    for (const file of svgFiles) {
      assert.ok(used.has(file), `public/diagrams/${file} is shipped but no page renders it`);
    }
  });
});

describe("a diagram stands on its own when opened directly", () => {
  for (const file of svgFiles) {
    test(`${file} is self-describing and inert`, () => {
      const svg = readFileSync(path.join(diagramDir, file), "utf8");
      assert.match(svg, /<title\b/, "an SVG opened on its own needs a <title>");
      assert.match(svg, /<desc\b/, "an SVG opened on its own needs a <desc>");
      assert.match(svg, /role="img"/, "the root needs role=img");
      assert.match(svg, /viewBox="/, "a fixed-size SVG does not scale");
      assert.doesNotMatch(svg, /<script/i, "a served SVG must carry no script");
      assert.doesNotMatch(svg, /(href|src)\s*=\s*"https?:/i, "a diagram must not pull in a remote resource");
    });
  }
});

/** Every reason a diagram may not ship, as plain strings. Pure, so it can be aimed at a
 *  known-bad diagram and proven to fire — a guard nobody has seen fail is not a guard. */
export function claimProblems(svg: string, prices: Set<string>): string[] {
  const problems: string[] = [];
  for (const amount of svg.match(/\$[\d,]+/g) ?? []) {
    if (!prices.has(amount)) {
      problems.push(`shows ${amount}, which is not a published plan price (${[...prices].join(", ")})`);
    }
  }
  if (/\d\s*%/.test(svg)) problems.push("shows a percentage — a diagram may not state a result");
  for (const banned of [
    "guarantee",
    "guaranteed",
    "ROI",
    "increase",
    "boost",
    "on average",
    "up to",
    "more leads",
    "results",
  ]) {
    if (new RegExp(`\\b${banned}\\b`, "i").test(svg)) {
      problems.push(`uses "${banned}" — deliverables are activity, never an outcome`);
    }
  }
  return problems;
}

const planPrices = new Set(plans.map((p) => `$${p.price.toLocaleString()}`));

describe("a diagram never carries a claim the rest of the site could not make", () => {
  for (const file of svgFiles) {
    test(`${file} states no outcome and no retired price`, () => {
      const problems = claimProblems(readFileSync(path.join(diagramDir, file), "utf8"), planPrices);
      assert.deepEqual(problems, [], `${file}: ${problems.join("; ")}`);
    });
  }

  test("the guard is live: it catches each thing this pass forbids", () => {
    // The $750 tier D-028 retired — the exact drift that survived in shipped copy for weeks.
    assert.match(claimProblems("<svg><text>$750/mo</text></svg>", planPrices)[0] ?? "", /not a published plan price/);
    // A published price must still pass, or the guard would ban the diagrams it is meant to allow.
    assert.deepEqual(claimProblems("<svg><text>$1,500/mo and $2,500/mo</text></svg>", planPrices), []);
    // Outcome claims, in the shapes a marketing edit actually introduces.
    assert.match(claimProblems("<svg><text>40% more meetings</text></svg>", planPrices).join(" "), /percentage/);
    assert.match(claimProblems("<svg><text>Guaranteed appointments</text></svg>", planPrices).join(" "), /guaranteed/i);
    assert.match(claimProblems("<svg><text>Up to 50 accounts</text></svg>", planPrices).join(" "), /up to/i);
    assert.match(claimProblems("<svg><text>Real results, fast</text></svg>", planPrices).join(" "), /results/i);
  });
});

describe("a diagram never carries a fact alone", () => {
  for (const f of figures()) {
    test(`${path.basename(f.src)} has a full alt, a region label and a visible caption`, () => {
      assert.ok(
        f.alt.length >= 150,
        `${f.file}: an <img> hides the SVG's own <title>/<desc>, so alt must describe the whole diagram (got ${f.alt.length} chars)`,
      );
      assert.ok(f.label.length >= 10, `${f.file}: the scroll region needs a label`);
      assert.ok(
        f.caption.length >= 80,
        `${f.file}: the visible caption is what a sighted reader gets (got ${f.caption.length} chars)`,
      );
      assert.notEqual(
        f.alt.replace(/\s+/g, " ").trim(),
        f.caption,
        `${f.file}: alt and caption do different jobs and must not be the same sentence`,
      );
    });
  }
});

describe("a diagram reserves its space before it loads", () => {
  // Measured on 2026-09-20: without width/height the <img> rendered at height 0 until the
  // SVG arrived, so the article moved under the reader. Declaring the size is the fix, and
  // a declared size that drifts from the file is the same bug wearing a number.
  for (const f of figures()) {
    test(`${path.basename(f.src)} declares the size its viewBox actually is`, () => {
      const svg = readFileSync(path.join(repoRoot, "public", f.src.replace(/^\//, "")), "utf8");
      const box = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
      assert.ok(box, `${f.src}: no parseable viewBox`);
      assert.equal(f.width, Number(box[1]), `${f.file}: declared width must equal the viewBox width`);
      assert.equal(f.height, Number(box[2]), `${f.file}: declared height must equal the viewBox height`);
    });
  }
});
