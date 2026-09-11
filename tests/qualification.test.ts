// Tests for the fit rules in lib/qualification.ts.
//
// This is the one piece of real logic on the site: it decides who is shown a booking
// link and who is told, honestly, that we cannot help them. A regression here does not
// throw or render wrong — it quietly starts booking calls with companies the site
// publicly says it cannot serve, which nobody would notice until the calls happened.
//
// REBUILT 2026-09-11 for D-025. The model under test now asks the COMMERCIAL ICP —
// already sells and completes commercial work; someone who quotes and wins those bids;
// room for more accounts; a describable target account — and the blocks it enforces are
// the published declines: residential-only, wants to buy homeowner leads, at capacity,
// already runs an in-house outbound seat. The residential model's "no customer history"
// and "cannot export" questions are gone, and a test here proves they cannot come back
// as a precondition: no answer about a customer list can block anyone.
//
// Run with `npm test` (Node's own runner; Node strips the types natively).

import assert from "node:assert/strict";
import { test, describe } from "node:test";

import {
  ANSWER_KEYS,
  ANSWER_OPTIONS,
  BLOCK_IDS,
  BUDGET,
  CAPACITY,
  COMMERCIAL_QUOTER,
  COMMERCIAL_SHARE,
  CURRENT_APPROACH,
  EMPTY_ANSWERS,
  FOLLOW_UP_OWNER,
  GROWTH_PROBLEM,
  JOB_VALUE,
  MAX_FIT_SCORE,
  QUESTION_LABELS,
  STRONG_THRESHOLD,
  TARGET_ACCOUNTS,
  TIMELINE,
  YEARS_IN_BUSINESS,
  evaluateFit,
  recommendTier,
  sanitizeAnswers,
  scoreAnswers,
  summarizeAnswers,
  type QualificationAnswers,
} from "../lib/qualification.ts";
import { notFor } from "../lib/content.ts";

/** A textbook strong-fit company, used as the baseline every case mutates: an
 *  established shop, mostly commercial, with a dedicated estimator, big contracts, room
 *  for more, a nameable target, and nobody doing the outbound today. */
const IDEAL: QualificationAnswers = {
  yearsInBusiness: "over-15",
  commercialShare: "most",
  commercialQuoter: "dedicated",
  jobValue: "over-100000",
  growthProblem: "no-way-to-find-accounts",
  currentApproach: "word-of-mouth",
  followUpOwner: "nobody",
  capacity: "room-now",
  targetAccounts: "can-name",
  timeline: "now",
  budget: "unsure",
};

const with_ = (patch: Partial<QualificationAnswers>): QualificationAnswers => ({
  ...IDEAL,
  ...patch,
});

/** Every blocking answer, keyed by the block id it must trigger. */
const BLOCKING: Record<string, Partial<QualificationAnswers>> = {
  "wants-to-buy-leads": { growthProblem: "buy-leads" },
  "residential-only": { commercialShare: "none" },
  "no-capacity": { capacity: "at-capacity" },
  "in-house-outbound": { currentApproach: "in-house-outbound" },
};

describe("scoring", () => {
  test("the ideal answer set scores the published maximum", () => {
    assert.equal(scoreAnswers(IDEAL), MAX_FIT_SCORE);
    assert.equal(evaluateFit(IDEAL).maxScore, MAX_FIT_SCORE);
    assert.ok(STRONG_THRESHOLD < MAX_FIT_SCORE, "a strong fit must be reachable");
  });

  test("no answer set can exceed the published maximum", () => {
    // Exhaustive over every rule-bearing dimension, so a future point value that is
    // raised without bumping MAX_FIT_SCORE fails here rather than showing a visitor
    // "18 out of 16".
    for (const yearsInBusiness of YEARS_IN_BUSINESS)
      for (const commercialShare of COMMERCIAL_SHARE)
        for (const commercialQuoter of COMMERCIAL_QUOTER)
          for (const targetAccounts of TARGET_ACCOUNTS)
            for (const jobValue of JOB_VALUE)
              for (const capacity of CAPACITY)
                for (const timeline of TIMELINE)
                  for (const followUpOwner of FOLLOW_UP_OWNER) {
                    const score = scoreAnswers(
                      with_({
                        yearsInBusiness: yearsInBusiness.value,
                        commercialShare: commercialShare.value,
                        commercialQuoter: commercialQuoter.value,
                        targetAccounts: targetAccounts.value,
                        jobValue: jobValue.value,
                        capacity: capacity.value,
                        timeline: timeline.value,
                        followUpOwner: followUpOwner.value,
                      }),
                    );
                    assert.ok(
                      score >= 0 && score <= MAX_FIT_SCORE,
                      `score ${score} out of range for ${yearsInBusiness.value}/${commercialShare.value}/${commercialQuoter.value}`,
                    );
                  }
  });

  test("a mixed shop scores the same as a commercial-only one", () => {
    // D-025 says a commercial COMPONENT. A scoring table that rewarded "most or all"
    // over "a real share alongside residential" would quietly re-read the ICP as
    // commercial-only and score down exactly the contractors this is built for.
    assert.equal(
      scoreAnswers(with_({ commercialShare: "steady" })),
      scoreAnswers(with_({ commercialShare: "most" })),
    );
  });

  test("an empty form scores zero and does not throw", () => {
    assert.equal(scoreAnswers(EMPTY_ANSWERS), 0);
    const result = evaluateFit(EMPTY_ANSWERS);
    assert.equal(result.outcome, "explore");
    assert.equal(typeof result.headline, "string");
  });

  test("the same answers always produce the same result", () => {
    assert.deepEqual(evaluateFit(IDEAL), evaluateFit({ ...IDEAL }));
  });
});

describe("hard blocks", () => {
  test("someone shopping to buy homeowner leads is not offered a call", () => {
    const result = evaluateFit(with_(BLOCKING["wants-to-buy-leads"]));
    assert.equal(result.outcome, "not_yet");
    assert.equal(result.offerBooking, false);
    assert.equal(result.recommendedTier, null);
    assert.match(result.watchouts.join(" "), /don't sell them|lead seller|resell|broker/i);
    assert.match(result.watchouts.join(" "), /never contact homeowners/i);
    // A dead end is not an acceptable answer — they get sent somewhere useful.
    assert.ok(result.suggestedReading, "a blocked visitor must still be given somewhere to go");
  });

  test("a residential-only shop is not offered a call", () => {
    const result = evaluateFit(with_(BLOCKING["residential-only"]));
    assert.equal(result.outcome, "not_yet");
    assert.equal(result.offerBooking, false);
    assert.equal(result.recommendedTier, null);
    assert.match(result.watchouts.join(" "), /residential-only|commercial/i);
    assert.ok(result.suggestedReading, "a residential shop is pointed at a useful page");
  });

  test("the residential-only decline never offers to contact homeowners instead", () => {
    // The D-025 inversion is a reason not to sell to the CONTRACTOR. The operating
    // system's guard #0f forbids cold-sourcing consumers unconditionally, so the one
    // thing this copy must never do is read as "for the right price we'd go after your
    // homeowners". It has to say the opposite, out loud.
    const result = evaluateFit(with_(BLOCKING["residential-only"]));
    const text = [result.headline, result.nextStep, ...result.watchouts].join(" ");
    assert.match(text, /never contact homeowners/i);
    assert.doesNotMatch(text, /\b(contact|reach|email|work) (your )?homeowners instead\b/i);
    assert.doesNotMatch(text, /\bexport\b/i, "the decline must not ask for a customer export");
  });

  test("a company at capacity year-round is not offered a call", () => {
    const result = evaluateFit(with_(BLOCKING["no-capacity"]));
    assert.equal(result.outcome, "not_yet");
    assert.equal(result.offerBooking, false);
  });

  test("a company with an in-house outbound seat is not offered a call", () => {
    // core/icp.py `mature_outbound`: they already own what we sell. A decline, not a
    // competitive judgement — the copy has to say so.
    const result = evaluateFit(with_(BLOCKING["in-house-outbound"]));
    assert.equal(result.outcome, "not_yet");
    assert.equal(result.offerBooking, false);
    assert.match(result.watchouts.join(" "), /in-house outbound|already (have|run)/i);
    assert.match(result.watchouts.join(" "), /isn't a judgement|not a judgement/i);
    assert.ok(result.suggestedReading);
  });

  test("a block beats a perfect score on every other dimension", () => {
    // The ideal set scores the maximum; adding one blocking answer must still stop it.
    // Without this the score could quietly outvote a published disqualifier.
    for (const [id, patch] of Object.entries(BLOCKING)) {
      const result = evaluateFit(with_(patch));
      assert.ok(result.score >= STRONG_THRESHOLD, `${id}: precondition — the rest is strong`);
      assert.equal(result.outcome, "not_yet", id);
    }
  });

  test("every blocked outcome names the specific reason, not a generic refusal", () => {
    for (const [id, patch] of Object.entries(BLOCKING)) {
      const result = evaluateFit(with_(patch));
      assert.equal(result.watchouts.length, 1, id);
      assert.ok(result.watchouts[0]!.length > 120, `${id}: the reason must actually explain itself`);
      assert.ok(result.nextStep.length > 40, `${id}: a blocked visitor still needs a next step`);
      // The recovery path: a single radio answer is a thin basis, so every block hands
      // the visitor a person to reply to, and never a calendar.
      assert.match(result.nextStep, /reply to .+@.+ and tell us what we missed/i, id);
    }
  });

  test("the four published blocks are exactly the four the rules enforce", () => {
    assert.deepEqual([...BLOCK_IDS].sort(), Object.keys(BLOCKING).sort());
  });

  test("each disqualifier corresponds to something the site publishes", () => {
    // The screening rules and the published "not the right fit" list must describe the
    // same business. Screening on a criterion the site never states is the failure this
    // guards: the visitor would be turned away for a reason they were never shown.
    const published = notFor.join(" ").toLowerCase();
    const publishedAs: Record<string, RegExp> = {
      "wants-to-buy-leads": /lead seller/,
      "residential-only": /residential-only/,
      "no-capacity": /at capacity/,
      "in-house-outbound": /in-house outbound/,
    };
    // A block added to the rules without a row here fails the previous test; a row here
    // without a published entry fails this one. Both directions are covered.
    assert.deepEqual(Object.keys(publishedAs).sort(), [...BLOCK_IDS].sort());
    for (const [id, re] of Object.entries(publishedAs)) {
      assert.match(published, re, `${id} block must be published in notFor`);
    }
    // And the site's own rule about homeowners is published next to the decline.
    assert.match(published, /never contact homeowners/);
  });

  test("no answer about a customer list or an export can block anyone", () => {
    // The retired model's precondition. If a future question reintroduces it, the ICP
    // has silently gone back to residential reactivation.
    for (const key of ANSWER_KEYS) {
      assert.doesNotMatch(key, /record|export|history/i, `${key} looks like the retired model`);
      assert.doesNotMatch(QUESTION_LABELS[key], /export|customer (list|history|records)/i, key);
    }
  });
});

describe("the fits that must not be mistaken for blocks", () => {
  test("a thin shoulder season qualifies rather than disqualifies", () => {
    // HVAC is seasonal: a company booked solid in August with room in October is
    // exactly who a maintenance-agreement account suits. Only "at capacity year-round
    // and not looking" is a real disqualifier, and conflating the two would screen out
    // the best-fit visitor on the site.
    const result = evaluateFit(with_({ capacity: "shoulder-thin" }));
    assert.notEqual(result.outcome, "not_yet");
    assert.equal(result.offerBooking, true);
    assert.match(result.reasons.join(" "), /shoulder season/i);
  });

  test("an occasional-commercial shop is a watchout, not a block", () => {
    // D-025 declines residential ONLY. A few commercial jobs a year is thin, and the
    // audit says whether there's an account base — but it is a conversation, not a no.
    const result = evaluateFit(with_({ commercialShare: "occasional" }));
    assert.notEqual(result.outcome, "not_yet");
    assert.equal(result.offerBooking, true);
    assert.match(result.watchouts.join(" "), /small share/i);
  });

  test("a mixed shop is a strong fit, not a weak one", () => {
    const result = evaluateFit(with_({ commercialShare: "steady" }));
    assert.equal(result.outcome, "strong");
    assert.match(result.reasons.join(" "), /alongside residential/i);
  });

  test("needing help to define the target accounts is a watchout, not a block", () => {
    // The audit's first page IS that profile. Screening out someone for not having
    // written the thing we sell would be absurd.
    const result = evaluateFit(with_({ targetAccounts: "need-help" }));
    assert.notEqual(result.outcome, "not_yet");
    assert.equal(result.offerBooking, true);
    assert.match(result.watchouts.join(" "), /defining the target accounts/i);
  });

  test("nobody quoting commercial work is the first watchout, not a block", () => {
    const result = evaluateFit(with_({ commercialQuoter: "nobody" }));
    assert.notEqual(result.outcome, "not_yet");
    assert.match(result.watchouts.join(" "), /nobody who quotes commercial bids/i);
    assert.match(result.watchouts.join(" "), /stays yours at every tier/i);
  });
});

describe("outcomes", () => {
  test("a strong fit is offered booking and a starting tier", () => {
    const result = evaluateFit(IDEAL);
    assert.equal(result.outcome, "strong");
    assert.equal(result.offerBooking, true);
    assert.ok(result.reasons.length >= 2, "a strong result must justify itself from the answers");
    assert.match(result.nextStep, /3-5 cited commercial accounts/i);
  });

  test("a middling fit lands on explore and still books", () => {
    const result = evaluateFit(
      with_({
        yearsInBusiness: "2-5",
        commercialShare: "occasional",
        commercialQuoter: "owner-when-time",
        targetAccounts: "roughly",
        jobValue: "under-5000",
        timeline: "researching",
        followUpOwner: "office-part-time",
      }),
    );
    assert.equal(result.outcome, "explore");
    assert.equal(result.offerBooking, true);
    assert.ok(result.watchouts.length > 0, "explore must name what is unresolved");
  });

  test("reasons are derived from the answers given, not boilerplate", () => {
    const noWay = evaluateFit(with_({ growthProblem: "no-way-to-find-accounts" }));
    assert.match(noWay.reasons.join(" "), /find new commercial accounts/i);

    const referrals = evaluateFit(with_({ growthProblem: "referral-dependent" }));
    assert.match(referrals.reasons.join(" "), /referrals/i);

    const bidLists = evaluateFit(with_({ growthProblem: "not-on-bid-lists" }));
    assert.match(bidLists.reasons.join(" "), /bid lists/i);

    const quoter = evaluateFit(with_({ commercialQuoter: "dedicated" }));
    assert.match(quoter.reasons.join(" "), /quote and win commercial bids/i);

    // Different problems must not produce the same page.
    assert.notDeepEqual(noWay.reasons, referrals.reasons);
    assert.notDeepEqual(referrals.reasons, bidLists.reasons);
  });

  test("watchouts surface the specific weak answer", () => {
    assert.match(
      evaluateFit(with_({ commercialQuoter: "owner-when-time" })).watchouts.join(" "),
      /owner having time/i,
    );
    assert.match(evaluateFit(with_({ targetAccounts: "roughly" })).watchouts.join(" "), /kind of building/i);
    assert.match(evaluateFit(with_({ timeline: "researching" })).watchouts.join(" "), /research/i);
    assert.match(evaluateFit(with_({ yearsInBusiness: "under-2" })).watchouts.join(" "), /reference/i);
    assert.match(evaluateFit(with_({ jobValue: "under-5000" })).watchouts.join(" "), /arithmetic/i);
  });

  test("no outcome promises a result", () => {
    // The whole business is built on never promising jobs, revenue or appointment
    // counts. This is the one surface where a "you'll get X" sentence would be most
    // tempting to write and least noticeable once written.
    const banned =
      /\b(guarantee|guaranteed|we will get you|you will get \d|roi|return on investment)\b/i;
    const cases = [IDEAL, EMPTY_ANSWERS, ...Object.values(BLOCKING).map((p) => with_(p))];
    for (const answers of cases) {
      const r = evaluateFit(answers);
      const text = [r.headline, r.nextStep, ...r.reasons, ...r.watchouts].join(" ");
      assert.doesNotMatch(text, banned, `outcome ${r.outcome} promised a result`);
    }
  });

  test("no outcome, for any answer, uses the retired residential vocabulary", () => {
    // The site was repositioned in one pass; a stray sentence from the old model in a
    // result the visitor reads would contradict every page that linked here.
    const retired = /\b(unsold estimate|lapsed agreement|past customer|customer history|reactivat|your records|export)\b/i;
    for (const key of ANSWER_KEYS) {
      for (const { value } of ANSWER_OPTIONS[key]) {
        const r = evaluateFit(with_({ [key]: value } as Partial<QualificationAnswers>));
        const text = [r.headline, r.nextStep, ...r.reasons, ...r.watchouts].join(" ");
        assert.doesNotMatch(text, retired, `${key}=${value}`);
      }
    }
  });
});

describe("tier recommendation", () => {
  test("a stated budget always wins over inference", () => {
    for (const { value } of BUDGET) {
      if (value === "unsure") continue;
      const tier = recommendTier(with_({ budget: value, followUpOwner: "dedicated" }));
      assert.ok(tier, `budget ${value} should map to a tier`);
    }
    assert.equal(recommendTier(with_({ budget: "750", followUpOwner: "nobody" })), "Lead Engine");
    assert.equal(
      recommendTier(with_({ budget: "2500", followUpOwner: "dedicated" })),
      "Appointment Engine",
    );
  });

  test("a company that already employs a follow-up person is pointed at the list tier", () => {
    assert.equal(recommendTier(with_({ followUpOwner: "dedicated" })), "Lead Engine");
  });

  test("nobody following up, big contracts and a dedicated estimator points at Appointment Engine", () => {
    const tier = recommendTier(
      with_({ followUpOwner: "nobody", jobValue: "25000-100000", commercialQuoter: "dedicated" }),
    );
    assert.equal(tier, "Appointment Engine");
  });

  test("Appointment Engine is never suggested when nobody is there to take the booked conversation", () => {
    // Booking a qualified conversation onto a calendar only pays when someone whose job
    // it is will take it. With the owner quoting "when there's time", the honest read
    // is Outreach Engine: we hand over the interested replies, and the owner decides.
    for (const commercialQuoter of ["nobody", "owner-when-time"] as const) {
      assert.equal(
        recommendTier(with_({ followUpOwner: "nobody", jobValue: "over-100000", commercialQuoter })),
        "Outreach Engine",
        commercialQuoter,
      );
    }
    assert.equal(
      recommendTier(with_({ followUpOwner: "owner-sometimes", jobValue: "under-5000" })),
      "Outreach Engine",
    );
  });

  test("a recommended tier is always one of the three real ones", () => {
    const real = new Set(["Lead Engine", "Outreach Engine", "Appointment Engine", null]);
    for (const g of GROWTH_PROBLEM)
      for (const f of FOLLOW_UP_OWNER)
        for (const j of JOB_VALUE)
          for (const q of COMMERCIAL_QUOTER) {
            const tier = recommendTier(
              with_({ growthProblem: g.value, followUpOwner: f.value, jobValue: j.value, commercialQuoter: q.value }),
            );
            assert.ok(real.has(tier), `invented tier ${tier}`);
          }
  });
});

describe("sanitizeAnswers", () => {
  test("keeps only values from the published option sets", () => {
    const clean = sanitizeAnswers({
      yearsInBusiness: "over-15",
      commercialShare: "definitely-not-a-real-option",
      capacity: "<script>alert(1)</script>",
      jobValue: "=IMPORTXML(\"https://evil.example\",\"//a\")",
      targetAccounts: "can-name",
      nonsenseKey: "ignored",
    });
    assert.equal(clean.yearsInBusiness, "over-15");
    assert.equal(clean.commercialShare, "");
    assert.equal(clean.capacity, "");
    assert.equal(clean.jobValue, "");
    assert.equal(clean.targetAccounts, "can-name");
    assert.equal(Object.keys(clean).length, ANSWER_KEYS.length);
  });

  test("the retired fields are dropped rather than carried through", () => {
    // A stale browser tab, a cached form, or an old outbound link posting the
    // residential model's fields must not smuggle them onto the lead record.
    const clean = sanitizeAnswers({ ...IDEAL, recordVolume: "5k-plus", exportReadiness: "crm" });
    assert.ok(!("recordVolume" in clean));
    assert.ok(!("exportReadiness" in clean));
    assert.deepEqual(clean, IDEAL);
  });

  test("a forged answer cannot manufacture a passing score", () => {
    // Every rule-bearing field is a closed set, so free text scores zero rather than
    // matching a points table by accident.
    const forged = sanitizeAnswers(
      Object.fromEntries(ANSWER_KEYS.map((k) => [k, "whatever-i-want"])),
    );
    assert.equal(scoreAnswers(forged), 0);
    assert.equal(evaluateFit(forged).outcome, "explore");
  });

  test("round-trips a genuine submission unchanged", () => {
    assert.deepEqual(sanitizeAnswers({ ...IDEAL }), IDEAL);
  });
});

describe("summarizeAnswers", () => {
  test("renders human labels, not raw rule values", () => {
    const summary = summarizeAnswers(IDEAL);
    assert.match(summary, /More than 15 years in business/);
    assert.match(summary, /commercial share: Most or all of it/);
    assert.doesNotMatch(summary, /over-15|can-name|no-way-to-find-accounts|over-100000/);
  });

  test("skips unanswered questions instead of printing blanks", () => {
    assert.equal(summarizeAnswers(EMPTY_ANSWERS), "");
    assert.doesNotMatch(summarizeAnswers({ ...EMPTY_ANSWERS, timeline: "now" }), /·/);
  });
});
