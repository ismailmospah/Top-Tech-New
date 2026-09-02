/* ============================================================
   TOP TECH — route table
   ------------------------------------------------------------
   The single source of truth for every indexable URL and its
   translated counterpart. The build tools read this file:

     tools/build-ar.mjs        mirrors the hand-written pages into Arabic
     tools/build-services.mjs  renders the service pages
     tools/build-sitemap.mjs   renders sitemap.xml

   `generator` says who owns a route:
     "ar-mirror" — a hand-written English page mirrored into /ar
     "services"  — rendered from tools/content/services
   ============================================================ */

import { SERVICES } from "./content/services/index.mjs";
import { ARTICLES } from "./content/articles/index.mjs";

export const SITE = "https://www.toptech.studio";

const PAGES = [
  {
    id: "home",
    generator: "ar-mirror",
    priority: "1.0",
    changefreq: "monthly",
    en: { path: "/", source: "index.html" },
    ar: {
      path: "/ar",
      out: "ar/index.html",
      title: "وكالة تسويق في السعودية ومصر — توب تك",
      description:
        "توب تك وكالة تسويق رقمي متكاملة في السعودية ومصر. استراتيجية تسويق، إدارة حسابات التواصل الاجتماعي، صناعة المحتوى، الهوية البصرية، الموشن جرافيك وإنتاج الفيديو، والإعلانات المدفوعة.",
    },
  },
  {
    id: "contact",
    generator: "ar-mirror",
    priority: "0.8",
    changefreq: "yearly",
    en: { path: "/contact", source: "contact.html" },
    ar: {
      path: "/ar/contact",
      out: "ar/contact/index.html",
      title: "ابدأ مشروعك — تواصل مع توب تك | السعودية ومصر",
      description:
        "احكِ لنا عن مشروعك التسويقي وسنرد عليك خلال 24 ساعة. مكاتبنا في الرياض بالسعودية والقاهرة بمصر.",
      breadcrumb: [
        { name: "توب تك", item: SITE + "/ar" },
        { name: "تواصل معنا", item: SITE + "/ar/contact" },
      ],
    },
  },
  {
    id: "services",
    generator: "services",
    priority: "0.9",
    changefreq: "monthly",
    en: { path: "/services" },
    ar: { path: "/ar/services" },
  },
  ...SERVICES.map((s) => ({
    id: `service:${s.slug}`,
    generator: "services",
    priority: "0.8",
    changefreq: "monthly",
    en: { path: `/services/${s.slug}` },
    ar: { path: `/ar/services/${s.slug}` },
  })),
  {
    id: "articles",
    generator: "articles",
    priority: "0.7",
    changefreq: "weekly",
    en: { path: "/articles" },
    ar: { path: "/ar/articles" },
  },
  ...ARTICLES.map((a) => ({
    id: `article:${a.slug}`,
    generator: "articles",
    priority: "0.6",
    changefreq: "yearly",
    en: { path: `/articles/${a.slug}` },
    ar: { path: `/ar/articles/${a.slug}` },
  })),
];

export const ROUTES = PAGES;
export const mirrorRoutes = () => PAGES.filter((r) => r.generator === "ar-mirror");

export const url = (path) => SITE + (path === "/" ? "/" : path);
