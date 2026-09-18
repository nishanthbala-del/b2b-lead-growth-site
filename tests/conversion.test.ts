// The conversion layer (the conversion-optimization supplement of 2026-09-17), enforced.
//
// One dominant, tangible call to action on every sales page; a homepage that leads with the
// outcome and shows one real account; the company's newness said once; no sending mechanics
// on the sales page; a fit check that asks only what the decision needs; and a /start page
// that delivers what the button promised. All of it is prose, and prose drifts — these are
// the tripwires.

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import { audit, faqs, plans, planSlug, productExample, riskReversal } from "../lib/content.ts";
import { homepageH1 } from "../lib/pages.ts";
import { ANSWER_KEYS, OPTIONAL_ANSWER_KEYS, REQUIRED_ANSWER_KEYS, evaluateFit, recommendTier, scoreAnswers, type QualificationAnswers } from "../lib/qualification.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(repoRoot, rel), "utf8");
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|\s)\/\/[^\n]*/g, " ");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}
const uiFiles = [...walk(path.join(repoRoot, "app")), ...walk(path.join(repoRoot, "components"))].map((f) => path.relative(repoRoot, f));

// The label is read from the module that owns it, not restated: the test holds every page to
// whatever SiteChrome says, and separately holds SiteChrome to a tangible label.
const chrome = read("components/SiteChrome.tsx");
const CTA_LABEL = chrome.match(/export const CTA_LABEL = "([^"]+)"/)![1]!;

describe("one dominant, tangible call to action", () => {
  test("the label names a deliverable the audit actually provides", () => {
    assert.equal(CTA_LABEL, "Get 3 Commercial Accounts Free");
    // 3 is the floor of what the audit delivers, so the label is supportable.
    assert.ok(audit.includes.some((i) => /3-5 commercial accounts/i.test(i.title)), "the audit no longer promises 3-5 accounts");
  });

  test("no page uses a vague primary action", () => {
    // Capitalised as a label would be: "how to contact us" in the legal pages is prose, not a button.
    const vague = [/\bLearn [Mm]ore\b/, /\bExplore\b/, /\bContact [Uu]s\b/, /\bGet [Ss]tarted\b/, /See if we.{0,8}re a fit/i];
    const hits: string[] = [];
    for (const rel of uiFiles) {
      const src = stripComments(read(rel));
      for (const re of vague) {
        const m = src.match(re);
        if (m) hits.push(`${rel}: ${m[0]}`);
      }
    }
    assert.deepEqual(hits, [], `vague calls to action:\n  ${hits.join("\n  ")}`);
  });

  test("every filled button that leads to /start is the one PrimaryCta (or the header's tracked link)", () => {
    // A second button style pointing at the same place is a competing conversion path.
    const owners = new Set(["components/PrimaryCta.tsx", "components/SiteChrome.tsx"]);
    const hits: string[] = [];
    for (const rel of uiFiles) {
      if (owners.has(rel)) continue;
      const src = stripComments(read(rel));
      for (const m of src.matchAll(/<(?:Link|a|TrackedLink)\b[^>]*href=(?:"\/start"|\{CTA_HREF\})[^>]*>/g)) {
        if (/bg-accent-fill/.test(m[0])) hits.push(`${rel}: ${m[0].slice(0, 100)}`);
      }
    }
    assert.deepEqual(hits, [], `a second primary-button style points at /start:\n  ${hits.join("\n  ")}`);
  });

  test("the primary action appears on every major sales page, tagged with where it sits", () => {
    for (const rel of ["components/LeadGenerationLanding.tsx", "components/GuideLayout.tsx", "app/reviews/page.tsx", "app/not-found.tsx"]) {
      assert.match(read(rel), /<PrimaryCta placement="[a-z-]+"/, `${rel} does not render PrimaryCta`);
    }
    const placements = [...read("components/LeadGenerationLanding.tsx").matchAll(/<PrimaryCta placement="([a-z-]+)"/g)].map((m) => m[1]);
    assert.ok(placements.length >= 3, "the homepage should offer the action more than once along the page");
    assert.equal(new Set(placements).size, placements.length, "each homepage placement must be distinct, or the counts are meaningless");
    assert.match(chrome, /<TrackedLink[\s\S]{0,80}placement="header"/);
    assert.match(read("components/PrimaryCta.tsx"), /\{CTA_LABEL\}/);
  });
});

describe("the homepage leads with the outcome and shows the product", () => {
  const landing = stripComments(read("components/LeadGenerationLanding.tsx"));

  test("the eyebrow names the category and the buyer; the H1 states the outcome", () => {
    assert.match(landing, /Managed outbound for commercial HVAC contractors/);
    assert.match(homepageH1, /^Turn the commercial accounts in your market/);
    assert.match(homepageH1, /quote/);
    assert.doesNotMatch(homepageH1, /guarantee|\d/);
  });

  test("one real account is shown, in the audit's own format, with its provenance", () => {
    for (const row of [productExample.account, productExample.fit, productExample.buyer, productExample.reason, productExample.approach]) {
      assert.ok(row.label.length > 3 && row.value.length > 60, row.label);
    }
    assert.match(productExample.preparedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(productExample.source.quotes.length >= 2);
    for (const q of productExample.source.quotes) assert.ok(q.split(" ").length >= 3, `too short to be a quotation: ${q}`);
    assert.match(productExample.disclosure, /real account/i);
    assert.match(productExample.disclosure, /withheld/);
    assert.match(productExample.approach.label, /\(ours\)/, "the approach must be labelled as our recommendation");
    assert.doesNotMatch(productExample.buyer.value, /\b(Mr|Mrs|Ms|Dr)\.? [A-Z]/, "the buyer is a role, never a named person");
    // The reason to write is an opportunity, never a diagnosis of anyone's equipment (D-024).
    assert.doesNotMatch(productExample.reason.value, /\b(failing|broken|neglected|outdated|inefficient|due for replacement)\b/i);
    for (const key of ["account", "fit", "buyer", "reason", "approach", "source", "disclosure"]) {
      assert.match(landing, new RegExp(`productExample\\.${key}\\b`), `the homepage does not render productExample.${key}`);
    }
  });

  test("the company's newness is stated once on the homepage, not three times", () => {
    const newness = landing.match(/founder-led|founder-run|case studies|young company|new company|early,? founder|no client (results|reviews)/gi) ?? [];
    assert.equal(newness.length, 1, `newness stated ${newness.length} times: ${newness.join(" | ")}`);
    assert.doesNotMatch(landing, /whyFree/, "the audit's 'why it's free' line repeats the newness; it belongs on /free-pipeline-audit");
  });

  test("no sending mechanics on the sales page", () => {
    assert.doesNotMatch(landing, /warm-?up|ramp|messages? (the first|a) day|\b\d+ a day\b|queue|automation state/i);
    // The pacing still exists, one link down.
    assert.match(read("app/how-it-works/page.tsx"), /sendingCadence/);
  });

  test("the load-bearing anchors survive the compression", () => {
    for (const id of ["pricing", "get-audit", "faq", "why-us", "contact", "how-it-works", "boundary"]) {
      assert.match(landing, new RegExp(`id="${id}"`), `#${id} is gone from the homepage`);
    }
    assert.match(landing, /id=\{`plan-\$\{planSlug\(plan\.name\)\}`\}/);
    for (const p of plans) assert.ok(planSlug(p.name).length > 5);
  });

  test("the FAQ is curated open and complete in the DOM; the markup still maps all of it", () => {
    const featured = faqs.filter((f) => f.featured);
    assert.ok(featured.length >= 6 && featured.length <= 10, `${featured.length} featured questions`);
    assert.match(landing, /<details/);
    assert.match(landing, /faqs\.filter\(\(f\) => f\.group === group && !f\.featured\)/);
    assert.match(stripComments(read("app/page.tsx")), /mainEntity: faqs\.map/);
  });

  test("the three commitments shown are three of the seven, and the seven are published in full on /pricing", () => {
    const shown = [...landing.matchAll(/^\s+"([^"]+)",$/gm)].map((m) => m[1]!).filter((t) => riskReversal.some((r) => r.title === t));
    assert.equal(shown.length, 3, `homepage commitments: ${shown.join(" | ")}`);
    const pricing = read("app/pricing/page.tsx");
    assert.match(pricing, /id="commitments"/);
    assert.match(pricing, /riskReversal\.map/);
    assert.match(landing, /\/pricing#commitments/);
  });

  test("what left the homepage is published one link deeper", () => {
    const service = read("app/commercial-hvac-lead-generation/page.tsx");
    assert.match(service, /id="not-for"/);
    assert.match(service, /notFor\.map/);
    assert.match(service, /differentiators\.map/);
    assert.match(landing, /\/commercial-hvac-lead-generation#not-for/);
  });
});

describe("the fit check asks only what the decision needs", () => {
  const flow = stripComments(read("components/qualification/QualificationFlow.tsx"));

  test("the role is no longer asked; name, work email and company still are", () => {
    assert.doesNotMatch(flow, /id="q-role"/);
    for (const id of ["q-name", "q-email", "q-company", "q-area"]) assert.match(flow, new RegExp(`id="${id}"`), id);
  });

  test("the budget is optional everywhere: the rules, the form, and the API", () => {
    assert.deepEqual([...OPTIONAL_ANSWER_KEYS], ["budget"]);
    assert.deepEqual(REQUIRED_ANSWER_KEYS, ANSWER_KEYS.filter((k) => k !== "budget"));
    assert.doesNotMatch(flow, /next\.budget\s*=/);
    const api = stripComments(read("app/api/lead/route.ts"));
    assert.match(api, /for \(const key of REQUIRED_ANSWER_KEYS\)/);
    assert.doesNotMatch(api, /for \(const key of ANSWER_KEYS\)/);
  });

  test("no rule reads an optional answer: leaving it blank changes no verdict, score or plan", () => {
    const base: QualificationAnswers = {
      yearsInBusiness: "over-15",
      commercialShare: "most",
      commercialQuoter: "dedicated",
      jobValue: "over-100000",
      growthProblem: "no-way-to-find-accounts",
      currentApproach: "word-of-mouth",
      followUpOwner: "nobody",
      preparedOpportunities: "yes",
      capacity: "room-now",
      targetAccounts: "can-name",
      timeline: "now",
      budget: "",
    };
    for (const key of OPTIONAL_ANSWER_KEYS) {
      const blank = evaluateFit({ ...base, [key]: "" });
      for (const value of ["750", "1500", "2500", "unsure"]) {
        const given = evaluateFit({ ...base, [key]: value });
        assert.equal(given.outcome, blank.outcome);
        assert.equal(given.score, blank.score);
        assert.equal(given.recommendedTier, blank.recommendedTier);
      }
      assert.equal(scoreAnswers({ ...base, [key]: "" }), scoreAnswers({ ...base, [key]: "2500" }));
      assert.equal(recommendTier({ ...base, [key]: "" }), recommendTier({ ...base, [key]: "750" }));
    }
  });

  test("the result step says what just happened and what happens next", () => {
    assert.match(flow, /What just happened/);
    assert.match(flow, /What happens next/);
    assert.match(flow, /result\.nextStep/);
  });

  test("/start delivers what the button promised", () => {
    const start = stripComments(read("app/start/page.tsx"));
    assert.match(start, /<h1[^>]*>\s*Get 3 commercial accounts in your market, free\./);
    assert.match(start, /If it isn&rsquo;t, the last screen\s+says so/);
    assert.match(flow, /"Get my 3 free accounts"/);
    assert.match(flow, /"Get the straight answer"/);
  });
});
