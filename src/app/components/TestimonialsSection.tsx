import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const avatars = [
  { avatar: "AR", avatarColor: "#482D7A" },
  { avatar: "SO", avatarColor: "#482D7A" },
  { avatar: "KH", avatarColor: "#482D7A" },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const { t, isRTL } = useLanguage();
  const items = t.testimonials.items;

  useEffect(() => {
    if (current >= items.length) {
      setCurrent(0);
    }
  }, [current, items.length]);

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));

  const item = items[current] ?? items[0];
  const avatarEntry = avatars[current % avatars.length] ?? avatars[0];
  const avatar = avatarEntry.avatar;
  const avatarColor = avatarEntry.avatarColor;

  return (
    <section className="py-16 md:py-28 bg-[#1a0533] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#482D7A]/20 text-[#C4B5FD] mb-4"
            style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
          >
            {t.testimonials.badge}
          </span>
          <h2
            className="text-white"
            style={{
              fontFamily: t.fontHeading,
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
            }}
          >
            {t.testimonials.heading}
            <br />
            <span className="text-[#FAB51F]">{t.testimonials.headingAccent}</span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 40 : -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-gradient-to-br from-[#1a0533] to-[#12022a] rounded-3xl p-6 md:p-14 border border-white/10"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-20">
                <Quote size={64} color="#482D7A" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="#FAB51F" color="#FAB51F" />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-white/85 mb-10 max-w-3xl"
                style={{
                  fontFamily: t.fontBody,
                  fontWeight: 400,
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  lineHeight: 1.8,
                }}
              >
                "{item.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: avatarColor + "33", border: `1.5px solid ${avatarColor}50` }}
                >
                  <span
                    className="text-white"
                    style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.85rem" }}
                  >
                    {avatar}
                  </span>
                </div>
                <div>
                  <div
                    className="text-white"
                    style={{ fontFamily: t.fontHeading, fontWeight: 700, fontSize: "1rem" }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-white/50"
                    style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.875rem" }}
                  >
                    {item.role} · {item.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: current === i ? "2rem" : "0.5rem",
                    height: "0.5rem",
                    backgroundColor: current === i ? "#FAB51F" : "rgba(255,255,255,0.25)",
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={isRTL ? next : prev}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-200"
              >
                {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={isRTL ? prev : next}
                className="w-12 h-12 rounded-full bg-[#482D7A] flex items-center justify-center text-white hover:bg-[#6D28D9] transition-colors duration-200"
              >
                {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}