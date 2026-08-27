// Route-registry drift.
//
// The site publishes its URL list in three places that cannot import each other:
// lib/pages.ts (the registry the sitemap renders from), public/llms.txt (a static
// file), and scripts/indexnow-ping.mjs (a standalone script). lib/pages.ts used to
// carry a comment asking future editors to keep all three in step. It went stale.
//
// A page missing from these lists is not a visible bug: it renders fine, and simply
// never gets discovered or announced. This turns the comment into a failing test.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import { guidePages, indexablePaths, standaloneRoutes } from "../lib/pages.ts";

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

  test("every indexable path is listed in llms.txt", () => {
    const llms = read("public/llms.txt");
    for (const p of indexablePaths) {
      const url = `https://www.b2bleadgrowth.com${p === "/" ? "/" : p}`;
      assert.ok(llms.includes(url), `${p} is in the registry but missing from public/llms.txt`);
    }
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
