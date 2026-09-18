// The pricing model, enforced (D-027 mandate §23).
//
// Source of truth: the operating-system repo's
// 00_CONTROL_CENTER/decisions/D-027_responsibility_tiers.md and its machine form core/offer.py.
//
//     $750    Prospecting                  find and contact; the contractor takes over at interest
//     $1,500  Managed Pipeline             outreach + follow-up, interest SCREENING, structured handoff
//     $2,500  Qualified Opportunity Engine qualification, context, next-step / site-visit coordination
//
// Three LEVELS OF RESPONSIBILITY — never three sizes of one service — and on every one of them
// the contractor estimates and closes. A lower plan never inherits a higher plan's work.
//
// These are prose rules, and prose rules drift silently: the previous model's tier names
// survived in a Terms clause, a manifest and a fit-check hint for days after the decision that
// retired them. So this file fails when shipped copy:
//   (a) gives the $750 plan follow-up, screening, qualification, pipeline management, booking
//       or site-visit coordination, or calls its output a Qualified Opportunity;
//   (b) gives the $1,500 plan qualification, scope/context development or site-visit
//       coordination, or calls its handoff a Qualified Opportunity;
//   (c) reduces the $2,500 difference to volume, implies we estimate, quote, price or
//       technically scope, or guarantees contracts;
//   (d) revives a retired name, "qualified conversation", a second pricing model,
//       residential / homeowner-lead positioning, New-Jersey-only positioning, or a stale
//       calling absolute;
//   (e) changes the three canonical plan names, prices or one-liners;
//   (f) lists a sitemap URL that is unregistered, redirected, noindex or has no page file;
//   (g) ships a registered page without an in-budget title and description and exactly one H1.
//
// HOW THE PROSE DETECTORS READ. Copy is split into sentences. A sentence that names ONE plan is
// checked whole against that plan's forbidden claims; a sentence that names several is cut into
// segments, each running from one plan's name to the next, so "Prospecting hands over at
// interest, and Managed Pipeline screens it" blames nobody. A claim is excused when it is
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

type TierKey = "prospecting" | "managed" | "qoe";

const FORBIDDEN: Record<TierKey, RegExp[]> = {
  // $750: targeting → research → contact selection → initial outreach → identification of
  // genuine interest → handoff. Nothing after interest is ours.
  prospecting: [
    /\bqualif(y|ies|ied|ying|ication)\b/i,
    /\bqualified opportunit/i,
    /\bscreen(s|ed|ing)\b/i,
    /\bfollow[- ]?ups?\b/i,
    /\bsequence\b/i,
    /\b(manag(e|es|ed|ing)|organi[sz](e|es|ed|ing))\b[^.]{0,30}\bpipeline\b/i,
    /\bpipeline (management|organi[sz]ation)\b/i,
    /\bbook(s|ed|ing)?\b/i,
    /\bschedul\w+/i,
    /\bappointments?\b/i,
    /\bsite[- ]visits?\b/i,
    /\bcoordinat\w+/i,
    /\bscope\b/i,
    /\bcontext gathering\b/i,
  ],
  // $1,500: screening is NOT qualification, and the handoff is never a Qualified Opportunity.
  managed: [
    /\bqualif(y|ies|ied|ying|ication)\b/i,
    /\bqualified opportunit/i,
    /\b(gather|develop|collect|build)(s|ed|ing)?\b[^.]{0,40}\b(scope|context)\b/i,
    /\b(scope|context) (discovery|development|gathering)\b/i,
    /\bsite[- ]visits?\b/i,
    /\bcoordinat\w+/i,
  ],
  // $2,500: more responsibility, never "more messages".
  qoe: [
    /\b(more|higher|extra|bigger|larger|additional)\b[^.]{0,25}\b(messages?|volume|emails?|sends?|outreach|accounts|contacts)\b/i,
  ],
};

const TIER_MENTION = /\b(Prospecting|Managed Pipeline|Qualified Opportunity Engine)\b|\$(750|1,500|2,500)(?![\d,])/g;

function tierOf(match: RegExpMatchArray): TierKey {
  const token = match[1] ?? match[2];
  if (token === "Prospecting" || token === "750") return "prospecting";
  if (token === "Managed Pipeline" || token === "1,500") return "managed";
  return "qoe";
}

/** Plan claims in `prose` that give a plan work it does not include. */
function tierViolations(prose: string): string[] {
  const out: string[] = [];
  for (const sentence of sentencesOf(prose)) {
    if (isQuestion(sentence)) continue;
    const mentions = [...sentence.matchAll(TIER_MENTION)].map((m) => ({ tier: tierOf(m), at: m.index }));
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
    // (a) $750
    assert.ok(fires("Prospecting qualifies every opportunity before it reaches you."));
    assert.ok(fires("On the $750 plan we coordinate the site visit."));
    assert.ok(fires("Prospecting manages your pipeline after interest."));
    assert.ok(fires("Prospecting delivers Qualified Opportunities every month."));
    assert.ok(fires("Prospecting books appointments onto your calendar."));
    assert.ok(fires("Prospecting includes a three-touch follow-up sequence."));
    assert.ok(fires("Prospecting screens each reply for relevance."));
    // (b) $1,500
    assert.ok(fires("Managed Pipeline fully qualifies every interested reply."));
    assert.ok(fires("Managed Pipeline gathers the property and scope context."));
    assert.ok(fires("On the $1,500 plan we coordinate the site visit for you."));
    assert.ok(fires("Managed Pipeline hands you Qualified Opportunities."));
    // (c) $2,500 reduced to volume
    assert.ok(fires("Qualified Opportunity Engine costs more because it sends more messages."));
    assert.ok(fires("The $2,500 plan is the same service with higher volume."));
  });

  test("the detectors stay quiet on the honest sentences", () => {
    const quiet = (text: string) => assert.deepEqual(tierViolations(text), [], text);
    quiet("On Prospecting there is no follow-up sequence, and no screening or qualification.");
    quiet("Follow-up, interest screening, qualification and the site visit stay with you on Prospecting.");
    quiet("If someone on your team already chases the follow-up, Prospecting fits.");
    quiet("Prospecting hands over at first interest, and Managed Pipeline hands over screened interest.");
    quiet("Managed Pipeline hands you screened interest; the Qualified Opportunity Engine qualifies each one.");
    quiet("Screened interest is not a qualified opportunity, and Managed Pipeline never calls it one.");
    quiet("Qualified Opportunity Engine covers up to 150 outreach messages a month.");
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

describe("(e) the three plans are exactly the canonical three", () => {
  const CANONICAL = [
    { name: "Prospecting", price: 750, oneLiner: "We find and contact suitable commercial accounts. You take over at interest." },
    { name: "Managed Pipeline", price: 1500, oneLiner: "We run outreach and follow-up, screen genuine interest, and organize the handoff." },
    {
      name: "Qualified Opportunity Engine",
      price: 2500,
      oneLiner:
        "We qualify the opportunity, gather the relevant context, coordinate the next step or site visit, and prepare your team to estimate and close.",
    },
  ];

  test("names, prices and one-liners are verbatim, in ladder order", () => {
    assert.deepEqual(plans.map((p) => ({ name: p.name, price: p.price, oneLiner: p.oneLiner })), CANONICAL);
  });

  test("Managed Pipeline is the one featured plan", () => {
    assert.deepEqual(plans.filter((p) => p.featured).map((p) => p.name), ["Managed Pipeline"]);
  });

  test("the literal source carries them too, for the operating system's own checker", () => {
    // scripts/check_cross_repo.py reads lib/content.ts as TEXT. Keep each as one literal.
    const source = read("lib/content.ts");
    for (const c of CANONICAL) {
      assert.ok(source.includes(`name: "${c.name}"`), `name: "${c.name}" is not a single literal`);
      assert.ok(source.includes(`"${c.oneLiner}"`), `${c.name}'s one-liner is not a single literal`);
    }
    assert.deepEqual([...source.matchAll(/\bprice:\s*(\d+)/g)].map((m) => Number(m[1])), [750, 1500, 2500]);
  });

  const [prospecting, managed, qoe] = plans as [(typeof plans)[number], (typeof plans)[number], (typeof plans)[number]];
  /** Everything a plan says WE do. `youKeep` is excluded on purpose: it is the list of things
   *  that stay with the contractor, which is exactly where the forbidden words belong. */
  const ours = (p: (typeof plans)[number]) =>
    [p.oneLiner, ...p.owns, ...p.afterInterest, p.handoff.label, p.handoff.unit, p.handoff.definition, p.capacity, p.bestFor, ...p.includes];

  test("Prospecting claims nothing past the handoff at interest", () => {
    for (const line of ours(prospecting)) {
      if (TRANSFER.test(line)) continue;
      for (const re of FORBIDDEN.prospecting) {
        const hit = line.match(re);
        assert.ok(!hit || negated(line, hit.index ?? 0, hit[0].length), `Prospecting claims "${hit?.[0]}" in: ${line}`);
      }
    }
    assert.deepEqual(prospecting.afterInterest, ["interest", "contractor takeover"]);
    assert.match(prospecting.capacity, /no follow-up sequence/i);
    assert.match(prospecting.youKeep, /follow-up.*screening.*qualification.*site visit.*estimate.*close/i);
  });

  test("Managed Pipeline screens interest and never qualifies it", () => {
    for (const line of ours(managed)) {
      if (TRANSFER.test(line)) continue;
      for (const re of FORBIDDEN.managed) {
        const hit = line.match(re);
        assert.ok(!hit || negated(line, hit.index ?? 0, hit[0].length), `Managed Pipeline claims "${hit?.[0]}" in: ${line}`);
      }
    }
    assert.match(managed.handoff.label, /screened interest/i);
    assert.match(managed.handoff.definition, /not a qualified opportunity/i);
    assert.doesNotMatch(managed.handoff.unit, /qualified/i);
  });

  test("Qualified Opportunity Engine is differentiated by responsibility, not by volume", () => {
    for (const needed of ["qualification", "useful context gathering", "site-visit coordination where appropriate", "contractor handoff"]) {
      assert.ok(qoe.owns.includes(needed), `the top plan no longer owns "${needed}"`);
    }
    assert.equal(qoe.handoff.unit, "qualified opportunities");
    // The one-liner and the "best for" line never mention a count of anything.
    for (const p of plans) assert.doesNotMatch(`${p.oneLiner} ${p.bestFor}`, /\d/, `${p.name} is pitched on a number`);
  });

  test("a lower plan's handoff is never labelled with a higher plan's noun", () => {
    assert.doesNotMatch(`${prospecting.handoff.label} ${prospecting.handoff.unit}`, /screened|qualified|structured/i);
    assert.doesNotMatch(`${managed.handoff.label} ${managed.handoff.unit}`, /qualified/i);
  });

  test("on every plan the contractor keeps the estimate and the close", () => {
    for (const p of plans) assert.match(p.youKeep, /estimate.*close/i, p.name);
  });

  test("the who-owns-what grid never lets a lower plan inherit a higher plan's work", () => {
    for (const row of responsibilityMatrix) {
      const [p, m, q] = row.owner;
      // Monotonic: once we own it on a plan, we own it on every plan above.
      assert.ok(!(p === "we" && m === "you"), `${row.responsibility}: Prospecting has it, Managed Pipeline does not`);
      assert.ok(!(m === "we" && q === "you"), `${row.responsibility}: Managed Pipeline has it, the top plan does not`);
      if (/follow-up|screening|conversation organization|pipeline organization/i.test(row.responsibility)) {
        assert.equal(p, "you", `Prospecting must not own: ${row.responsibility}`);
      }
      if (/qualification|scope context|next-step|site-visit|engaged call|prepared opportunity/i.test(row.responsibility)) {
        assert.equal(p, "you", `Prospecting must not own: ${row.responsibility}`);
        assert.equal(m, "you", `Managed Pipeline must not own: ${row.responsibility}`);
        assert.equal(q, "we", `the top plan must own: ${row.responsibility}`);
      }
    }
    const last = responsibilityMatrix.at(-1)!;
    assert.match(last.responsibility, /estimate.*close/i);
    assert.deepEqual(last.owner, ["you", "you", "you"], "the estimate and the close are the contractor's on every plan");
  });

  test("the five terms are defined once, and the reserved ones name their plan", () => {
    assert.deepEqual(terminology.map((t) => t.term), [
      "Prospect",
      "Interested Prospect",
      "Screened Interest",
      "Qualified Opportunity",
      "Structured Handoff",
    ]);
    const def = (term: string) => terminology.find((t) => t.term === term)!.definition;
    assert.match(def("Prospect"), /never a homeowner/i);
    assert.match(def("Screened Interest"), /\$1,500 Managed Pipeline/);
    assert.match(def("Qualified Opportunity"), /Reserved for the \$2,500 Qualified Opportunity Engine/);
  });

  test("the boundary is published whole", () => {
    assert.equal(boundarySentence, "B2B Lead Growth prepares the opportunity. The HVAC contractor estimates and closes it.");
    const all = contractorBoundary.join(" | ");
    for (const must of ["inspections", "specify equipment", "diagnose equipment", "final project scope", "estimates or quotes", "final pricing", "negotiate", "guarantee contracts", "estimator or salesperson"]) {
      assert.ok(all.includes(must), `the boundary list dropped "${must}"`);
    }
  });

  test("schema says what the plan cards say, and nothing else", () => {
    const service = serviceJsonLd();
    const offers = service.offers.offers;
    assert.deepEqual(offers.map((o) => [o.name, o.price, o.description]), plans.map((p) => [p.name, String(p.price), p.oneLiner]));
    assert.equal(service.offers.lowPrice, "750");
    assert.equal(service.offers.highPrice, "2500");
    assert.doesNotMatch(JSON.stringify(service), /appointment setting/i, "the Service node must not advertise appointment setting");
    for (const p of plans) assert.ok(orgDescription.includes(p.name), `orgDescription does not name ${p.name}`);
    assert.match(orgDescription, /contractor always estimates and closes/i);
  });

  test("the homepage hero carries the one positioning sentence, word for word", () => {
    // The same comparison the operating system's check_cross_repo.py makes, so a drift is
    // caught here before it is caught there.
    const words = (t: string) => t.toLowerCase().match(/[a-z]+/g) ?? [];
    const want = words(positioningSentence);
    const have = words(read("components/LeadGenerationLanding.tsx"));
    const found = have.some((_, k) => want.every((w, i) => have[k + i] === w));
    assert.ok(found, "the hero no longer carries lib/content.ts `positioningSentence` verbatim");
    assert.match(positioningSentence, /interested prospects\.$/);
  });
});

/* -------------------------------------------------------------------------- */
/*  (d) retired names, retired models, retired geography, retired absolutes     */
/* -------------------------------------------------------------------------- */

describe("(d) nothing retired comes back", () => {
  const RETIRED_NAMES = [
    "Lead Engine",
    "Outreach Engine",
    "Appointment Engine",
    "Starter Lead Engine",
    "Recommended Outreach Engine",
    "Premium Appointment Engine",
  ];

  // Each is fine when DENIED ("no acceptance fee", "no pilot") and a defect when asserted.
  const SECOND_PRICING_MODEL = [
    /\bacceptance fee\b/i,
    /\bper[- ](qualified[- ])?opportunity\b/i,
    /\bhybrid (pricing|model|plan)\b/i,
    /\bpilot\b/i,
    /\b(free )?trial\b/i,
    /\bcommission\b/i,
    /\bfounding[- ]client\b/i,
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

  test("'qualified conversation' is gone — the metric is interested prospects", () => {
    const hits = corpus.filter((d) => /qualified conversations?/i.test(d.prose)).map((d) => d.rel);
    assert.deepEqual(hits, [], `retired metric wording in: ${hits.join(", ")}`);
    assert.ok(corpus.some((d) => /interested prospects/.test(d.prose)));
  });

  test("there is exactly one pricing model", () => {
    const hits = corpus.flatMap((d) => negatedHits(d.prose, SECOND_PRICING_MODEL, { allowNegated: true }).map((h) => `${d.rel}: ${h}`));
    assert.deepEqual(hits, [], `a second pricing model is offered:\n  ${hits.join("\n  ")}`);
  });

  test("no residential or homeowner-lead positioning", () => {
    const hits = corpus.flatMap((d) => negatedHits(d.prose, RESIDENTIAL_POSITIONING, { allowNegated: false }).map((h) => `${d.rel}: ${h}`));
    assert.deepEqual(hits, [], `retired residential positioning:\n  ${hits.join("\n  ")}`);
  });

  test("marketplace names appear only where they are a labelled contrast", () => {
    // Angi, Thumbtack and HomeAdvisor are other people's RESIDENTIAL products. They may be
    // named where the site explicitly contrasts itself with them, and nowhere else — the
    // moment they turn up on the homepage hero or the pricing page, they have become the frame.
    const ALLOWED = new Set([
      "lib/content.ts", // one FAQ: "How is this different from Angi, Thumbtack, or a per-lead seller?"
      "app/how-to-choose-a-lead-generation-agency/page.tsx", // the section headed "A contrast: …"
      // The fit check's DECLINE for someone who wants to buy homeowner leads: it says we do not
      // sell them and points him at that same contrast section. Naming the case there is the
      // opposite of adopting the frame.
      "lib/qualification.ts",
    ]);
    const hits = corpus.filter((d) => /\b(Angi|Thumbtack|HomeAdvisor)\b/.test(d.prose) && !ALLOWED.has(d.rel)).map((d) => d.rel);
    assert.deepEqual(hits, [], `marketplace names outside a labelled contrast: ${hits.join(", ")}`);
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
    assert.doesNotMatch(all, /New Jersey HVAC|HVAC leads? (cost|in)|shared vs|qualified conversation|Appointment Engine|Outreach Engine|Lead Engine/i);
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
