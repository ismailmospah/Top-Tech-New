import React from "react";
import { motion } from "motion/react";
import {
  Film,
  LayoutGrid,
  Share2,
  Palette,
  Scissors,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const icons = [Film, LayoutGrid, Share2, Palette, Scissors];
const colors = [
  { color: "#482D7A", bg: "#EDE9FE" },
  { color: "#482D7A", bg: "#DDD6FE" },
  { color: "#482D7A", bg: "#EDE9FE" },
  { color: "#482D7A", bg: "#DDD6FE" },
  { color: "#482D7A", bg: "#EDE9FE" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ["easeOut"] },
  },
};

export function ServicesSection() {
  const { t, lang } = useLanguage();

  return (
    <section id="services" className="py-16 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#482D7A] mb-4"
            style={{
              fontFamily: t.fontBody,
              fontWeight: 600,
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
            }}
          >
            {t.services.badge}
          </span>
          <h2
            className="text-[#482D7A] mb-4"
            style={{
              fontFamily: t.fontHeading,
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
            }}
          >
            {t.services.heading}
            <br />
            <span className="text-[#482D7A]">{t.services.headingAccent}</span>
          </h2>
          <p
            className="text-[#717182] max-w-xl mx-auto"
            style={{
              fontFamily: t.fontBody,
              fontWeight: 400,
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            {t.services.description}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          key={lang}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {t.services.items.map((service, i) => {
            const Icon = icons[i];
            const { color, bg } = colors[i];
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  boxShadow: "0 24px 48px rgba(72,45,122,0.15)",
                  borderColor: "#482D7A",
                }}
                className="group relative p-8 rounded-3xl border border-[#e5e7eb] bg-white cursor-pointer transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={26} color={color} strokeWidth={1.8} />
                </div>

                <h3
                  className="text-[#482D7A] mb-3"
                  style={{
                    fontFamily: t.fontHeading,
                    fontWeight: 700,
                    fontSize: "1.2rem",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-[#717182] mb-6"
                  style={{
                    fontFamily: t.fontBody,
                    fontWeight: 400,
                    fontSize: "0.92rem",
                    lineHeight: 1.65,
                  }}
                >
                  {service.description}
                </p>

               

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#482D7A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}

          {/* Last card spanning wider */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(72,45,122,0.2)" }}
            className="group relative p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-[#482D7A] to-[#3a2260] cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden"
          >
            <div className="relative z-10">
              <span
                className="inline-block px-3 py-1 rounded-full bg-[#FAB51F] text-[#482D7A] mb-4"
                style={{
                  fontFamily: t.fontBody,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              >
                {t.services.customBadge}
              </span>
              <h3
                className="text-white mb-3"
                style={{
                  fontFamily: t.fontHeading,
                  fontWeight: 800,
                  fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                }}
              >
                {t.services.customHeading}
              </h3>
              <p
                className="text-white/70 mb-6 max-w-md"
                style={{
                  fontFamily: t.fontBody,
                  fontWeight: 400,
                  fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                  lineHeight: 1.65,
                }}
              >
                {t.services.customDescription}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  window.history.pushState({}, "", "/contact");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#FAB51F] text-[#482D7A] w-full sm:w-auto justify-center sm:justify-start"
                style={{
                  fontFamily: t.fontBody,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                {t.services.customCta} <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
