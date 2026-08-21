"use client";

import Lenis from "lenis";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { IntakeProvider, useIntake } from "./IntakeForm";
import { audit, differentiators, faqs, idealFor, notFor, plans } from "@/lib/content";
import {
  callLengthMinutes,
  contactEmail,
  currentFocusArea,
  founderName,
  intakeMinutes,
} from "@/lib/site";
import { guidePages } from "@/lib/pages";
import { registerSmoothScroll } from "@/lib/smooth-scroll";

// Bridge so ProcessSection's lazily-loaded ScrollTrigger can stay in sync with the
// Lenis smooth-scroll instance without statically importing GSAP into the page bundle.
let notifyScrollTriggerUpdate: (() => void) | null = null;

// Cache the pointer-fine MediaQueryList so hot mousemove handlers don't reconstruct it.
let finePointerMql: MediaQueryList | null = null;
function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  if (!finePointerMql) finePointerMql = window.matchMedia("(pointer: fine)");
  return finePointerMql.matches;
}

const disclaimer =
  "We guarantee the system and the work, and we report the results honestly — we do not guarantee revenue, jobs, customers, or a set number of appointments. Sales outcomes depend on your offer, your market, your follow-up, and your closing.";

const brandName = "B2B Lead Growth";

const navItems = [
  { label: "Free audit", href: "#get-audit" },
  { label: "Who it's for", href: "#who-its-for" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Why us", href: "#why-us" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

// "Cited sources" rather than "verified contacts": what the system actually
// guarantees is that every prospect carries a public source citation before anyone
// is contacted. Contact-data confidence is noted, not certified — so the pillar
// claims the thing that is genuinely true and checkable.
const valuePillars = [
  "Sharper ICP focus",
  "Cited public sources",
  "Priority scoring",
  "CRM-ready pipeline",
];

// The full pipeline, not just the list-building half. `from` names the lowest tier
// at which the step is included, so the ladder is legible before anyone reaches the
// pricing table and nobody buys expecting a step their tier doesn't cover.
const processSteps = [
  {
    title: "Agree the profile",
    from: "Lead Engine",
    body: "Set the industries, service areas, company profiles, buyer roles, exclusions, and qualification filters that define a true fit.",
  },
  {
    title: "Research and cite",
    from: "Lead Engine",
    body: "Find companies that match the criteria from free public sources, each with its source citation and a specific, checkable reason to reach out.",
  },
  {
    title: "Score and organise",
    from: "Lead Engine",
    body: "Rank by fit and deliver annotated, prioritised records with the fields your team needs to filter, assign, and follow up — plus the outreach scripts.",
  },
  {
    title: "Write and verify",
    from: "Outreach Engine",
    body: "Draft outreach per prospect, checked before it can send — cited, on-profile, compliant, not over-promising — and put in front of you to approve.",
  },
  {
    title: "Send and follow up",
    from: "Outreach Engine",
    body: "Run the multi-touch cadence from your own sending account, within daily caps, with opt-outs suppressed immediately and permanently.",
  },
  {
    title: "Qualify and book",
    from: "Appointment Engine",
    body: "Classify every reply, qualify interest against your criteria, and put the call on your calendar — then use what came back to sharpen the next batch.",
  },
];

const services = [
  {
    title: "ICP & Targeting",
    description: "Turn broad market assumptions into a precise, agreed definition of a true-fit buyer.",
    deliverables: "ICP worksheet, target criteria, exclusion list, qualification rules",
  },
  {
    title: "Sourcing & Citation",
    description: "Find the accounts and decision-makers that match the profile, using free public sources only — never a bought broker list.",
    deliverables: "Company + buyer records, role/title, contact path, public source citation, data-confidence note",
  },
  {
    title: "Lead Scoring & Prioritization",
    description: "Rank prospects by fit, signal, and account quality so effort lands on the strongest opportunities first.",
    deliverables: "Lead score, reason for fit, priority tier (A/B/C), suggested angle",
  },
  {
    title: "Personalized Outreach",
    description: "Done-for-you messaging written per prospect — not templated mail-merge — tied to a real reason to reach out.",
    deliverables: "Per-prospect first touch + sequence, angle bank, targeting and messaging client-approved before send",
  },
  {
    title: "Follow-up & Reply Triage",
    description: "Multi-touch follow-up that keeps the conversation alive, with replies flagged by interest.",
    deliverables: "Tracked cadence, reply classification, hand-off notes, opt-out handling",
  },
  {
    title: "Qualification & Booking",
    description: "Qualify interested replies against your criteria and book the call straight onto your calendar.",
    deliverables: "Qualification check, booked call + confirmations/reminders, CRM-ready status",
  },
];

const qualificationStandards = [
  {
    title: "Account Fit",
    body: "The company matches the agreed industry, geography, size, service need, and exclusion criteria.",
  },
  {
    title: "Buyer Relevance",
    body: "The contact connects to a decision-making, budget-influencing, growth, operations, or department-specific role.",
  },
  {
    title: "Data Usability",
    body: "Each record includes enough context to contact, filter, prioritize, and track the prospect.",
  },
  {
    title: "Reason for Fit",
    body: "High-priority leads include a concise explanation for why they belong in the campaign.",
  },
  {
    title: "Source Citation",
    body: "Every prospect we research carries the public source it came from. No citation, no cold outreach — that is a hard rule, not a preference.",
  },
  {
    title: "Enforced Compliance Controls",
    body: "Opt-outs are suppressed immediately and permanently, duplicates and conflicts are blocked, and daily sending caps are enforced automatically on every send. You remain responsible for the email, privacy, and platform rules that apply in your market, and we'll confirm them with you before outreach begins.",
  },
];

const leadTiers = [
  {
    tier: "Band A",
    title: "High fit — top scores",
    body: "Strong profile match, a relevant buyer path, and a clear, cited reason to reach out. Work these first.",
  },
  {
    tier: "Band B",
    title: "Good fit — mid scores",
    body: "Matches most of the criteria but needs more context, a confirmed buyer, or a timing signal.",
  },
  {
    tier: "Band C",
    title: "Possible fit — low scores",
    body: "Some relevance, but a weaker signal, incomplete data, or a less obvious buyer.",
  },
];

// Only what the system actually produces. "Verified contact percentage" and
// "client-approved lead percentage" were metrics nothing in the pipeline computes.
const reportingItems = [
  "Leads delivered, with fit scores",
  "Priority-band distribution",
  "Prospects contacted (outreach tiers)",
  "Replies, and how many were positive",
  "Calls booked (Appointment Engine)",
  "Lead-quality feedback notes",
];

const framework = [
  {
    period: "Days 1–30",
    title: "Clarify and validate",
    body: "Clarify the ICP, validate data quality, and watch early response signals.",
  },
  {
    period: "Days 31–60",
    title: "Refine targeting",
    body: "Use lead-quality feedback to tighten segments, scoring, and priority rules.",
  },
  {
    period: "Days 61–90",
    title: "Evaluate scale",
    body: "Evaluate quality, pipeline movement, conversion signals, and whether to scale.",
  },
];

// What the system runs versus what stays with the client. Mirrors the operating
// system's own split exactly — no capability here that isn't actually built.
const systemHandles = [
  {
    title: "Research & targeting",
    body: "Sourcing accounts that fit the agreed profile, from free public sources, each with its citation.",
  },
  {
    title: "Messaging & angles",
    body: "Per-prospect outreach and follow-up written against a real, cited reason to reach out.",
  },
  {
    title: "Verification before send",
    body: "An independent check on every draft, plus hard gates for citations, opt-outs, duplicates, and daily caps.",
  },
  {
    title: "Replies & reporting",
    body: "Replies classified and answered, and honest numbers on what was done and what came back.",
  },
];

const youHandle = [
  {
    title: "Approve the messaging",
    body: "Nothing goes out in your name until you've signed off on it.",
  },
  {
    title: "Take the calls",
    body: "The conversation with an interested buyer is yours to run.",
  },
  {
    title: "Close, and tell us what happened",
    body: "You own the offer and the close, and confirm the real outcomes so the reporting stays true.",
  },
];

export default function LeadGenerationLanding() {
  const shellRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const progress = useScrollProgress();

  useSmoothScroll(Boolean(prefersReducedMotion));
  useAmbientPointer(shellRef, Boolean(prefersReducedMotion));

  return (
    <IntakeProvider>
      <div ref={shellRef} className="noise min-h-screen overflow-hidden bg-ink-950 text-bone">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-sm focus:border focus:border-gold-500/70 focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-gold-200"
      >
        Skip to content
      </a>
      <CustomCursor />
      <motion.div
        className="fixed left-0 top-0 z-[90] h-px w-full origin-left bg-gold-sheen"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <SiteNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero prefersReducedMotion={Boolean(prefersReducedMotion)} />
        <PositioningSection />
        <AuditSection />
        <WhoItsForSection />
        <ProcessSection />
        <ServicesSection />
        <LeadQualitySection />
        <DifferentiatorsSection />
        <FounderSection />
        <PricingSection />
        <FrameworkSection />
        <ProofSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <SiteFooter />
      </div>
    </IntakeProvider>
  );
}

function SiteNav() {
  const { openIntake } = useIntake();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close the mobile menu once the viewport grows to where the desktop nav appears,
  // and on Escape — an expanded disclosure a keyboard user cannot dismiss is a trap.
  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-gold-500/20 bg-ink-950/78 shadow-panel backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:gap-5 sm:px-8"
        aria-label="Primary navigation"
      >
        <MagneticAnchor
          href="#top"
          className="font-display text-base text-gold-200 sm:text-xl"
          data-cursor-label="Open"
        >
          <span>B2B Lead Growth</span>
        </MagneticAnchor>
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <MagneticAnchor
              key={item.href}
              href={item.href}
              className="link-wipe text-sm text-muted transition-colors hover:text-gold-200"
              data-cursor-label="Open"
              strength={0.18}
            >
              {item.label}
            </MagneticAnchor>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <MagneticAnchor
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              openIntake();
            }}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm border border-gold-500/55 bg-gold-sheen px-3.5 text-xs font-semibold text-ink-950 shadow-gold transition-transform hover:scale-[1.015] sm:px-5 sm:text-sm"
            data-cursor-label="Open"
          >
            Start Now
          </MagneticAnchor>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-gold-500/40 text-gold-200 transition-colors hover:bg-gold-500/10 lg:hidden"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>
      {/* Always rendered so `aria-controls` on the toggle points at a real element
          (a dangling id is ignored by assistive tech, which then can't tell the user
          what the button expands), and wrapped in <nav> so the links stay inside a
          navigation landmark. `hidden` keeps it out of the tree while collapsed. */}
      <nav
        id="mobile-nav"
        hidden={!menuOpen}
        aria-label="Mobile navigation"
        className="border-t border-gold-500/15 bg-ink-950/95 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex max-w-7xl flex-col px-5 py-1 sm:px-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center border-b border-gold-500/10 py-3.5 text-sm text-muted transition-colors last:border-0 hover:text-gold-200"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function Hero({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const { openIntake } = useIntake();
  const headlineRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  // Write the parallax transform straight to the nodes (no per-frame React render).
  function handleMove(event: MouseEvent<HTMLElement>) {
    if (prefersReducedMotion || !isFinePointer()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (headlineRef.current)
      headlineRef.current.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0)`;
    const lineTransform = `translate3d(${x * -10}px, ${y * -8}px, 0)`;
    if (line1Ref.current) line1Ref.current.style.transform = lineTransform;
    if (line2Ref.current) line2Ref.current.style.transform = lineTransform;
  }

  // Always the identity transform, on both the server and the client: branching this
  // on a client-only media query is another hydration mismatch. `handleMove` already
  // no-ops under reduced motion, so these nodes simply never move.
  const restStyle = { transform: "translate3d(0, 0, 0)" };

  return (
    <section
      id="top"
      // Mobile spacing is tuned so the primary CTA clears the fold on a 360x740
      // screen — the common small-Android size — where it previously landed a couple
      // of pixels below it and the only visible action was the nav button.
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-16 pt-24 sm:pb-20 sm:pt-32 lg:pb-28 lg:pt-36"
      onMouseMove={handleMove}
    >
      <div className="ambient-light pointer-events-none absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={line1Ref}
          className="absolute left-[8%] top-[18%] h-px w-64 rotate-[-12deg] bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
          style={restStyle}
        />
        <div
          ref={line2Ref}
          className="absolute bottom-[18%] right-[8%] h-72 w-px rotate-[18deg] bg-gradient-to-b from-transparent via-gold-200/35 to-transparent"
          style={restStyle}
        />
        <div className="absolute left-0 top-28 h-px w-full bg-gradient-to-r from-transparent via-gold-500/18 to-transparent" />
      </div>
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div ref={headlineRef} style={restStyle}>
          <Reveal immediate>
            <p className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/90 sm:mb-7">
              <span className="h-px w-10 bg-gold-500/80" aria-hidden="true" />
              B2B lead generation
            </p>
          </Reveal>
          <Reveal immediate>
            <h1 className="max-w-[20rem] font-display text-[2.05rem] leading-[1.1] text-bone sm:max-w-5xl sm:text-6xl lg:text-7xl">
              A steady pipeline of qualified B2B leads — not a bulk list or a black box.
            </h1>
          </Reveal>
          <Reveal immediate>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl">
              We find your best-fit buyers and hand you a cited, scored pipeline — or run the outreach and book qualified calls straight onto your calendar. You choose how much we handle, and you approve the targeting and the messaging before anything goes out.
            </p>
            <p className="mt-3 max-w-2xl text-sm font-semibold uppercase tracking-[0.18em] text-gold-200/80 sm:mt-4">
              For contractors, service businesses, agencies &amp; software teams selling
              high-value work.
            </p>
          </Reveal>
          <Reveal immediate>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <MagneticAnchor
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  openIntake();
                }}
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 font-semibold text-ink-950 shadow-gold"
                data-cursor-label="Open"
              >
                Start Building Your Pipeline <span className="ml-3" aria-hidden="true">→</span>
              </MagneticAnchor>
              <MagneticAnchor
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/28 px-6 font-semibold text-gold-200 transition-colors hover:border-gold-200/65 hover:bg-gold-500/8"
                data-cursor-label="View"
              >
                See how it works
              </MagneticAnchor>
            </div>
            <p className="mt-4 text-sm text-muted">
              Free {callLengthMinutes}-minute call · {intakeMinutes}-minute intake · you keep the audit
              either way
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.18} className="relative">
          <div className="gold-border-draw relative overflow-hidden rounded-lg border border-gold-500/18 bg-ink-900/70 p-5 shadow-panel backdrop-blur">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-200/70 to-transparent" />
            <div className="mb-6 flex items-center justify-between border-b border-gold-500/14 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold-200/80">Service promise</p>
                <p className="mt-2 font-display text-3xl text-bone">Clarity your sales team can act on.</p>
              </div>
              <div className="h-12 w-12 rounded-sm border border-gold-500/35 bg-gold-500/10" aria-hidden="true" />
            </div>
            <div className="space-y-4">
              {[
                ["Source", "Best-fit accounts + buyers, with a real reason to care"],
                ["Outreach", "Personalized messages — you approve the pattern before they send"],
                ["Follow-up", "Tracked multi-touch cadence; replies triaged by interest"],
                ["Book", "Qualified calls booked straight onto your calendar"],
              ].map(([label, body], index) => (
                <div
                  key={label}
                  className="group grid grid-cols-[auto_1fr] gap-4 border-b border-gold-500/12 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold-500/32 bg-ink-850 text-sm text-gold-200">
                    0{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-bone">{label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// The Free Pipeline Audit is the primary trust offer. With no case studies to point
// at, giving away a real, checkable piece of the paid work IS the proof - so this
// section has to exist ON the homepage, and `id="get-audit"` has to exist because
// every guide page's only CTA links to /#get-audit. Both halves went missing once;
// the CTA on five pages pointed at an anchor that was not here.
function AuditSection() {
  const { openIntake } = useIntake();

  return (
    <section id="get-audit" className="relative scroll-mt-24 border-y border-gold-500/12 bg-ink-900 px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              Start here — free
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              {audit.name}
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">{audit.tagline}</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {audit.includes.map((item, index) => (
            <Reveal key={item.title} delay={Math.min(index, 4) * 0.06}>
              <div className="h-full rounded-lg border border-gold-500/18 bg-ink-950/60 p-6">
                <h3 className="text-xl font-semibold text-bone">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-10 rounded-lg border border-gold-500/18 bg-ink-950/60 p-6">
            <p className="leading-7 text-muted">
              <span className="font-semibold text-gold-200">Why it&rsquo;s free: </span>
              {audit.whyFree}
            </p>
            <p className="mt-4 leading-7 text-muted">
              <span className="font-semibold text-gold-200">What it is not: </span>
              {audit.guardrail}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => openIntake()}
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-6 font-semibold text-ink-950 shadow-gold"
              data-cursor-label="Open"
            >
              Request my free pipeline audit <span className="ml-3" aria-hidden="true">&rarr;</span>
            </button>
            <a
              href="/free-pipeline-audit"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/28 px-6 font-semibold text-gold-200 transition-colors hover:border-gold-200/65 hover:bg-gold-500/8"
              data-cursor-label="Read"
            >
              See exactly what&rsquo;s included
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PositioningSection() {
  return (
    <section className="relative border-y border-gold-500/12 bg-ink-900 px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
                Qualified B2B leads
              </p>
              <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
                The wrong accounts are more expensive than they look.
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-muted">
              <p>
                Most teams do not lose pipeline because they lack effort. They lose it because their research is too broad, their data is aging, and their sales team is working accounts that were never a strong fit.
              </p>
              <p>
                {brandName} narrows the market, verifies the path to the right buyers, and turns scattered research into a pipeline your team can measure, prioritize, and improve over time.
              </p>
            </div>
          </div>
        </Reveal>
        {/* 1 -> 2 -> 4. Jumping straight to 4 columns at md gave 164px cards at
            768px, hard-wrapping every heading onto three lines. */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valuePillars.map((pillar, index) => (
            <Reveal key={pillar} delay={index * 0.06}>
              <TiltCard className="gold-border-draw h-full rounded-lg border border-gold-500/14 bg-ink-850/70 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-gold-200/70">0{index + 1}</p>
                <h3 className="mt-6 text-xl font-semibold text-bone">{pillar}</h3>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoItsForSection() {
  const { openIntake } = useIntake();

  return (
    <section id="who-its-for" className="relative bg-ink-950 px-5 py-24 sm:px-8 lg:py-32">
      <div className="ambient-light pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              Who it&rsquo;s for
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              Built for B2B teams with a clear offer and real deals to win.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              The system works best when the fit is right. Here&rsquo;s who we do our best work for — and who we&rsquo;re honestly not the right choice for.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="gold-border-draw h-full rounded-lg border border-gold-500/30 bg-ink-900/72 p-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">
                A strong fit
              </h3>
              <ul className="mt-6 space-y-4">
                {idealFor.map((item) => (
                  <li key={item} className="flex gap-3 leading-7 text-bone/90">
                    <span aria-hidden="true" className="mt-1 text-gold-200">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-lg border border-gold-500/12 bg-ink-900/40 p-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Not the right fit
              </h3>
              <ul className="mt-6 space-y-4">
                {notFor.map((item) => (
                  <li key={item} className="flex gap-3 leading-7 text-muted">
                    <span aria-hidden="true" className="mt-1 text-muted/70">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.12}>
          <div className="mt-10 text-center">
            <p className="mx-auto max-w-2xl text-base leading-7 text-muted">
              The work is done remotely for businesses across the US. Campaigns are currently
              focused on {currentFocusArea}, starting with residential HVAC contractors — so
              that&rsquo;s where the sharpest local market knowledge sits today.
            </p>
            <button
              type="button"
              onClick={() => openIntake()}
              className="link-wipe mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
            >
              Sounds like you? Book a strategy call →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;
    const section = sectionRef.current;
    let cancelled = false;
    let mm: { revert: () => void } | null = null;

    // Load GSAP only when the pinned animation can actually run (keeps it off the
    // initial bundle, so mobile visitors never download it).
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      // Let the Lenis smooth-scroll loop drive ScrollTrigger.update (fixes scrub desync).
      notifyScrollTriggerUpdate = () => ScrollTrigger.update();

      // matchMedia creates the pin/scrub trigger on entering the breakpoint and reverts
      // it on exit, refreshing on resize — so rotating/resizing across it works.
      //
      // This MUST match the `lg:` breakpoint (1024px) that the section's full-height,
      // two-column layout is built on. Pinning at 900px pinned a section whose layout
      // was still the stacked mobile one, so between 900px and 1023px the pin froze the
      // viewport on a card list taller than the screen and steps 4 and 5 could never be
      // scrolled to.
      const media = gsap.matchMedia();
      mm = media;
      media.add("(min-width: 1024px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${processSteps.length * 540}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextIndex = Math.min(
              processSteps.length - 1,
              Math.floor(self.progress * processSteps.length),
            );
            setActiveStep((current) => (current === nextIndex ? current : nextIndex));
          },
        });
        return () => trigger.kill();
      });
    })();

    return () => {
      cancelled = true;
      notifyScrollTriggerUpdate = null;
      mm?.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-ink-950 px-5 py-24 sm:px-8 lg:min-h-screen lg:py-0"
    >
      <div className="ambient-light pointer-events-none absolute inset-0 opacity-55" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:min-h-screen lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div>
          <Reveal>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              How it works
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              Proof starts with the way the work is done.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              No vague lists. No borrowed credibility. Just visible criteria, traceable sourcing, verification notes, scoring logic, and CRM-ready delivery your team can inspect.
            </p>
          </Reveal>
          <div className="mt-10 hidden gap-2 lg:flex" aria-hidden="true">
            {processSteps.map((step, index) => (
              <span
                key={step.title}
                className={`h-px flex-1 transition-colors ${
                  index <= activeStep ? "bg-gold-400" : "bg-gold-500/16"
                }`}
              />
            ))}
          </div>
        </div>
        <div id="process" className="grid gap-4">
          {processSteps.map((step, index) => (
            <motion.article
              key={step.title}
              className={`gold-border-draw rounded-lg border p-6 transition-colors lg:p-7 ${
                index === activeStep
                  ? "border-gold-500/60 bg-ink-850 shadow-gold"
                  : "border-gold-500/14 bg-ink-900/60"
              }`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.26 }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: index * 0.05 }
              }
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-gold-500/40 text-sm text-gold-200">
                  0{index + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-2xl font-semibold text-bone">{step.title}</h3>
                    <span className="rounded-sm border border-gold-500/30 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-200/80">
                      From {step.from}
                    </span>
                  </div>
                  <p className="mt-2 leading-7 text-muted">{step.body}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="relative border-y border-gold-500/12 bg-ink-900 px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
                Services and deliverables
              </p>
              <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
                A done-for-you outbound system, not a contact export.
              </h2>
            </div>
            <p className="text-lg leading-8 text-muted">
              Each campaign is built around your ICP, qualification criteria, and sales priorities — from sourcing the right buyers to running the outreach and booking the calls. How much you hand to us is the tier you choose; the standards stay the same.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.04}>
              <TiltCard className="gold-border-draw h-full rounded-lg border border-gold-500/14 bg-ink-950/70 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-gold-200/70">
                  Service 0{index + 1}
                </p>
                <h3 className="mt-5 text-2xl font-semibold text-bone">{service.title}</h3>
                <p className="mt-4 leading-7 text-muted">{service.description}</p>
                <div className="mt-6 border-t border-gold-500/14 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-200/70">
                    Deliverables
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{service.deliverables}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadQualitySection() {
  return (
    <section id="lead-quality" className="relative bg-ink-950 px-5 py-24 sm:px-8 lg:py-32">
      <div className="ambient-light pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              Lead qualification standards
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              Trust comes from standards buyers can see.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              A lead is only useful when your team understands why it belongs in the pipeline. These standards make quality visible before outreach begins.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {qualificationStandards.map((standard, index) => (
            <Reveal key={standard.title} delay={index * 0.04}>
              <div className="gold-border-draw h-full rounded-lg border border-gold-500/14 bg-ink-900/72 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-gold-200/70">
                  0{index + 1}
                </p>
                <h3 className="mt-5 text-2xl font-semibold text-bone">{standard.title}</h3>
                <p className="mt-4 leading-7 text-muted">{standard.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}>
          <div className="mt-12 overflow-hidden rounded-lg border border-gold-500/18 bg-ink-900/72">
            <div className="border-b border-gold-500/14 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
                Lead scoring model
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-bone">
                Every prospect gets a fit score, and the score sets the band
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Each record is scored against the criteria you agreed, and the score decides which
                band it lands in — so &ldquo;high priority&rdquo; means a number you can check, not
                a label someone assigned by feel.
              </p>
            </div>
            <div className="grid divide-y divide-gold-500/12 md:grid-cols-3 md:divide-x md:divide-y-0">
              {leadTiers.map((tier) => (
                <div key={tier.tier} className="p-6">
                  <p className="text-sm font-semibold text-gold-200">{tier.tier}</p>
                  <h4 className="mt-3 text-xl font-semibold text-bone">{tier.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-muted">{tier.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DifferentiatorsSection() {
  return (
    <section id="why-us" className="relative bg-ink-950 px-5 py-24 sm:px-8 lg:py-32">
      <div className="ambient-light pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
                Why B2B Lead Growth
              </p>
              <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
                A pipeline you control, with quality you can see.
              </h2>
            </div>
            <p className="text-lg leading-8 text-muted">
              A lot of &ldquo;lead gen&rdquo; means bulk lists, templated blasts sent in your name, and numbers you can&rsquo;t verify. This is built the opposite way: you stay in control, you see the quality, and the reporting stays honest.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {differentiators.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <TiltCard className="gold-border-draw h-full rounded-lg border border-gold-500/14 bg-ink-950/70 p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-gold-500/35 text-sm text-gold-200">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-bone">{item.title}</h3>
                    <p className="mt-3 leading-7 text-muted">{item.body}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderSection() {
  const { openIntake } = useIntake();

  return (
    <section id="founder" className="relative bg-ink-950 px-5 py-24 sm:px-8 lg:py-32">
      <div className="ambient-light pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              How the work actually gets done
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              An AI-run system, with a person accountable for it.
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-muted">
              <p>
                We&rsquo;d rather tell you this up front than let you find out later: the research,
                scoring, writing, follow-up, and reply handling are run by an AI system, not by a
                room of junior staff. That&rsquo;s precisely why every prospect arrives with a
                public source citation and a specific reason to reach out — consistently, on every
                record, not just when someone has time.
              </p>
              <p>
                It is not left unattended. Every draft is independently checked before it can be
                sent — cited, on-profile, compliant, not over-promising — against hard automated
                gates for citations, opt-out suppression, duplicates, and daily sending caps, and
                any lane that starts behaving oddly can be stopped outright. Nothing reaches a
                prospect until <span className="text-bone/90">you</span> have approved the
                targeting, the messaging pattern, and the first batch it goes out in.
              </p>
              <p>
                And a person stands behind it: {founderName}, the founder — the one who takes
                your call, answers for the numbers, and is who you talk to when something needs to
                change. Not an account manager, and not a rotating queue.
              </p>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => openIntake()}
                className="link-wipe inline-flex min-h-11 items-center text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
              >
                Book a strategy call →
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="gold-border-draw overflow-hidden rounded-lg border border-gold-500/18 bg-ink-900/72 shadow-panel">
              <div className="border-b border-gold-500/14 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
                  Who does what
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-bone">
                  No confusion about the split
                </h3>
              </div>
              <div className="divide-y divide-gold-500/12">
                <div className="px-5 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-200/70">
                    We run
                  </p>
                </div>
                {systemHandles.map((item) => (
                  <div key={item.title} className="grid grid-cols-[auto_1fr] gap-4 p-5">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-gold-500/32 text-xs text-gold-200"
                    >
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-bone">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                    </div>
                  </div>
                ))}
                <div className="px-5 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-200/70">
                    You keep
                  </p>
                </div>
                {youHandle.map((item) => (
                  <div key={item.title} className="grid grid-cols-[auto_1fr] gap-4 p-5">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-gold-500/32 text-xs text-gold-200"
                    >
                      →
                    </span>
                    <div>
                      <p className="font-semibold text-bone">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { openIntake } = useIntake();

  return (
    <section id="pricing" className="relative border-y border-gold-500/12 bg-ink-900 px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              Pricing
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              The smartest investment is the tier your team can actually use.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              Each tier de-risks the next: Lead Engine proves the list, Outreach Engine proves the messaging, and Appointment Engine runs the whole system through to booked calls on your calendar.
            </p>
            <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-semibold text-gold-200/90">
              <span>Flat monthly fee</span>
              <span aria-hidden="true" className="text-gold-500/60">·</span>
              <span>No setup fee</span>
              <span aria-hidden="true" className="text-gold-500/60">·</span>
              <span>Month-to-month, 14 days&rsquo; notice</span>
              <span aria-hidden="true" className="text-gold-500/60">·</span>
              <span>Everything we build is yours to keep</span>
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.08}>
              <TiltCard
                className={`gold-border-draw relative flex h-full flex-col rounded-lg border p-6 shadow-panel ${
                  plan.featured
                    ? "border-gold-500/65 bg-ink-850 lg:-mt-5 lg:min-h-[720px]"
                    : "border-gold-500/16 bg-ink-950/72 lg:mt-8"
                }`}
              >
                {plan.featured ? (
                  <div className="mb-5 inline-flex w-fit rounded-sm border border-gold-500/45 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-200">
                    Recommended
                  </div>
                ) : null}
                <div className="border-b border-gold-500/14 pb-6">
                  <h3 className="font-display text-4xl text-bone">{plan.name}</h3>
                  <p className="mt-5 text-5xl font-semibold text-bone">
                    <CountUp prefix="$" value={plan.price} />
                    <span className="text-lg font-normal text-muted">/mo</span>
                  </p>
                  <p className="mt-4 font-semibold text-gold-200">{plan.volume}</p>
                  {/* The ceiling is part of the price. `capacity` was defined on every plan and
                      rendered nowhere on this page, so the buyer met the number only on /pricing
                      - or after signing. Quoting a tier without its ceiling reads as unlimited. */}
                  <p className="mt-2 text-sm text-muted">{plan.capacity}</p>
                </div>
                <div className="space-y-6 py-7">
                  <PlanField label="Best for" value={plan.bestFor} />
                  <PlanField label="Includes" value={plan.includes} />
                  <PlanField label="Excludes/guardrails" value={plan.guardrails} />
                </div>
                <MagneticAnchor
                  href="#contact"
                  onClick={(event) => {
                    event.preventDefault();
                    openIntake(plan.name);
                  }}
                  className={`mt-auto inline-flex min-h-12 items-center justify-center rounded-sm border px-5 font-semibold ${
                    plan.featured
                      ? "border-gold-500/70 bg-gold-sheen text-ink-950 shadow-gold"
                      : "border-gold-500/38 text-gold-200 hover:bg-gold-500/8"
                  }`}
                  data-cursor-label="Open"
                >
                  {plan.cta}
                </MagneticAnchor>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-7 text-bone/85">
            A lower-risk way to build pipeline before you commit to hiring: every tier costs less
            than a full-time SDR — no salary, tooling, ramp time, or long-term headcount — so you
            can find out whether outbound works for your market first.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-9 rounded-lg border border-gold-500/20 bg-ink-950/72 p-5 text-center text-sm leading-6 text-muted">
            <span className="font-semibold text-gold-200">Disclaimer:</span> {disclaimer}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FrameworkSection() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 sm:px-8 lg:py-32">
      <div className="ambient-light pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <Reveal>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              Reporting and evaluation
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              Measure what matters before you scale.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-xl leading-9 text-muted">
              A <CountUp value={90} />-day review window turns lead generation from a list purchase into a learning system.
            </p>
            <p className="mt-4 leading-7 text-muted">
              Track lead quality, pipeline movement, and response signals, then decide whether the
              system is worth scaling — on your own numbers, against your own deal size. We
              don&rsquo;t model your return for you, because we have no way to know it.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {framework.map((item, index) => (
            <Reveal key={item.period} delay={index * 0.07}>
              <TiltCard className="gold-border-draw h-full rounded-lg border border-gold-500/15 bg-ink-900/72 p-6">
                <p className="text-sm font-semibold text-gold-200">{item.period}</p>
                <h3 className="mt-5 text-2xl font-semibold text-bone">{item.title}</h3>
                <p className="mt-4 leading-7 text-muted">{item.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}>
          <div className="mt-12 grid gap-6 rounded-lg border border-gold-500/18 bg-ink-900/72 p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
                Client expectations
              </p>
              <p className="mt-4 leading-7 text-muted">
                {brandName} owns targeting, research quality, the writing, the sending and
                follow-up on the outreach tiers, and honest reporting. You approve the messaging,
                own the offer, take the calls, close, and confirm what actually happened. That
                clarity keeps the partnership honest.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
                Reporting dashboard
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {reportingItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-sm border border-gold-500/16 bg-ink-950/58 px-4 py-3 text-sm text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProofSection() {
  const { openIntake } = useIntake();

  return (
    <section className="relative border-y border-gold-500/12 bg-ink-900 px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <Reveal>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              Proof you can inspect
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              See the quality standard before you invest.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              We have no client case studies to show you yet, and we won&rsquo;t borrow anyone
              else&rsquo;s. What we can show you is the standard: the exact fields, scoring context,
              and citations that ship with every record. Judge that, then judge the first real list
              — one month at a time, on a month-to-month agreement either side can end on 14 days&rsquo; notice, and the work is yours to keep.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => openIntake("Lead Engine")}
                className="link-wipe inline-flex min-h-11 items-center text-sm font-semibold text-gold-200 transition-colors hover:text-gold-400"
              >
                Start with Lead Engine and see the quality →
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="group overflow-hidden rounded-lg border border-gold-500/18 bg-ink-950/78 shadow-panel">
              <div className="border-b border-gold-500/14 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-200/80">
                      Illustrative sample
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-bone">Prospect record</h3>
                  </div>
                  <span className="rounded-sm border border-gold-500/35 px-3 py-1 text-xs text-gold-200">
                    Example format
                  </span>
                </div>
              </div>
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950/42 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="origin-center transition-transform duration-500 group-hover:scale-[1.018]">
                  <SampleRow label="Company" value="Anonymized business record" />
                  <SampleRow label="Contact" value="Relevant buyer role or influence point mapped" />
                  <SampleRow label="Website" value="Checked and cited" />
                  <SampleRow label="Industry / location" value="Company field prepared for filtering" />
                  <SampleRow label="Contact path" value="Email, phone, or LinkedIn/profile when available" />
                  <SampleRow label="Source/confidence" value="Verification status or data confidence noted" />
                  <SampleRow label="Priority tier" value="Tier A / Tier B / Tier C (illustrative)" />
                  <SampleRow label="Fit reason" value="Short explanation for why the lead belongs in the campaign" />
                  <SampleRow label="Outreach angle" value="Suggested angle tied to segment context" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="bg-ink-950 px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
              FAQ
            </p>
            <h2 className="font-display text-4xl leading-tight text-bone sm:text-5xl">
              Clear answers before you commit.
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 divide-y divide-gold-500/12 border-y border-gold-500/12">
          {/* Every question AND its answer render open by default - no <details>, accordion or
              expander. Answers must be readable (and crawlable) without interaction, which is
              also what keeps the FAQPage JSON-LD in app/page.tsx honest: structured data may
              only mirror text a visitor can actually see. Re-collapsing this is a regression:
              it was removed once for that reason and came back. */}
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={Math.min(index, 4) * 0.05}>
              <div className="py-6">
                <h3 className="text-xl font-semibold text-bone">{faq.question}</h3>
                <p className="mt-4 max-w-3xl leading-7 text-muted">{faq.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-8 rounded-lg border border-gold-500/18 bg-ink-900/70 p-5 text-sm leading-6 text-muted">
            <span className="font-semibold text-gold-200">Disclaimer:</span> {disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { openIntake } = useIntake();

  return (
    <section id="contact" className="relative overflow-hidden border-y border-gold-500/12 bg-ink-900 px-5 py-24 sm:px-8 lg:py-32">
      <div className="ambient-light pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">
            Stop chasing poor-fit prospects
          </p>
          <h2 className="font-display text-5xl leading-tight text-bone sm:text-6xl">
            Put right-fit prospects in front of your sales team.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            Every week spent chasing poor-fit prospects is sales attention you cannot recover.
            Book a free {callLengthMinutes}-minute call to define your ideal customer and find
            the tier that fits your market. You&rsquo;ll leave with a short written lead audit —
            a few specific observations and one next step — and it&rsquo;s yours to keep whether
            or not we work together.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticAnchor
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                openIntake();
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-gold-500/70 bg-gold-sheen px-7 font-semibold text-ink-950 shadow-gold"
              data-cursor-label="Open"
            >
              Book a Lead Strategy Call Now <span className="ml-3" aria-hidden="true">→</span>
            </MagneticAnchor>
            <span className="text-sm leading-6 text-muted">
              {intakeMinutes}-minute intake · then pick a time
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { openIntake } = useIntake();

  return (
    <footer className="bg-ink-950 px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-gold-500/12 pt-8 text-sm text-muted md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-xl text-gold-200">{brandName}</p>
          <button
            type="button"
            onClick={() => openIntake()}
            className="link-wipe mt-2 inline-flex min-h-11 items-center text-left text-gold-200 transition-colors hover:text-gold-400"
            data-cursor-label="Open"
          >
            Book a strategy call →
          </button>
          <p className="mt-2">
            Remote across the US · currently focused on {currentFocusArea}
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} ·{" "}
            <a
              href="/privacy"
              className="inline-block py-1 transition-colors hover:text-gold-200"
            >
              Privacy Policy
            </a>
            {contactEmail ? (
              <>
                {" · "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-block py-1 transition-colors hover:text-gold-200"
                >
                  {contactEmail}
                </a>
              </>
            ) : null}
          </p>
        </div>
        {/* Guides + legal navigation. Without this the site's highest-authority page
            links to nothing but /privacy: /pricing, /terms and all four guide pages
            had zero internal inbound links, and a Terms of Service that /terms itself
            treats as binding on submission was unreachable from the page the visitor
            converts on. */}
        <nav aria-label="More from B2B Lead Growth" className="md:min-w-56">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200/80">
            Guides
          </p>
          <ul className="mt-3 space-y-1">
            {guidePages.map((page) => (
              <li key={page.slug}>
                <a
                  href={`/${page.slug}`}
                  className="inline-block py-1 transition-colors hover:text-gold-200"
                >
                  {page.navLabel}
                </a>
              </li>
            ))}
            <li>
              <a href="/terms" className="inline-block py-1 transition-colors hover:text-gold-200">
                Terms of Service
              </a>
            </li>
          </ul>
        </nav>
        <p className="max-w-xl leading-6">
          <span className="font-semibold text-gold-200">Disclaimer:</span> {disclaimer}
        </p>
      </div>
    </footer>
  );
}

function PlanField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200/70">{label}</p>
      <p className="mt-2 text-sm leading-7 text-muted">{value}</p>
    </div>
  );
}

function SampleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-3 border-b border-gold-500/10 px-5 py-4 last:border-0 sm:grid-cols-[0.42fr_0.58fr]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-200/70">{label}</p>
      <p className="text-sm leading-6 text-bone/88">{value}</p>
    </div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  // `immediate` is for ABOVE-THE-FOLD content. Every other Reveal server-renders at
  // style="opacity:0" and only becomes visible once framer-motion has hydrated and
  // the IntersectionObserver has fired. That is fine for content the visitor has to
  // scroll to, but it made the hero - the LCP element - invisible for the whole time
  // the 170 kB client bundle was downloading and parsing: on a phone the first paint
  // was a black screen with one eyebrow label. The <noscript> fallback in app/layout
  // only helps clients with scripting DISABLED, not slow ones, so it never covered
  // this. Rendering the hero unconditionally costs nothing and fixes both the bounce
  // and the Core Web Vital.
  if (immediate) {
    return <div className={className}>{children}</div>;
  }

  // `initial` and `whileInView` stay identical on the server and the client — they
  // decide the first rendered markup, so branching them on a client-only media query
  // breaks hydration. Reduced motion is honoured through the transition instead: the
  // element still reveals, it just arrives instantly with no travel.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }
      }
    >
      {children}
    </motion.div>
  );
}

function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // No resting transform. There are ~20 of these on the page, and a static
  // `perspective()` establishes a 3D rendering context that switches the card's
  // text from subpixel to grayscale antialiasing — on every touch device, where
  // the tilt can never fire anyway. `handleMove` writes the transform on demand
  // and mouse-leave clears it, so the effect is unchanged where it applies.
  function handleMove(event: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || !isFinePointer() || !ref.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
  }

  return (
    <div
      ref={ref}
      className={`${className ?? ""} transition-transform duration-300`}
      data-cursor-label="View"
      onMouseMove={handleMove}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}

function MagneticAnchor({
  children,
  className,
  strength = 0.24,
  onMouseMove,
  onMouseLeave,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  strength?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    onMouseMove?.(event);
    if (prefersReducedMotion || !isFinePointer() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function handleLeave(event: MouseEvent<HTMLAnchorElement>) {
    onMouseLeave?.(event);
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <a
      ref={ref}
      className={`${className ?? ""} transition-transform duration-200 ease-out`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </a>
  );
}

function CountUp({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setDisplay(0);
        const start = performance.now();
        const duration = 1200;
        const animate = (now: number) => {
          const elapsed = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - elapsed, 3);
          setDisplay(Math.round(value * eased));
          if (elapsed < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion, value]);

  // Two things matter here:
  //  - A fixed locale. Bare `toLocaleString()` formats with the *server's* locale
  //    during SSR and the *visitor's* on the client, so "1,500" vs "1.500" was a
  //    hydration mismatch for anyone outside en-US.
  //  - A reserved width. The counter drops to 0 and climbs back, so the digit count
  //    goes 4 -> 1 -> 4 and the adjacent "/mo" slid sideways at 48px type on all
  //    three price cards. An invisible copy of the final value holds the box.
  const format = (n: number) => n.toLocaleString("en-US");

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span aria-hidden="true" className="invisible">
        {prefix}
        {format(value)}
        {suffix}
      </span>
      <span className="absolute inset-0">
        {prefix}
        {format(display)}
        {suffix}
      </span>
    </span>
  );
}

function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 180, damping: 24, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 180, damping: 24, mass: 0.45 });
  const [state, setState] = useState({ active: false, label: "" });
  const last = useRef({ active: false, label: "" });

  useEffect(() => {
    if (prefersReducedMotion || !isFinePointer()) return;

    document.body.classList.add("has-custom-cursor");

    const handleMove = (event: globalThis.MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const element = event.target instanceof Element ? event.target.closest("[data-cursor-label], a, button") : null;
      const label =
        element?.getAttribute("data-cursor-label") ||
        (element?.tagName === "A" || element?.tagName === "BUTTON" ? "Open" : "");
      const active = Boolean(element);

      if (last.current.active !== active || last.current.label !== label) {
        last.current = { active, label };
        setState({ active, label });
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
    };
  }, [prefersReducedMotion, x, y]);

  // NOTE: do NOT return null for reduced motion. `useReducedMotion()` reads a media
  // query that only exists on the client, so the server always renders this subtree
  // while a reduced-motion client would skip it — a hydration mismatch that makes
  // React throw away and re-render the whole page for exactly the users who asked
  // for less work. globals.css already hides `.fine-cursor` under reduced motion
  // (and on coarse pointers), and the effect above never attaches its listeners,
  // so keeping the markup identical on both sides costs nothing.
  return (
    <div className="fine-cursor pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
      <motion.div
        className="fixed h-2 w-2 rounded-full bg-gold-200"
        style={{ left: x, top: y, marginLeft: -4, marginTop: -4 }}
      />
      <motion.div
        className="fixed flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/70 bg-ink-950/8 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur-sm"
        style={{
          left: springX,
          top: springY,
          marginLeft: -24,
          marginTop: -24,
          scale: state.active ? 1.55 : 1,
        }}
      >
        <span className={`transition-opacity ${state.label ? "opacity-100" : "opacity-0"}`}>
          {state.label}
        </span>
      </motion.div>
    </div>
  );
}

function useScrollProgress() {
  // A MotionValue drives the progress bar's scaleX without re-rendering the page tree.
  const progress = useMotionValue(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.set(max > 0 ? window.scrollY / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  return progress;
}

function useSmoothScroll(prefersReducedMotion: boolean) {
  useEffect(() => {
    // Lenis leaves `syncTouch` off by default, so on touch devices it smooths
    // nothing while still binding document-level listeners and running a rAF loop
    // for the whole session — pure cost on the weakest hardware. Only run it where
    // it actually does something.
    if (prefersReducedMotion || !isFinePointer()) return;

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });

    // Keep ProcessSection's ScrollTrigger (lazy-loaded) in sync with smooth scroll.
    lenis.on("scroll", () => notifyScrollTriggerUpdate?.());

    // Let the intake modal park Lenis while it is open.
    registerSmoothScroll((paused) => (paused ? lenis.stop() : lenis.start()));

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      registerSmoothScroll(null);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);
}

function useAmbientPointer(
  ref: React.RefObject<HTMLElement | null>,
  prefersReducedMotion: boolean,
) {
  useEffect(() => {
    if (prefersReducedMotion || !isFinePointer()) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;
    const apply = () => {
      frame = 0;
      ref.current?.style.setProperty("--cursor-x", `${nextX}px`);
      ref.current?.style.setProperty("--cursor-y", `${nextY}px`);
    };
    const handleMove = (event: globalThis.MouseEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion, ref]);
}
