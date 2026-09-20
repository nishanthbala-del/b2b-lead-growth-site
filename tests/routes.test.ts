// Route-registry drift.
//
// The site publishes its URL list in three places: lib/pages.ts (the registry the sitemap
// renders from), /llms.txt (generated from that registry by lib/llms.ts since 2026-09-18;
// until then a static file kept in step by hand), and scripts/indexnow-ping.mjs (a
// standalone script that cannot import the registry). lib/pages.ts used to carry a comment
// asking future editors to keep all three in step. It went stale.
//
// A page missing from these lists is not a visible bug: it renders fine, and simply
// never gets discovered or announced. This turns the comment into a failing test.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import { llmsTxt } from "../lib/llms.ts";
import { guidePages, indexablePaths, retiredPaths, standaloneRoutes } from "../lib/pages.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(repoRoot, rel), "utf8");

describe("route registry", () => {
  test("every indexable path is announced to IndexNow", () => {
    const script = read("scripts/indexnow-ping.mjs");
    for (const p of indexablePaths) {
      assert.ok(
        script.includes(`"${p}"`),
        `${p} is in the registry but missing from scripts/indexnow-ping.mjs`,
      );
    }
  });

  // scripts/audit-live.mjs runs against the DEPLOYED site and therefore cannot import the
  // registry either. It hardcodes the retired paths so it can prove each one still 301s in a
  // single hop to a live page. A retirement added to lib/pages.ts and not to the auditor is a
  // redirect nothing watches.
  test("every retired path is checked by the live auditor", () => {
    const script = read("scripts/audit-live.mjs");
    for (const { from, to } of retiredPaths) {
      assert.ok(
        script.includes(`["${from}", "${to}"]`),
        `${from} -> ${to} is retired in the registry but not checked by scripts/audit-live.mjs`,
      );
    }
  });

  test("the live auditor checks no retirement the registry has dropped", () => {
    const script = read("scripts/audit-live.mjs");
    const block = script.slice(script.indexOf("const RETIRED_PATHS"), script.indexOf("];", script.indexOf("const RETIRED_PATHS")));
    for (const m of block.matchAll(/\["(\/[^"]+)", "(\/[^"]+)"\]/g)) {
      assert.ok(
        retiredPaths.some((r) => r.from === m[1] && r.to === m[2]),
        `scripts/audit-live.mjs checks ${m[1]} -> ${m[2]}, which is not in retiredPaths`,
      );
    }
  });

  test("every indexable path is listed in llms.txt", () => {
    const llms = llmsTxt();
    for (const p of indexablePaths) {
      const url = `https://www.b2bleadgrowth.com${p === "/" ? "/" : p}`;
      assert.ok(llms.includes(`](${url})`), `${p} is in the registry but missing from /llms.txt`);
    }
  });

  test("llms.txt lists nothing the registry doesn't know about, and no retired path", () => {
    const llms = llmsTxt();
    const listed = [...llms.matchAll(/\]\(https:\/\/www\.b2bleadgrowth\.com(\/[^)]*)\)/g)].map((m) => m[1]!);
    assert.ok(listed.length >= indexablePaths.length, "could not parse the llms.txt link list");
    for (const p of listed) assert.ok(indexablePaths.includes(p), `${p} is listed in llms.txt but not in lib/pages.ts`);
    for (const r of retiredPaths) assert.ok(!llms.includes(r.from), `retired ${r.from} is still in llms.txt`);
  });

  test("llms.txt follows the llms.txt format: one H1, a summary blockquote, H2 link lists", () => {
    const llms = llmsTxt();
    const h1s = llms.split("\n").filter((l) => /^# /.test(l));
    assert.equal(h1s.length, 1, "llms.txt must have exactly one H1");
    assert.match(llms, /^# B2B Lead Growth\n\n> \S/, "the H1 must be followed by the summary blockquote");
    assert.match(llms, /^## Optional$/m, "the secondary links belong under ## Optional");
    assert.doesNotMatch(llms, /\bundefined\b|\[object Object\]|NaN/, "a field failed to render");
  });

  test("the static public/llms.txt is gone, so it cannot shadow the generated route", () => {
    assert.throws(() => read("public/llms.txt"), "public/llms.txt came back; the route renders /llms.txt now");
    assert.match(read("app/llms.txt/route.ts"), /force-static/);
  });

  test("IndexNow announces nothing the registry doesn't know about", () => {
    // The other direction: a route that was retired from the site but left in the
    // ping list keeps being submitted, and every submission resolves to a 404.
    const script = read("scripts/indexnow-ping.mjs");
    const listed = [...script.matchAll(/^\s+"(\/[^"]*)",?$/gm)].map((m) => m[1]!);
    assert.ok(listed.length > 0, "could not parse the IndexNow URL list");
    for (const p of listed) {
      assert.ok(indexablePaths.includes(p), `${p} is announced but not in lib/pages.ts`);
    }
  });

  test("the registry has no duplicate paths", () => {
    assert.equal(new Set(indexablePaths).size, indexablePaths.length);
  });

  test("every route has a real page file behind it", () => {
    // A slug in the registry with no app/<slug>/page.tsx is a sitemap entry pointing
    // at a 404 — which is worse for a low-authority site than not listing it at all.
    for (const slug of [...guidePages.map((g) => g.slug), ...standaloneRoutes.map((r) => r.slug)]) {
      assert.doesNotThrow(
        () => read(path.join("app", slug, "page.tsx")),
        `no app/${slug}/page.tsx for registered route /${slug}`,
      );
    }
  });

  test("registry dates are real ISO dates, not build dates", () => {
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    for (const g of guidePages) {
      assert.match(g.datePublished, iso, `${g.slug} datePublished`);
      assert.match(g.dateModified, iso, `${g.slug} dateModified`);
      assert.ok(
        g.dateModified >= g.datePublished,
        `${g.slug} was modified before it was published`,
      );
    }
    for (const r of standaloneRoutes) assert.match(r.dateModified, iso, `${r.slug} dateModified`);
  });
});
