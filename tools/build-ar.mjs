/* ============================================================
   TOP TECH — Arabic page generator
   ------------------------------------------------------------
   Builds the Arabic pages under /ar from the English source files
   plus the shared dictionary in lang.js. Nothing here runs on the
   website or on Vercel: it is a local authoring tool. Run it after
   editing an English page or a translation, then commit the output.

       node tools/build-ar.mjs

   Why generate instead of hand-writing the Arabic pages:
   every translatable node in the English markup already carries a
   data-i18n key, so the Arabic page can be produced mechanically.
   That guarantees both languages keep exactly the same structure,
   classes and animation hooks — the design can never drift apart.
   ============================================================ */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, SITE, url } from "./routes.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------- load the shared dictionary out of lang.js ---------- */
function loadI18N() {
  const src = readFileSync(resolve(ROOT, "lang.js"), "utf8");
  const start = src.indexOf("const I18N = {");
  const end = src.indexOf("\n};", start);
  if (start === -1 || end === -1) throw new Error("could not locate I18N in lang.js");
  const body = src.slice(start + "const I18N = ".length, end + 3);
  return new Function(`return ${body}`)();
}
const I18N = loadI18N();

/* ---------- tiny HTML helpers (no dependencies) ---------- */

/* index of the closing tag that matches an opening tag starting at `from` */
function findClose(html, tag, from) {
  const re = new RegExp(`<(/)?${tag}\\b`, "gi");
  re.lastIndex = from;
  let depth = 1;
  let m;
  while ((m = re.exec(html))) {
    if (m[1]) {
      depth -= 1;
      if (depth === 0) return m.index;
    } else {
      depth += 1;
    }
  }
  return -1;
}

const escapeText = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* swap every [data-i18n] element's content for its Arabic translation */
function translate(html, lang) {
  const re = /<([a-zA-Z0-9]+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    const [full, tag, pre, key, post] = m;
    const entry = I18N[key];
    if (!entry || entry[lang] === undefined) continue;
    const openEnd = m.index + full.length;
    const close = findClose(html, tag, openEnd);
    if (close === -1) throw new Error(`unbalanced <${tag}> for data-i18n="${key}"`);
    const asHtml = /\bdata-i18n-html\b/.test(pre + post);
    out += html.slice(last, openEnd) + (asHtml ? entry[lang] : escapeText(entry[lang]));
    last = close;
    re.lastIndex = close;
  }
  return out + html.slice(last);
}

/* rebuild the marquee rows in Arabic, using the same repeat count as lang.js */
function translateMarquees(html, lang) {
  return html.replace(
    /(<div[^>]*\sdata-marquee="([^"]+)"[^>]*>)[\s\S]*?(<\/div>)/g,
    (full, open, key, close) => {
      const entry = I18N[key];
      if (!entry) return full;
      const group = (entry[lang] + " ✳ ").repeat(4);
      return `${open}<span>${group}</span><span>${group}</span>${close}`;
    }
  );
}

/* attributes that carry human-readable English and need translating too */
const ATTR_TEXT = {
  "We make brands grow.": "نُنمّي العلامات.",
  "Top Tech home": "توب تك — الصفحة الرئيسية",
  Primary: "التنقل الرئيسي",
  "Switch language": "تغيير اللغة",
};
function translateAttributes(html) {
  for (const [en, ar] of Object.entries(ATTR_TEXT)) {
    html = html.split(`aria-label="${en}"`).join(`aria-label="${ar}"`);
  }
  return html;
}

/* ---------- structured data: derive the Arabic graph from the English one ---------- */
const SERVICE_AR = {
  "Marketing Strategy": "استراتيجية التسويق",
  "Social Media Marketing": "التسويق عبر وسائل التواصل الاجتماعي",
  "Content Management": "إدارة المحتوى وصناعته",
  "Branding & Design": "الهوية البصرية والتصميم",
  "Motion & Video": "الموشن جرافيك وإنتاج الفيديو",
  "Media Buying": "الإعلانات المدفوعة وشراء المساحات",
};
const ORG_DESC_AR =
  "توب تك وكالة تسويق متكاملة تخدم السعودية ومصر. بدأت كاستوديو موشن جرافيك، وتقدّم اليوم استراتيجية التسويق والتسويق عبر وسائل التواصل الاجتماعي وإدارة المحتوى والهوية البصرية والتصميم وإنتاج الفيديو والموشن جرافيك والإعلانات المدفوعة.";

function arabicGraph(enJson, page) {
  const doc = JSON.parse(enJson);
  for (const node of doc["@graph"]) {
    const type = node["@type"];

    if (type === "Organization") {
      node.description = ORG_DESC_AR;
      if (node.hasOfferCatalog) {
        node.hasOfferCatalog.name = "خدمات التسويق";
        for (const offer of node.hasOfferCatalog.itemListElement) {
          const en = offer.itemOffered.name;
          if (SERVICE_AR[en]) offer.itemOffered.name = SERVICE_AR[en];
        }
      }
    }

    if (type === "WebPage" || type === "ContactPage") {
      node["@id"] = `${page.url}#webpage`;
      node.url = page.url;
      node.name = page.title;
      node.description = page.description;
      node.inLanguage = "ar";
      if (node.breadcrumb) node.breadcrumb["@id"] = `${page.url}#breadcrumb`;
    }

    if (type === "BreadcrumbList") {
      node["@id"] = `${page.url}#breadcrumb`;
      node.itemListElement = node.itemListElement.map((li, i) => ({
        ...li,
        name: page.breadcrumb[i].name,
        item: page.breadcrumb[i].item,
      }));
    }
  }
  return JSON.stringify(doc, null, 2)
    .split("\n")
    .map((line) => "  " + line)
    .join("\n");
}

/* ---------- the Arabic <head> ---------- */
function arabicHead(page) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <link rel="canonical" href="${page.url}" />
  <link rel="alternate" hreflang="ar" href="${page.url}" />
  <link rel="alternate" hreflang="en" href="${page.enUrl}" />
  <link rel="alternate" hreflang="x-default" href="${page.enUrl}" />

  <!-- Facebook Domain Verification -->
  <meta name="facebook-domain-verification" content="jgs5un48jog44hoh5u0pxr8ckapcc9" />

  <link rel="icon" href="/assets/logo-original.svg" type="image/svg+xml" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Top Tech" />
  <meta property="og:locale" content="ar_AR" />
  <meta property="og:locale:alternate" content="en_US" />
  <meta property="og:url" content="${page.url}" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:image" content="${SITE}/assets/og-image.jpg" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="720" />
  <meta property="og:image:alt" content="توب تك — وكالة تسويق في السعودية ومصر" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${page.title}" />
  <meta name="twitter:description" content="${page.description}" />
  <meta name="twitter:image" content="${SITE}/assets/og-image.jpg" />
  <meta name="twitter:image:alt" content="توب تك — وكالة تسويق في السعودية ومصر" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Space+Grotesk:wght@300..700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/style.css" />`;
}

/* ---------- build one page ---------- */
const HEAD_END = '<link rel="stylesheet" href="/style.css" />';

function build(page) {
  let html = readFileSync(resolve(ROOT, page.source), "utf8");

  // 1 — replace the English head block (everything up to the stylesheet link)
  const cut = html.indexOf(HEAD_END);
  if (cut === -1) throw new Error(`stylesheet marker missing in ${page.source}`);
  const enHead = html.slice(0, cut + HEAD_END.length);
  html = arabicHead(page) + html.slice(cut + HEAD_END.length);

  // 2 — swap the structured data for its Arabic counterpart
  const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
  const found = html.match(ld);
  if (!found) throw new Error(`no JSON-LD in ${page.source}`);
  html = html.replace(
    ld,
    () => `<script type="application/ld+json">\n${arabicGraph(found[1], page)}\n  </script>`
  );

  // 3 — translate the body
  html = translate(html, "ar");
  html = translateMarquees(html, "ar");
  html = translateAttributes(html);

  // 4 — Arabic typography class on <body>
  html = html.replace(/<body([^>]*)>/, (full, attrs) =>
    /\bclass="/.test(attrs)
      ? `<body${attrs.replace(/class="([^"]*)"/, 'class="$1 is-ar"')}>`
      : `<body${attrs} class="is-ar">`
  );

  // 5 — keep internal navigation inside the Arabic site
  html = html
    .split('href="/contact"').join('href="/ar/contact"')
    .split('href="/"').join('href="/ar"');

  const out = resolve(ROOT, page.out);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");

  // sanity: the English head must be gone, the analytics must have survived
  if (html.includes(enHead)) throw new Error(`head not replaced in ${page.out}`);
  for (const tracker of ["gtag(", "fbq(", "ttq.load"]) {
    if (!html.includes(tracker)) throw new Error(`lost ${tracker} in ${page.out}`);
  }
  console.log(`built ${page.out}`);
}

for (const route of ROUTES) {
  build({
    source: route.en.source,
    out: route.ar.out,
    url: url(route.ar.path),
    enUrl: url(route.en.path),
    title: route.ar.title,
    description: route.ar.description,
    breadcrumb: route.ar.breadcrumb,
  });
}
