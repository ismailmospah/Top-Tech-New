import { motion } from "motion/react";
import {
  Instagram,
  Twitter,
  Globe,
  Link2,
  MessageCircle,
  BriefcaseBusiness,
  Music2,
  Facebook,

} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const socials = [
  // { icon: Globe, href: "https://top-tech.framer.website/", label: "Website" },
  // { icon: Link2, href: "https://linktr.ee/Top_Tech_Company", label: "Linktree" },
  { icon: Facebook, href: "https://www.facebook.com/share/16vibMnJEv/?mibextid=wwXIfr", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/toptech.company?igsh=eXZqeHY5cnU3Mm8z", label: "Instagram" },
  { icon: Music2, href: "https://www.tiktok.com/@toptechcompany?_t=8mDY8zdjT8w&_r=1", label: "TikTok" },
  { icon: Twitter, href: "https://x.com/toptechcompany5?s=21", label: "X" },
  { icon: MessageCircle, href: "https://wa.me/966592661980", label: "WhatsApp" },
  { icon: BriefcaseBusiness, href: "https://www.behance.net/TopTechCompany", label: "Behance" },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#080012] text-white pt-16 md:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  color: "white",
                  whiteSpace: "nowrap",
                  direction: "ltr",
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  lineHeight: 1,
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>
                  <span style={{ color: "#FAB51F" }}>Top</span> Tech
                </span>
                <span
                  style={{
                    fontSize: "0.48rem",
                    fontWeight: 600,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                    marginTop: "2px",
                  }}
                >
                  Studio
                </span>
              </span>
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
                    <a
                      href="#"
                      className="text-white/45 hover:text-white transition-colors duration-200"
                      style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.875rem" }}
                    >
                      {item}
                    </a>
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