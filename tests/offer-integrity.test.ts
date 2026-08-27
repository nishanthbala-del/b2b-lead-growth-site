// The offer's two load-bearing rules, enforced.
//
// Source of truth: the operating-system repo's
// 20_MARKETING_MY_SERVICES_SYSTEM/free_pipeline_audit.md.
//
// RULE 1 — the audit is delivered in writing, and a call is never its price. §5 names
// "Book a call to receive your free audit" as "a cold ask wearing a warm label" and the
// exact anti-pattern the escalation ladder exists to prevent. The walkthrough is rung 2
// and is OFFERED once someone has the work; it is not the turnstile the free work sits
// behind. Three separate surfaces had drifted back into gating it — the homepage final
// CTA, the guide-page CTA, and the fit check's own result screen.
//
// RULE 2 — no outcome is ever promised. CLAUDE.md §3.2: deliverables are activity,
// never outcomes.
//
// Both rules are prose rules, and prose rules drift silently. These are cheap.

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import {
  ANSWER_KEYS,
  EMPTY_ANSWERS,
  QUESTION_LABELS,
  evaluateFit,
  type QualificationAnswers,
} from "../lib/qualification.ts";
import { audit, faqs, plans } from "../lib/content.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** Remove line and block comments so only shipped strings are scanned. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
}

const copyFiles = [
  ...walk(path.join(repoRoot, "app")),
  ...walk(path.join(repoRoot, "components")),
  path.join(repoRoot, "lib", "content.ts"),
  path.join(repoRoot, "lib", "qualification.ts"),
];

describe("the audit is never gated behind a call", () => {
  test("no page tells a visitor to book a call in order to get the audit", () => {
    // Both orderings of the anti-pattern: "book a call to get the audit", and
    // "book a call and you'll leave with the audit".
    const gating = [
      /\b(book|schedule|pick)\b[^.!?]{0,120}\b(call|slot|time)\b[^.!?]{0,120}\b(to (get|receive|claim)|and (you'?ll |you will )?(leave|get|keep|walk away))\b[^.!?]{0,60}\baudit\b/i,
      /\baudit\b[^.!?]{0,80}\b(only|just)\b[^.!?]{0,60}\b(book|schedule)\b[^.!?]{0,40}\b(call|slot|time)\b/i,
    ];
    const offenders: string[] = [];
    for (const file of copyFiles) {
      // Comments are stripped: the rule is about what a visitor reads, and the code that
      // enforces it necessarily QUOTES the anti-pattern in order to explain itself.
      const text = stripComments(readFileSync(file, "utf8"));
      for (const re of gating) {
        const hit = text.match(re);
        // A line that explicitly disclaims the pattern is the fix, not the bug.
        if (hit && !/never (required|the price)|not (required|the price)|no call/i.test(hit[0])) {
          offenders.push(`${path.relative(repoRoot, file)}: "${hit[0].slice(0, 140)}"`);
        }
      }
    }
    assert.deepEqual(offenders, [], `the audit must be delivered in writing:\n${offenders.join("\n")}`);
  });

  test("a qualified visitor is told the audit comes without a call", () => {
    const strong = evaluateFit({
      yearsInBusiness: "over-15",
      recordVolume: "5k-plus",
      jobValue: "over-40000",
      growthProblem: "unsold-estimates",
      currentApproach: "word-of-mouth",
      followUpOwner: "nobody",
      capacity: "room-now",
      exportReadiness: "crm",
      timeline: "now",
      budget: "unsure",
    });
    assert.equal(strong.outcome, "strong");
    assert.match(strong.nextStep, /send it over in writing/i);
    assert.match(strong.nextStep, /don't have to talk to anyone/i);
  });

  test("an explore outcome does not make the open questions cost the audit", () => {
    const explore = evaluateFit({ ...EMPTY_ANSWERS, yearsInBusiness: "2-5", capacity: "room-now" });
    assert.equal(explore.outcome, "explore");
    assert.match(explore.nextStep, /in writing/i);
  });
});

describe("nothing promises an outcome", () => {
  // Deliberately narrow: these are phrasings that assert a RESULT, not words that merely
  // appear near one.
  const promises = [
    /\bwe (guarantee|promise|will get you|will book you|will deliver you)\b/gi,
    /\bguaranteed (leads|jobs|appointments|revenue|replies|results|meetings|calls)\b/gi,
    /\b(roi|return on investment) (of|up to)\b/gi,
    /\b\d+\s*(x|%)\s*(more|increase|growth|roi)\b/gi,
  ];

  // A denial of a promise is the opposite of a promise, and this site is built almost
  // entirely out of them: "no guaranteed leads, calls, or jobs" is the honest line, not
  // the violation. A matcher that cannot read negation flags exactly the sentences that
  // exist to prevent the thing it is looking for — which is how a prose guard ends up
  // being deleted for crying wolf instead of being fixed.
  const NEGATORS = /\b(no|not|never|without|don'?t|doesn'?t|won'?t|cannot|can'?t|nor|neither|any)\b[^.!?]{0,40}$/i;

  /** Promise-shaped phrases that are NOT inside a denial. */
  function outcomePromises(text: string): string[] {
    const hits: string[] = [];
    for (const re of promises) {
      for (const m of text.matchAll(re)) {
        const before = text.slice(Math.max(0, m.index - 60), m.index);
        if (!NEGATORS.test(before)) hits.push(m[0]);
      }
    }
    return hits;
  }

  test("the negation guard itself works", () => {
    // Without this the suite can silently degrade into always passing.
    assert.deepEqual(outcomePromises("no guaranteed leads, calls, or jobs"), []);
    assert.deepEqual(outcomePromises("We do not guarantee revenue"), []);
    assert.deepEqual(outcomePromises("we guarantee revenue"), ["we guarantee"]);
    assert.deepEqual(outcomePromises("guaranteed appointments every month"), [
      "guaranteed appointments",
    ]);
  });

  test("the published plan copy states activity, not results", () => {
    for (const plan of plans) {
      const text = [
        plan.oneLiner,
        plan.capacity,
        plan.bestFor,
        ...plan.includes,
        plan.youKeep,
      ].join(" ");
      assert.deepEqual(outcomePromises(text), [], `${plan.name} promises an outcome`);
    }
  });

  test("the audit copy promises a deliverable and its quality, never a result", () => {
    const text = [audit.tagline, audit.whyFree, audit.guardrail, ...audit.includes.map((i) => `${i.title} ${i.body}`)].join(" ");
    assert.deepEqual(outcomePromises(text), []);
  });

  test("no FAQ answer promises an outcome", () => {
    for (const faq of faqs) {
      assert.deepEqual(outcomePromises(faq.answer), [], `FAQ "${faq.question}" promises an outcome`);
    }
  });

  test("no fit outcome, for any combination of answers, promises a result", () => {
    // Exhaustive over the two dimensions the outcome copy actually branches on, plus
    // the blocking answers — the reachable surface of every sentence this can render.
    const problems = ["unsold-estimates", "lapsed-customers", "thin-shoulder-season", "no-referral-pipeline", "paying-per-lead", "buy-leads", "other"] as const;
    const capacities = ["room-now", "shoulder-thin", "at-capacity"] as const;
    for (const growthProblem of problems) {
      for (const capacity of capacities) {
        for (const recordVolume of ["none", "few-hundred", "5k-plus"] as const) {
          const answers: QualificationAnswers = { ...EMPTY_ANSWERS, growthProblem, capacity, recordVolume };
          const r = evaluateFit(answers);
          const text = [r.headline, r.nextStep, ...r.reasons, ...r.watchouts].join(" ");
          assert.deepEqual(
            outcomePromises(text),
            [],
            `outcome for ${growthProblem}/${capacity}/${recordVolume}`,
          );
        }
      }
    }
  });
});

describe("the privacy policy describes the form that actually exists", () => {
  // /privacy renders this list directly, so a question added without a label would
  // publish a blank bullet on a legal page. It is also the only guard that the policy
  // keeps pace with the form at all — the previous hand-written list was already stale.
  test("every question the form asks has a published plain-English label", () => {
    for (const key of ANSWER_KEYS) {
      const label = QUESTION_LABELS[key];
      assert.ok(label && label.trim().length > 8, `${key} has no usable label`);
      assert.doesNotMatch(label, /^[A-Z]/, `${key}'s label should read as prose in a sentence`);
    }
    assert.equal(Object.keys(QUESTION_LABELS).length, ANSWER_KEYS.length);
  });

  test("the policy page is the one rendering that list", () => {
    const policy = readFileSync(path.join(repoRoot, "app", "privacy", "page.tsx"), "utf8");
    assert.match(policy, /ANSWER_KEYS/, "/privacy must generate the field list, not restate it");
    assert.match(policy, /QUESTION_LABELS/);
    // We store a computed judgement about the visitor; saying so is not optional.
    assert.match(policy, /fit assessment/i);
  });
});
