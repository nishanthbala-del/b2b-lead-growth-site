# SEO Growth Plan — B2B Lead Growth

_Last updated: 2026-08-08. All external figures below were verified against their primary
sources on 2026-08-07; dates are noted inline. Nothing in this plan or on the site invents
results, testimonials, statistics, or credentials — the business has 0 clients and says so._

## 1. Current SEO / AI-search baseline

- **The live deployment is stale.** `b2b-lead-growth-site.vercel.app` serves a pre-"Free
  Pipeline Audit" build (old hero, "strategy call" copy, `/terms` 404s, the offer name appears
  0 times). Local `main` fixed all of this weeks ago but was never pushed. **Deploying current
  `main` + this work is the single highest-impact action available.**
- **Not indexed anywhere.** Searches for the exact subdomain, exact H1, and brand+vercel
  combinations return zero hits in Google. Expected: zero backlinks, no Search Console
  property, and `vercel.app` is on the Public Suffix List so the subdomain inherits nothing.
- **Technically indexable.** Verified live: no `X-Robots-Tag`/`noindex` on the production
  deployment (Vercel only noindexes previews and outdated production deploys), valid
  robots.txt + sitemap, full SSR, self-canonicals, Organization/WebSite/FAQPage/Service
  JSON-LD, OG image. The foundation was already healthy; the problems were discovery,
  authority, and a one-page architecture.
- **Structural handicap:** the `vercel.app` subdomain itself (shared-reputation crawl
  deprioritization, buyer trust, directory friction). Free mitigations are in place;
  see §11 for the flagged ~$10 decision that is the real fix.

## 2. Competitor + demand research (what the SERPs actually look like)

- **Head terms are locked.** "B2B lead generation", "appointment setting services", "best
  lead gen companies" → high-authority agency content machines (Belkins, CIENCE, WebFX,
  Callbox) and aggregator listicles. Not winnable at zero authority; not targeted.
- **The industry's biggest exploitable gap is pricing opacity.** Belkins and Callbox publish
  no prices (quotes via sales call; third-party reviews report $3k–$30k/mo); CIENCE's managed
  service starts at $2,000/mo (its pricing page, checked Aug 2026); Cleverly is the rare
  exception publishing LinkedIn-only plans from $397/mo. A full-service published tier at
  $750/mo is a genuinely unusual, citable market fact.
- **The HVAC shared-leads pain space is held by conflicted or thin content.** Pages ranking
  for shared-vs-exclusive and Angi-cost queries are written by lead sellers or are template
  affiliate pages. The FTC's HomeAdvisor action (order up to $7.2M, finalized April 2023,
  re: misleading lead-quality/sourcing claims — settled without admission) is public record
  no lead seller will cite. A neutral party that sells neither lead type can own this angle.
- **"HVAC lead generation New Jersey" is the weakest relevant SERP found:** a 99Calls
  programmatic location page ($54.99/lead exclusive, their published NJ rate), scraper lists,
  and directories. Geo + niche is where a zero-authority site can genuinely rank — and it is
  exactly the business's active niche and territory.

> **Re-checked 2026-08-29 (3 weeks after the original survey).** The shared-vs-exclusive
> space is no longer near-empty. A single query now surfaces at least seven competing pages,
> several published or refreshed in 2026 — rocketmedia, homeshowoff, baadigi, gowithhero,
> peakintent, constructionleadpro, astraresults — with cost-per-booked-job math close to the
> figures our own page argues. The *angle* survives (most of them sell leads or sell
> marketing to lead buyers, so the neutral-party framing is still ours alone, and none cite
> the FTC order), but "weakest SERP found" is no longer accurate for this cluster and should
> not be used to justify effort allocation without re-checking. Treat every competitive claim
> in §2 as perishable and re-run the queries before acting on it.

## 3. Keyword / search-intent map (business value first, not volume)

| Cluster | Intent | Value | Winnable? | Where it lives |
|---|---|---|---|---|
| HVAC lead gen New Jersey ("hvac lead generation nj", "exclusive hvac leads new jersey") | Transactional | High | **Yes — weakest SERP in the map** | `/hvac-lead-generation-new-jersey` |
| Shared vs exclusive leads math ("shared vs exclusive hvac leads", "real cost per booked job") | Commercial | High | **Yes — best AI-citation bet**; no neutral voice ranks | `/shared-vs-exclusive-hvac-leads` |
| Cost transparency ("appointment setting cost 2026", "lead gen agency pricing") | Commercial | High | Organic: hard. **AI answers: yes** — concrete published prices are what assistants extract | `/pricing` |
| Sub-$1k budget ("appointment setting under $1,000/month") | Transactional | High | **Yes — near-empty SERP**, and $750 is a real answer | `/pricing` |
| Agency diligence ("lead gen agency red flags", "questions to ask before hiring") | Commercial | Medium | Yes — modest-authority sites already rank here | `/how-to-choose-a-lead-generation-agency` |
| Pipeline-audit category ("what is a pipeline audit", brand-adjacent searches by outreach recipients) | Transactional | Medium | Yes — near-empty; this page defines the category | `/free-pipeline-audit` |
| Angi pain long-tails ("are angi leads worth it for hvac") | Commercial | High | Partially — covered inside the two HVAC pages rather than standalone attack pages | HVAC pages |
| Head terms ("b2b lead generation", "does cold email work") | — | — | **No. Deliberately skipped.** | — |

## 4. SEO strategy

1. **Skip every head term.** The homepage carries the brand; the guide cluster does the work.
2. **Small, honest topic cluster — not a content farm.** Five interlinked guide pages, each
   owning one query family, each answer-first, each with only verified, dated, source-linked
   facts. No programmatic pages, no filler.
3. **NJ + HVAC first** because that is both the weakest SERP and the actual first-client
   target. The pages also serve as the diligence landing spot when cold-outreach recipients
   google the brand.
4. **Sequence for a zero-authority site: Bing first, Google as the slow lane.** Bing Webmaster
   Tools + IndexNow give hours-to-days discovery and feed ChatGPT/Copilot; Google AI surfaces
   correlate with top-10 rankings we can't yet earn and arrive later as a byproduct.
5. **Honesty as differentiation.** Transparent pricing, no-guarantee policy, "we're new and
   here's the proof-of-work instead" — these are the claims competitors structurally cannot
   copy, and they are true.

## 5. AI SEO / GEO / AEO strategy

Evidence-based (Princeton GEO study; Ahrefs 17M-citation analysis; server-log studies), hype
filtered out:

- **Answer-first extractable passages**: every guide opens with a 2–3 sentence direct answer;
  key facts appear as self-contained 40–60 word blocks (`KeyAnswer` component); H2/H3s are
  literal buyer questions with immediate answers.
- **Cited third-party facts with links and dates** — the single strongest measured citation
  factor, and it happens to be our house rule anyway.
- **Transparent pricing in plain declarative text** ("B2B Lead Growth charges a flat $750,
  $1,500, or $2,500 per month") — "how much does X cost" is the classic AI-answer query and
  almost no competitor answers it on-page.
- **Entity consistency**: Organization JSON-LD with email; `sameAs` wired to accept real
  profiles as they're created (LinkedIn/Crunchbase/Clutch — see §9). Identical
  name/description/pricing across all future profiles.
- **Permissive, explicit crawler access**: robots.txt names GPTBot, OAI-SearchBot,
  ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User,
  Google-Extended, CCBot, Bingbot. Training-bot exposure is pure upside for a marketing site.
- **Freshness discipline**: visible "Last updated" dates backed by identical
  `dateModified` in JSON-LD; refresh the pricing/cost pages every 4–8 weeks with genuinely
  new information and re-ping IndexNow. Never fake-bump dates.
- **What we deliberately did NOT chase**: FAQ rich results (deprecated by Google; FAQPage
  markup kept only because it matches visible text and costs nothing), llms.txt as a lever
  (no major AI crawler consumes it — ours exists because it took 5 minutes, ranked last),
  Review/AggregateRating markup (nothing to rate — would be fabrication), paid "AI
  visibility" schemes, directory blasts.

## 6. Site architecture + content plan

```
/                                        brand + offer + pricing + FAQ (landing, existing)
/free-pipeline-audit                     the offer page; category definition; Offer schema ($0)
/pricing                                 transparent tiers + cited market comparison table
/hvac-lead-generation-new-jersey         niche+geo money page; cost-by-channel table
/shared-vs-exclusive-hvac-leads          neutral math explainer; FTC case, precisely framed
/how-to-choose-a-lead-generation-agency  buyer's-side diligence page; answers about ourselves
/privacy, /terms                         legal (existing)
```

- Every guide interlinks to every other guide + a single honest CTA block.
- Homepage footer carries a "Guides" nav (crawl discovery from the highest-authority page).
- Conversion: guides CTA → `/#get-audit` deep link → intake modal auto-opens (new).
- Future content (only when real data exists): a cited outreach-benchmarks roundup for
  home services; own verified numbers once real sends/results exist and clients permit.

## 7. Technical changes required

All items below were required; **all are implemented** (see §8) except the two that need
owner accounts (§11): Search Console verification token and the post-deploy IndexNow ping.

## 8. Changes implemented (in this repo, this pass)

> **Correction, 2026-08-29.** Three items below were recorded as shipped but were never
> on this branch. They were written in commit `2705c1a`, which is **not reachable from
> `main`**; the later commit `c3c89a5` ("Restore /pricing, /terms and the guide pages")
> restored this plan document and the guide pages but not the rest of `2705c1a`'s
> technical layer. `git log --all -S<term>` finds each term in exactly two commits — the
> one that wrote it and the one that reverted it — and in none that `main` can see.
> A plan that claims its own completion is not evidence of completion.
>
> - **§8.4 `Organization.email` + `sameAs` wiring** — was absent; **restored 2026-08-29**
>   (`app/layout.tsx`, `organizationProfiles` in `lib/site.ts`, empty until real profiles
>   exist). Verified in the production build output.
> - **§8.5 robots.ts AI-agent allow groups** — was absent; live `robots.txt` carried only
>   `User-Agent: *`. **Restored 2026-08-29** and verified in the generated `robots.txt`.
> - **§8.12 GSC verification wiring** — still absent, and now **obsolete rather than
>   missing**: that wiring existed because DNS verification is impossible on a
>   `*.vercel.app` subdomain. The site is on `b2bleadgrowth.com`, and two
>   `google-site-verification` TXT records are live on the apex (confirmed by `dig`), so
>   the domain property is already verified and covers `www`. Adding an unused
>   `NEXT_PUBLIC_GSC_VERIFICATION` env var would be noise. **Do not restore it.**
>
> Everything else in §8 was re-checked against the working tree on 2026-08-29 and is
> present, including the `KeyAnswer` component, the per-page FAQPage nodes, the registry,
> the IndexNow script and key file, and `llms.txt`.


1. **Five new statically-rendered guide pages** (above) — answer-first, fact-checked,
   source-linked, honest. Every external figure verified against its primary source on
   2026-08-07 and dated in the copy.
2. **`lib/pages.ts` page registry** — single source of truth driving sitemap, footer nav,
   metadata, Article + BreadcrumbList JSON-LD; dates in one place so visible and structured
   dates can't drift.
3. **`components/GuideLayout.tsx`** — shared server-rendered shell: unique title/canonical/OG
   per page, one H1, KeyAnswer extractable blocks, accessible sourced tables, CTA, guide
   cross-links, no client-side animation weight (guide pages ship ~178 B of page JS).
4. **Structured data upgrades** — per-page FAQPage (verbatim-matched to visible text), Offer
   (price 0) on the audit page, Service w/ per-tier `UnitPriceSpecification` on `/pricing`
   (same node as homepage, built from the same array), NJ-scoped Service on the HVAC page,
   Organization gains `email` + `sameAs` wiring (renders only when real profiles exist).
5. **robots.ts** — explicit allow groups for all named AI search/user/training agents.
   _(Never landed on `main`; restored 2026-08-29 — see the correction above.)_
6. **sitemap.ts** — registry-driven, truthful per-page lastmod.
7. **Homepage FAQ** — two new answer-engine-shaped entries: monthly cost (with cited market
   range + our exact pricing) and NJ/HVAC focus (owned-audience model, no homeowner scraping).
8. **Footer "Guides" navigation** on the landing page.
9. **`/#get-audit` deep link** — IntakeForm opens on load for guide-page CTAs (verified in
   browser: modal opens).
10. **`public/llms.txt`** — honest brand summary + page map (lowest-priority freebie).
11. **IndexNow** — key file in `public/` + `scripts/indexnow-ping.mjs` (run post-deploy).
12. ~~**GSC verification wiring** — `NEXT_PUBLIC_GSC_VERIFICATION` env var renders the meta
    verification tag.~~ **Superseded 2026-08-29:** never landed, and no longer needed —
    the domain is DNS-verified in Search Console. See the correction above.
13. Carried the pending uncommitted honest-copy pass, then unified it further: prospect
    claims now read "individually vetted" site-wide (review found "hand-vetted" overclaims a
    software-assisted process; "individually vetted … human-reviewed before delivery" is true
    under scrutiny).
14. **Adversarial 4-lens review run and applied** (honesty, technical SEO, skeptical buyer,
    consistency — ~30 findings fixed). Highlights: a dead citation URL repointed (the review's
    one blocker); the Cleverly figure weakened to what its source supports; "hand-vetted"
    unified site-wide to "individually vetted … human-reviewed before delivery" (true under
    scrutiny of the software-assisted pipeline); the closing CTA rewritten to practice the
    site's own "no manufactured urgency" rule; the shared-leads math table given a
    concession row where cheap shared leads WIN plus our own fee added to the comparison;
    an HVAC-specific audit-contents FAQ; a one-client-per-territory exclusivity FAQ (backed
    by the code-enforced conflict check); five operational FAQs (who does the work, channels,
    what we need, time cost, competitors); intake friction cut (tier select moved and made
    optional, 90-day-goals optional, dual-persona placeholder); post-submit copy fixed so the
    walkthrough no longer contradicts the audit-before-call promise; "Recommended" badge
    replaced with a fit-based label; guide pages got their own X/Twitter cards; homepage
    sitemap date pinned; legacy Host directive dropped; legal pages got their own og:url.
15. **`SOURCES.md` citation register** — every published external figure with its primary
    source, check date, and re-verify rules.
16. **Validated**: typecheck, lint, production build green; all routes prerender statically;
    JSON-LD parses on every page with expected types and matches visible text; canonicals/
    titles unique; sitemap and robots output inspected; `/#get-audit` deep link verified in a
    real browser.

## 9. Free distribution / link-earning strategy (all $0)

Ranked by effort-to-impact; researched Aug 2026:

1. **Google Search Console + Bing Webmaster Tools** (owner, ~35 min total): URL-prefix
   property + HTML-tag verification (DNS is impossible on vercel.app), submit sitemap, then
   Bing's one-click "Import from GSC". Bing's index feeds ChatGPT/Copilot/DuckDuckGo.
2. **LinkedIn company page + founder-led zero-click posts** — the one channel where having
   no track record doesn't matter. Post observations/process (never invented outcomes); keep
   links out of captions (measured ~60% reach penalty); 2–3×/week founder habit.
3. **Crunchbase free profile** (~DA 91, read by buyers doing diligence) and **Clutch free
   profile** (+ **GoodFirms**; G2/Capterra are software-only — skip). Identical
   name/description/pricing everywhere; then add each URL to `organizationProfiles` in
   `lib/site.ts` so Organization.sameAs picks them up.
4. **HARO successors** — Source of Sources (free), Qwoted free tier, Help a B2B Writer:
   expertise-based editorial quotes; slow drip, the only genuinely free editorial links.
5. **Reddit/communities** (r/sweatystartup, r/smallbusiness) under the 9:1 rule with founder
   disclosure; answer-first, link-last. Never pitch r/HVAC.
6. **Not eligible / not free — do not do**: Google Business Profile (online-only businesses
   are ineligible under 2026 rules; attempting it with a home address risks suspension and
   violates our own honesty rules), NJ chambers + ACCA directories (paid membership — queue
   post-revenue), directory-blast lists (spam footprint), any paid links/placements.

## 10. Measurement / KPI framework

Weekly, once GSC + Bing WMT are live (all free):

- **Index coverage**: pages indexed in Google + Bing (target: all 8 within 4–6 weeks of
  deploy + submission; the vercel.app handicap may slow Google — expected, documented).
- **Impressions/clicks by cluster query** (GSC + Bing WMT query reports) — the map in §3 is
  the checklist; NJ+HVAC queries are the ones that matter, not total traffic.
- **AI-citation spot checks** (manual, monthly): ask ChatGPT/Perplexity/Claude the cluster
  questions ("how much does appointment setting cost", "shared vs exclusive hvac leads",
  "hvac lead generation new jersey") and record whether/where the site is cited.
- **Conversion**: audit-intake submissions (the Google Sheet is the only durable record in
  production — the `data/` +
  events.jsonl), with `#get-audit` deep-link arrivals distinguishable in referrer logs.
- **Honest expectation-setting**: with zero backlinks on a PSL subdomain, meaningful Google
  organic traffic in under ~2–3 months would be a surprise; Bing/AI-surface citations can
  come in weeks. The KPI that pays the bills is audit requests, not sessions.

## 11. Remaining human actions (owner)

> **Status re-check, 2026-08-29.** Items 1, 3 (verification half), 6b and 7 below are now
> **DONE** and are struck through. What is NOT done is the part that actually matters:
> **the site is not indexed by Google.** An exact-domain search for `"b2bleadgrowth.com"`
> and an exact-phrase search for the homepage H1 both return zero results. Deployment,
> schema, and copy are no longer the constraint — *discovery* is, and every remaining
> item below is an owner action because each one needs a login this system does not hold.

1. ~~**Push + deploy**~~ **DONE.** Verified 2026-08-29: `reconcile` is identical to
   `origin/main` (0 ahead / 0 behind), and all 12 live routes return 200 with the current
   build's H1, metadata, and JSON-LD. The "live site is weeks stale" problem is resolved.
2. ~~**After deploy**: run `node scripts/indexnow-ping.mjs`~~ **RUN 2026-08-29** against the
   live production URL set: `202 Accepted`, 9 URLs submitted for `www.b2bleadgrowth.com`.
   This is the Bing lane (and therefore the ChatGPT-search / Copilot / DuckDuckGo lane),
   which §4.4 correctly identifies as the fast one for a zero-authority site.
   Note there is still **no postbuild hook**, so this remains a manual step that has to be
   repeated after each substantive deploy. A hook was deliberately not added: Vercel runs
   `npm run build` for preview deployments too, and the script hardcodes the production
   host, so a `postbuild` would announce production URLs from every preview build.
3. **Google Search Console** — verification ~~HTML-tag~~ **DONE via DNS.** Two
   `google-site-verification` TXT records are live on the apex, so the domain property is
   verified and covers `www`. **Still outstanding, and this is now the single highest-value
   action available:** open the property, **submit `/sitemap.xml`**, then use URL Inspection
   → **Request indexing** on each of the 9 URLs. A verified property that was never given a
   sitemap explains the zero-index state better than any on-page factor does.
4. **Bing Webmaster Tools**: "Import from GSC" (~5 min).
5. **Create free profiles** (LinkedIn company page, Crunchbase, Clutch, GoodFirms) with
   identical positioning, then add their URLs to `organizationProfiles` in `lib/site.ts`.
6. **Identity signals — the skeptical-buyer review's verdict.** The review's only FAIL was
   identity, not copy: a vercel.app URL + a numbered personal Gmail + no named founder reads
   as fly-by-night to the exact buyer the site targets, and it contradicts the site's own
   red-flag advice about inspectable sending identities. Owner decisions, in order of impact:
   (a) the custom domain below; (b) a branded mailbox (hello@domain) replacing the Gmail in
   `contactEmail`; (c) **done in the 2026-08-08 truth-audit pass** — `founderName` in
   `lib/site.ts` now names the founder in the landing footer, the homepage proof block, the FAQ,
   and both legal pages, matching `from_name` in the OS repo's `sender_identity.yaml` so a
   prospect who receives an email sees the same name on the site. The earlier legal-name /
   sending-name split was resolved on 2026-08-10: **Nishanth Balaji** is now the single published
   name across the website, `sender_identity.yaml`, and all staged drafts. Still outstanding: a real LinkedIn profile URL added to
   `organizationProfiles`, and a photo if wanted; (d) optionally a business phone line;
   (e) set the booking link's
   minimum scheduling notice to ~3 business days so walkthrough calls land after the audit
   arrives (the site now promises audit-first).
7. ~~**Flagged decision — custom domain (~$10/yr).**~~ **DONE** — `www.b2bleadgrowth.com`
   is live and canonical, and `lib/site.ts` pins it. Original note kept for the reasoning: The one paid item with outsized return:
   fixes the shared-subdomain trust/crawl handicap, directory friction, AND is already
   required by the operating system's identity floor (`scripts/check_identity.py` needs an
   owned domain before any production send). One purchase resolves two blockers. If bought:
   set `NEXT_PUBLIC_SITE_URL`, 301 the vercel.app host, keep canonicals on the new domain.
   Recommendation only — not purchased here per the $0 constraint.
8. Optional, later: chamber/ACCA memberships post-revenue; publish own verified benchmark
   numbers once real send data + client permission exist.

## 12. Prioritized next steps

_Re-prioritised 2026-08-29. P0, P1's ping half, and P4 are done; the list now leads with the
only thing standing between this site and an AI citation, which is that Google has no record
of it. On-page work is no longer the constraint and is ranked accordingly._

| P | Action | Owner | Cost |
|---|---|---|---|
| — | ~~Deploy current main~~ **DONE** — live == `origin/main`, all 12 routes 200 | — | — |
| — | ~~IndexNow ping~~ **DONE 2026-08-29** — 202 Accepted, 9 URLs (Bing → ChatGPT/Copilot) | — | — |
| — | ~~Custom domain~~ **DONE** — `www.b2bleadgrowth.com` live and canonical | — | — |
| **0** | **GSC: submit `/sitemap.xml`, then Request Indexing on all 9 URLs.** The domain is already DNS-verified; the sitemap appears never to have been submitted. Zero Google results today. | Owner (~20 min) | $0 |
| **1** | **Bing WMT: "Import from GSC".** IndexNow notifies Bing but WMT is where you see whether it indexed. | Owner (~5 min) | $0 |
| **2** | LinkedIn company page + Crunchbase/Clutch/GoodFirms → paste URLs into `organizationProfiles` in `lib/site.ts` (wiring restored 2026-08-29; array is empty and renders no `sameAs` until then). **This is the entity-corroboration gap: nothing on the web currently says this company exists.** | Owner (~1 hr) | $0 |
| 3 | Founder LinkedIn cadence + SOS/Qwoted monitoring | Owner (ongoing) | $0 |
| 4 | Re-verify §2's competitive claims before writing more guides — the shared-vs-exclusive SERP has filled in since 2026-08-07 (see §2 note) | Either | $0 |
| 5 | 4–8-week refresh cycle on /pricing + HVAC pages (real updates only) + re-ping IndexNow | Either | $0 |
| 6 | Benchmarks roundup page (cited third-party data, HVAC angle) when time allows | Either | $0 |
| 7 | Own results content — only when real, permissioned data exists | Blocked on reality | $0 |

---

**Standing guardrails for all future SEO work on this site:** no fabricated anything; no
outcome promises; every external figure dated and linked to its primary source; visible
dates must match structured dates; no page exists unless it's the best honest answer to a
real query the business can serve.
