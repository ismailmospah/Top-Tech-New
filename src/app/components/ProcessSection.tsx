import { motion } from "motion/react";
import { Lightbulb, BookOpen, Sparkles, Rocket } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const icons = [Lightbulb, BookOpen, Sparkles, Rocket];
const stepColors = [
  { color: "#FAB51F", bgColor: "#FEF3C7" },
  { color: "#482D7A", bgColor: "#EDE9FE" },
  { color: "#FAB51F", bgColor: "#FEF3C7" },
  { color: "#482D7A", bgColor: "#EDE9FE" },
];
const stepNumbers = ["01", "02", "03", "04"];

export function ProcessSection() {
  const { t } = useLanguage();

  return (
    <section id="process" className="py-16 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#482D7A] mb-4"
            style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
          >
            {t.process.badge}
          </span>
          <h2
            className="text-[#482D7A]"
            style={{
              fontFamily: t.fontHeading,
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
            }}
          >
            {t.process.heading}{" "}
            <span className="text-[#482D7A]">{t.process.headingAccent}</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#FAB51F] via-[#482D7A] to-[#FAB51F]" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.process.steps.map((step, i) => {
              const Icon = icons[i];
              const { color, bgColor } = stepColors[i];
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                    style={{ backgroundColor: bgColor }}
                  >
                    <Icon size={32} color={color} strokeWidth={1.7} />
                    {/* Number badge */}
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
                      style={{ backgroundColor: color }}
                    >
                      <span
                        className="text-white"
                        style={{ fontFamily: t.fontHeading, fontWeight: 800, fontSize: "0.65rem" }}
                      >
                        {stepNumbers[i]}
                      </span>
                    </div>
                  </motion.div>

                  <h3
                    className="text-[#482D7A] mb-3"
                    style={{ fontFamily: t.fontHeading, fontWeight: 700, fontSize: "1.25rem" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-[#717182] max-w-xs mx-auto"
                    style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.65 }}
                  >
                    {step.description}
                  </p>

                  {/* Mobile connector */}
                  {i < t.process.steps.length - 1 && (
                    <div className="lg:hidden w-0.5 h-8 bg-gradient-to-b from-[#482D7A]/30 to-transparent mt-6" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 md:mt-20 p-6 md:p-10 rounded-3xl bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div>
            <h3
              className="text-[#482D7A] mb-2"
              style={{ fontFamily: t.fontHeading, fontWeight: 800, fontSize: "1.5rem" }}
            >
              {t.process.ctaHeading}
            </h3>
            <p
              className="text-[#717182]"
              style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.95rem" }}
            >
              {t.process.ctaSubtext}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(250,181,31,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              window.history.pushState({}, "", "/contact");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="w-full md:w-auto px-8 py-4 rounded-full bg-[#482D7A] text-white shadow-lg shadow-purple-500/25 whitespace-nowrap"
            style={{ fontFamily: t.fontBody, fontWeight: 700, fontSize: "0.95rem" }}
          >
            {t.process.ctaBtn}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}