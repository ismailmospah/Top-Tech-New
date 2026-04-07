import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function CTASection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-6 md:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          dir={isRTL ? "rtl" : "ltr"}
          className="relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#482D7A] via-[#482D7A] to-[#3a2260] px-6 py-14 md:px-16 md:py-20 text-center"
        >
          {/* Content */}
          <div className="relative z-10">
          

            <h2
              className="text-white mb-6 mx-auto max-w-3xl"
              style={{
                fontFamily: t.fontHeading,
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {t.cta.heading}{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #FAB51F, #F59E0B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.cta.headingAccent}
              </span>
            </h2>

            <p
              className="text-white/60 max-w-xl mx-auto mb-10"
              style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "1.05rem", lineHeight: 1.7 }}
            >
              {t.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.07, boxShadow: "0 0 40px rgba(251,191,36,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  window.history.pushState({}, "", "/contact");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 rounded-full bg-[#FAB51F] text-[#482D7A] shadow-xl shadow-yellow-500/30"
                style={{ fontFamily: t.fontBody, fontWeight: 700, fontSize: "1rem" }}
              >
                {t.cta.btnStart}
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/30 text-white transition-colors duration-200"
                style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "1rem" }}
              >
                {t.cta.btnWork}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}