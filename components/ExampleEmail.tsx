// A worked example of a first email, shown on the audience pages and the cold-email guide.
//
// EVERY EXAMPLE IS A TEMPLATE, NEVER A SENT MESSAGE. The bracketed fields are what a contractor
// fills in, and only with something true: a building, a person and a reason the reader can
// check. No example names a real company, a real person or a real result, because this site
// has no client results to show and will not dress a template up as one.

export default function ExampleEmail({
  label,
  subject,
  body,
  signoff,
}: {
  /** What the example is for, e.g. "Example: a first email to a property manager". */
  label: string;
  subject: string;
  /** One entry per paragraph. */
  body: string[];
  /** The signature block, one line each. The postal address and the opt-out line are not
      decoration: US law requires both on a commercial email (see /commercial-hvac-cold-email). */
  signoff: string[];
}) {
  return (
    <figure className="mt-6 rounded-lg border border-line bg-surface p-5 sm:p-6">
      <figcaption className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{label}</figcaption>
      <p className="mt-4 text-sm leading-6 text-subtle">
        <span className="font-semibold text-ink">Subject:</span> {subject}
      </p>
      <div className="mt-4 space-y-3 leading-7 text-ink/90">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-4 border-t border-line pt-3 text-sm leading-6 text-subtle">
        {signoff.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </figure>
  );
}
