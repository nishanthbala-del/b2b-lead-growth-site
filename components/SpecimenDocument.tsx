import type { ReactNode } from "react";

// Renders one specimen from lib/generated/specimens.ts — a document the operating system's
// production code rendered (a handoff record, an opportunity brief, the client report) or the
// research record in the shape the send gate parses.
//
// The documents are plain Markdown-like text, and they use a small, fixed subset of it:
// headings (#, ##), paragraphs, "- " bullets, "> " quotes, pipe tables, "---" rules, **bold**,
// and "Field: value" header lines. This renderer handles exactly that subset and builds React
// nodes — never HTML strings — so nothing in a specimen can inject markup.
//
// A [bracketed placeholder] is set in its own style, so a reader can see at a glance which parts
// of the document would carry a real client's or a real buyer's details.

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  // **bold** first, then [placeholders] inside each run.
  text.split(/(\*\*[^*]+\*\*)/g).forEach((part, i) => {
    if (!part) return;
    const bold = part.startsWith("**") && part.endsWith("**") && part.length > 4;
    const body = bold ? part.slice(2, -2) : part;
    const pieces = body.split(/(\[[^\]]+\])/g).map((p, j) =>
      /^\[[^\]]+\]$/.test(p) ? (
        <span key={`${keyBase}-${i}-${j}`} className="rounded bg-accent/10 px-1 font-medium text-accent">
          {p}
        </span>
      ) : (
        p
      ),
    );
    out.push(
      bold ? (
        <strong key={`${keyBase}-${i}`} className="font-semibold text-ink">
          {pieces}
        </strong>
      ) : (
        <span key={`${keyBase}-${i}`}>{pieces}</span>
      ),
    );
  });
  return out;
}

function tableRows(lines: string[]): string[][] {
  return lines
    .filter((l) => !/^\|\s*-{3,}/.test(l))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
}

export default function SpecimenDocument({ body, label }: { body: string; label: string }) {
  const lines = body.replace(/\s+$/, "").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const key = () => `b${k++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (line.trim() === "---") {
      blocks.push(<hr key={key()} className="my-4 border-line" />);
      i += 1;
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const cls =
        level === 1
          ? "font-display text-xl text-ink sm:text-2xl"
          : "mt-2 font-display text-lg text-ink";
      blocks.push(
        <p key={key()} role="heading" aria-level={level + 3} className={cls}>
          {inline(heading[2], `h${k}`)}
        </p>,
      );
      i += 1;
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const [head, ...rest] = tableRows(rows);
      blocks.push(
        <div key={key()} className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr>
                {head.map((c, j) => (
                  <th key={j} scope="col" className="border-b border-line py-2 pr-3 font-semibold text-ink">
                    {inline(c, `th${k}-${j}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rest.map((r, ri) => (
                <tr key={ri} className="align-top">
                  {r.map((c, j) => (
                    <td key={j} className="border-b border-line py-2 pr-3 text-subtle">
                      {inline(c, `td${k}-${ri}-${j}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (line.startsWith(">")) {
      const quoted: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) quoted.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(
        <blockquote key={key()} className="space-y-2 border-l-2 border-accent/40 pl-4 text-subtle">
          {quoted
            .join("\n")
            .split(/\n{2,}/)
            .map((para, j) => (
              <p key={j} className="whitespace-pre-line">
                {inline(para, `q${k}-${j}`)}
              </p>
            ))}
        </blockquote>,
      );
      continue;
    }
    if (/^\s*- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && (/^\s*- /.test(lines[i]) || (!lines[i].trim() && /^\s*- /.test(lines[i + 1] ?? "")))) {
        if (lines[i].trim()) items.push(lines[i].replace(/^\s*- /, ""));
        i += 1;
      }
      blocks.push(
        <ul key={key()} className="list-disc space-y-1 pl-5 text-subtle">
          {items.map((it, j) => (
            <li key={j}>{inline(it, `li${k}-${j}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|>|\||\s*- |---$)/.test(lines[i])) {
      para.push(lines[i++]);
    }
    blocks.push(
      <p key={key()} className="whitespace-pre-line text-subtle">
        {inline(para.join("\n"), `p${k}`)}
      </p>,
    );
  }

  return (
    <figure className="rounded-lg border border-line bg-surface p-5 sm:p-6">
      <figcaption className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {label}
      </figcaption>
      <div className="space-y-3 text-[0.95rem] leading-7">{blocks}</div>
    </figure>
  );
}
