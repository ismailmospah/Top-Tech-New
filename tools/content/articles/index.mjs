/* Insights articles. Order in the index is decided at render time by `published`. */

import cost from "./digital-marketing-cost-saudi-arabia.mjs";
import choose from "./how-to-choose-a-marketing-agency.mjs";
import freelancer from "./agency-vs-freelancer.mjs";
import socialCost from "./social-media-management-cost.mjs";
import videoCost from "./video-production-cost.mjs";
import adsWorking from "./is-your-advertising-working.mjs";
import motion from "./what-is-motion-graphics.mjs";
import brandingVsMarketing from "./branding-vs-marketing.mjs";
import mistakes from "./common-marketing-mistakes.mjs";
import fullService from "./when-you-need-a-full-service-agency.mjs";
import startup from "./startup-marketing-strategy.mjs";
import realEstate from "./real-estate-marketing.mjs";

export const ARTICLES = [
  cost,
  choose,
  socialCost,
  videoCost,
  adsWorking,
  motion,
  brandingVsMarketing,
  freelancer,
  mistakes,
  fullService,
  startup,
  realEstate,
];

/* fail loudly rather than shipping a half-written article */
const slugs = new Set();
for (const a of ARTICLES) {
  for (const key of ["slug", "published", "services", "related"]) {
    if (a[key] === undefined) throw new Error(`${a.slug}: missing ${key}`);
  }
  if (slugs.has(a.slug)) throw new Error(`duplicate slug: ${a.slug}`);
  slugs.add(a.slug);

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
