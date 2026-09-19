// The pricing model, enforced (D-028 — the two-offer model).
//
// Source of truth: the operating-system repo's
// 00_CONTROL_CENTER/decisions/D-028_two_offer_model.md and its machine form core/offer.py.
//
//     $1,500  Managed Outbound    accounts, decision-makers, outreach + follow-up, screening,
//                                 qualified interest -> the WARM HANDOFF of a qualified conversation
//     $2,500  Opportunity Engine  all of that, then need validation, property/account/buyer
//                                 information, acceptance against the client's agreed criteria and
//                                 a coordinated next sales step -> an ACCEPTED SALES OPPORTUNITY,
//                                 handed over with an opportunity brief and the warm handoff
//
// Two answers to one question — how far do we carry each opportunity before the warm handoff? —
// and on both the contractor does the technical discovery, estimates, proposes and closes. The
// $750 plan (D-027 "Prospecting", D-015 "Starter / Lead Engine") is RETIRED, not renamed.
//
// These are prose rules, and prose rules drift silently: a retired model's tier names survived
// in a Terms clause, a manifest and a fit-check hint for days after the decision that retired
// them. So this file fails when shipped copy:
//   (a) gives Managed Outbound need validation, context development, acceptance against the
//       client's criteria, a coordinated next step or site assessment, an opportunity brief,
//       or calls its handoff an accepted sales opportunity;
//   (c) reduces the $2,500 difference to volume, implies we estimate, quote, price or
//       technically scope, or guarantees contracts;
//   (d) revives a retired plan, price or name, a second pricing model, residential /
//       homeowner-lead positioning, New-Jersey-only positioning, or a stale calling absolute;
//   (e) changes the two canonical plan names, prices, one-liners or handoff points;
//   (f) lists a sitemap URL that is unregistered, redirected, noindex or has no page file;
//   (g) ships a registered page without an in-budget title and description and exactly one H1.
//
// HOW THE PROSE DETECTORS READ. Copy is split into sentences. A sentence that names ONE plan is
// checked whole against that plan's forbidden claims; a sentence that names several is cut into
// segments, each running from one plan's name to the next, so "Managed Outbound hands over at
// qualified interest, and the Opportunity Engine validates it" blames nobody. A mention that
// only REFERS to a plan ("everything in Managed Outbound", "never includes the Opportunity
// Engine's work") makes no claim about it and starts no segment. A claim is excused when it is
// negated ("no follow-up sequence at this level") or handed to the contractor ("…stay with
// you"). That is deliberately forgiving — this site is built out of sentences that say what a
// plan does NOT do, and a guard that cannot read negation gets deleted for crying wolf. It is
// a tripwire, not a proof; the STRUCTURED checks on `plans` below are the strict ones. Every
// detector has a negative fixture, so none of them can quietly degrade into always passing.

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe } from "node:test";

import {
  boundarySentence,
  contractorBoundary,
  plans,
  positioningSentence,
  responsibilityMatrix,
  terminology,
  warmHandoffSteps,
} from "../lib/content.ts";
import {
  DESCRIPTION_BUDGET,
  TITLE_BUDGET,
  guidePages,
  homepageDescription,
  homepageH1,
  homepageMetaTitle,
  indexablePaths,
  legalRoutes,
  retiredPaths,
  serviceJsonLd,
  standaloneRoutes,
} from "../lib/pages.ts";
import { llmsTxt } from "../lib/llms.ts";
import { orgDescription } from "../lib/site.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(path.join(repoRoot, rel), "utf8");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** Remove block, line and trailing comments so only shipped strings are scanned. The code
 *  that enforces a rule necessarily QUOTES the thing it forbids in order to explain itself. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|\s)\/\/[^\n]*/g, " ");
}

/** Source → readable prose: comments out, tags out, entities decoded, whitespace collapsed. */
function toProse(source: string, isCode: boolean): string {
  let t = isCode ? stripComments(source) : source;
  // In code, the END OF A STRING LITERAL is the end of a statement: `title: "…", body: "…"`
  // are two claims, and a heading with no full stop must not run on into the paragraph below
  // it. So a closing quote followed by a comma is given the full stop it lacks.
  if (isCode) t = t.replace(/<[^<>]+>/g, " ").replace(/\{"\s*"\}/g, " ").replace(/(["`]),(\s)/g, "$1.$2");
  return t
    .replace(/&rsquo;|&lsquo;|&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ");
}

const codeFiles = [
  ...walk(path.join(repoRoot, "app")),
  ...walk(path.join(repoRoot, "components")),
  ...["content", "qualification", "site", "pages", "attribution"].map((n) =>
    path.join(repoRoot, "lib", `${n}.ts`),
  ),
];
// Shipped or owner-facing text that states the offer. CLAUDE_CODE_SEO_AI_SEO_AUDIT_HANDOFF.md
// and SEO_GROWTH_PLAN.md are dated historical records carrying a "superseded" banner, and
// SOURCES.md is a citation register; none of them is copy.
const textFiles = ["README.md", "SETUP.md"];

type Doc = { rel: string; prose: string };
const corpus: Doc[] = [
  ...codeFiles.map((f) => ({ rel: path.relative(repoRoot, f), prose: toProse(readFileSync(f, "utf8"), true) })),
  ...textFiles.map((rel) => ({ rel, prose: toProse(read(rel), false) })),
  // /llms.txt is generated (lib/llms.ts), so the corpus reads what it RENDERS, not its source.
  { rel: "/llms.txt (rendered)", prose: toProse(llmsTxt(), false) },
];

// A sentence ends at . ! or ? — and, inside a TypeScript string literal, that mark is followed
// by the closing quote and a comma (`…hands off.", }, {`). Without allowing for those, one
// array entry's last sentence runs on into the next entry's first, and a claim about one plan
// is blamed on the plan named in its neighbour.
const sentencesOf = (prose: string): string[] =>
  prose.split(/(?<=[.!?]["'”)\]]{0,2},?)\s+/).map((s) => s.trim()).filter(Boolean);

/** A question asks; it does not claim. "Do you cold call?" is not a cold-call claim. */
// A QUESTION ASSERTS NOTHING. "Do you cold call?" is the FAQ heading; the answer beneath it is
// the claim, and the answer is checked on its own. The sentence splitter hands source text over
// with whatever closed the string literal still attached — `…long contracts?".` — so the
// closing quote, bracket, comma AND the splitter's own full stop are all allowed after the `?`.
const isQuestion = (sentence: string): boolean => /\?["'”’)\]]{0,2}[,.;]?\s*$/.test(sentence.trim());

/* -------------------------------------------------------------------------- */
/*  Negation and ownership                                                      */
/* -------------------------------------------------------------------------- */

const NEGATOR =
  /\b(no|not|never|without|nothing|none|neither|nor|isn'?t|aren'?t|don'?t|doesn'?t|won'?t|cannot|can'?t|excludes?|excluding)\b/i;

// The claim is handed to the CONTRACTOR: "…stay with you", "that call is yours", "you take
// the conversation", "someone on your team already chases the follow-up".
const TRANSFER =
  /\b(stays? with you|(is|are|stays?|remains?) yours|yours to (make|run|take|do)|you (also |then |always )?(take|keep|run|handle|own|do|work)\b|someone on your team|your (team|office|person|staff|estimator|side)\b[^.]{0,40}\b(takes?|works?|runs?|handles?|does|chases?|already)\b)/i;

/** True when the match is negated nearby, or sits inside a negation of its own. */
function negated(text: string, index: number, length: number): boolean {
  return NEGATOR.test(text.slice(Math.max(0, index - 80), index + length));
}

/* -------------------------------------------------------------------------- */
/*  (a) (b) (c) — what each plan may not be said to do                          */
/* -------------------------------------------------------------------------- */

type TierKey = "managed" | "engine";

const FORBIDDEN: Record<TierKey, RegExp[]> = {
  // $1,500: everything up to and including the warm handoff of a qualified conversation.
  // Nothing past qualified interest is ours: no validation, no acceptance against criteria,
  // no coordinated next step or site assessment, no opportunity brief — and its handoff is
  // never an accepted sales opportunity. Sharing the contractor's booking link or calendar
  // path IS part of its warm handoff, so "coordinate" alone is not forbidden.
  managed: [
    /\baccepted (sales )?opportunit/i,
    /\bvalidat(e|es|ed|ing|ion)\b/i,
    /\b(gather|develop|collect|build)(s|ed|ing)?\b[^.]{0,40}\b(scope|context|property)\b/i,
    /\b(scope|context) (discovery|development|gathering)\b/i,
    /\bagainst (your|the|their)\b[^.]{0,25}\bcriteria\b/i,
    /\bsite[- ](visits?|assessments?)\b/i,
    /\bcoordinat\w+\b[^.]{0,40}\b(next (sales )?step|site|meeting|appointment|visit)\b/i,
    /\bopportunity brief\b/i,
  ],
  // $2,500: more responsibility, never "more messages".
  engine: [
    /\b(more|higher|extra|bigger|larger|additional)\b[^.]{0,25}\b(messages?|volume|emails?|sends?|outreach|accounts|contacts)\b/i,
  ],
};

// "Commercial HVAC Managed Outbound" in a title is the CATEGORY in title case, not the plan.
const TIER_MENTION = /\b((?<!HVAC )Managed Outbound|Opportunity Engine)\b|\$(1,500|2,500)(?![\d,])/g;

function tierOf(match: RegExpMatchArray): TierKey {
  const token = match[1] ?? match[2];
  return token === "Managed Outbound" || token === "1,500" ? "managed" : "engine";
}

// "Everything in Managed Outbound, and we keep going: we validate…" is the Opportunity
// Engine's claim, not Managed Outbound's; "Managed Outbound never includes the Opportunity
// Engine's work" is Managed Outbound's. A mention preceded by one of these words refers to a
// plan without making a claim about it.
const REFERENCE_BEFORE = /\b((everything|all|the work) (in|of)|includ(e|es|ing)|than|beyond|plus)\s+(the\s+)?$/i;
const isReference = (sentence: string, at: number) => REFERENCE_BEFORE.test(sentence.slice(Math.max(0, at - 30), at));

/** Plan claims in `prose` that give a plan work it does not include. */
function tierViolations(prose: string): string[] {
  const out: string[] = [];
  for (const sentence of sentencesOf(prose)) {
    if (isQuestion(sentence)) continue;
    const mentions = [...sentence.matchAll(TIER_MENTION)]
      .filter((m) => !isReference(sentence, m.index ?? 0))
      .map((m) => ({ tier: tierOf(m), at: m.index ?? 0 }));
    if (mentions.length === 0) continue;
    const named = new Set(mentions.map((m) => m.tier));
    const segments =
      named.size === 1
        ? [{ tier: mentions[0]!.tier, text: sentence }]
        : mentions.map((m, i) => ({ tier: m.tier, text: sentence.slice(m.at, mentions[i + 1]?.at ?? sentence.length) }));
    for (const seg of segments) {
      if (TRANSFER.test(seg.text)) continue;
      for (const re of FORBIDDEN[seg.tier]) {
        const hit = seg.text.match(re);
        if (hit && !negated(seg.text, hit.index ?? 0, hit[0].length)) {
          out.push(`[${seg.tier}] "${hit[0]}" in: ${seg.text.slice(0, 160)}`);
        }
      }
    }
  }
  return out;
}

// True on EVERY plan, so checked in every sentence whatever it names: we never estimate,
// quote, price, technically scope, or guarantee.
const BOUNDARY_BREACHES: RegExp[] = [
  /\bwe (will |can |also )?(create|write|produce|provide|issue|draft|send|deliver|build)\b[^.;]{0,30}\b(estimates?|quotes?|bids?|proposals?|pricing)\b/i,
  /\bwe (will |can |also )?(estimate|quote|price|bid)\b[^.;]{0,20}\b(the|your|each|every) (job|work|project|opportunit\w+|system|unit)\b/i,
  /\bwe\b[^.;]{0,40}\b(diagnos(e|es|ing)|specif(y|ies|ying)|engineer(s|ing)?|size|sizes|inspect(s|ing)?)\b[^.;]{0,30}\b(equipment|units?|systems?|rtus?|rooftop|solutions?)\b/i,
  /\b(we|our plans?|this plan|the plan)\b[^.;?]{0,40}\bguarantee(s|d)?\b/i,
  /\bguaranteed (contracts?|site visits?|qualified opportunit\w+|opportunit\w+)\b/i,
  /\b(difference|differ|differs)\b[^.]{0,60}\b(only|just|simply)\b[^.]{0,30}\b(volume|message count|number of messages)\b/i,
];

function boundaryBreaches(prose: string): string[] {
  const out: string[] = [];
  for (const sentence of sentencesOf(prose)) {
    if (isQuestion(sentence)) continue;
    for (const re of BOUNDARY_BREACHES) {
      const hit = sentence.match(re);
      if (hit && !negated(sentence, hit.index ?? 0, hit[0].length)) out.push(`"${hit[0]}" in: ${sentence.slice(0, 160)}`);
    }
  }
  return out;
}

describe("(a)(b)(c) no plan is given another plan's work", () => {
  test("the detectors fire on the contradictions the mandate names", () => {
    const fires = (text: string) => tierViolations(text).length > 0;
    // (a) $1,500
    assert.ok(fires("Managed Outbound validates the business need before the handoff."));
    assert.ok(fires("On the $1,500 plan we coordinate the site assessment."));
    assert.ok(fires("Managed Outbound hands you accepted sales opportunities."));
    assert.ok(fires("Managed Outbound gathers the property and scope context."));
    assert.ok(fires("Managed Outbound checks each opportunity against your criteria."));
    assert.ok(fires("Managed Outbound delivers an opportunity brief with every handoff."));
    assert.ok(fires("Managed Outbound coordinates the next sales step with the buyer."));
    // (c) $2,500 reduced to volume
    assert.ok(fires("The Opportunity Engine costs more because it sends more messages."));
    assert.ok(fires("The $2,500 plan is the same service with higher volume."));
  });

  test("the detectors stay quiet on the honest sentences", () => {
    const quiet = (text: string) => assert.deepEqual(tierViolations(text), [], text);
    quiet("Managed Outbound hands you qualified conversations with a warm introduction.");
    quiet("On Managed Outbound, need validation and the next sales step stay with you.");
    quiet("Managed Outbound never includes validation, criteria acceptance or a coordinated next step.");
    quiet("Managed Outbound can share your booking link and coordinate your calendar path when appropriate.");
    quiet("$2,500 is the Opportunity Engine: everything in Managed Outbound, and we also validate the business need and set a concrete next sales step.");
    quiet("Managed Outbound never quietly includes the Opportunity Engine's validation and scheduling.");
    quiet("Managed Outbound hands over at qualified interest, and the Opportunity Engine validates the need.");
    quiet("The Opportunity Engine covers up to 150 outreach messages a month.");
    quiet("Commercial HVAC prospecting is part of every plan.");
  });

  test("the boundary detectors fire, and read negation", () => {
    const fires = (text: string) => boundaryBreaches(text).length > 0;
    assert.ok(fires("We create the estimate and send it to the buyer."));
    assert.ok(fires("We quote the job so your estimator does not have to."));
    assert.ok(fires("We diagnose the rooftop unit and specify the equipment."));
    assert.ok(fires("We guarantee contracts within ninety days."));
    assert.ok(fires("Guaranteed site visits every month."));
    assert.ok(fires("The plans differ only by message count."));
    assert.deepEqual(boundaryBreaches("We never create binding estimates or quotes."), []);
    assert.deepEqual(boundaryBreaches("We do not inspect equipment, diagnose or specify it."), []);
    assert.deepEqual(boundaryBreaches("We do not guarantee revenue, contracts or site visits."), []);
    assert.deepEqual(boundaryBreaches("We prepare the opportunity; you estimate and close it."), []);
  });

  test("no shipped copy gives a plan work it does not include", () => {
    const offenders = corpus.flatMap((d) => tierViolations(d.prose).map((v) => `${d.rel}: ${v}`));
    assert.deepEqual(offenders, [], `a plan is described with another plan's responsibility:\n  ${offenders.join("\n  ")}`);
  });

  test("no shipped copy crosses the contractor's boundary or guarantees an outcome", () => {
    const offenders = corpus.flatMap((d) => boundaryBreaches(d.prose).map((v) => `${d.rel}: ${v}`));
    assert.deepEqual(offenders, [], `copy implies we estimate, scope or guarantee:\n  ${offenders.join("\n  ")}`);
  });
});

/* -------------------------------------------------------------------------- */
/*  (e) + the structured plan data — the strict checks                          */
/* -------------------------------------------------------------------------- */

describe("(e) the two plans are exactly the canonical two", () => {
  const CANONICAL = [
    {
      name: "Managed Outbound",
      price: 1500,
      oneLiner:
        "We find the right commercial accounts, reach the decision-makers, run the outreach and follow-up, and hand you each prospect who wants to talk — with a warm introduction.",
      handoffPoint: "Qualified Interest",
    },
    {
      name: "Opportunity Engine",
      price: 2500,
      oneLiner:
        "Everything in Managed Outbound, and we keep going: we validate the business need, gather the property, account and buyer information, confirm the fit against your agreed criteria, and coordinate a concrete next sales step before we hand the opportunity over.",
      handoffPoint: "Accepted Sales Opportunity",
    },
  ];

  test("names, prices, one-liners and handoff points are verbatim, in ladder order", () => {
    assert.deepEqual(
      plans.map((p) => ({ name: p.name, price: p.price, oneLiner: p.oneLiner, handoffPoint: p.handoffPoint })),
      CANONICAL,
    );
  });

  test("Managed Outbound is the one featured plan", () => {
    assert.deepEqual(plans.filter((p) => p.featured).map((p) => p.name), ["Managed Outbound"]);
  });

  test("the literal source carries them too, for the operating system's own checker", () => {
    // scripts/check_cross_repo.py reads lib/content.ts as TEXT. Keep each as one literal.
    const source = read("lib/content.ts");
    for (const c of CANONICAL) {
      assert.ok(source.includes(`name: "${c.name}"`), `name: "${c.name}" is not a single literal`);
      assert.ok(source.includes(`"${c.oneLiner}"`), `${c.name}'s one-liner is not a single literal`);
    }
    assert.deepEqual([...source.matchAll(/\bprice:\s*(\d+)/g)].map((m) => Number(m[1])), [1500, 2500]);
  });

  const [managed, engine] = plans as [(typeof plans)[number], (typeof plans)[number]];
  /** Everything a plan says WE do. `youKeep` is excluded on purpose: it is the list of things
   *  that stay with the contractor, which is exactly where the forbidden words belong. */
  const ours = (p: (typeof plans)[number]) =>
    [p.oneLiner, p.outcome, ...p.owns, ...p.afterInterest, p.handoff.label, p.handoff.unit, p.handoff.definition, p.capacity, p.bestFor, ...p.includes];

  test("Managed Outbound stops at the warm handoff of a qualified conversation", () => {
    for (const line of ours(managed)) {
      if (TRANSFER.test(line)) continue;
      for (const re of FORBIDDEN.managed) {
        const hit = line.match(re);
        assert.ok(!hit || negated(line, hit.index ?? 0, hit[0].length), `Managed Outbound claims "${hit?.[0]}" in: ${line}`);
      }
    }
    assert.deepEqual(managed.afterInterest.slice(0, 2), ["qualified interest", "warm handoff"]);
    assert.equal(managed.handoff.label, "Warm handoff — qualified interest");
    assert.equal(managed.handoff.unit, "qualified conversations handed off");
    assert.equal(managed.outcome, "Create qualified conversations.");
    assert.match(managed.youKeep, /qualification.*discovery.*estimate.*proposal.*close/i);
  });

  test("the Opportunity Engine is differentiated by responsibility, not by volume", () => {
    for (const needed of [
      "business-need validation",
      "property, account and buyer information",
      "acceptance against your criteria",
      "next sales step coordination",
      "opportunity brief",
      "warm handoff",
    ]) {
      assert.ok(engine.owns.includes(needed), `the Opportunity Engine no longer owns "${needed}"`);
    }
    assert.equal(engine.handoff.unit, "accepted sales opportunities handed off");
    assert.equal(engine.outcome, "Turn qualified conversations into accepted sales opportunities.");
    // The one-liner and the "best for" line never mention a count of anything.
    for (const p of plans) assert.doesNotMatch(`${p.oneLiner} ${p.bestFor}`, /\d/, `${p.name} is pitched on a number`);
  });

  test("Managed Outbound's handoff is never labelled with the Opportunity Engine's noun", () => {
    assert.doesNotMatch(`${managed.handoff.label} ${managed.handoff.unit} ${managed.handoff.definition}`, /accepted|opportunity brief/i);
  });

  test("on both plans the contractor keeps the technical discovery, the estimate, the proposal and the close", () => {
    for (const p of plans) assert.match(p.youKeep, /discovery.*estimate.*proposal.*close/i, p.name);
  });

  test("the who-owns-what grid never lets Managed Outbound inherit the Opportunity Engine's work", () => {
    const ENGINE_ONLY = /validat|acceptance criteria|next sales step|opportunity brief|property, account and buyer|engaged call/i;
    const BOTH = /targeting|account research|decision-maker|outreach|follow-up|screening|warm handoff|open conversation/i;
    for (const row of responsibilityMatrix.slice(0, -1)) {
      const [m, e] = row.owner;
      assert.ok(!(m === "we" && e === "you"), `${row.responsibility}: Managed Outbound has it, the Opportunity Engine does not`);
      if (ENGINE_ONLY.test(row.responsibility)) assert.deepEqual(row.owner, ["you", "we"], row.responsibility);
      else if (BOTH.test(row.responsibility)) assert.deepEqual(row.owner, ["we", "we"], row.responsibility);
    }
    const last = responsibilityMatrix.at(-1)!;
    assert.match(last.responsibility, /discovery.*estimate.*proposal.*close/i);
    assert.deepEqual(last.owner, ["you", "you"], "the technical work, the estimate and the close are the contractor's on both plans");
  });

  test("the six terms are defined once, and the plan-bound ones name their plan", () => {
    assert.deepEqual(terminology.map((t) => t.term), [
      "Prospect",
      "Interested Prospect",
      "Qualified Conversation",
      "Accepted Sales Opportunity",
      "Warm Handoff",
      "Opportunity Brief",
    ]);
    const def = (term: string) => terminology.find((t) => t.term === term)!.definition;
    assert.match(def("Prospect"), /Always a business/i);
    // The definition says who a prospect IS, and names no residential audience.
    assert.doesNotMatch(def("Prospect"), /homeowner|residential/i);
    assert.match(def("Interested Prospect"), /before a qualified conversation/i);
    assert.match(def("Qualified Conversation"), /What Managed Outbound hands off/);
    assert.match(def("Accepted Sales Opportunity"), /What the Opportunity Engine hands off/);
  });

  test("the boundary is published whole", () => {
    assert.equal(
      boundarySentence,
      "B2B Lead Growth creates the sales conversation and, on the Opportunity Engine, develops it into an accepted sales opportunity. The HVAC contractor does the technical discovery, estimates, proposes and closes.",
    );
    const all = contractorBoundary.join(" | ");
    for (const must of [
      "technical HVAC discovery",
      "site assessments",
      "diagnose equipment",
      "specify equipment",
      "final project scope",
      "estimates, quotes, bids or proposals",
      "negotiate",
      "close the sale",
      "guarantee contracts",
    ]) {
      assert.ok(all.includes(must), `the boundary list dropped "${must}"`);
    }
  });

  test("the warm handoff is published step by step, the same on both plans", () => {
    assert.equal(warmHandoffSteps.length, 8);
    for (const step of ["create the handoff record", "make the warm introduction", "transfer ownership", "mark the opportunity handed off"]) {
      assert.ok(warmHandoffSteps.some((s) => s.includes(step)), `the warm handoff dropped "${step}"`);
    }
    assert.match(read("app/how-it-works/page.tsx"), /warmHandoffSteps\.map/);
  });

  test("schema says what the plan cards say, and nothing else", () => {
    const service = serviceJsonLd();
    const offers = service.offers.offers;
    assert.deepEqual(offers.map((o) => [o.name, o.price, o.description]), plans.map((p) => [p.name, String(p.price), p.oneLiner]));
    assert.equal(service.offers.lowPrice, "1500");
    assert.equal(service.offers.highPrice, "2500");
    assert.equal(service.offers.offerCount, 2);
    assert.doesNotMatch(JSON.stringify(service), /appointment setting|\$750|"750"/i, "the Service node must not advertise appointment setting or a retired price");
    for (const p of plans) assert.ok(orgDescription.includes(p.name), `orgDescription does not name ${p.name}`);
    assert.match(orgDescription, /contractor always does the technical discovery, estimates and closes/i);
  });

  test("the homepage hero carries the one positioning sentence, word for word", () => {
    // The same comparison the operating system's check_cross_repo.py makes, so a drift is
    // caught here before it is caught there.
    const words = (t: string) => t.toLowerCase().match(/[a-z]+/g) ?? [];
    const want = words(positioningSentence);
    const have = words(read("components/LeadGenerationLanding.tsx"));
    const found = have.some((_, k) => want.every((w, i) => have[k + i] === w));
    assert.ok(found, "the hero no longer carries lib/content.ts `positioningSentence` verbatim");
    assert.match(positioningSentence, /one thing: qualified conversations\.$/);
  });
});

/* -------------------------------------------------------------------------- */
/*  (d) retired names, retired models, retired geography, retired absolutes     */
/* -------------------------------------------------------------------------- */

describe("(d) nothing retired comes back", () => {
  const RETIRED_NAMES = [
    // D-015
    "Lead Engine",
    "Outreach Engine",
    "Appointment Engine",
    "Starter Lead Engine",
    "Recommended Outreach Engine",
    "Premium Appointment Engine",
    // D-027 (retired by D-028, 2026-09-18)
    "Managed Pipeline",
    "Qualified Opportunity Engine",
    "Screened Interest",
    "Structured Handoff",
  ];

  // The $750 plan is retired, not renamed. Its price and its D-027 name may not be published.
  const RETIRED_PLAN = [/\$750(?![\d,])/, /\b([Oo]n|[Tt]he|[Tt]o|[Ff]rom) Prospecting\b(?! guide)/, /\bProspecting (plan|tier|level)\b/, /\bthree (plans|levels|tiers)\b/i];

  // Each is fine when DENIED ("no acceptance fee", "no pilot") and a defect when asserted.
  const SECOND_PRICING_MODEL = [
    /\bacceptance fee\b/i,
    /\bper[- ](qualified[- ])?opportunity\b/i,
    /\bhybrid (pricing|model|plan)\b/i,
    /\bpilot\b/i,
    /\b(free )?trial\b/i,
    /\bcommission\b/i,
    /\bfounding[- ]client\b/i,
    /\bperformance[- ](fee|pricing|based)\b/i,
  ];

  // The retired residential model, and any sentence in which WE sell consumers.
  const RESIDENTIAL_POSITIONING = [
    /\breactivat\w*/i,
    /\bpipeline recovery\b/i,
    /\bmaintenance[- ]plan recovery\b/i,
    /\bunsold estimates?\b/i,
    /\b(past|previous) customers?\b/i,
    /\bhomeowner (records?|estimates?|databases?) (you|we|to)\b/i,
    // "buy" is deliberately absent: it is the VISITOR's verb in the fit check ("we're looking
    // to buy homeowner leads"), and that option exists precisely to decline him.
    /\b(we|our service|b2b lead growth)\b[^.]{0,50}\b(sells?|generates?|delivers?|provides?|sources?)\b[^.]{0,40}\b(homeowner|residential)\b[^.]{0,20}\b(leads?|customers?|jobs|records?)\b/i,
  ];

  // Where the company IS may be said ("based in New Jersey", "a New Jersey limited liability
  // company", "the laws of the State of New Jersey"). Where it WORKS may not be one state.
  const NEW_JERSEY_ONLY = [
    /\b(focus(ed|ing)?|concentrat\w+) on New Jersey\b/i,
    /\bcurrently focused\b/i,
    /\b(New Jersey|NJ)[- ]first\b/i,
    /\bNJ-specific\b/i,
    /\bin New Jersey only\b/i,
    /\bonly (in|serves?|works? (in|with)) New Jersey\b/i,
    /\bNew Jersey HVAC (contractors?|companies|shops)\b/i,
    /\bHVAC (lead generation|leads) in (New Jersey|NJ)\b/i,
    /\bcurrentFocusArea\b/,
  ];

  // The calling policy is "email-led; no COLD calls; an engaged call only after genuine
  // interest, and ours only on the top plan". A flat "we never call" contradicts the top plan,
  // and an un-negated "cold call" contradicts all three.
  const STALE_CALLING = [
    // "call" as in NAME is not a phone call: "we never call one by another's name",
    // "we do not call either of them qualified".
    /\bwe (never|do not|don'?t|will not|won'?t) (phone|make (any )?(phone )?calls)\b/i,
    /\bwe (never|do not|don'?t|will not|won'?t) call\b(?! (it|them|either|one|this|that|any of)\b)/i,
    /\bmake phone calls in your name\b/i,
    /\bmake calls on your behalf\b/i,
    /\bno phone calls\b/i,
  ];

  const negatedHits = (prose: string, patterns: RegExp[], opts: { allowNegated: boolean }) => {
    const out: string[] = [];
    for (const sentence of sentencesOf(prose)) {
      if (isQuestion(sentence)) continue;
      for (const re of patterns) {
        const hit = sentence.match(re);
        if (!hit) continue;
        if (opts.allowNegated && negated(sentence, hit.index ?? 0, hit[0].length)) continue;
        out.push(`"${hit[0]}" in: ${sentence.slice(0, 160)}`);
      }
    }
    return out;
  };

  const coldCalls = (prose: string) =>
    sentencesOf(prose)
      .filter((s) => !isQuestion(s))
      .flatMap((s) => {
        const hit = s.match(/\bcold[- ]call(s|ing|ed)?\b/i);
        return hit && !negated(s, hit.index ?? 0, hit[0].length) ? [`"${hit[0]}" in: ${s.slice(0, 160)}`] : [];
      });

  test("the detectors fire on what they exist to catch", () => {
    assert.ok(negatedHits("There is a small acceptance fee per opportunity.", SECOND_PRICING_MODEL, { allowNegated: true }).length > 0);
    assert.ok(negatedHits("Start with a 30-day pilot.", SECOND_PRICING_MODEL, { allowNegated: true }).length > 0);
    assert.deepEqual(negatedHits("No per-opportunity fee, no acceptance fee and no pilot.", SECOND_PRICING_MODEL, { allowNegated: true }), []);
    assert.ok(negatedHits("We reactivate the jobs you already quoted.", RESIDENTIAL_POSITIONING, { allowNegated: false }).length > 0);
    assert.ok(negatedHits("We generate exclusive homeowner leads for your crews.", RESIDENTIAL_POSITIONING, { allowNegated: false }).length > 0);
    assert.deepEqual(negatedHits("We never contact homeowners, and a residential-only shop is a decline.", RESIDENTIAL_POSITIONING, { allowNegated: false }), []);
    assert.ok(negatedHits("Campaigns are currently focused on New Jersey.", NEW_JERSEY_ONLY, { allowNegated: false }).length > 0);
    assert.ok(negatedHits("We serve established New Jersey HVAC contractors.", NEW_JERSEY_ONLY, { allowNegated: false }).length > 0);
    assert.deepEqual(negatedHits("A founder-run company based in New Jersey, serving contractors across the United States.", NEW_JERSEY_ONLY, { allowNegated: false }), []);
    assert.ok(negatedHits("We never call anyone on your behalf.", STALE_CALLING, { allowNegated: false }).length > 0);
    assert.ok(negatedHits("We do not make phone calls in your name.", STALE_CALLING, { allowNegated: false }).length > 0);
    assert.deepEqual(negatedHits("We never call one by another's name.", STALE_CALLING, { allowNegated: false }), []);
    assert.deepEqual(negatedHits("Is there an acceptance fee or a pilot?", SECOND_PRICING_MODEL, { allowNegated: true }), []);
    assert.ok(coldCalls("We cold call facility managers for you.").length > 0);
    assert.deepEqual(coldCalls("We make no cold calls, on any plan."), []);
    assert.deepEqual(coldCalls("Do you cold call?"), []);
  });

  test("no retired plan name appears anywhere", () => {
    const hits = corpus.flatMap((d) => RETIRED_NAMES.filter((n) => d.prose.includes(n)).map((n) => `${d.rel}: ${n}`));
    assert.deepEqual(hits, [], `retired plan names are still published:\n  ${hits.join("\n  ")}`);
  });

  test("no retired plan, price or tier count is published", () => {
    const hits = corpus.flatMap((d) => RETIRED_PLAN.filter((re) => re.test(d.prose)).map((re) => `${d.rel}: ${re}`));
    assert.deepEqual(hits, [], `the retired $750 plan is still published:\n  ${hits.join("\n  ")}`);
    for (const fixture of ["Start at $750 a month.", "On Prospecting you take over at interest.", "Pick one of three plans."]) {
      assert.ok(RETIRED_PLAN.some((re) => re.test(fixture)), `the retired-plan detector no longer fires on: ${fixture}`);
    }
    assert.ok(!RETIRED_PLAN.some((re) => re.test("A $7,500 contract. Commercial HVAC prospecting guide.")));
  });

  test("the one measure is qualified conversations; interested prospects only lead to it", () => {
    assert.ok(corpus.some((d) => /We measure the work by qualified conversations/.test(d.prose)));
    const measuredByInterest = corpus.filter((d) => /\bmeasure\w*\b[^.]{0,40}\binterested prospects\b/i.test(d.prose)).map((d) => d.rel);
    assert.deepEqual(measuredByInterest, [], `the retired metric is still the measure in: ${measuredByInterest.join(", ")}`);
  });

  test("there is exactly one pricing model", () => {
    const hits = corpus.flatMap((d) => negatedHits(d.prose, SECOND_PRICING_MODEL, { allowNegated: true }).map((h) => `${d.rel}: ${h}`));
    assert.deepEqual(hits, [], `a second pricing model is offered:\n  ${hits.join("\n  ")}`);
  });

  test("no residential or homeowner-lead positioning", () => {
    const hits = corpus.flatMap((d) => negatedHits(d.prose, RESIDENTIAL_POSITIONING, { allowNegated: false }).map((h) => `${d.rel}: ${h}`));
    assert.deepEqual(hits, [], `retired residential positioning:\n  ${hits.join("\n  ")}`);
  });

  test("residential marketplace names appear nowhere", () => {
    // Angi, Thumbtack and HomeAdvisor are other people's RESIDENTIAL products. Until
    // 2026-09-18 they were allowed in three labelled contrasts (an FAQ, a section of the
    // vendor guide, and the fit check's lead-buyer decline). Those contrasts were the last
    // residential signals on a commercial site, and they are gone; so is the allowance.
    const hits = corpus.filter((d) => /\b(Angi|Thumbtack|HomeAdvisor)\b/.test(d.prose)).map((d) => d.rel);
    assert.deepEqual(hits, [], `residential marketplace names in shipped copy: ${hits.join(", ")}`);
  });

  test("the business is not positioned as New-Jersey-only", () => {
    const hits = corpus.flatMap((d) => negatedHits(d.prose, NEW_JERSEY_ONLY, { allowNegated: false }).map((h) => `${d.rel}: ${h}`));
    assert.deepEqual(hits, [], `New-Jersey-only positioning:\n  ${hits.join("\n  ")}`);
    assert.ok(!existsSync(path.join(repoRoot, "app", "hvac-lead-generation-new-jersey")), "the one-state doorway page is back");
  });

  test("no stale calling absolute, and no cold-call claim", () => {
    const hits = corpus.flatMap((d) => [
      ...negatedHits(d.prose, STALE_CALLING, { allowNegated: false }).map((h) => `${d.rel}: ${h}`),
      ...coldCalls(d.prose).map((h) => `${d.rel}: ${h}`),
    ]);
    assert.deepEqual(hits, [], `calling policy contradicted:\n  ${hits.join("\n  ")}`);
  });
});

/* -------------------------------------------------------------------------- */
/*  (f) sitemap, redirects, internal links                                      */
/* -------------------------------------------------------------------------- */

describe("(f) every URL we publish is real, indexable and not a redirect", () => {
  const pageFileFor = (p: string) => (p === "/" ? "app/page.tsx" : path.join("app", p.slice(1), "page.tsx"));

  test("the sitemap is built from the registry and nothing else", () => {
    const source = stripComments(read("app/sitemap.ts"));
    for (const list of ["guidePages", "standaloneRoutes", "legalRoutes"]) {
      assert.ok(source.includes(`${list}.map`), `app/sitemap.ts no longer renders ${list}`);
    }
    for (const r of retiredPaths) assert.ok(!source.includes(r.from), `${r.from} is hardcoded into the sitemap`);
  });

  test("every sitemap URL has a page file, is indexable, and is not a redirect source", () => {
    const retired = new Set(retiredPaths.map((r) => r.from));
    for (const p of indexablePaths) {
      assert.ok(!retired.has(p), `${p} is redirected AND registered`);
      const file = pageFileFor(p);
      assert.ok(existsSync(path.join(repoRoot, file)), `${p} is in the sitemap with no ${file}`);
      assert.doesNotMatch(stripComments(read(file)), /index:\s*false/, `${p} is in the sitemap but noindex`);
    }
  });

  test("the noindex routes are not registered", () => {
    for (const p of ["/for-clients", "/refer"]) {
      assert.ok(!indexablePaths.includes(p), `${p} is noindex and must stay out of the sitemap`);
      assert.match(read(pageFileFor(p)), /index:\s*false/);
    }
  });

  test("next.config.ts redirects exactly the retired paths, one hop, to a live page", () => {
    const config = stripComments(read("next.config.ts"));
    const configured = [...config.matchAll(/source:\s*"([^"]+)",\s*destination:\s*"([^"]+)",\s*statusCode:\s*(\d+)/g)].map((m) => ({
      from: m[1]!,
      to: m[2]!,
      status: Number(m[3]),
    }));
    assert.deepEqual(configured.map(({ from, to }) => ({ from, to })), retiredPaths);
    for (const r of configured) {
      assert.equal(r.status, 301, `${r.from} must be a permanent redirect`);
      assert.ok(indexablePaths.includes(r.to), `${r.from} redirects to ${r.to}, which is not a live indexable page`);
      assert.ok(!retiredPaths.some((x) => x.from === r.to), `${r.from} -> ${r.to} is a redirect chain`);
      assert.ok(!existsSync(path.join(repoRoot, pageFileFor(r.from))), `${r.from} is redirected but its page file still exists`);
    }
  });

  test("no internal link points at a retired, redirected or unknown path", () => {
    const known = new Set([...indexablePaths, "/for-clients", "/refer", "/opengraph-image", "/icon.svg"]);
    const bad: string[] = [];
    const check = (rel: string, href: string) => {
      if (href.includes("$")) return; // a template built from the registry, e.g. `/${page.slug}`
      const clean = href.split("#")[0]!.split("?")[0]!.replace(/(.)\/$/, "$1");
      if (clean.startsWith("/api/")) return;
      if (!known.has(clean)) bad.push(`${rel}: ${href}`);
    };
    for (const f of codeFiles) {
      const rel = path.relative(repoRoot, f);
      const source = stripComments(readFileSync(f, "utf8"));
      for (const m of source.matchAll(/href(?:=|:\s*)\{?["`](\/[^"`\s]*)["`]/g)) check(rel, m[1]!);
    }
    for (const m of llmsTxt().matchAll(/https:\/\/www\.b2bleadgrowth\.com(\/[^\s)]*)?/g)) {
      check("/llms.txt", (m[1] ?? "/").replace(/[.,;:]+$/, "") || "/"); // a sentence's full stop is not part of the path
    }
    assert.deepEqual(bad, [], `internal links that do not resolve to a live page:\n  ${bad.join("\n  ")}`);
  });

  test("retired paths are gone from every list that announces URLs", () => {
    const lists: [string, string][] = [
      ["/llms.txt", llmsTxt()],
      ["scripts/indexnow-ping.mjs", read("scripts/indexnow-ping.mjs")],
    ];
    for (const [rel, text] of lists) {
      for (const r of retiredPaths) assert.ok(!stripComments(text).includes(`${r.from}"`) && !text.includes(`b2bleadgrowth.com${r.from}`), `${rel} still lists ${r.from}`);
    }
  });
});

/* -------------------------------------------------------------------------- */
/*  (g) every registered page: title, description, one H1, self-canonical        */
/* -------------------------------------------------------------------------- */

describe("(g) every registered page is fully dressed", () => {
  const entries = [
    { path: "/", title: homepageMetaTitle, description: homepageDescription },
    ...guidePages.map((p) => ({ path: `/${p.slug}`, title: p.metaTitle, description: p.description })),
    ...standaloneRoutes.map((r) => ({ path: `/${r.slug}`, title: r.metaTitle, description: r.description })),
    ...legalRoutes.map((r) => ({ path: `/${r.slug}`, title: r.metaTitle, description: r.description })),
  ];
  const h1Count = (source: string) => (stripComments(source).match(/<h1[\s>]/g) ?? []).length;

  test("every indexable path has a registry entry", () => {
    assert.deepEqual(entries.map((e) => e.path), indexablePaths);
  });

  test("titles and descriptions are present, within budget, and unique", () => {
    for (const e of entries) {
      assert.ok(e.title.trim().length >= 10, `${e.path}: title too short`);
      assert.ok(e.title.length <= TITLE_BUDGET, `${e.path}: title is ${e.title.length} > ${TITLE_BUDGET}`);
      assert.ok(e.description.trim().length >= 70, `${e.path}: description too short to be useful`);
      assert.ok(e.description.length <= DESCRIPTION_BUDGET, `${e.path}: description is ${e.description.length} > ${DESCRIPTION_BUDGET}`);
    }
    assert.equal(new Set(entries.map((e) => e.title)).size, entries.length, "two pages share a title");
    assert.equal(new Set(entries.map((e) => e.description)).size, entries.length, "two pages share a description");
  });

  test("metadata names the real service, in the current vocabulary", () => {
    const all = entries.map((e) => `${e.title} ${e.description}`).join(" ");
    assert.doesNotMatch(all, /New Jersey HVAC|HVAC leads? (cost|in)|shared vs|Appointment Engine|Outreach Engine|Lead Engine|Managed Pipeline|Qualified Opportunity Engine|\$750/i);
    assert.match(all, /commercial HVAC/i);
  });

  test("every page renders exactly one H1", () => {
    assert.equal(h1Count(read("components/GuideLayout.tsx")), 1, "GuideLayout must render exactly one <h1>");
    assert.equal(h1Count(read("components/LeadGenerationLanding.tsx")), 1, "the homepage must render exactly one <h1>");
    assert.ok(read("components/LeadGenerationLanding.tsx").includes("{homepageH1}"), "the homepage H1 must come from the registry");
    assert.ok(homepageH1.trim().length > 10);
    for (const p of guidePages) {
      const source = read(path.join("app", p.slug, "page.tsx"));
      assert.ok(p.h1.trim().length > 10, `/${p.slug} has no H1 text in the registry`);
      assert.ok(/<GuideLayout\b/.test(source) && /page=\{page\}/.test(source), `/${p.slug} must render through GuideLayout with its registry entry`);
      assert.equal(h1Count(source), 0, `/${p.slug} renders a second <h1> next to GuideLayout's`);
    }
    for (const r of [...standaloneRoutes, ...legalRoutes]) {
      assert.equal(h1Count(read(path.join("app", r.slug, "page.tsx"))), 1, `/${r.slug} must render exactly one <h1>`);
    }
  });

  test("every registered page declares a self-canonical through pageMetadata", () => {
    for (const p of indexablePaths.filter((x) => x !== "/")) {
      const source = read(path.join("app", p.slice(1), "page.tsx"));
      assert.ok(source.includes("pageMetadata("), `${p} does not build its metadata through pageMetadata()`);
    }
    assert.match(read("app/layout.tsx"), /alternates:\s*\{\s*canonical:\s*"\/"/);
  });
});
