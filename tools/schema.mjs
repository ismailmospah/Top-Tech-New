/* ============================================================
   TOP TECH — Schema.org builders
   ------------------------------------------------------------
   Every fact here comes from the real site: the phone numbers,
   email and social profiles shown in the footer, and the services
   actually offered. Nothing is invented — no address, no reviews,
   no ratings, because the available business information does not
   support them.
   ============================================================ */

import { SITE } from "./routes.mjs";

export const ORG_ID = `${SITE}/#organization`;
export const SITE_ID = `${SITE}/#website`;

const ORG_DESC = {
  en: "Top Tech is a full-service marketing agency serving Saudi Arabia and Egypt. It began as a motion graphics studio and now delivers marketing strategy, social media marketing, content management, branding and design, motion and video production, and media buying.",
  ar: "توب تك وكالة تسويق متكاملة تخدم السعودية ومصر. بدأت كاستوديو موشن جرافيك، وتقدّم اليوم استراتيجية التسويق والتسويق عبر وسائل التواصل الاجتماعي وإدارة المحتوى والهوية البصرية والتصميم وإنتاج الفيديو والموشن جرافيك والإعلانات المدفوعة.",
};

export function organization(lang) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Top Tech",
    alternateName: "توب تك",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/assets/logo-original.svg` },
    image: `${SITE}/assets/og-image.jpg`,
    description: ORG_DESC[lang],
    email: "toptechcompany51@gmail.com",
    telephone: "+966592661980",
    knowsLanguage: ["ar", "en"],
    areaServed: [
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "Egypt" },
    ],
    sameAs: [
      "https://www.instagram.com/toptechagency/",
      "https://www.tiktok.com/@toptechagency1",
      "https://x.com/toptechstudio1",
      "https://www.behance.net/TopTechCompany",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+966592661980",
        email: "toptechcompany51@gmail.com",
        areaServed: "SA",
        availableLanguage: ["ar", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+201093723960",
        email: "toptechcompany51@gmail.com",
        areaServed: "EG",
        availableLanguage: ["ar", "en"],
      },
    ],
  };
}

export const website = () => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  url: `${SITE}/`,
  name: "Top Tech",
  publisher: { "@id": ORG_ID },
  inLanguage: ["en", "ar"],
});

export const webPage = ({ lang, url, name, description, breadcrumb }) => ({
  "@type": "WebPage",
  "@id": `${url}#webpage`,
  url,
  name,
  description,
  isPartOf: { "@id": SITE_ID },
  about: { "@id": ORG_ID },
  inLanguage: lang,
  primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}/assets/og-image.jpg` },
  ...(breadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
});

export const breadcrumbList = (url, trail) => ({
  "@type": "BreadcrumbList",
  "@id": `${url}#breadcrumb`,
  itemListElement: trail.map((step, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: step.name,
    item: step.item,
  })),
});

/* Only ever built from FAQ content that is visibly rendered on the page. */
export const faqPage = (url, faq) => ({
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
  })),
});

export const service = ({ url, name, description, serviceType, lang }) => ({
  "@type": "Service",
  "@id": `${url}#service`,
  name,
  description,
  serviceType,
  provider: { "@id": ORG_ID },
  areaServed: [
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "Country", name: "Egypt" },
  ],
  availableLanguage: ["ar", "en"],
  inLanguage: lang,
  url,
});

export const graph = (nodes) => ({ "@context": "https://schema.org", "@graph": nodes.filter(Boolean) });
