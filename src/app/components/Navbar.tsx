import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import logo from "../../assets/logo.png";

function Logo({ size = "lg" }: { size?: "lg" | "sm" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const fontSize = size === "lg" ? "1.35rem" : "1.2rem";
  const studioSize = size === "lg" ? "0.5rem" : "0.44rem";
  const imageHeight = size === "lg" ? 24 : 20;

  if (!imageFailed) {
    return (
      <img
        src={logo}
        alt="Top Tech"
        height={imageHeight}
        className="w-auto h-auto max-w-[95px] md:max-w-[115px] object-contain"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
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
      <span style={{ fontSize }}>
        <span style={{ color: "#FAB51F" }}>Top</span> Tech
      </span>
      <span
        style={{
          fontSize: studioSize,
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
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t, isRTL } = useLanguage();
  const isHomePage = window.location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);

    if (href.startsWith("/")) {
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }

    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const navLinks = [
    { label: t.nav.services, href: "#services" },
    { label: t.nav.work, href: "#portfolio" },
    { label: t.nav.process, href: "#process" },
    { label: t.nav.clients, href: "#clients" },
    { label: t.nav.contact, href: "/contact" },
     { label: t.nav.blogs, href: "/blogs" },
  ];

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      dir={isRTL ? "rtl" : "ltr"}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? "bg-[#482D7A]/95 backdrop-blur-xl shadow-lg shadow-purple-900/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className={`flex items-center gap-2 group shrink-0 rounded-xl transition-all duration-200 ${
            scrolled || !isHomePage
              ? "bg-white/95 px-2.5 py-1.5 shadow-sm"
              : "bg-transparent"
          }`}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Logo size="lg" />
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="text-white/70 hover:text-white transition-colors duration-200 relative group cursor-pointer"
                style={{
                  fontFamily: t.fontBody,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 ${isRTL ? "right-0" : "left-0"} w-0 h-[2px] bg-[#FAB51F] transition-all duration-300 group-hover:w-full rounded-full`}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-[#FAB51F]/60 transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: t.fontBody,
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
            title={
              lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
            }
          >
            <Globe size={14} className="text-[#FAB51F]" />
            <span>{lang === "en" ? "عربي" : "EN"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavClick("/contact")}
            className="px-5 py-2.5 rounded-full bg-[#FAB51F] text-[#482D7A] hover:bg-[#F59E0B] transition-colors duration-200 shadow-md shadow-yellow-500/25 cursor-pointer"
            style={{
              fontFamily: t.fontBody,
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {t.nav.cta}
          </motion.button>
        </div>

        {/* Mobile Right */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleLang}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/20 text-white/80 cursor-pointer"
            style={{
              fontFamily: t.fontBody,
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          >
            <Globe size={13} className="text-[#FAB51F]" />
            <span>{lang === "en" ? "عربي" : "EN"}</span>
          </motion.button>

          <button
            className="text-white p-1 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#482D7A]/98 backdrop-blur-xl border-t border-white/10"
          >
            <ul className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-white/80 hover:text-white w-full cursor-pointer"
                    style={{
                      fontFamily: t.fontBody,
                      fontWeight: 500,
                      fontSize: "1rem",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNavClick("/contact")}
                  className="w-full px-5 py-3 rounded-full bg-[#FAB51F] text-[#482D7A] mt-2 cursor-pointer"
                  style={{
                    fontFamily: t.fontBody,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  {t.nav.cta}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
