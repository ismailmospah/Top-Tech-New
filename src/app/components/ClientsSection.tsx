/// <reference types="vite/client" />

import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

const clientImages = Object.values(
  import.meta.glob("/src/assets/clients/*.{png,jpg,jpeg,webp,svg,avif}", {
    eager: true,
    import: "default",
  }),
) as string[];

export function ClientsSection() {
  const { t } = useLanguage();

  return (
    <section id="clients" className="py-16 md:py-24 bg-[#f8f7ff]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p
            className="text-[#717182] mb-2"
            style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem", letterSpacing: "0.05em" }}
          >
            {t.clients.trusted}
          </p>
          <h2
            className="text-[#482D7A]"
            style={{ fontFamily: t.fontHeading, fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
          >
            {t.clients.heading}{" "}
            <span className="text-[#482D7A]">{t.clients.headingAccent}</span>
          </h2>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {clientImages.map((imageSrc, i) => (
            <motion.div
              key={imageSrc}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(124,58,237,0.12)" }}
              className="group aspect-square overflow-hidden rounded-xl bg-white border border-[#e5e7eb] cursor-pointer transition-all duration-300"
            >
              <img
                src={imageSrc}
                alt="Client logo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {clientImages.length === 0 && (
          <p
            className="text-center text-[#717182] mt-6"
            style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.95rem" }}
          >
            Add your client logos to src/assets/clients
          </p>
        )}

        {/* Partner Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-[#717182] mt-10"
          style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.9rem" }}
        >
          {t.clients.more}
        </motion.p>
      </div>
    </section>
  );
}