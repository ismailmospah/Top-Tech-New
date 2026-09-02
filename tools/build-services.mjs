/* ============================================================
   TOP TECH — service page generator
   ------------------------------------------------------------
   Renders the six service pages plus the services index, in both
   languages, from tools/content/services/*.mjs.

       node tools/build-services.mjs

   Content lives in the data files; this file owns only the shell.
   ============================================================ */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { SERVICES } from "./content/services/index.mjs";
import { ARTICLES } from "./content/articles/index.mjs";
import { SITE, url as abs } from "./routes.mjs";
import { ROOT, t } from "./i18n.mjs";
import {
  renderHead, renderBodyOpen, renderHeader, renderFooter, SCRIPTS, paths, esc, attr,
} from "./template.mjs";
import {
  graph, organization, website, webPage, breadcrumbList, faqPage, service as serviceNode,
} from "./schema.mjs";

/* structural labels — the shell's own words, not page content */
const UI = {
  en: {
    home: "Home", services: "Services", related: "Related services",
    allServices: "All services", indexKicker: "Services",
    reading: "Related reading",
    faqIndex: "Questions", processIndex: "Process", deliverIndex: "Deliverables",
    solvesIndex: "Problems", offerIndex: "Scope",
    audienceIndex: "Audience", defIndex: "Overview",
  },
  ar: {
    home: "الرئيسية", services: "الخدمات", related: "خدمات ذات صلة",
    allServices: "كل الخدمات", indexKicker: "الخدمات",
    reading: "اقرأ أيضًا",
    faqIndex: "الأسئلة", processIndex: "المراحل", deliverIndex: "المخرجات",
    solvesIndex: "المشكلات", offerIndex: "النطاق",
    audienceIndex: "الجمهور", defIndex: "نظرة عامة",
  },
};

const servicePath = (lang, slug) => (lang === "ar" ? `/ar/services/${slug}` : `/services/${slug}`);
const indexPath = (lang) => (lang === "ar" ? "/ar/services" : "/services");

const write = (relPath, html) => {
  const out = resolve(ROOT, relPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");
  console.log(`built ${relPath}`);
};

const crumb = (lang, trail) => `
    <nav class="crumb" aria-label="${lang === "ar" ? "مسار التنقل" : "Breadcrumb"}">
      <ol>
${trail
  .map((step, i) =>
    step.href
      ? `        <li><a href="${step.href}">${esc(step.name)}</a> <span class="crumb__sep" aria-hidden="true">/</span></li>`
      : `        <li><span aria-current="page">${esc(step.name)}</span></li>`
  )
  .join("\n")}
      </ol>
    </nav>`;

const cards = (items) => `
      <div class="cards">
${items
  .map(
    (it) => `        <article class="card">
          <h3 class="card__title">${esc(it.title)}</h3>
          <p class="card__text">${esc(it.text)}</p>
        </article>`
  )
  .join("\n")}
      </div>`;

const ticks = (items) =>
  `
      <ul class="ticks">
${items.map((i) => `        <li>${i}</li>`).join("\n")}
      </ul>`;

const steps = (items) => `
      <ol class="steps">
${items
  .map(
    (s) => `        <li>
          <div>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
          </div>
        </li>`
  )
  .join("\n")}
      </ol>`;

const faqBlock = (items) => `
      <div class="faq">
${items
  .map(
    (f) => `        <details>
          <summary><h3>${esc(f.q)}</h3></summary>
          <div class="faq__answer">${f.a.map((p) => `<p>${p}</p>`).join("")}</div>
        </details>`
  )
  .join("\n")}
      </div>`;

const block = (index, title, inner) => `
    <section class="block">
      <p class="block__index">${esc(index)}</p>
      <h2 class="block__title">${esc(title)}</h2>${inner}
    </section>`;

/* ---------- one service page ---------- */
function renderService(svc, lang) {
  const c = svc[lang];
  const u = UI[lang];
  const p = paths(lang);
  const url = abs(servicePath(lang, svc.slug));
  const altUrl = abs(servicePath(lang === "en" ? "ar" : "en", svc.slug));

  const trail = [
    { name: u.home, href: p.home },
    { name: u.services, href: indexPath(lang) },
    { name: c.name },
  ];

  const related = svc.related
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter(Boolean)
    .map(
      (s) => `        <a href="${servicePath(lang, s.slug)}" data-cursor="view">
          <span>${esc(s[lang].name)}</span><i aria-hidden="true">→</i>
        </a>`
    )
    .join("\n");

  const articlePath = (slug) => (lang === "ar" ? `/ar/articles/${slug}` : `/articles/${slug}`);
  const reading = ARTICLES.filter((a) => a.services.includes(svc.slug))
    .map((a) => `        <a href="${articlePath(a.slug)}" data-cursor="view">
          <span>${esc(a[lang].h1)}</span><i aria-hidden="true">→</i>
        </a>`)
    .join("\n");

  const jsonld = graph([
    organization(lang),
    website(),
    webPage({ lang, url, name: c.title, description: c.description, breadcrumb: true }),
    breadcrumbList(url, [
      { name: u.home, item: abs(p.home) },
      { name: u.services, item: abs(indexPath(lang)) },
      { name: c.name, item: url },
    ]),
    serviceNode({ url, name: c.name, description: c.description, serviceType: svc.serviceType, lang }),
    faqPage(url, c.sections.faq.items),
  ]);

  return `${renderHead({ lang, url, altUrl, title: c.title, description: c.description, jsonld })}
${renderBodyOpen(lang, svc.shape)}
${renderHeader(lang)}

  <main class="page">
${crumb(lang, trail)}

    <section class="phero">
      <p class="block__index">${esc(u.indexKicker)} — ${esc(svc.num)}</p>
      <h1 class="phero__title">${esc(c.h1)}</h1>
      <p class="phero__lead">${c.lead}</p>
      <div class="phero__actions">
        <a class="btn btn--solid magnetic" href="${p.contact}" data-cursor="go">${esc(t("nav_cta", lang))} <i aria-hidden="true">→</i></a>
        <a class="btn btn--ghost" href="${indexPath(lang)}" data-cursor="hover">${esc(u.allServices)}</a>
      </div>
    </section>
${block(u.defIndex, c.sections.definition.h, `
      <div class="prose">${c.sections.definition.body.map((x) => `<p>${x}</p>`).join("")}</div>`)}
${block(u.audienceIndex, c.sections.audience.h, ticks(c.sections.audience.items))}
${block(u.solvesIndex, c.sections.problems.h, cards(c.sections.problems.items))}
${block(u.offerIndex, c.sections.offer.h, cards(c.sections.offer.items))}
${block(u.processIndex, c.sections.process.h, steps(c.sections.process.items))}
${block(u.deliverIndex, c.sections.deliverables.h, ticks(c.sections.deliverables.items))}
${block(u.faqIndex, c.sections.faq.h, faqBlock(c.sections.faq.items))}

    <section class="block">
      <p class="block__index">${esc(u.related)}</p>
      <div class="related">
${related}
      </div>
    </section>
${reading ? `
    <section class="block">
      <p class="block__index">${esc(u.reading)}</p>
      <div class="related">
${reading}
      </div>
    </section>` : ""}
  </main>
${renderFooter(lang)}
${SCRIPTS}`;
}

/* ---------- the services index ---------- */
const INDEX_COPY = {
  en: {
    title: "Marketing Services in Saudi Arabia & Egypt — Top Tech",
    description:
      "The six things Top Tech does for brands in Saudi Arabia and Egypt: marketing strategy, social media marketing, content management, branding and design, motion and video, and media buying.",
    h1: "What we do",
    lead:
      "Six services that work as one system. Strategy sets the direction, content and creative give it a voice, and paid media puts it in front of the right people — run by one team, so nothing gets lost between briefs.",
  },
  ar: {
    title: "خدمات التسويق في السعودية ومصر — توب تك",
    description:
      "ست خدمات تقدّمها توب تك للعلامات في السعودية ومصر: استراتيجية التسويق، التسويق عبر وسائل التواصل الاجتماعي، إدارة المحتوى وصناعته، الهوية البصرية والتصميم، الموشن جرافيك وإنتاج الفيديو، والإعلانات المدفوعة.",
    h1: "ماذا نقدّم",
    lead:
      "ست خدمات تعمل كنظام واحد. الاستراتيجية تحدّد الاتجاه، والمحتوى والإبداع يمنحانه صوتًا، والإعلانات المدفوعة توصّله إلى الجمهور الصحيح — يديرها فريق واحد، فلا يضيع شيء بين مرحلة وأخرى.",
  },
};

function renderIndex(lang) {
  const u = UI[lang];
  const p = paths(lang);
  const copy = INDEX_COPY[lang];
  const url = abs(indexPath(lang));
  const altUrl = abs(indexPath(lang === "en" ? "ar" : "en"));

  const rows = SERVICES.map(
    (s) => `        <li class="svclist__row" data-cursor="view">
          <span class="svclist__num">${esc(s.num)}</span>
          <div>
            <h2 class="svclist__name"><a class="svclist__link" href="${servicePath(lang, s.slug)}">${esc(s[lang].name)}</a></h2>
            <p class="svclist__desc">${esc(s[lang].short)}</p>
          </div>
          <span class="svclist__arrow" aria-hidden="true">→</span>
        </li>`
  ).join("\n");

  const jsonld = graph([
    organization(lang),
    website(),
    webPage({ lang, url, name: copy.title, description: copy.description, breadcrumb: true }),
    breadcrumbList(url, [
      { name: u.home, item: abs(p.home) },
      { name: u.services, item: url },
    ]),
    {
      "@type": "ItemList",
      "@id": `${url}#list`,
      name: copy.title,
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s[lang].name,
        url: abs(servicePath(lang, s.slug)),
      })),
    },
  ]);

  return `${renderHead({ lang, url, altUrl, title: copy.title, description: copy.description, jsonld })}
${renderBodyOpen(lang, "ring")}
${renderHeader(lang)}

  <main class="page">
${crumb(lang, [{ name: u.home, href: p.home }, { name: u.services }])}

    <section class="phero">
      <p class="block__index">${esc(u.indexKicker)}</p>
      <h1 class="phero__title">${esc(copy.h1)}</h1>
      <p class="phero__lead">${copy.lead}</p>
      <div class="phero__actions">
        <a class="btn btn--solid magnetic" href="${p.contact}" data-cursor="go">${esc(t("nav_cta", lang))} <i aria-hidden="true">→</i></a>
      </div>
    </section>

    <section class="block">
      <ul class="svclist">
${rows}
      </ul>
    </section>
  </main>
${renderFooter(lang)}
${SCRIPTS}`;
}

/* ---------- run ---------- */
for (const lang of ["en", "ar"]) {
  const base = lang === "ar" ? "ar/services" : "services";
  write(`${base}/index.html`, renderIndex(lang));
  for (const svc of SERVICES) write(`${base}/${svc.slug}/index.html`, renderService(svc, lang));
}
