/* ============================================================
   TOP TECH — route table
   ------------------------------------------------------------
   The single source of truth for every indexable URL and its
   translated counterpart. Both build tools read this file:

     tools/build-ar.mjs       generates the Arabic pages
     tools/build-sitemap.mjs  generates sitemap.xml

   Adding a page means adding one entry here, then re-running both.
   ============================================================ */

export const SITE = "https://www.toptech.studio";

export const ROUTES = [
  {
    id: "home",
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
];

export const url = (path) => SITE + (path === "/" ? "/" : path);
