/* ============================================================
   TOP TECH — Insights article generator
   ------------------------------------------------------------
   Renders the Insights index and every article, in both languages,
   from tools/content/insights/*.mjs.

       node tools/build-insights.mjs

   Articles are written per language, not translated. Arabic is the
   priority market, so the Arabic version is the one written first.
   ============================================================ */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { ARTICLES } from "./content/insights/index.mjs";
import { SERVICES } from "./content/services/index.mjs";
import { url as abs } from "./routes.mjs";
import { ROOT, t } from "./i18n.mjs";
import {
  renderHead, renderBodyOpen, renderHeader, renderFooter, SCRIPTS, paths, esc,
} from "./template.mjs";
import {
  graph, organization, website, webPage, breadcrumbList, faqPage, ORG_ID, SITE_ID,
} from "./schema.mjs";

const UI = {
  en: {
    home: "Home", insights: "Articles", kicker: "Articles",
    published: "Published", updated: "Updated", readTime: "min read",
    author: "Top Tech", inThis: "In this article",
    relatedServices: "Related services", relatedReading: "Related reading",
    faqIndex: "Questions", ctaTitle: "Talk it through with us",
    ctaText: "Tell us what you are trying to move. We reply within 24 hours.",
    all: "All articles",
  },
  ar: {
    home: "الرئيسية", insights: "المقالات", kicker: "المقالات",
    published: "نُشر", updated: "آخر تحديث", readTime: "دقائق قراءة",
    author: "فريق توب تك", inThis: "في هذا المقال",
    relatedServices: "خدمات ذات صلة", relatedReading: "اقرأ أيضًا",
    faqIndex: "أسئلة شائعة", ctaTitle: "تحدّث معنا",
    ctaText: "احكِ لنا عمّا تريد تحريكه. نرد خلال 24 ساعة.",
    all: "كل المقالات",
  },
};

const articlePath = (lang, slug) => (lang === "ar" ? `/ar/insights/${slug}` : `/insights/${slug}`);
const indexPath = (lang) => (lang === "ar" ? "/ar/insights" : "/insights");
const servicePath = (lang, slug) => (lang === "ar" ? `/ar/services/${slug}` : `/services/${slug}`);

const write = (relPath, html) => {
  const out = resolve(ROOT, relPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");
  console.log(`built ${relPath}`);
};

const fmtDate = (iso, lang) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });

/* rough reading time from the article's own words */
function readingMinutes(content) {
  const words = content.sections
    .flatMap((s) => [s.h, ...(s.body || []), ...(s.list || []), ...(s.steps || []).flatMap((x) => [x.title, x.text])])
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
}

const crumb = (lang, trail) => `
    <nav class="crumb" aria-label="${lang === "ar" ? "مسار التنقل" : "Breadcrumb"}">
      <ol>
${trail.map((s) =>
  s.href
    ? `        <li><a href="${s.href}">${esc(s.name)}</a> <span class="crumb__sep" aria-hidden="true">/</span></li>`
    : `        <li><span aria-current="page">${esc(s.name)}</span></li>`
).join("\n")}
      </ol>
    </nav>`;

function renderSection(s) {
  const parts = [];
  if (s.body) parts.push(`<div class="prose">${s.body.map((p) => `<p>${p}</p>`).join("")}</div>`);
  if (s.list) parts.push(`
      <ul class="ticks">
${s.list.map((i) => `        <li>${i}</li>`).join("\n")}
      </ul>`);
  if (s.steps) parts.push(`
      <ol class="steps">
${s.steps.map((x) => `        <li>
          <div>
            <h3>${esc(x.title)}</h3>
            <p>${esc(x.text)}</p>
          </div>
        </li>`).join("\n")}
      </ol>`);
  if (s.after) parts.push(`<div class="prose">${s.after.map((p) => `<p>${p}</p>`).join("")}</div>`);
  return `
    <section class="block" id="${s.id}">
      <h2 class="block__title">${esc(s.h)}</h2>
${parts.join("\n")}
    </section>`;
}

function renderArticle(article, lang) {
  const c = article[lang];
  const u = UI[lang];
  const p = paths(lang);
  const url = abs(articlePath(lang, article.slug));
  const altUrl = abs(articlePath(lang === "en" ? "ar" : "en", article.slug));
  const mins = readingMinutes(c);

  const services = article.services
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter(Boolean)
    .map((s) => `        <a href="${servicePath(lang, s.slug)}" data-cursor="view">
          <span>${esc(s[lang].name)}</span><i aria-hidden="true">→</i>
        </a>`).join("\n");

  const reading = article.related
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter(Boolean)
    .map((a) => `        <a href="${articlePath(lang, a.slug)}" data-cursor="view">
          <span>${esc(a[lang].h1)}</span><i aria-hidden="true">→</i>
        </a>`).join("\n");

  const toc = `
    <nav class="toc" aria-label="${esc(u.inThis)}">
      <p class="toc__label">${esc(u.inThis)}</p>
      <ol>
${c.sections.map((s) => `        <li><a href="#${s.id}">${esc(s.h)}</a></li>`).join("\n")}
      </ol>
    </nav>`;

  const jsonld = graph([
    organization(lang),
    website(),
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: c.h1,
      description: c.description,
      inLanguage: lang,
      datePublished: article.published,
      dateModified: article.updated || article.published,
      /* the byline is the company, not an invented individual */
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": SITE_ID },
      mainEntityOfPage: { "@id": `${url}#webpage` },
      image: `${abs("/")}assets/og-image.jpg`.replace("//assets", "/assets"),
      articleSection: u.insights,
    },
    webPage({ lang, url, name: c.title, description: c.description, breadcrumb: true }),
    breadcrumbList(url, [
      { name: u.home, item: abs(p.home) },
      { name: u.insights, item: abs(indexPath(lang)) },
      { name: c.h1, item: url },
    ]),
    c.faq?.length ? faqPage(url, c.faq) : null,
  ]);

  const faqBlock = c.faq?.length ? `
    <section class="block">
      <p class="block__index">${esc(u.faqIndex)}</p>
      <h2 class="block__title">${esc(c.faqTitle)}</h2>
      <div class="faq">
${c.faq.map((f) => `        <details>
          <summary><h3>${esc(f.q)}</h3></summary>
          <div class="faq__answer">${f.a.map((x) => `<p>${x}</p>`).join("")}</div>
        </details>`).join("\n")}
      </div>
    </section>` : "";

  return `${renderHead({ lang, url, altUrl, title: c.title, description: c.description, jsonld, ogType: "article" })}
${renderBodyOpen(lang, article.shape || "wave")}
${renderHeader(lang)}

  <main class="page">
${crumb(lang, [
  { name: u.home, href: p.home },
  { name: u.insights, href: indexPath(lang) },
  { name: c.h1 },
])}

    <article>
      <header class="phero">
        <p class="block__index">${esc(u.kicker)}</p>
        <h1 class="phero__title phero__title--article">${esc(c.h1)}</h1>
        <p class="phero__lead">${c.lead}</p>
        <p class="artmeta">
          <span>${esc(u.author)}</span>
          <span class="artmeta__sep" aria-hidden="true">·</span>
          <span>${esc(u.published)} <time datetime="${article.published}">${fmtDate(article.published, lang)}</time></span>
${article.updated ? `          <span class="artmeta__sep" aria-hidden="true">·</span>
          <span>${esc(u.updated)} <time datetime="${article.updated}">${fmtDate(article.updated, lang)}</time></span>` : ""}
          <span class="artmeta__sep" aria-hidden="true">·</span>
          <span>${mins} ${esc(u.readTime)}</span>
        </p>
      </header>
${toc}
${c.sections.map(renderSection).join("\n")}
${faqBlock}
    </article>

    <section class="block">
      <p class="block__index">${esc(u.relatedServices)}</p>
      <div class="related">
${services}
      </div>
    </section>
${reading ? `
    <section class="block">
      <p class="block__index">${esc(u.relatedReading)}</p>
      <div class="related">
${reading}
      </div>
    </section>` : ""}

    <section class="block artcta">
      <h2 class="block__title">${esc(u.ctaTitle)}</h2>
      <p class="prose"><span>${esc(u.ctaText)}</span></p>
      <p class="phero__actions">
        <a class="btn btn--solid magnetic" href="${p.contact}" data-cursor="go">${esc(t("nav_cta", lang))} <i aria-hidden="true">→</i></a>
      </p>
    </section>
  </main>
${renderFooter(lang)}
${SCRIPTS}`;
}

/* ---------- index ---------- */
const INDEX_COPY = {
  en: {
    title: "Marketing Articles for Saudi Arabia & Egypt — Top Tech",
    description:
      "Practical answers to the questions businesses in Saudi Arabia and Egypt actually ask about marketing agencies, social media, video production, budgets and results.",
    h1: "Articles",
    lead: "Straight answers to the questions clients ask us before they hire anyone — what things cost, how to judge an agency, and how to tell whether marketing is working.",
  },
  ar: {
    title: "مقالات عن التسويق في السعودية ومصر — توب تك",
    description:
      "إجابات عملية عن الأسئلة التي تطرحها الشركات في السعودية ومصر فعلًا: تكاليف وكالات التسويق، وإدارة السوشيال ميديا، وإنتاج الفيديو، والميزانيات، وقياس النتائج.",
    h1: "المقالات",
    lead: "إجابات مباشرة عن الأسئلة التي يطرحها العملاء قبل أن يتعاقدوا مع أي جهة — كم تكلّف الأمور، وكيف تحكم على وكالة، وكيف تعرف أن التسويق يعمل.",
  },
};

function renderIndex(lang) {
  const u = UI[lang];
  const p = paths(lang);
  const copy = INDEX_COPY[lang];
  const url = abs(indexPath(lang));
  const altUrl = abs(indexPath(lang === "en" ? "ar" : "en"));

  const sorted = [...ARTICLES].sort((a, b) => (a.published < b.published ? 1 : -1));

  const rows = sorted.map((a, i) => `        <li class="svclist__row" data-cursor="view">
          <span class="svclist__num">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <h2 class="svclist__name svclist__name--article"><a class="svclist__link" href="${articlePath(lang, a.slug)}">${esc(a[lang].h1)}</a></h2>
            <p class="svclist__desc">${esc(a[lang].excerpt)}</p>
            <p class="artmeta artmeta--row"><time datetime="${a.published}">${fmtDate(a.published, lang)}</time></p>
          </div>
          <span class="svclist__arrow" aria-hidden="true">→</span>
        </li>`).join("\n");

  const jsonld = graph([
    organization(lang),
    website(),
    webPage({ lang, url, name: copy.title, description: copy.description, breadcrumb: true }),
    breadcrumbList(url, [
      { name: u.home, item: abs(p.home) },
      { name: u.insights, item: url },
    ]),
    {
      "@type": "ItemList",
      "@id": `${url}#list`,
      name: copy.title,
      itemListElement: sorted.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a[lang].h1,
        url: abs(articlePath(lang, a.slug)),
      })),
    },
  ]);

  return `${renderHead({ lang, url, altUrl, title: copy.title, description: copy.description, jsonld })}
${renderBodyOpen(lang, "scatter")}
${renderHeader(lang)}

  <main class="page">
${crumb(lang, [{ name: u.home, href: p.home }, { name: u.insights }])}

    <section class="phero">
      <p class="block__index">${esc(u.kicker)}</p>
      <h1 class="phero__title">${esc(copy.h1)}</h1>
      <p class="phero__lead">${copy.lead}</p>
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

for (const lang of ["en", "ar"]) {
  const base = lang === "ar" ? "ar/insights" : "insights";
  write(`${base}/index.html`, renderIndex(lang));
  for (const a of ARTICLES) write(`${base}/${a.slug}/index.html`, renderArticle(a, lang));
}
