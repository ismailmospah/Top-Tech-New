/* ============================================================
   TOP TECH — sitemap generator
   ------------------------------------------------------------
   Writes sitemap.xml from the route table. Every entry carries
   reciprocal xhtml:link hreflang annotations (self + counterpart
   + x-default), which is what Google expects for a bilingual site.

       node tools/build-sitemap.mjs

   Only canonical, indexable URLs belong here — no redirects, no
   .html duplicates, no utility pages.
   ============================================================ */

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, url } from "./routes.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lastmod = new Date().toISOString().slice(0, 10);

function entry(loc, route) {
  const en = url(route.en.path);
  const ar = url(route.ar.path);
  return `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${en}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${ar}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}

const body = ROUTES.flatMap((route) => [
  entry(url(route.en.path), route),
  entry(url(route.ar.path), route),
]).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

writeFileSync(resolve(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`built sitemap.xml — ${ROUTES.length * 2} URLs`);
