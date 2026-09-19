import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout, { GuideSection, KeyAnswer } from "@/components/GuideLayout";
import {
  canonAsOf,
  canonGroups,
  canonRetired,
  canonStages,
  termAnchor,
  termsInGroup,
} from "@/lib/canon";
import { getGuidePage, guideJsonLd, pageMetadata } from "@/lib/pages";
import { brandName, siteUrl } from "@/lib/site";

// THE DEFINITIONS PAGE — the business's vocabulary, published from the operating system.
//
// Nothing on this page is written here. Every label, definition, "who decides" and "on record"
// line comes from lib/generated/vocabulary.ts, which the operating system generates from
// core/vocabulary.py — the same module its gates, reports and handoff records are checked
// against. So a prospect reading "qualified conversation" here, a client reading it in a
// report and the code deciding whether one exists are reading one definition.

const page = getGuidePage("definitions");

export const metadata: Metadata = pageMetadata({
  path: `/${page.slug}`,
  title: page.metaTitle,
  description: page.description,
});

const pageUrl = `${siteUrl}/${page.slug}`;
const publicGroups = canonGroups.filter((g) => g.terms.length > 0);

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    ...guideJsonLd(page)["@graph"],
    {
      "@type": "DefinedTermSet",
      "@id": `${pageUrl}#terminology`,
      name: `${brandName} definitions`,
      url: `${pageUrl}#terminology`,
      hasDefinedTerm: publicGroups.flatMap((g) =>
        termsInGroup(g.key).map((t) => ({
          "@type": "DefinedTerm",
          "@id": `${pageUrl}#${termAnchor(t.key)}`,
          name: t.label,
          description: t.definition,
          url: `${pageUrl}#${termAnchor(t.key)}`,
          inDefinedTermSet: { "@id": `${pageUrl}#terminology` },
        })),
      ),
    },
  ],
};

export default function DefinitionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <GuideLayout
        page={page}
        eyebrow="Definitions"
        intro={
          <>
            <p className="text-ink">
              These are the definitions {brandName} works to. Each term means one thing — on a
              sales call, in the service agreement, in every report a client receives, and in
              the code that decides whether something counts.
            </p>
            <p>
              They are published straight from the operating system that runs the service, so the
              words on this page are the words the code checks. When a definition changes there, it
              changes here. Current as of {formatDate(canonAsOf)}.
            </p>
            <p>
              Want to see the documents these terms describe?{" "}
              <Link href="/sample-deliverables" className="text-accent underline underline-offset-4">
                Sample deliverables
              </Link>{" "}
              shows each one, produced by the same code that produces a client&rsquo;s.
            </p>
          </>
        }
      >
        <div id="terminology">
          {publicGroups.map((g) => (
            <GuideSection key={g.key} id={g.key} title={g.title}>
              {termsInGroup(g.key).map((t) => (
                <div
                  key={t.key}
                  id={termAnchor(t.key)}
                  className="scroll-mt-24 border-t border-line pt-6 first:border-t-0 first:pt-0"
                >
                  <h3 className="font-display text-xl text-ink">{t.label}</h3>
                  <p className="mt-2 text-ink">{t.definition}</p>
                  <dl className="mt-3 space-y-2 text-base leading-7">
                    {t.measure ? (
                      <div>
                        <dt className="inline font-semibold text-ink">How it is measured: </dt>
                        <dd className="inline">{t.measure}</dd>
                      </div>
                    ) : null}
                    {t.steps.length ? (
                      <div>
                        <dt className="inline font-semibold text-ink">The steps, in order: </dt>
                        <dd className="inline">{t.steps.join("; ")}.</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="inline font-semibold text-ink">Who decides: </dt>
                      <dd className="inline">{t.decidedBy}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">On record before it counts: </dt>
                      <dd className="inline">{t.evidence}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-ink">Applies to: </dt>
                      <dd className="inline">
                        {t.plans.length ? t.plans.join(" and ") : `${brandName}'s own sales, not a client plan`}
                      </dd>
                    </div>
                    {t.aka.length ? (
                      <div>
                        <dt className="inline font-semibold text-ink">Also read as: </dt>
                        <dd className="inline">{t.aka.join(", ")}</dd>
                      </div>
                    ) : null}
                    {t.notSameAs.map((n) => (
                      <div key={n.key}>
                        <dt className="inline font-semibold text-ink">
                          Not the same as{" "}
                          <Link href={`#${termAnchor(n.key)}`} className="text-accent underline underline-offset-4">
                            {n.label}
                          </Link>
                          :{" "}
                        </dt>
                        <dd className="inline">{n.why}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </GuideSection>
          ))}
        </div>

        <GuideSection id="stages" title="The stages a client sees in a report">
          <KeyAnswer>
            Every opportunity in a client report sits at one of these stages, named the same way
            everywhere it appears.
          </KeyAnswer>
          <ul className="list-disc space-y-1 pl-5">
            {canonStages.map((s) => (
              <li key={s.stage}>{s.label}</li>
            ))}
          </ul>
        </GuideSection>

        <GuideSection id="retired" title="Names we no longer use">
          <p>
            If you read an older page, email or proposal from us, you may meet one of these. Each
            now means the term shown, or nothing at all.
          </p>
          <ul className="space-y-3">
            {canonRetired.map((r) => (
              <li key={`${r.term}-${r.context}`}>
                <span className="font-semibold text-ink">
                  {r.term}
                  {r.context ? ` (${r.context})` : ""}
                </span>{" "}
                →{" "}
                {r.replacedBy.length ? (
                  r.replacedBy.map((x, i) => (
                    <span key={x.key}>
                      {i ? " or " : ""}
                      <Link href={`#${termAnchor(x.key)}`} className="text-accent underline underline-offset-4">
                        {x.label}
                      </Link>
                    </span>
                  ))
                ) : (
                  <span>no current equivalent</span>
                )}
                . {r.why}
              </li>
            ))}
          </ul>
        </GuideSection>
      </GuideLayout>
    </>
  );
}
