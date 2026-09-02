/* The six services, in the order they appear on the homepage. */

import marketingStrategy from "./marketing-strategy.mjs";
import socialMediaMarketing from "./social-media-marketing.mjs";
import contentManagement from "./content-management.mjs";
import brandingDesign from "./branding-design.mjs";
import motionVideo from "./motion-video.mjs";
import mediaBuying from "./media-buying.mjs";

export const SERVICES = [
  marketingStrategy,
  socialMediaMarketing,
  contentManagement,
  brandingDesign,
  motionVideo,
  mediaBuying,
];

/* fail loudly rather than shipping a half-written page */
const REQUIRED = ["definition", "audience", "problems", "offer", "process", "deliverables", "faq"];
for (const s of SERVICES) {
  for (const lang of ["en", "ar"]) {
    const c = s[lang];
    if (!c) throw new Error(`${s.slug}: missing ${lang}`);
    for (const key of ["name", "short", "title", "description", "h1", "lead"]) {
      if (!c[key]) throw new Error(`${s.slug}.${lang}: missing ${key}`);
    }
    for (const key of REQUIRED) {
      const section = c.sections?.[key];
      if (!section?.h) throw new Error(`${s.slug}.${lang}: missing section ${key}`);
      const body = section.items || section.body;
      if (!body?.length) throw new Error(`${s.slug}.${lang}: section ${key} is empty`);
    }
  }
  for (const slug of s.related) {
    if (!SERVICES.some((x) => x.slug === slug)) throw new Error(`${s.slug}: unknown related slug ${slug}`);
  }
}
