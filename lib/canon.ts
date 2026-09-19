// The operating system's canon, as this site reads it.
//
// lib/generated/vocabulary.ts and lib/generated/specimens.ts are GENERATED in the operating
// system (scripts/export_site_canon.py) from the modules the business actually runs on:
// core/vocabulary.py — every business term, defined once — and core/specimens.py — what a
// client receives, rendered by the production code with placeholders only. This file only
// shapes them for pages; it never restates a definition. A definition changes in the operating
// system, is re-exported, and scripts/check_cross_repo.py fails the moment the two differ.

import { specimens } from "./generated/specimens.ts";
import { vocabulary } from "./generated/vocabulary.ts";

export type CanonTerm = (typeof vocabulary)["terms"][number];
export type Specimen = (typeof specimens)["specimens"][number];

export const canonTerms: readonly CanonTerm[] = vocabulary.terms;
export const canonGroups = vocabulary.groups;
export const canonStages = vocabulary.stages;
export const canonRetired = vocabulary.retired;
export const canonAsOf = vocabulary.asOf;
export const specimenList: readonly Specimen[] = specimens.specimens;
/** The one real account shown on the homepage and as the first specimen — one text, from the OS. */
export const canonAccount = specimens.account;
export const specimenDisclosure = specimens.disclosure;

/** A term's anchor on /definitions: `term-<key>`, with the machine key's underscores as hyphens. */
export function termAnchor(key: string): string {
  return `term-${key.replace(/_/g, "-")}`;
}

export function canonTerm(key: string): CanonTerm {
  const t = canonTerms.find((x) => x.key === key);
  if (!t) throw new Error(`Term not in the operating system's vocabulary: ${key}`);
  return t;
}

export function termsInGroup(group: string): CanonTerm[] {
  const keys: readonly string[] = canonGroups.find((g) => g.key === group)?.terms ?? [];
  return keys.map((k) => canonTerm(k));
}

/** The retired-name detectors the operating system runs on its own surfaces, for this site's copy. */
export function retiredDetectors(): { term: string; context: string; re: RegExp }[] {
  return canonRetired
    .filter((r) => r.pattern)
    .map((r) => ({ term: r.term, context: r.context, re: new RegExp(r.pattern, "i") }));
}
