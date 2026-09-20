// Search signals that must agree with each other (the commercial-HVAC SEO pass, 2026-09-18).
//
// A search engine reads the same page several ways — the <title>, the H1, the canonical, the
// robots directive, the structured data, the sitemap, the redirects — and a page that says
// one thing in one place and another elsewhere hands the engine a choice. These tests hold
// the signals the pass set to one answer each.

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import { productExample } from "../lib/content.ts";
import { llmsTxt } from "../lib/llms.ts";
import {
  guidePages,
  homepageDescription,
  homepageH1,
  homepageMetaTitle,
  indexablePaths,
  pageSection,
} from "../lib/pages.ts";
import { orgDescription, siteUrl } from "../lib/site.ts";

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

describe("one model: commercial HVAC, and nothing residential", () => {
  function walk(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full, out);
      else if (/\.tsx?$/.test(entry)) out.push(full);
    }
    return out;
  }

  // Every file whose strings reach a visitor, a crawler or an answer engine, comments removed
  // (the code that retired the residential model necessarily describes it), plus the
  // rendered /llms.txt.
  const shipped = [
    ...walk(path.join(repoRoot, "app")),
    ...walk(path.join(repoRoot, "components")),
    ...["content", "qualification", "site", "pages", "llms", "events", "canon"].map((n) => path.join(repoRoot, "lib", `${n}.ts`)),
    // The operating system's generated canon is shipped copy too: /definitions, /sample-deliverables.
    ...walk(path.join(repoRoot, "lib", "generated")),
  ].map((f) => ({ rel: path.relative(repoRoot, f), text: stripComments(readFileSync(f, "utf8")) }));
  shipped.push({ rel: "/llms.txt (rendered)", text: llmsTxt() });

  // The former model's vocabulary. Not a negation-aware detector ON PURPOSE: the brief was to
  // remove the residential model from the site, and "we never contact homeowners" is still a
  // sentence about homeowners. What the site says instead is who it DOES contact.
  const RETIRED = [
    /\bhomeowners?\b/i,
    /\bresidential\b/i,
    /\bunsold estimates?\b/i,
    /\blapsed (service|maintenance) (agreements?|plans?|contracts?)\b/i,
    /\breactivat\w*/i,
    /\b(HomeAdvisor|Angi|Thumbtack)\b/,
    /\bHOAs?\b/,
    /\btownhomes?\b/i,
  ];

  test("no shipped string names homeowners, residential work, or the residential model's records", () => {
    const hits: string[] = [];
    for (const { rel, text } of shipped) {
      for (const re of RETIRED) {
        const m = text.match(re);
        if (m) hits.push(`${rel}: ${JSON.stringify(m[0])}`);
      }
    }
    assert.deepEqual(hits, [], `retired residential vocabulary in shipped copy:\n  ${hits.join("\n  ")}`);
  });

  test("the detector is live: it catches the sentences this pass removed", () => {
    const removed = [
      "Every account is a business — never a homeowner.",
      "It is not a lead marketplace, and it is not residential.",
      "usually past accounts, proposals that were never accepted, and lapsed service agreements",
      "How is this different from Angi, Thumbtack, or a per-lead seller?",
      "A property management company running condo, townhome, HOA and co-op associations",
    ];
    for (const sentence of removed) {
      assert.ok(RETIRED.some((re) => re.test(sentence)), `the detector misses: ${sentence}`);
    }
  });

  test("the organization description says who is contacted, as a positive", () => {
    assert.match(orgDescription, /property managers, building owners, facility teams/);
    assert.match(orgDescription, /Every account contacted is a business/);
  });

  test("the homepage example is a commercial account, dated, and honest about its provenance", () => {
    const text = JSON.stringify(productExample);
    for (const re of RETIRED) assert.doesNotMatch(text, re);
    assert.match(productExample.account.value, /industrial|office|commercial/i);
    assert.match(productExample.disclosure, /not prepared for a client/i, "a format example must not pose as client work");
    assert.equal(productExample.preparedOn, "2026-09-18");
  });
});

describe("the six priority URLs send one commercial signal", () => {
  const byPath = (p: string) => guidePages.find((g) => `/${g.slug}` === p)!;
  const priority = [
    { path: "/", title: homepageMetaTitle, h1: homepageH1, description: homepageDescription },
    ...["/commercial-hvac-lead-generation", "/how-it-works", "/pricing", "/free-pipeline-audit", "/about"].map((p) => {
      const g = byPath(p);
      assert.ok(g, `${p} is not registered`);
      return { path: p, title: g.metaTitle, h1: g.h1, description: g.description };
    }),
  ];

  test("every priority title names commercial HVAC", () => {
    for (const p of priority) assert.match(p.title, /commercial HVAC/i, `${p.path} title: ${p.title}`);
  });

  test("every priority H1 and description is about commercial work", () => {
    for (const p of priority) {
      assert.match(p.h1, /commercial/i, `${p.path} H1: ${p.h1}`);
      assert.match(p.description, /commercial/i, `${p.path} description: ${p.description}`);
    }
  });

  test("the pricing page targets \"Commercial HVAC Lead Generation Pricing\"", () => {
    const pricing = byPath("/pricing");
    assert.match(pricing.metaTitle, /^Commercial HVAC Lead Generation Pricing\b/);
    assert.match(pricing.h1, /^Commercial HVAC lead generation pricing\b/i);
  });

  test("the audit page targets \"Free Commercial HVAC Pipeline Audit\"", () => {
    const audit = byPath("/free-pipeline-audit");
    assert.match(audit.metaTitle, /^Free Commercial HVAC Pipeline Audit\b/);
    assert.match(audit.h1, /^Free commercial HVAC pipeline audit\b/i);
  });

  test("no two priority pages share a title or an H1", () => {
    assert.equal(new Set(priority.map((p) => p.title)).size, priority.length);
    assert.equal(new Set(priority.map((p) => p.h1)).size, priority.length);
  });
});

// The acquisition cluster (2026-09-20). Three pages, each for an intent the site could not
// answer: how recurring maintenance work is won, what makes an account worth contacting this
// week, and whether to buy outreach at all. The tests below hold the two things that make the
// cluster worth publishing rather than the dozen thin pages the keyword list suggests — that
// each page is distinct, and that the one rule the method rests on cannot be quietly softened.
describe("the acquisition cluster", () => {
  // JSX wraps prose across lines, so a phrase in the rendered sentence is almost never a
  // phrase in the source with single spaces. Every prose assertion below reads through this:
  // a detector that only matches unwrapped text silently stops detecting the moment the file
  // is reformatted, which is the same failure as having no test.
  const flat = (rel: string) => read(rel).replace(/\s+/g, " ");

  const CLUSTER = [
    "commercial-hvac-maintenance-contracts",
    "commercial-hvac-prospecting-triggers",
    "commercial-hvac-outbound-vs-inbound",
  ];

  test("every cluster page is registered, indexable, and has a page file", () => {
    for (const slug of CLUSTER) {
      const page = guidePages.find((g) => g.slug === slug);
      assert.ok(page, `${slug} is not in the registry`);
      assert.equal(page.kind, "guide");
      assert.ok(indexablePaths.includes(`/${slug}`), `${slug} is not indexable`);
      assert.ok(existsSync(path.join(repoRoot, "app", slug, "page.tsx")), `${slug} has no page file`);
    }
  });

  test("every cluster page publishes an Article and its own FAQPage", () => {
    for (const slug of CLUSTER) {
      const source = read(`app/${slug}/page.tsx`);
      assert.match(source, /guideJsonLd\(page\)/, `${slug} publishes no Article node`);
      assert.match(source, /"@type": "FAQPage"/, `${slug} publishes no FAQPage node`);
    }
  });

  // THE RULE THE WHOLE METHOD RESTS ON. A signal is a reason to CONTACT an account; it is
  // never proof that the account needs HVAC work or intends to buy. Stated in the operating
  // system's vocabulary module and enforced by its send gates, and now published. This test
  // exists because the sentence is the first thing that gets softened when someone wants the
  // copy to sound more confident — and softening it is what produces "I see you're having
  // HVAC problems", a guess about a building nobody from here has entered.
  test("the trigger page publishes the signal rule, and does not hedge it", () => {
    const source = flat("app/commercial-hvac-prospecting-triggers/page.tsx");
    assert.match(
      source,
      /reason to contact an account[\s\S]{0,80}not proof of HVAC need/i,
      "the trigger page no longer states that a signal is a reason to contact, not proof of need",
    );
    // The failure mode the rule forbids: asserting the reader's problem from a public record.
    const DIAGNOSES = [
      /\byour (?:equipment|system|units?|HVAC) (?:is|are) (?:failing|old|overdue|due)\b/i,
      /\bwe (?:can see|noticed|see) (?:that )?you(?:'re| are) having\b/i,
    ];
    const prose = stripComments(source).replace(/&ldquo;|&rdquo;/g, '"').replace(/\s+/g, " ");
    for (const re of DIAGNOSES) {
      assert.ok(!re.test(prose), `the trigger page itself diagnoses a building: ${re}`);
    }
  });

  // A comparison page written by one of the options it compares is only worth reading if it
  // says when its own option is wrong. This is the load-bearing section of that page.
  test("the channel page says when outbound is the wrong choice", () => {
    const source = flat("app/commercial-hvac-outbound-vs-inbound/page.tsx");
    assert.match(source, /When outbound is the wrong answer/i, "the section is gone");
    assert.match(
      source,
      /cannot create commercial capability you do not have/i,
      "the page no longer states the limit that makes it honest",
    );
  });

  // The boundary that keeps the maintenance page inside the business model: we research and
  // reach, the contractor assesses, prices, scopes and closes. The same line the operating
  // system enforces in code (core/scope_boundary.py).
  test("the maintenance page keeps the contractor boundary", () => {
    const source = flat("app/commercial-hvac-maintenance-contracts/page.tsx");
    assert.match(source, /Where this work stops/i, "the boundary section is gone");
    assert.match(
      source,
      /price, size, diagnose, scope, negotiate or close/i,
      "the page no longer names what an agency message may never do",
    );
  });

  test("the cluster is internally linked to the method, the buyers and the service", () => {
    const wanted: Record<string, string[]> = {
      "commercial-hvac-maintenance-contracts": [
        "/hvac-property-manager-outreach",
        "/how-to-find-commercial-hvac-accounts",
        "/commercial-hvac-prospecting-triggers",
        "/commercial-hvac-lead-generation",
      ],
      "commercial-hvac-prospecting-triggers": [
        "/how-to-find-commercial-hvac-accounts",
        "/commercial-hvac-cold-email",
        "/commercial-hvac-maintenance-contracts",
      ],
      "commercial-hvac-outbound-vs-inbound": [
        "/how-to-choose-a-lead-generation-agency",
        "/commercial-hvac-maintenance-contracts",
        "/definitions",
        "/start",
      ],
    };
    for (const [slug, links] of Object.entries(wanted)) {
      const source = read(`app/${slug}/page.tsx`);
      for (const href of links) {
        assert.ok(source.includes(`href="${href}"`), `${slug} does not link to ${href}`);
      }
    }
  });

  // Depth over page count: three pages that say three different things, not one page with the
  // noun swapped. Near-duplicate titles are the first symptom of a doorway cluster.
  test("no registered guide shares a title, an H1 or a description with another", () => {
    assert.equal(new Set(guidePages.map((g) => g.metaTitle)).size, guidePages.length);
    assert.equal(new Set(guidePages.map((g) => g.h1)).size, guidePages.length);
    assert.equal(new Set(guidePages.map((g) => g.description)).size, guidePages.length);
  });

  test("every cluster page is announced to IndexNow", () => {
    const ping = read("scripts/indexnow-ping.mjs");
    for (const slug of CLUSTER) {
      assert.ok(ping.includes(`"/${slug}"`), `/${slug} is not announced to IndexNow`);
    }
  });
});
