/* ============================================================
   TOP TECH — internal link and metadata checker
   ------------------------------------------------------------
   Walks every committed HTML page and verifies that each internal
   link resolves the way Vercel will resolve it, that canonical and
   hreflang are self-consistent, and that each page has exactly one h1.

       node tools/dev-server.mjs &
       node tools/check-links.mjs
   ============================================================ */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, relative } from "node:path";
import { ROOT } from "./i18n.mjs";
import { SITE } from "./routes.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4173";
const SKIP = new Set(["node_modules", ".git", "tools", "docs", "assets"]);

function htmlFiles(dir = ROOT, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name) || name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) htmlFiles(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

const pages = htmlFiles().sort();
const problems = [];
const seen = new Map(); // href -> status
let linkCount = 0;

async function status(path) {
  if (seen.has(path)) return seen.get(path);
  const res = await fetch(BASE + path, { redirect: "manual" });
  seen.set(path, res.status);
  return res.status;
}

for (const file of pages) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, "utf8");

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) problems.push(`${rel}: ${h1s.length} <h1> elements`);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) problems.push(`${rel}: no canonical`);

  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  const langs = alts.map((m) => m[1]);
  for (const need of ["en", "ar", "x-default"]) {
    if (!langs.includes(need)) problems.push(`${rel}: missing hreflang ${need}`);
  }
  // the canonical must appear among its own alternates
  if (canonical && !alts.some((m) => m[2] === canonical)) {
    problems.push(`${rel}: canonical ${canonical} is not self-referenced in hreflang`);
  }

  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    let href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) {
      // absolute links to our own domain should be relative internally
      if (href.startsWith(SITE) && !html.slice(Math.max(0, m.index - 220), m.index).includes("rel=")) {
        problems.push(`${rel}: absolute self-link in body — ${href}`);
      }
      continue;
    }
    if (!href.startsWith("/")) {
      problems.push(`${rel}: relative link "${href}" breaks in subdirectories`);
      continue;
    }
    const path = href.split("#")[0];
    if (!path) continue;
    linkCount += 1;
    const code = await status(path);
    if (code >= 400) problems.push(`${rel}: ${href} → ${code}`);
    if (code >= 300 && code < 400) problems.push(`${rel}: ${href} → ${code} (internal link should not redirect)`);
  }
}

console.log(`checked ${pages.length} pages, ${linkCount} internal links, ${seen.size} unique targets`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log("  " + p);
  process.exitCode = 1;
} else {
  console.log("no problems found");
}
