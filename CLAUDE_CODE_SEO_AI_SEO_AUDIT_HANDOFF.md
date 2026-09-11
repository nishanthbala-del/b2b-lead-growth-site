# B2B Lead Growth Managed Outbound SEO + AI Search Implementation Handoff

**Target:** [b2bleadgrowth.com](https://www.b2bleadgrowth.com/)  
**Repository:** `/Users/nishanthbalaji/Documents/Lead_Generation`  
**Audit date:** 2026-09-10  
**Audience:** Claude Code implementing the changes in this repository

This document replaces the earlier audit. The earlier audit treated customer reactivation and referral-partner outreach as the core category. That was incorrect.

## 1. Correct business model

B2B Lead Growth is a **managed outbound service for established HVAC companies**.

The service manages the work that sits between “we need more pipeline” and “the contractor’s salesperson is having a qualified sales conversation”:

1. Define the target job, territory, account/customer profile, and disqualifiers.
2. Research, clean, rank, and cite the prospect or customer records.
3. Write the first-touch and follow-up messages for the actual record.
4. Send the approved outreach from the client’s own domain/mailbox at a controlled cadence.
5. Read and classify replies.
6. Escalate substantive interest to the client, or qualify and book the appointment on the highest tier.
7. Report activity and qualified conversations against the records and messages that produced them.

Customer-history campaigns and referral-partner campaigns are **outbound motions within the service**, not the category the website should lead with. The current website’s own pricing model confirms this:

| Tier | Current price | Current delivery | Business-model interpretation |
|---|---:|---|---|
| Lead Engine | $750/mo | Research/list foundation, scripts, and handoff; client sends | Outbound foundation, not managed outbound |
| Outreach Engine | $1,500/mo | Client-specific writing, sending, follow-up, reply triage, reporting | Core managed outbound |
| Appointment Engine | $2,500/mo | Managed outreach plus qualification and calendar booking | Managed outbound plus appointment setting |

The primary public offer should therefore be **managed outbound / outsourced prospecting and appointment setting**, with the three tiers explaining how much of the outbound operation B2B Lead Growth owns.

## 2. Executive decision

The website is not suffering from a basic technical SEO failure. The live site has server-rendered pages, a canonical `www` domain, a robots file, a sitemap, structured data that parses, responsive layout, and strong lab performance. The main problem is **category and intent clarity**.

The site currently makes searchers infer that the service is managed outbound from language about “lead generation”, the client’s existing records, and referral partners. That is backwards. A contractor should understand in the first screen that B2B Lead Growth runs a controlled outbound program on the contractor’s behalf.

### Highest-priority findings

| Priority | Finding | Required action |
|---|---|---|
| P0 | “Lead generation” is the dominant label, but the actual paid work is managed outbound. | Reposition the homepage and service schema around managed outbound, outsourced prospecting, and appointment setting. Keep “lead generation” as a secondary market term with a clear disqualifier. |
| P0 | The $750 tier is a list/research product while the $1,500 and $2,500 tiers are managed services. | Make the boundary explicit. Do not present all three as if they deliver managed outbound. Make Outreach Engine the featured core offer. |
| P0 | The site is narrow by industry but ambiguous by outbound motion. | State whether a campaign targets existing customer records, homeowner prospects, business decision-makers, or a combination. Do not let “managed outbound” become another vague label. |
| P0 | The current fit check asks heavily about customer history/reactivation and does not fully qualify managed-outbound readiness. | Add target segment, offer, sender setup, decision-maker, response owner, appointment criteria, capacity, and compliance readiness. |
| P1 | Current SEO pages are built around “HVAC leads”, “shared vs exclusive leads”, and broad agency choice. | Keep comparison pages as demand capture, but add one authoritative managed-outbound service page and rewrite the commercial pages around the real offer. |
| P1 | Public competitors already claim managed outbound, human prospecting, appointment setting, and HVAC specialization. | Do not claim that “managed outbound” alone is differentiated. Differentiate with transparent scope, source-cited research, client-controlled sending identity, flat pricing, and truthful measurement—but do not call that proven superiority without paid evidence. |
| P1 | Sending from a client domain creates deliverability, consent, and reputation risk. | Add an outbound-readiness gate and an operational evidence checklist. Website copy must not promise safe delivery merely because volume is low. |
| P1 | Conversion attribution currently captures `?src=` and referral tokens but not standard UTMs, landing path, or referrer host. | Add first-party attribution so Google, Bing, ChatGPT, Claude, referrals, and outbound batches can be compared by qualified outcome. |
| P2 | The homepage is very long and carries multiple education jobs. | Keep the homepage as the clear commercial explanation; move detailed buyer education into purpose-built pages. Do not chase word count. |

## 3. Evidence inspected

### Repository evidence

The following source files establish the actual offer:

- `lib/content.ts` defines `Lead Engine`, `Outreach Engine`, and `Appointment Engine` at `$750`, `$1,500`, and `$2,500` per month.
- `lib/content.ts` describes Outreach Engine as writing and sending follow-up, and Appointment Engine as qualifying replies and booking appointments.
- `app/pricing/page.tsx` explicitly says the $750 tier is client-sent, while sending starts at the $1,500 tier.
- `components/LeadGenerationLanding.tsx` describes a client-domain sending sequence, approval before sending, follow-up, and one primary fit-check CTA.
- `app/api/lead/route.ts` stores fit-check answers, package recommendation, campaign tag, referral token, consent timestamp, and booking-opened status.
- `components/qualification/QualificationFlow.tsx` currently asks about customer history, records, follow-up ownership, capacity, export readiness, timeline, and budget.
- `app/manifest.ts`, `lib/site.ts`, `public/llms.txt`, and `serviceJsonLd()` still describe the company primarily as HVAC lead generation with reactivation and referral partners. These are the highest-risk identity inconsistencies.

Existing baseline verification before this update:

- `npm test`: 63 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; Next 15.5.23 generated 21 static pages.
- Lighthouse mobile lab run for the homepage: performance 0.99, accessibility 1, best practices 1, SEO 1; LCP approximately 2.1 seconds and CLS 0.

Performance is not the primary constraint. Do not spend the first implementation cycle shaving a few kilobytes while the site still labels the service incorrectly.

### Live public evidence

Checked on 2026-09-10:

- `https://b2bleadgrowth.com/` redirects to `https://www.b2bleadgrowth.com/` over HTTPS.
- The homepage is public, server-rendered/static-prerendered, and content-rich.
- `https://www.b2bleadgrowth.com/robots.txt` returns `200` and disallows `/api/`.
- `https://www.b2bleadgrowth.com/sitemap.xml` returns `200` and lists 10 URLs, including conversion and legal routes.
- `https://www.b2bleadgrowth.com/llms.txt` returns `200`, but its offer summary is still centered on reactivation/referral-partner language rather than managed outbound.
- The homepage has one H1, approximately 4,059 visible words, valid canonical metadata, and parseable JSON-LD.
- `/start` is a short conversion flow of approximately 269 visible words and should not be treated as a normal search article.
- `/reviews` is an honest empty-state page with no real review markup. It should not be an indexable review resource until evidence exists.

The live pages are evidence of the current public state, not proof of ranking, qualified demand, or client results.

### Historical private evidence

`SEO_GROWTH_PLAN.md` contains a 2026-09-05 Search Console note reporting approximately 1 click, 22 impressions, and average position 37.4 over three months. Treat that as a dated local snapshot only. The current sitemap has 10 URLs while parts of the plan refer to 9. Re-export current 28-day and 90-day Search Console and Bing data after implementation.

## 4. Business-model stress test

### 4.1 Is “managed outbound” actually a differentiated offer?

No—not by itself.

Current public competitors already position around:

- fully managed outbound systems for home-service companies;
- B2B appointment setting for HVAC and mechanical contractors;
- direct decision-maker outreach to facility managers and property managers;
- human-led phone and email follow-up;
- qualified appointment booking and calendar handoff;
- outsourced sales development for high-ticket B2B companies.

Examples include [AR Marketing’s managed outbound service for home services](https://www.armarketing.solar/), [Alliance HVAC Leads’ B2B HVAC appointment setting](https://alliancehvacleads.com/), [Lead Orchard’s commercial HVAC appointment setting](https://leadorchard.co/commercial-hvac-appointment-setting), and [Acquirely’s managed cold email and appointment-setting model](https://www.acquirely.io/).

The defensible claim is narrower:

> B2B Lead Growth is a small, transparent, HVAC-focused managed-outbound service with published tier scope, client-controlled sending identity, individually researched/cited records, explicit handoff ownership, and no invented outcome guarantees.

That is a positioning hypothesis, not a proven moat. It becomes credible only after paid campaigns produce permissioned, attributable evidence.

### 4.2 Tier economics stress test

The current capacity numbers imply the following unit economics before labor, tools, data, inbox setup, deliverability work, taxes, support, and payment fees:

| Tier | Stated cap | Simple revenue/unit calculation | What this does **not** prove |
|---|---:|---:|---|
| Lead Engine | ~40 researched prospects/batch | `$750 / 40 = $18.75` per delivered prospect | Profitability or buyer willingness to pay |
| Outreach Engine | ~100 messages/mo, about 33 prospects on a 3-touch sequence | `$1,500 / 100 = $15` per message; about `$45` per 3-touch prospect | That 33 prospects can produce enough conversations |
| Appointment Engine | ~150 messages/mo, about 50 prospects on a 3-touch sequence | `$2,500 / 150 = $16.67` per message; about `$50` per 3-touch prospect | That any appointment will attend, close, or create revenue |

Illustrative labor sensitivity—not measured facts:

| Activity assumption | Outreach Engine at ~33 prospects | Appointment Engine at ~50 prospects |
|---|---:|---:|
| 15 minutes research/hygiene per prospect | 8.25 hours | 12.5 hours |
| 3 touches at 5 minutes each | 8.25 hours | 12.5 hours |
| Reply handling, QA, reporting, setup, exceptions | 4–8 hours | 8–12 hours |
| Illustrative total | 20.5–24.5 hours | 33–37 hours |
| Illustrative gross hourly revenue before overhead | $61–$73/hr | $68–$76/hr |

These assumptions are deliberately conservative enough to expose the risk, not to forecast results. If research takes 30 minutes per account, replies are complex, or booking requires reschedules and reminders, the margin falls quickly. The owner should measure actual time by campaign and tier before adding clients.

### 4.3 Core operational risks

| Risk | How the model fails | Required control |
|---|---|---|
| Low-quality targeting | Messages are personalized but aimed at the wrong account, person, service area, or job type. | Require an approved ICP/territory/offer matrix before list build; reject records without a fit reason. |
| Client cannot follow up | A reply or appointment arrives, but the HVAC owner is too busy, unavailable, or lacks a response owner. | Make response owner, response SLA, calendar availability, and appointment criteria mandatory fit fields. |
| Domain reputation damage | Sending from the client’s domain creates bounces, complaints, authentication issues, or poor engagement. | Preflight SPF/DKIM/DMARC, mailbox ownership, sending identity, list source, bounce handling, opt-out handling, and daily caps. Pause on thresholds. |
| Compliance ambiguity | “The client gave us the list” is treated as permission for every channel and recipient. | Record source, lawful basis/permission claim, suppression status, jurisdiction, and approved message purpose. Obtain counsel for the actual campaign. |
| Activity mistaken for outcome | Sent messages or polite acknowledgements are reported as pipeline. | Define delivered, positive reply, substantive engagement, qualified conversation, booked, attended, opportunity, won, and collected revenue as separate states. |
| Appointment quality failure | A meeting is booked but the prospect is outside territory, lacks authority, has no need, or does not meet the contractor’s economics. | Use a written qualification rubric and require human review before calendar booking. Track show rate and acceptance rate. |
| Over-customization | Each account takes too long, causing the $1,500 tier to become founder-heavy work. | Time-box research and copy; log actual minutes; cap active accounts and revise price/scope when the ceiling is exceeded. |
| Tool dependency | CRM, mailbox, dialer, data source, or automation terms prevent the promised workflow. | Verify permission and API terms per client; avoid cross-client data pooling and do not promise connectors not implemented. |
| Client concentration | A few clients use all sending capacity or one domain incident affects the business. | Separate client tenants, identities, suppression lists, send schedules, logs, and kill switches. |
| No proof | The company has no public case studies and cannot use invented numbers. | Sell the audit/process/transparent scope honestly while running paid, permissioned pilots that create evidence. |

### 4.4 The most important commercial decision

The site should not sell “more leads” as the main outcome. It should sell **managed outbound execution** and define the handoff:

- B2B Lead Growth owns research, writing, sending, follow-up, reply classification, and booking only where the tier says so.
- The HVAC company owns the sales conversation, visit, quote, close, capacity, service quality, and revenue.
- The website must report the work and conversation states it can observe, not revenue it cannot observe.

## 5. SEO positioning and keyword architecture

### 5.1 Primary positioning sentence

Use this as the working positioning sentence throughout the site:

> Managed outbound for established HVAC companies: we research the right prospects, write and send the follow-up from your domain, qualify interested replies, and book sales conversations—so your team does not have to build and supervise the outbound function itself.

Replace “customer reactivation and referral outreach” as the top-level description. Those can appear as campaign examples under “who we can target” or “where campaigns start.”

### 5.2 Search-intent groups

Do not assume “managed outbound” is itself a high-volume query. It is the strategic category label. Pair it with the language buyers actually use:

| Intent group | Search language to test in Search Console/Ads/tools | Page |
|---|---|---|
| Core category | managed outbound for HVAC, outsourced outbound sales HVAC, HVAC outbound agency | Homepage + primary service page |
| Appointment outcome | HVAC appointment setting, HVAC appointment setting service, outsourced HVAC appointment setting | Primary service page |
| Sales-development mechanism | HVAC prospecting service, HVAC cold outreach, HVAC lead follow-up service, outsourced SDR for HVAC | Primary service page + guide |
| Buyer comparison | HVAC lead generation agency, HVAC lead generation vs appointment setting, shared vs exclusive HVAC leads | Existing comparison/choice guides |
| Commercial HVAC variant | commercial HVAC appointment setting, facility manager outreach for HVAC | Only if commercial HVAC is truly served; do not imply residential and commercial expertise are identical |
| Service-area intent | HVAC appointment setting New Jersey, HVAC outbound agency New Jersey | Existing New Jersey page only if New Jersey is an active service area |
| Proof/decision intent | appointment setting pricing, managed outbound pricing, outsourced SDR cost | Pricing page |

The page should not chase “HVAC leads” without a qualifier. That term includes pay-per-lead marketplaces, paid ads, homeowner form fills, and commercial appointment setting. The first paragraph must tell the searcher what this service is and is not.

### 5.3 Recommended homepage H1 and title

Recommended H1:

> Managed outbound for established HVAC companies

Recommended title:

> Managed Outbound for HVAC Companies | B2B Lead Growth

Recommended meta description:

> We research, write, send, and manage outbound for established HVAC companies—then qualify replies or book appointments under a clear monthly scope.

Alternative problem-led hero copy, if the brand wants a more direct voice:

> We run the outbound your HVAC team never has time to do.

Supporting sentence:

> Prospect research, personalized email, follow-up, reply triage, and appointment setting—managed from your domain, with your approval and a defined monthly ceiling.

Do not use both as separate H1s. Make the category H1 explicit and use the problem-led sentence as the hero lead or subheading.

## 6. Route-by-route implementation plan

### 6.1 Homepage `/`

Keep the route and canonical, but change the decision sequence to:

1. Managed-outbound category and HVAC niche.
2. What B2B Lead Growth owns: research, writing, sending, follow-up, reply triage, booking by tier.
3. What the client owns: offer, approvals, sales conversations, visits, quotes, close, capacity.
4. Campaign inputs: customer records, researched businesses, commercial accounts, or another approved target source—only those genuinely supported.
5. Three tiers, with Outreach Engine visually primary.
6. Fit requirements: established company, defined territory/offer, usable sender identity, capacity to handle replies, and no expectation of guaranteed outcomes.
7. Process and controls: approval, sending ramp, suppression, pause, logs, reporting.
8. Pricing and one CTA.
9. Short FAQ and links to the service/pricing/diligence pages.

Remove repeated customer-reactivation/referral-partner explanations from the hero. Keep them as examples under a section such as `What can a campaign target?`.

The homepage should answer “Will you run outbound for a company like mine?” before explaining every record type.

### 6.2 Primary service page: create `/hvac-appointment-setting`

Create one authoritative service page rather than separate thin pages for every outbound motion.

Recommended metadata:

- Title: `HVAC Appointment Setting & Managed Outbound`
- H1: `Managed outbound and appointment setting for HVAC companies`
- Description: `Outsourced HVAC prospecting, personalized outreach, follow-up, reply qualification, and appointment booking with clear monthly scope.`

Required sections:

1. Direct answer in the first 80–120 words.
2. What “managed outbound” means in this specific service.
3. Campaign lanes, clearly separated:
   - client-owned customer/prospect records;
   - researched business or commercial accounts;
   - partner/referral opportunities only if genuinely in scope.
4. What B2B Lead Growth does each week.
5. What the client must provide and approve.
6. What the client still owns after a reply or appointment.
7. Tier boundary table: Lead Engine vs Outreach Engine vs Appointment Engine.
8. Sending and compliance controls.
9. Appointment qualification rubric.
10. Observable reporting definitions.
11. “Not for” list: pay-per-lead buying, unlimited blasting, guaranteed appointments/revenue, no capacity, no sender approval.
12. FAQ with visible answers only.
13. CTA to `/start`.

This page should become the target for internal links from the homepage, pricing, New Jersey, shared/exclusive, and agency-selection pages.

### 6.3 Pricing `/pricing`

Keep the route, but turn it into a managed-outbound scope page.

Required changes:

- Title: `Managed Outbound Pricing for HVAC Companies | B2B Lead Growth`.
- H1: `Managed outbound pricing: $750, $1,500, or $2,500 per month`.
- Feature Outreach Engine as the core managed service.
- Label Lead Engine explicitly: `Outbound Foundation — you send`.
- Label Outreach Engine explicitly: `Managed Outbound — we send and follow up`.
- Label Appointment Engine explicitly: `Managed Outbound + Appointment Setting — we qualify and book`.
- Put the ownership boundary directly on each tier card.
- Show the unit being capped: prospects, messages, or appointments; do not mix them without explanation.
- Add a “what is not included” block: no purchased homeowner leads, no guaranteed replies/appointments/revenue, no sales close, no in-home visit, no unapproved sending.
- Keep pricing, billing, cancellation, and ownership terms visible.
- Remove any stale market-price claim that is not rechecked and source-dated.
- Fix the CIENCE URL to `https://www.cience.com/pricing/` to avoid linking through a redirect.

The $1,500 tier should not read like a cheaper version of an agency. It should read like a deliberately capped, transparent managed-outbound pilot.

### 6.4 Free audit `/free-pipeline-audit`

Rename the offer concept, not necessarily the URL, to **Free Outbound Campaign Audit**.

Recommended title:

> Free HVAC Outbound Campaign Audit | B2B Lead Growth

Recommended H1:

> See what a managed outbound campaign would need to work

Required deliverable language:

- target account/customer profile;
- service area and disqualifiers;
- sample prospect or customer-record review;
- one example personalized message;
- suggested follow-up sequence;
- qualification and handoff rules;
- sender/setup risks visible before launch;
- the first campaign measurement plan.

Do not promise a certain number of leads, replies, meetings, or revenue. The audit should demonstrate the actual work a managed-outbound client would buy.

### 6.5 New Jersey page `/hvac-lead-generation-new-jersey`

Do not create more location pages. Rewrite this existing route only if New Jersey remains an active service focus.

Recommended title:

> HVAC Appointment Setting in New Jersey | B2B Lead Growth

Recommended H1:

> Managed outbound for HVAC companies in New Jersey

Required content:

- New Jersey as an actual operating focus, not a doorway-page template;
- what campaign targeting is available in the state;
- how territory, service area, and capacity are approved;
- examples of target types only if truly supported;
- how replies and appointments are handed to the contractor;
- no unsupported local conversion or appointment-volume claim;
- link to `/hvac-appointment-setting` and `/pricing`.

If New Jersey is not an active sales/delivery focus, do not preserve the page simply for a local keyword.

### 6.6 Shared vs exclusive page `/shared-vs-exclusive-hvac-leads`

Keep this page initially as a comparison page because it can capture a real buyer question, but put the boundary at the top:

> B2B Lead Growth does not sell shared or exclusive homeowner leads. It runs managed outbound campaigns with an approved target profile, controlled sending, reply handling, and appointment setting by tier.

Add a comparison table:

| Model | What the buyer receives | Who does the work after delivery | B2B Lead Growth position |
|---|---|---|---|
| Shared lead | Contact/form record sold to multiple contractors | Contractor chases the lead | Not offered |
| Exclusive lead | Contact/form record sold to one contractor | Contractor chases the lead | Not offered |
| Managed outbound | Research, message, sending, follow-up, reply triage | Shared ownership by tier | Core offer |
| Appointment setting | Managed outbound plus qualification and booking | Contractor runs the sales call/visit/close | Core offer at top tier |

Measure this page by qualified assisted conversions. Do not delete or redirect it from a single ranking snapshot.

### 6.7 Agency-selection guide `/how-to-choose-a-lead-generation-agency`

Keep it as buyer diligence, but add a section called `Lead supply, managed outbound, and appointment setting are different products`.

The guide must ask:

- Does the vendor sell contact records or run the outreach?
- Who owns the sending identity and mailbox?
- Who approves the list and first message?
- Who handles opt-outs and suppression?
- Who qualifies a reply?
- What does “appointment” mean?
- Who handles the visit, quote, and close?
- Which number is activity and which number is a true commercial outcome?

Link to `/hvac-appointment-setting` and `/pricing`.

### 6.8 `/start`

This is a conversion flow, not an article:

- add `noindex,follow` metadata;
- remove from sitemap and `llms.txt` primary-page list;
- keep it linked from CTAs and outbound email;
- retain standard UTM/referral parameters;
- update the first-screen copy to say `managed outbound fit check`;
- do not make the form longer without reducing abandonment risk.

Do not disallow `/start` in `robots.txt`; crawlers must be able to see the noindex directive.

### 6.9 `/reviews`

Until real, permissioned reviews exist:

- add `noindex,follow`;
- remove from sitemap and `llms.txt`;
- keep the honest empty state;
- do not publish `Review`, `AggregateRating`, or `ratingValue` markup;
- publish only named/permissioned text when the evidence is recorded.

### 6.10 Privacy and terms

Set both legal pages to `noindex,follow` and remove them from the acquisition sitemap while keeping them linked in the footer. Update the privacy language if attribution, sending metadata, or campaign records are stored.

## 7. Source-code changes for Claude Code

### 7.1 Central business description

Inspect and update:

- `lib/site.ts` — `orgDescription`, homepage description, service area, founder/entity facts.
- `lib/pages.ts` — homepage title/description and page registry.
- `app/layout.tsx` — Organization/WebSite graph and founder relation.
- `app/manifest.ts` — application description.
- `public/llms.txt` — offer summary and route list.

Replace descriptions that say the service primarily reactivates own records and researches referral partners with a managed-outbound description. Preserve those as campaign inputs/examples where accurate.

Suggested `orgDescription`:

> B2B Lead Growth is a founder-run managed outbound service for established HVAC contractors with commercial work. It researches target accounts or approved customer/prospect records, writes and sends personalized follow-up from the client’s domain, handles replies by tier, and books qualified sales conversations on the highest tier. It does not sell shared or exclusive homeowner leads, and it does not guarantee replies, appointments, jobs, or revenue.

### 7.2 Service JSON-LD

Update `serviceJsonLd()` in `lib/pages.ts`:

- `name`: `Managed Outbound for HVAC Companies`.
- `serviceType`: `Managed outbound prospecting and appointment setting`.
- `description`: same core truth as visible copy.
- `audience`: established HVAC contractors with commercial work with a defined service area, capacity, and a person who can handle replies/appointments.
- `serviceOutput`: managed prospect research, personalized outbound, follow-up, reply qualification, and appointment booking by tier.
- `offers`: retain the three real prices only if they remain current and visible on the page.

Do not create `Review` or `AggregateRating` markup without visible permissioned evidence. Structured data must match visible copy; [Google’s structured-data policy](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) does not treat schema as a guarantee of rich results.

### 7.3 Page registry and author data

Inspect:

- `lib/pages.ts` guide registry;
- `components/GuideLayout.tsx`;
- all guide `page.tsx` files.

Implement:

1. Add an explicit visible `h1` field to the guide registry.
2. Use that H1 in the rendered page and JSON-LD `headline`.
3. Add a visible byline only after the owner confirms the exact public attribution.
4. Add a visible substantive-update date only when the page was actually reviewed.
5. Add a founder `Person` node with verified fields only.
6. Keep `organizationProfiles` empty until real owned URLs exist.

### 7.4 Homepage component

In `components/LeadGenerationLanding.tsx`:

- change the hero and `PositioningSection` to managed outbound;
- change the five steps to target definition → research → message approval → controlled sending/follow-up → reply qualification/booking;
- move customer history and referral partners into a campaign-source section;
- make `Outreach Engine` the featured core offer;
- distinguish `Lead Engine` as client-operated outbound foundation;
- distinguish `Appointment Engine` as managed outbound plus booking;
- retain one primary CTA;
- keep the no-guarantee and no-lead-selling boundaries.

### 7.5 Pricing and content arrays

In `lib/content.ts` and `app/pricing/page.tsx`:

- update `idealFor` to include a defined outbound target, territory, offer, sender approval, response owner, and sales capacity;
- change `notFor` to reject lead-buying, unlimited blasting, guaranteed outcomes, no response owner, and no approval process;
- update differentiators to reflect managed execution, client-domain sending, source-cited research, transparent caps, and ownership;
- rewrite FAQs around managed outbound, appointment setting, sending controls, and handoff;
- remove any remaining copy that makes reactivation/referral work sound like the entire product;
- keep the current tier-specific truth intact.

### 7.6 Fit-check qualification model

Inspect `lib/qualification.ts` and `components/qualification/QualificationFlow.tsx`. The current form is too dependent on customer-history/reactivation fit.

Add or replace questions with:

1. Company, role, service area, and residential/commercial focus.
2. Target customer/account type: homeowner records, property/business accounts, commercial facilities, partners, or another approved category.
3. Core offer: service agreement, replacement, maintenance, commercial service, or other actual offer.
4. Target job value or contract value.
5. Current outbound channels and monthly activity.
6. Target list source and whether the client owns/controls it.
7. Sending domain/mailbox readiness and approval owner.
8. Who answers replies and the response-time expectation.
9. Appointment definition and calendar capacity.
10. Timeline, budget, and tolerance for a controlled pilot.

Fit should be scored on readiness to run managed outbound, not only on the size of a historical customer list.

Automatic disqualifiers should include:

- wants purchased/shared/exclusive lead records instead of managed outbound;
- wants an unlimited blast or guaranteed appointment count;
- has no one to handle substantive replies or appointments;
- will not approve targeting and messages;
- cannot identify a legitimate list/source or sender identity;
- has no capacity to receive qualified conversations.

Do not silently reject a company merely because it does not have a large customer-history export if the actual campaign is legitimate new-account outbound and the service supports that campaign.

### 7.7 Attribution and event measurement

Inspect:

- `components/qualification/QualificationFlow.tsx`;
- `app/api/lead/route.ts`;
- `SETUP.md` and the Google Sheets headers.

The current flow reads `src`, `t`, and `ref`, but does not preserve standard UTMs, landing path, or referrer host. Add an allowlisted first-party object:

```ts
type LeadAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  legacySource?: string;
  referralToken?: string;
  landingPath?: string;
  referrerHost?: string;
  firstSeenAt?: string;
};
```

Implementation requirements:

1. Read only known query keys on initial page load.
2. Cap and normalize all fields in the browser and again on the server.
3. Preserve existing `src`, `t`, and `ref` behavior.
4. Capture the first landing pathname.
5. Capture only the referrer hostname, not the entire URL/query string.
6. Preserve `utm_source=chatgpt.com` when ChatGPT sends it. [OpenAI documents this referral parameter](https://help.openai.com/en/articles/12627856).
7. Add fields by name to the Google Sheet rather than relying on positional columns.
8. Update `SETUP.md` and the privacy page.

Add observable funnel events:

- `fit_check_started`;
- `fit_check_completed`;
- `outbound_audit_eligible`;
- `booking_opened`;
- `lead_submitted`;
- `appointment_attended` only if the owner manually records it;
- `qualified_opportunity` only after the defined rubric is met.

Do not call a response a qualified opportunity merely because it contains “interested”. Store the reason and the human reviewer where the operating system supports it.

## 8. Deliverability, compliance, and operational SEO trust

This is not a legal opinion. The implementation must require owner/legal review for the actual jurisdictions, recipients, channels, and consent facts.

### Email controls that must be reflected in the operating model

Google’s current sender guidance requires authentication and responsible sending practices, and its bulk-sender rules include SPF, DKIM, DMARC, alignment, low spam rates, and one-click unsubscribe for relevant marketing traffic. See [Google’s Email sender guidelines](https://support.google.com/mail/answer/81126?hl=en) and [the current FAQ](https://support.google.com/mail/answer/14229414?hl=en).

The website should not say “we send from your domain” without a readiness process that checks:

- client-owned mailbox and permission to send;
- SPF and DKIM;
- DMARC policy and alignment;
- reply-to and from identity;
- valid physical business address in the message where required;
- bounce and complaint handling;
- suppression and opt-out handling;
- sending ramp and daily cap;
- a pause/kill switch;
- an owner responsible for replies.

### Commercial-email obligations

The [FTC CAN-SPAM guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) states that CAN-SPAM covers commercial email, including B2B email, and requires accurate headers, non-deceptive subject lines, a valid physical postal address, and an opt-out mechanism. The service must not treat “B2B” as a compliance exemption.

For homeowner/customer campaigns, the lawful basis and channel rules may differ from business-account outreach. Do not generalize the B2B policy to consumers. Require a campaign-specific compliance review.

## 9. AI search and answer-engine plan

There is no separate technical AI-ranking switch. [Google states that AI features use the existing Search foundation and do not require special AI markup or a special file](https://developers.google.com/search/docs/appearance/ai-features). The practical work is to make the managed-outbound category, tier boundaries, entity, author, evidence, and source pages unambiguous.

### Answer blocks each authoritative page should contain

Each service page should answer one question directly in the first 80–120 words:

- What is managed outbound for an HVAC company?
- What does B2B Lead Growth actually do each week?
- Who sends the messages and from what identity?
- What happens when a prospect replies?
- What is the difference between a lead, a qualified conversation, and an appointment?
- What does each tier include and exclude?
- Does the service guarantee appointments or revenue?
- Who owns the sales call, visit, quote, and close?

Use visible tables, short definitions, a real process, and one original artifact such as a sample campaign brief, qualification rubric, or reporting schema. Do not publish invisible machine-only text.

### Crawler policy

Rewrite `app/robots.ts` comments and policy. The current comments treat named agents as if they decide AI-search visibility and describe training access as pure upside. That is inaccurate.

Separate:

- normal search crawlers;
- search retrieval/user-directed fetchers;
- model-training crawlers.

Anthropic explicitly distinguishes `ClaudeBot` for training, `Claude-SearchBot` for search, and `Claude-User` for user-directed retrieval in its [crawler policy](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). Google documents `Google-Extended` as controlling Gemini/Vertex AI training and grounding, not normal Google Search indexing or ranking ([Google crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)).

Owner decision:

**Policy A — allow search/user retrieval, do not opt into training by default**

- allow normal Google/Bing crawling;
- allow `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, and equivalent retrieval agents;
- disallow `GPTBot`, `ClaudeBot`, `CCBot`, and `Google-Extended` if the owner does not want training/grounding access;
- allow `/` and disallow `/api/`.

**Policy B — allow training/grounding as well**

- allow training-specific agents intentionally;
- document that this does not guarantee rankings, citations, or leads;
- still disallow `/api/`.

Do not add or remove a bot rule as a substitute for better service pages, third-party corroboration, or qualified conversion tracking.

### `llms.txt`

Keep `public/llms.txt` only as optional reference documentation. Generate it from the route registry or test it against the intended page list.

Its summary should say:

> B2B Lead Growth is a founder-run managed outbound service for established HVAC companies. It researches approved target records, writes and sends personalized outreach from the client’s domain, follows up, triages replies, and books qualified appointments on the top tier. It publishes scope and prices, but does not guarantee replies, appointments, jobs, or revenue.

List only the homepage, primary service page, pricing, audit, active New Jersey page, and genuinely useful guides. Do not present `/start`, empty reviews, privacy, or terms as primary answer sources.

## 10. Entity, proof, and authority plan

### Current weakness

The site has a lot of self-authored process explanation but little independent corroboration and no public case studies yet. The honest response is not to add fake reviews or inflated claims. It is to make the managed-outbound service legible and run paid campaigns that create permissioned evidence.

### Specific plan

1. Publish one verified founder/company identity page.
2. Add only real owned profiles to `sameAs`.
3. Publish one original asset: for example, a managed-outbound campaign brief, HVAC appointment qualification rubric, or outbound reporting template.
4. Ask real clients for permissioned, specific references only after the work exists.
5. Build relevant references through HVAC associations, contractor communities, technology partners, or useful editorial contributions—not mass directory links.
6. Record source URL, date, page referenced, and qualified conversion result for each external mention.

Stop if the proposed authority tactic requires fabricated clients, fake reviews, spun guest posts, mass directory links, or undisclosed paid links.

## 11. Indexability matrix

| Route | Index? | Sitemap? | Role |
|---|---:|---:|---|
| `/` | Yes | Yes | Primary managed-outbound commercial page |
| `/hvac-appointment-setting` | Yes | Yes | Authoritative service page |
| `/pricing` | Yes | Yes | Tier/scope decision page |
| `/free-pipeline-audit` | Yes | Yes | Managed-outbound audit/entry offer |
| `/hvac-lead-generation-new-jersey` | Yes if active | Yes if active | Real local service page |
| `/shared-vs-exclusive-hvac-leads` | Yes initially | Yes initially | Buyer comparison, with disqualifier |
| `/how-to-choose-a-lead-generation-agency` | Yes | Yes | Buyer diligence guide |
| `/about` or `/founder` | Yes if created | Yes | Identity/authorship page |
| `/start` | No | No | Fit-check conversion flow |
| `/reviews` | No until real reviews | No | Empty state |
| `/privacy` | No | No | Legal page |
| `/terms` | No | No | Legal page |

Do not create `/hvac-customer-reactivation` or `/hvac-referral-partner-outreach` as the primary architecture. Those are possible campaign lanes, not the corrected business category.

## 12. Automated and manual acceptance criteria

### Metadata and structured data tests

Add or update tests for:

- every indexable page has exactly one H1;
- every guide’s visible H1 equals its JSON-LD headline;
- every title is unique and normally 30–60 characters;
- descriptions are 120–160 characters unless an intentional exception is documented;
- noindex routes emit `noindex,follow` and are absent from the sitemap;
- all sitemap URLs return `200` after deployment;
- each canonical is self-consistent;
- JSON-LD parses;
- Service name/type/description match visible managed-outbound copy;
- no Review/AggregateRating appears without visible permissioned evidence;
- `llms.txt` includes only intended primary pages;
- UTM/referrer/landing-path fields survive form submission and server validation;
- campaign/source fields cannot inject spreadsheet formulas;
- `/api/` is never included in sitemap or public documentation.

### Managed-outbound operational tests

These do not all belong in the website repository, but Claude Code must report them as owner/operations gates:

- campaign cannot send without approved target profile;
- campaign cannot send without approved first batch/message;
- client-domain authentication has been checked;
- opt-out is recorded and suppresses future sends;
- bounce/complaint threshold pauses the campaign;
- reply classification distinguishes acknowledgement, substantive interest, disqualification, opt-out, OOO, referral, and manual review;
- appointment booking requires the written qualification criteria;
- every sent message links back to campaign, prospect, timestamp, and operator;
- each report separates activity from qualified conversation and downstream revenue.

### Visual checks

At 390px and desktop width:

- first screen says managed outbound, HVAC niche, core work, and CTA;
- the site does not make a visitor read several sections to discover that it is not a lead marketplace;
- tier cards show who sends, who handles replies, and who books;
- the service page has readable comparison tables and answer blocks;
- the form remains usable and does not bury the first field;
- footer/legal links remain reachable.

Run:

```text
npm test
npm run lint
npm run typecheck
npm run build
```

Then verify the deployed hostname. Lighthouse is a regression check, not evidence of demand.

## 13. Claude Code execution instructions

Work in:

```text
/Users/nishanthbalaji/Documents/Lead_Generation
```

Read before editing:

```text
CLAUDE.md
SEO_GROWTH_PLAN.md
lib/site.ts
lib/pages.ts
lib/content.ts
lib/qualification.ts
app/layout.tsx
app/manifest.ts
app/robots.ts
app/sitemap.ts
app/pricing/page.tsx
app/free-pipeline-audit/page.tsx
app/start/page.tsx
components/LeadGenerationLanding.tsx
components/qualification/QualificationFlow.tsx
app/api/lead/route.ts
SETUP.md
public/llms.txt
tests/routes.test.ts
tests/qualification.test.ts
```

Execution rules:

1. Treat this file and the existing code as implementation context, not permission to invent business facts.
2. Implement P0 positioning, route, metadata, and attribution changes first.
3. Do not create the old reactivation/referral pages as the primary architecture.
4. Do not add generic AI-written content pages or city-doorway pages.
5. Do not add fake reviews, case studies, logos, clients, credentials, performance numbers, guarantees, or `sameAs` URLs.
6. Keep every current price and capability aligned with the source of truth in `lib/content.ts` and the actual service agreement.
7. If the owner has not decided which outbound campaign lanes are sold, create a clearly marked TODO and report the decision; do not silently choose.
8. Do not publish or send outbound, alter external DNS, modify Search Console/Bing ownership, buy links, or edit external profiles as part of this code task.
9. Do not commit or push unless separately instructed.
10. At completion, report changed files, unresolved business decisions, test output, and post-deployment checks.

### Required implementation order

**Phase 1 — message and identity correction**

- homepage H1/title/description;
- `orgDescription`, `serviceJsonLd`, manifest, and `llms.txt`;
- tier labels and managed-outbound ownership boundaries;
- free audit wording;
- noindex/sitemap corrections;
- robots-policy comments.

**Phase 2 — service architecture**

- create `/hvac-appointment-setting` as the authoritative service page;
- rewrite homepage process and proof sections;
- rewrite pricing around managed outbound;
- rewrite New Jersey page if active;
- add comparison/diligence links;
- add verified authorship/entity page if facts are available.

**Phase 3 — fit and measurement**

- update qualification questions/rules;
- add UTM/referrer/landing-path attribution;
- add campaign and funnel events;
- update Sheet headers and privacy language;
- add automated tests and run the full baseline suite.

**Phase 4 — commercial evidence**

- run a controlled paid outbound pilot;
- record actual labor time, sending health, replies, qualification, booking, show rate, opportunity, and collected revenue;
- publish only permissioned evidence;
- revisit pricing and caps using actual contribution margin.

## 14. What not to do

- Do not relabel the current customer-reactivation/referral model as the entire business after the correction.
- Do not use “managed outbound” as a vague slogan without defining the weekly work and ownership boundaries.
- Do not treat a researched list as managed outbound.
- Do not claim “appointment setting” if the tier only hands over scripts or flags replies.
- Do not promise safe deliverability because the monthly volume is only 100–150 messages.
- Do not treat CAN-SPAM as irrelevant because a recipient is a business.
- Do not equate sent messages, responses, or booked meetings with revenue.
- Do not add an AI sitemap, hidden AI text, keyword meta tags, or schema purely as ranking tricks.
- Do not block Googlebot or search-retrieval agents to solve a copy problem.
- Do not create review markup while the reviews array is empty.
- Do not create broad commercial-HVAC pages if the actual delivery is residential-only.
- Do not delete currently indexed comparison pages from a single ranking snapshot.
- Do not use generic statistics or competitor claims as proof of B2B Lead Growth performance.

## 15. Definition of success

The update is successful only if:

1. A contractor understands in five seconds that B2B Lead Growth runs managed outbound for HVAC companies.
2. The site clearly distinguishes list/research, managed sending/follow-up, and appointment booking.
3. A searcher looking for homeowner lead purchases is told early that this is not a lead marketplace and is offered the relevant managed-outbound explanation.
4. Search engines and answer systems have one authoritative service page for the category.
5. The primary page answers what is done, from whose identity, at what scope, with what handoff and exclusions.
6. Every commercial claim is truthful and no proof is fabricated.
7. A submitted fit check retains enough attribution to compare organic, Bing, ChatGPT, Claude, referrals, and outbound batches.
8. The owner can distinguish activity, substantive engagement, qualified conversation, booked, attended, opportunity, won, and collected revenue.
9. Actual campaign labor and sending health are measured before adding volume or lowering prices.
10. Search Console/Bing data shows more relevant managed-outbound queries and qualified conversions—not merely more impressions.

## 16. Sources and references

Official search/AI guidance:

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: AI features optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: Google-Extended crawler](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [OpenAI Publisher FAQ](https://help.openai.com/en/articles/12627856)
- [Anthropic crawler policy](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

Email/compliance guidance:

- [Google Email sender guidelines](https://support.google.com/mail/answer/81126?hl=en)
- [Google Email sender guidelines FAQ](https://support.google.com/mail/answer/14229414?hl=en)
- [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)

Current market/competitor evidence:

- [AR Marketing managed outbound for home services](https://www.armarketing.solar/)
- [Alliance HVAC Leads B2B appointment setting](https://alliancehvacleads.com/)
- [Lead Orchard commercial HVAC appointment setting](https://leadorchard.co/commercial-hvac-appointment-setting)
- [Acquirely cold email and appointment setting](https://www.acquirely.io/)
- [ColdFront business development and outsourced sales](https://www.coldfrontio.com/services/business-development)
- [B2B Lead Growth live site](https://www.b2bleadgrowth.com/)
- [B2B Lead Growth robots.txt](https://www.b2bleadgrowth.com/robots.txt)
- [B2B Lead Growth sitemap](https://www.b2bleadgrowth.com/sitemap.xml)
- [B2B Lead Growth llms.txt](https://www.b2bleadgrowth.com/llms.txt)

Competitor pages are used to stress-test category claims and search intent, not as endorsements or as proof that their reported outcomes are typical.
