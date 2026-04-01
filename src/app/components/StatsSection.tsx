import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export function StatsSection() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#0f0620] py-10 md:py-14">
      {/* Subtle top gradient blend */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0f0620] to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 justify-center"
        >
          {t.hero.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center px-4 py-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
            >
              <div
                className="text-[#FAB51F] mb-2"
                style={{ fontFamily: t.fontHeading, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.4rem)" }}
              >
                {stat.value}
              </div>
              <div
                className="text-white/50"
                style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.85rem" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom divider to white */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-[#482D7A]/15 w-full" />
      </div>
    </section>
  );
}
