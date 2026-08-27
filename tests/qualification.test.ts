// Tests for the fit rules in lib/qualification.ts.
//
// This is the one piece of real logic on the site: it decides who is shown a booking
// link and who is told, honestly, that we cannot help them. A regression here does not
// throw or render wrong — it quietly starts booking calls with companies the site
// publicly says it cannot serve, which nobody would notice until the calls happened.
//
// Run with `npm test` (Node's own runner; Node strips the types natively).

import assert from "node:assert/strict";
import { test, describe } from "node:test";

import {
  ANSWER_KEYS,
  BUDGET,
  CAPACITY,
  EMPTY_ANSWERS,
  EXPORT_READINESS,
  FOLLOW_UP_OWNER,
  GROWTH_PROBLEM,
  JOB_VALUE,
  MAX_FIT_SCORE,
  RECORD_VOLUME,
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

/** A textbook strong-fit company, used as the baseline every case mutates. */
const IDEAL: QualificationAnswers = {
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
};

const with_ = (patch: Partial<QualificationAnswers>): QualificationAnswers => ({
  ...IDEAL,
  ...patch,
});

describe("scoring", () => {
  test("the ideal answer set scores the published maximum", () => {
    assert.equal(scoreAnswers(IDEAL), MAX_FIT_SCORE);
    assert.equal(evaluateFit(IDEAL).maxScore, MAX_FIT_SCORE);
  });

  test("no answer set can exceed the published maximum", () => {
    // Exhaustive over every rule-bearing dimension, so a future point value that is
    // raised without bumping MAX_FIT_SCORE fails here rather than showing a visitor
    // "16 out of 14".
    for (const yearsInBusiness of YEARS_IN_BUSINESS)
      for (const recordVolume of RECORD_VOLUME)
        for (const jobValue of JOB_VALUE)
          for (const capacity of CAPACITY)
            for (const exportReadiness of EXPORT_READINESS)
              for (const timeline of TIMELINE)
                for (const followUpOwner of FOLLOW_UP_OWNER) {
                  const score = scoreAnswers(
                    with_({
                      yearsInBusiness: yearsInBusiness.value,
                      recordVolume: recordVolume.value,
                      jobValue: jobValue.value,
                      capacity: capacity.value,
                      exportReadiness: exportReadiness.value,
                      timeline: timeline.value,
                      followUpOwner: followUpOwner.value,
                    }),
                  );
                  assert.ok(
                    score >= 0 && score <= MAX_FIT_SCORE,
                    `score ${score} out of range for ${yearsInBusiness.value}/${recordVolume.value}`,
                  );
                }
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
    const result = evaluateFit(with_({ growthProblem: "buy-leads" }));
    assert.equal(result.outcome, "not_yet");
    assert.equal(result.offerBooking, false);
    assert.equal(result.recommendedTier, null);
    assert.match(result.watchouts.join(" "), /don't sell them|lead seller|resell|broker/i);
    // A dead end is not an acceptable answer — they get sent somewhere useful.
    assert.ok(result.suggestedReading, "a blocked visitor must still be given somewhere to go");
  });

  test("a company with no customer history is not offered a call", () => {
    for (const patch of [
      { recordVolume: "none" } as const,
      { exportReadiness: "no-records" } as const,
    ]) {
      const result = evaluateFit(with_(patch));
      assert.equal(result.outcome, "not_yet", JSON.stringify(patch));
      assert.equal(result.offerBooking, false);
    }
  });

  test("a company at capacity year-round is not offered a call", () => {
    const result = evaluateFit(with_({ capacity: "at-capacity" }));
    assert.equal(result.outcome, "not_yet");
    assert.equal(result.offerBooking, false);
  });

  test("a block beats a perfect score on every other dimension", () => {
    // The ideal set scores the maximum; adding one blocking answer must still stop it.
    // Without this the score could quietly outvote a published disqualifier.
    const result = evaluateFit(with_({ growthProblem: "buy-leads" }));
    assert.ok(result.score >= 10, "precondition: the rest of the answers are strong");
    assert.equal(result.outcome, "not_yet");
  });

  test("every blocked outcome names the specific reason, not a generic refusal", () => {
    for (const patch of [
      { growthProblem: "buy-leads" } as const,
      { recordVolume: "none" } as const,
      { capacity: "at-capacity" } as const,
    ]) {
      const result = evaluateFit(with_(patch));
      assert.equal(result.watchouts.length, 1);
      assert.ok(result.watchouts[0]!.length > 120, "the reason must actually explain itself");
      assert.ok(result.nextStep.length > 40, "a blocked visitor still needs a next step");
    }
  });

  test("each disqualifier corresponds to something the site publishes", () => {
    // The screening rules and the published "not the right fit" list must describe the
    // same business. Screening on a criterion the site never states is the failure this
    // guards: the visitor would be turned away for a reason they were never shown.
    const published = notFor.join(" ").toLowerCase();
    assert.match(published, /lead seller/, "buy-leads block must be published");
    assert.match(published, /no customer history/, "no-history block must be published");
    assert.match(published, /no capacity/, "no-capacity block must be published");
  });
});

describe("the busy-but-seasonal company is a fit, not a block", () => {
  test("a thin shoulder season qualifies rather than disqualifies", () => {
    // HVAC is seasonal: a company booked solid in August with an empty October is the
    // ideal customer for reactivation. Only "at capacity year-round and not looking"
    // is a real disqualifier, and conflating the two would screen out the best-fit
    // visitor on the site.
    const result = evaluateFit(with_({ capacity: "shoulder-thin" }));
    assert.notEqual(result.outcome, "not_yet");
    assert.equal(result.offerBooking, true);
    assert.match(result.reasons.join(" "), /shoulder season/i);
  });
});

describe("outcomes", () => {
  test("a strong fit is offered booking and a starting tier", () => {
    const result = evaluateFit(IDEAL);
    assert.equal(result.outcome, "strong");
    assert.equal(result.offerBooking, true);
    assert.ok(result.reasons.length >= 2, "a strong result must justify itself from the answers");
  });

  test("a middling fit lands on explore and still books", () => {
    const result = evaluateFit(
      with_({
        yearsInBusiness: "2-5",
        recordVolume: "few-hundred",
        jobValue: "2500-7500",
        exportReadiness: "unsure",
        timeline: "researching",
        followUpOwner: "office-part-time",
      }),
    );
    assert.equal(result.outcome, "explore");
    assert.equal(result.offerBooking, true);
    assert.ok(result.watchouts.length > 0, "explore must name what is unresolved");
  });

  test("reasons are derived from the answers given, not boilerplate", () => {
    const perLead = evaluateFit(with_({ growthProblem: "paying-per-lead" }));
    assert.match(perLead.reasons.join(" "), /per lead/i);

    const partners = evaluateFit(with_({ growthProblem: "no-referral-pipeline" }));
    assert.match(partners.reasons.join(" "), /partner/i);

    // Different problems must not produce the same page.
    assert.notDeepEqual(perLead.reasons, partners.reasons);
  });

  test("watchouts surface the specific weak answer", () => {
    assert.match(
      evaluateFit(with_({ exportReadiness: "spreadsheets" })).watchouts.join(" "),
      /spreadsheet/i,
    );
    assert.match(evaluateFit(with_({ timeline: "researching" })).watchouts.join(" "), /research/i);
  });

  test("no outcome promises a result", () => {
    // The whole business is built on never promising jobs, revenue or appointment
    // counts. This is the one surface where a "you'll get X" sentence would be most
    // tempting to write and least noticeable once written.
    const banned =
      /\b(guarantee|guaranteed|we will get you|you will get \d|roi|return on investment)\b/i;
    for (const answers of [IDEAL, EMPTY_ANSWERS, with_({ growthProblem: "buy-leads" })]) {
      const r = evaluateFit(answers);
      const text = [r.headline, r.nextStep, ...r.reasons, ...r.watchouts].join(" ");
      assert.doesNotMatch(text, banned, `outcome ${r.outcome} promised a result`);
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

  test("nobody following up, with big jobs, points at the managed tiers", () => {
    const tier = recommendTier(
      with_({ followUpOwner: "nobody", jobValue: "15000-40000", growthProblem: "unsold-estimates" }),
    );
    assert.equal(tier, "Appointment Engine");
    assert.equal(
      recommendTier(with_({ followUpOwner: "owner-sometimes", jobValue: "under-2500" })),
      "Outreach Engine",
    );
  });

  test("a recommended tier is always one of the three real ones", () => {
    const real = new Set(["Lead Engine", "Outreach Engine", "Appointment Engine", null]);
    for (const g of GROWTH_PROBLEM)
      for (const f of FOLLOW_UP_OWNER)
        for (const j of JOB_VALUE) {
          const tier = recommendTier(with_({ growthProblem: g.value, followUpOwner: f.value, jobValue: j.value }));
          assert.ok(real.has(tier), `invented tier ${tier}`);
        }
  });
});

describe("sanitizeAnswers", () => {
  test("keeps only values from the published option sets", () => {
    const clean = sanitizeAnswers({
      yearsInBusiness: "over-15",
      recordVolume: "definitely-not-a-real-option",
      capacity: "<script>alert(1)</script>",
      jobValue: "=IMPORTXML(\"https://evil.example\",\"//a\")",
      nonsenseKey: "ignored",
    });
    assert.equal(clean.yearsInBusiness, "over-15");
    assert.equal(clean.recordVolume, "");
    assert.equal(clean.capacity, "");
    assert.equal(clean.jobValue, "");
    assert.equal(Object.keys(clean).length, ANSWER_KEYS.length);
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
    assert.doesNotMatch(summary, /over-15|5k-plus|unsold-estimates/);
  });

  test("skips unanswered questions instead of printing blanks", () => {
    assert.equal(summarizeAnswers(EMPTY_ANSWERS), "");
    assert.doesNotMatch(summarizeAnswers({ ...EMPTY_ANSWERS, timeline: "now" }), /·/);
  });
});
