// Search signals that must agree with each other (the commercial-HVAC SEO pass, 2026-09-18).
//
// A search engine reads the same page several ways — the <title>, the H1, the canonical, the
// robots directive, the structured data, the sitemap, the redirects — and a page that says
// one thing in one place and another elsewhere hands the engine a choice. These tests hold
// the signals the pass set to one answer each.

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import { guidePages, indexablePaths, pageSection } from "../lib/pages.ts";
import { siteUrl } from "../lib/site.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(repoRoot, rel), "utf8");
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|\s)\/\/[^\n]*/g, " ");

describe("one host", () => {
  test("the Vercel production alias redirects permanently to the brand domain, path kept", () => {
    const config = stripComments(read("next.config.ts"));
    const rule = config.match(
      /source:\s*"\/:path\*",\s*has:\s*\[\{\s*type:\s*"host"[^}]*value:\s*"([^"]+)"\s*\}\],\s*destination:\s*"([^"]+)",\s*statusCode:\s*(\d+)/,
    );
    assert.ok(rule, "no host redirect for the platform alias in next.config.ts");
    assert.equal(rule[1], "b2b-lead-growth-site.vercel.app", "only the exact production alias may match");
    assert.equal(rule[2], `${siteUrl}/:path*`, "the alias must land on the same path on the brand domain");
    assert.equal(Number(rule[3]), 301);
    assert.match(config, /return \[PLATFORM_HOST_REDIRECT, \.\.\.RETIRED_PAGE_REDIRECTS\]/);
  });
});

describe("a noindex page never names another page as its canonical", () => {
  test("/for-clients describes itself and canonicalises to itself", () => {
    const source = stripComments(read("app/for-clients/page.tsx"));
    assert.match(source, /index:\s*false/, "/for-clients must stay noindex");
    assert.match(source, /pageMetadata\(\{\s*path:\s*"\/for-clients"/, "/for-clients must set its own canonical");
  });
});

describe("the commercial-search footprint", () => {
  const audience = guidePages.filter((p) => pageSection(p) === "audience");
  const guides = guidePages.filter((p) => pageSection(p) === "guide");

  test("one page per commercial buyer: property managers, facility teams, building owners", () => {
    assert.deepEqual(
      audience.map((p) => p.slug),
      ["hvac-property-manager-outreach", "hvac-facility-manager-outreach", "hvac-building-owner-outreach"],
    );
    for (const p of audience) {
      assert.equal(p.kind, "solution", `${p.slug} is a solution page`);
      assert.match(p.metaTitle, /Commercial HVAC/, `${p.slug}'s title must name the category`);
      assert.match(p.h1, /commercial HVAC/i, `${p.slug}'s H1 must name the category`);
    }
  });

  test("every solution page publishes its own Service node, related to the site-wide one", () => {
    for (const p of audience) {
      const source = read(`app/${p.slug}/page.tsx`);
      assert.match(source, /solutionServiceJsonLd\(page,/, `${p.slug} does not publish its Service node`);
      assert.match(source, /"@type": "FAQPage"/, `${p.slug} does not publish its FAQPage`);
    }
  });

  test("the guides are Articles, and each links to the buyer pages it teaches toward", () => {
    for (const slug of ["how-to-find-commercial-hvac-accounts", "commercial-hvac-cold-email"]) {
      const page = guides.find((g) => g.slug === slug);
      assert.ok(page, `${slug} is not registered as a guide`);
      assert.equal(page.kind, "guide");
      const source = read(`app/${slug}/page.tsx`);
      for (const a of audience) assert.ok(source.includes(`href="/${a.slug}"`), `${slug} does not link to /${a.slug}`);
    }
  });

  test("every new page is indexable and has a page file", () => {
    for (const p of [...audience, ...guides]) {
      assert.ok(indexablePaths.includes(`/${p.slug}`));
      assert.ok(existsSync(path.join(repoRoot, "app", p.slug, "page.tsx")));
    }
  });

  test("worked examples are templates: every example email is bracketed, never a real account", () => {
    for (const p of [...audience, ...guides]) {
      const source = read(`app/${p.slug}/page.tsx`);
      for (const m of source.matchAll(/<ExampleEmail[\s\S]*?\/>/g)) {
        const block = m[0];
        assert.match(block, /subject="[^"]*\[[^\]]+\][^"]*"/, `${p.slug}: an example subject line names no placeholder`);
        assert.match(block, /Hi \[first name\]/, `${p.slug}: an example greets a real-looking name`);
        assert.match(block, /postal address/, `${p.slug}: an example omits the postal address the law requires`);
        assert.match(block, /not write again/, `${p.slug}: an example omits the opt-out line`);
      }
    }
  });
});
