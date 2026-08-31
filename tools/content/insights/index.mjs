/* Insights articles, newest first is decided at render time by `published`. */

import cost from "./digital-marketing-cost-saudi-arabia.mjs";
import choose from "./how-to-choose-a-marketing-agency.mjs";
import freelancer from "./agency-vs-freelancer.mjs";

export const ARTICLES = [cost, choose, freelancer];

/* fail loudly rather than shipping a half-written article */
for (const a of ARTICLES) {
  for (const key of ["slug", "published", "services", "related"]) {
    if (a[key] === undefined) throw new Error(`${a.slug}: missing ${key}`);
  }
  for (const lang of ["en", "ar"]) {
    const c = a[lang];
    if (!c) throw new Error(`${a.slug}: missing ${lang}`);
    for (const key of ["title", "h1", "description", "excerpt", "lead", "sections"]) {
      if (!c[key]) throw new Error(`${a.slug}.${lang}: missing ${key}`);
    }
    const ids = new Set();
    for (const s of c.sections) {
      if (!s.id || !s.h) throw new Error(`${a.slug}.${lang}: a section is missing id or heading`);
      if (ids.has(s.id)) throw new Error(`${a.slug}.${lang}: duplicate section id ${s.id}`);
      ids.add(s.id);
      if (!s.body && !s.list && !s.steps) throw new Error(`${a.slug}.${lang}: section ${s.id} is empty`);
    }
    if (c.faq?.length && !c.faqTitle) throw new Error(`${a.slug}.${lang}: faq without faqTitle`);
  }
  for (const slug of a.related) {
    if (!ARTICLES.some((x) => x.slug === slug)) throw new Error(`${a.slug}: unknown related article ${slug}`);
  }
}

/* section ids must match across languages so #anchors survive a language switch */
for (const a of ARTICLES) {
  const en = a.en.sections.map((s) => s.id).join(",");
  const ar = a.ar.sections.map((s) => s.id).join(",");
  if (en !== ar) throw new Error(`${a.slug}: section ids differ between languages`);
}
