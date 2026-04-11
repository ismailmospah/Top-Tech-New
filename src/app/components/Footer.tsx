import React from "react";
import { motion } from "motion/react";
import {
  Instagram,
  Twitter,
  Music2,
  Facebook,

} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
const logo = "/assets/logo.svg";

const footerSectionHrefMap: Record<string, string> = {
  // English
  Home: "/",
  "Motion Graphics": "/#services",
  "Social Media Content Management": "/#services",
  "Social Media Marketing": "/#services",
  "About Us": "/#clients",
  "Our Process": "/#process",
  Portfolio: "/#portfolio",
  Blog: "/blogs",
  // Arabic
  "الرئيسية": "/",
  "موشن جرافيك": "/#services",
  "إدارة محتوى سوشيال ميديا": "/#services",
  "تسويق عبر وسائل التواصل": "/#services",
  "من نحن": "/#clients",
  "منهجيتنا": "/#process",
  "أعمالنا": "/#portfolio",
  "الوظائف": "/#contact",
  "المدونة": "/blogs",
};

const getFooterLinkHref = (item: string) => footerSectionHrefMap[item] ?? "#";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.16 6.42 2.16 11.88c0 1.95.57 3.86 1.66 5.49L2 22l4.75-1.76a9.84 9.84 0 0 0 5.29 1.53h.01c5.46 0 9.88-4.42 9.88-9.88C21.92 6.42 17.5 2 12.04 2zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.82 1.05.95-2.91-.2-.3a8.18 8.18 0 0 1-1.25-4.37c0-4.52 3.67-8.2 8.2-8.2 2.19 0 4.24.85 5.78 2.39a8.13 8.13 0 0 1 2.4 5.81c0 4.52-3.67 8.2-8.57 8.2zm4.5-6.08c-.25-.13-1.47-.72-1.7-.8-.23-.08-.4-.13-.57.12s-.66.8-.81.96c-.15.17-.3.18-.56.06-.25-.13-1.08-.4-2.05-1.26-.76-.68-1.27-1.51-1.42-1.76-.15-.25-.02-.39.11-.52.12-.12.25-.3.37-.44.12-.15.16-.25.24-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.88-.21-.5-.43-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.03 2.58.12.17 1.76 2.69 4.26 3.77.59.26 1.06.41 1.42.52.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.29z" />
    </svg>
  );
}

function BehanceIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8.37 11.57c.58-.33.88-.86.88-1.56 0-1.26-.98-1.9-2.35-1.9H3v8.78h4.1c1.7 0 2.7-.82 2.7-2.2 0-.95-.43-1.62-1.43-1.96zM4.7 9.43h1.94c.65 0 1 .3 1 .84 0 .57-.36.86-1 .86H4.7V9.43zm2.04 6.15H4.7v-2.1h2.04c.75 0 1.17.37 1.17 1.02 0 .7-.42 1.08-1.17 1.08zM16.03 10.2c-2.2 0-3.55 1.57-3.55 3.58 0 2.1 1.32 3.45 3.53 3.45 1.72 0 2.88-.79 3.26-2.18h-1.64c-.16.46-.72.75-1.48.75-.98 0-1.66-.53-1.76-1.55h4.97c.02-.17.03-.33.03-.48 0-2.15-1.29-3.57-3.36-3.57zm-1.64 2.6c.1-.93.68-1.45 1.58-1.45.94 0 1.48.54 1.53 1.45h-3.11zM13.62 8.14h4.63V9h-4.63z" />
    </svg>
  );
}

const socials = [
  // { icon: Globe, href: "https://top-tech.framer.website/", label: "Website" },
  // { icon: Link2, href: "https://linktr.ee/Top_Tech_Company", label: "Linktree" },
  { icon: Facebook, href: "https://www.facebook.com/share/16vibMnJEv/?mibextid=wwXIfr", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/toptechstudio/", label: "Instagram" },
  { icon: Music2, href: "https://www.tiktok.com/@toptechcompany?_t=8mDY8zdjT8w&_r=1", label: "TikTok" },
  { icon: Twitter, href: "https://x.com/toptechcompany5?s=21", label: "X" },
  { icon: WhatsAppIcon, href: "https://wa.me/966592661980", label: "WhatsApp" },
  { icon: BehanceIcon, href: "https://www.behance.net/TopTechCompany", label: "Behance" },
];

export function Footer() {
  const { t } = useLanguage();

  const handleFooterNavClick = (href: string) => {
    if (href === "/") {
      if (window.location.pathname !== "/") {
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href.startsWith("/#")) {
      if (window.location.pathname !== "/") {
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }

      setTimeout(() => {
        const el = document.querySelector(href.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    if (href.startsWith("/")) {
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <footer className="bg-[#080012] text-white pt-16 md:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <img
                src={logo}
                alt="Top Tech"
                height={20}
                className="w-auto h-auto max-w-[35px] md:max-w-[40px] object-contain"
              />
            </div>
            <p
              className="text-white/50 mb-6 max-w-xs"
              style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.7 }}
            >
              {t.footer.tagline}
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, backgroundColor: "#482D7A" }}
                    className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200"
                    aria-label={s.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(t.footer.links as Record<string, string[]>)
            .filter(([title]) => title !== "Contact" && title !== "التواصل")
            .map(([title, items]: [string, string[]]) => (
              <div key={title}>
                <h4
                  className="text-white mb-5"
                  style={{ fontFamily: t.fontHeading, fontWeight: 700, fontSize: "0.95rem" }}
                >
                  {title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {items.map((item: string) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => handleFooterNavClick(getFooterLinkHref(item))}
                        className="text-white/45 hover:text-white transition-colors duration-200 text-start leading-snug"
                        style={{
                          fontFamily: t.fontBody,
                          fontWeight: 400,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>



        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p
            className="text-white/30"
            style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.825rem" }}
          >
            {t.footer.copyright}
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            {t.footer.legal.map((item: string) => (
              <a
                key={item}
                href="#"
                className="text-white/30 hover:text-white/60 transition-colors duration-200"
                style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.825rem" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}