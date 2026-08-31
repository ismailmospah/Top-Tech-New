/* ============================================================
   TOP TECH — shared page chrome for generated pages
   ------------------------------------------------------------
   Head, header, footer and script tags, rendered in either language.
   The analytics snippets are read out of index.html rather than copied,
   so there is exactly one place where a tracking ID can ever change.
   ============================================================ */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT, t } from "./i18n.mjs";
import { SITE } from "./routes.mjs";

/* ---------- analytics, lifted verbatim from the hand-written homepage ---------- */
function trackingScripts() {
  const html = readFileSync(resolve(ROOT, "index.html"), "utf8");
  const from = html.indexOf("  <!-- Google Analytics -->");
  const to = html.indexOf("  <!-- Structured data -->");
  if (from === -1 || to === -1) throw new Error("could not locate the analytics block in index.html");
  const block = html.slice(from, to).trimEnd();
  for (const marker of ["gtag(", "fbq(", "ttq.load"]) {
    if (!block.includes(marker)) throw new Error(`analytics block is missing ${marker}`);
  }
  return block;
}
export const TRACKING = trackingScripts();

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* for attribute values: quotes matter too */
export const attr = (s) => esc(s).replace(/"/g, "&quot;");

const OG_LOCALE = { en: "en_US", ar: "ar_AR" };
const OG_ALT = { en: "ar_AR", ar: "en_US" };
const IMG_ALT = {
  en: "Top Tech — marketing agency in Saudi Arabia and Egypt",
  ar: "توب تك — وكالة تسويق في السعودية ومصر",
};

/**
 * page = { lang, url, altUrl, title, description, jsonld, ogType }
 * altUrl is the same page in the other language; the English URL is always
 * x-default so one canonical entry point exists for unmatched languages.
 */
export function renderHead(page) {
  const { lang } = page;
  const en = lang === "en" ? page.url : page.altUrl;
  const ar = lang === "ar" ? page.url : page.altUrl;
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${esc(page.title)}</title>
  <meta name="description" content="${attr(page.description)}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <link rel="canonical" href="${page.url}" />
  <link rel="alternate" hreflang="en" href="${en}" />
  <link rel="alternate" hreflang="ar" href="${ar}" />
  <link rel="alternate" hreflang="x-default" href="${en}" />

  <!-- Facebook Domain Verification -->
  <meta name="facebook-domain-verification" content="jgs5un48jog44hoh5u0pxr8ckapcc9" />

  <link rel="icon" href="/assets/logo-original.svg" type="image/svg+xml" />

  <!-- Open Graph -->
  <meta property="og:type" content="${page.ogType || "website"}" />
  <meta property="og:site_name" content="Top Tech" />
  <meta property="og:locale" content="${OG_LOCALE[lang]}" />
  <meta property="og:locale:alternate" content="${OG_ALT[lang]}" />
  <meta property="og:url" content="${page.url}" />
  <meta property="og:title" content="${attr(page.title)}" />
  <meta property="og:description" content="${attr(page.description)}" />
  <meta property="og:image" content="${SITE}/assets/og-image.jpg" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="720" />
  <meta property="og:image:alt" content="${attr(IMG_ALT[lang])}" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${attr(page.title)}" />
  <meta name="twitter:description" content="${attr(page.description)}" />
  <meta name="twitter:image" content="${SITE}/assets/og-image.jpg" />
  <meta name="twitter:image:alt" content="${attr(IMG_ALT[lang])}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Space+Grotesk:wght@300..700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="/style.css" />

${TRACKING}

  <!-- Structured data -->
  <script type="application/ld+json">
${JSON.stringify(page.jsonld, null, 2).split("\n").map((l) => "  " + l).join("\n")}
  </script>
</head>`;
}

/* home/contact/services paths differ per language */
export const paths = (lang) => ({
  home: lang === "ar" ? "/ar" : "/",
  contact: lang === "ar" ? "/ar/contact" : "/contact",
  services: lang === "ar" ? "/ar/services" : "/services",
  insights: lang === "ar" ? "/ar/insights" : "/insights",
});

export function renderBodyOpen(lang, shape, extraClass = "") {
  const cls = [extraClass, lang === "ar" ? "is-ar" : ""].filter(Boolean).join(" ");
  return `<body data-shape="${shape}"${cls ? ` class="${cls}"` : ""}>

  <!-- WebGL backdrop. Content pages carry long-form body copy, so a scrim
       sits between the particles and the text — the universe stays visible,
       the paragraphs stay readable. -->
  <canvas id="gl" aria-hidden="true"></canvas>
  <div class="vignette" aria-hidden="true"></div>
  <div class="page-scrim" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>

  <div class="progress" aria-hidden="true"><span id="progressBar"></span></div>

  <div class="cursor" id="cursor" aria-hidden="true">
    <span class="cursor__dot"></span>
    <span class="cursor__ring"><i class="cursor__label" id="cursorLabel"></i></span>
  </div>`;
}

export function renderHeader(lang) {
  const p = paths(lang);
  const homeLabel = lang === "ar" ? "توب تك — الصفحة الرئيسية" : "Top Tech home";
  const navLabel = lang === "ar" ? "التنقل الرئيسي" : "Primary";
  return `
  <header class="header">
    <a class="header__logo" href="${p.home}" data-cursor="hover" aria-label="${homeLabel}">
      <img src="/assets/logo-white.svg" alt="Top Tech" />
    </a>
    <nav class="header__nav" aria-label="${navLabel}">
      <a href="${p.home}#story" data-cursor="hover">${esc(t("nav_story", lang))}</a>
      <a href="${p.services}" data-cursor="hover">${esc(t("nav_services", lang))}</a>
      <a href="${p.home}#reviews" data-cursor="hover">${esc(t("nav_clients", lang))}</a>
      <a href="${p.insights}" data-cursor="hover">${esc(t("nav_insights", lang))}</a>
      <a href="${p.contact}" data-cursor="hover">${esc(t("nav_contact", lang))}</a>
    </nav>
    <div class="header__actions">
      <button class="langtoggle" id="langToggle" data-cursor="hover" aria-label="${lang === "ar" ? "تغيير اللغة" : "Switch language"}">
        <span data-lang="en">EN</span>
        <span data-lang="ar">ع</span>
      </button>
      <a class="header__cta magnetic" href="${p.contact}" data-cursor="go">${esc(t("nav_cta", lang))}</a>
    </div>
  </header>`;
}

/* the same closing CTA + meta block the homepage ends with */
export function renderFooter(lang) {
  const p = paths(lang);
  return `
  <footer class="contact" id="contact" data-shape="sphere">
    <h2 class="contact__title">${t("contact_title", lang)}</h2>
    <p class="contact__sub">${esc(t("contact_sub", lang))}</p>
    <a class="contact__cta magnetic" href="${p.contact}" data-cursor="go">${t("contact_cta", lang)}</a>
    <div class="contact__meta">
      <div>
        <span>${esc(t("meta_talk", lang))}</span>
        <a href="https://wa.me/966592661980" target="_blank" rel="noopener" data-cursor="hover">+966 59 266 1980</a>
        <a href="https://wa.me/201093723960" target="_blank" rel="noopener" data-cursor="hover">+20 10 9372 3960</a>
        <a href="mailto:toptechcompany51@gmail.com" data-cursor="hover">toptechcompany51@gmail.com</a>
      </div>
      <div>
        <span>${esc(t("meta_socials", lang))}</span>
        <a href="https://www.instagram.com/toptechstudio/" target="_blank" rel="noopener" data-cursor="hover">Instagram</a>
        <a href="https://www.tiktok.com/@toptechcompany" target="_blank" rel="noopener" data-cursor="hover">TikTok</a>
        <a href="https://www.behance.net/TopTechCompany" target="_blank" rel="noopener" data-cursor="hover">Behance</a>
      </div>
      <div>
        <span>${esc(t("meta_base", lang))}</span>
        <p>${t("meta_base_text", lang)}</p>
      </div>
      <div>
        <span>${esc(t("meta_copy", lang))}</span>
        <p>${t("meta_copy_text", lang)}</p>
      </div>
    </div>
  </footer>`;
}

export const SCRIPTS = `
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"></script>
  <script src="/lang.js"></script>
  <script src="/transition.js"></script>
  <script src="/main.js"></script>
</body>
</html>
`;
