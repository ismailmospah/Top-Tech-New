import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function AnimatedLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-[#482D7A]/20"
          style={{
            top: `${20 + i * 18}%`,
            left: 0,
            right: 0,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: "easeOut" }}
        />
      ))}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-px bg-[#482D7A]/10"
          style={{
            left: `${25 + i * 25}%`,
            top: 0,
            bottom: 0,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function PulsingDot({ top, left, size, color, delay }: { top: string; left: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ top, left, width: size, height: size, backgroundColor: color }}
      animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.3, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function HeroSection() {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0620]">
      {/* Animated grid lines */}
      <AnimatedLines />

      {/* Corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-40 h-40 border-l-2 border-t-2 border-[#482D7A]/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-40 h-40 border-r-2 border-b-2 border-[#482D7A]/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-[15%] right-[10%] w-16 h-16 border-2 border-[#FAB51F]/20 rotate-45 hidden md:block"
        animate={{ y: [0, -12, 0], rotate: [45, 50, 40, 45] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[22%] left-[7%] w-12 h-12 border-2 border-[#8B7BB8]/15 rounded-full hidden md:block"
        animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute top-[50%] right-[6%] w-8 h-8 border border-[#482D7A]/25 hidden lg:block"
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[35%] left-[4%] w-1 h-16 bg-[#FAB51F]/15 hidden md:block"
        animate={{ scaleY: [1, 1.5, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing dots */}
      <PulsingDot top="20%" left="30%" size={4} color="rgba(250,181,31,0.4)" delay={0} />
      <PulsingDot top="65%" left="85%" size={3} color="rgba(139,123,184,0.4)" delay={1} />
      <PulsingDot top="75%" left="15%" size={3} color="rgba(250,181,31,0.3)" delay={2} />
      <PulsingDot top="12%" left="70%" size={4} color="rgba(139,123,184,0.3)" delay={0.5} />
      <PulsingDot top="45%" left="92%" size={3} color="rgba(250,181,31,0.25)" delay={1.5} />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center pt-24 pb-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#482D7A]/30 bg-[#482D7A]/10 mb-8"
        >
          <Sparkles size={14} className="text-[#FAB51F]" />
          <span
            className="text-[#C4B5FD]"
            style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.825rem" }}
          >
            {t.hero.badge}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-white mb-6"
          style={{
            fontFamily: t.fontHeading,
            fontWeight: 800,
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
          }}
        >
          {t.hero.heading1}
          <br />
          <span className="text-[#FAB51F] relative inline-block">
            {t.hero.heading2}
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#FAB51F]/40 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              style={{ transformOrigin: "left" }}
            />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-white/50 max-w-2xl mx-auto mb-10 px-2"
          style={{
            fontFamily: t.fontBody,
            fontWeight: 400,
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.7,
          }}
        >
          {t.hero.description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection("#portfolio")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAB51F] text-[#1a0533] cursor-pointer"
            style={{ fontFamily: t.fontBody, fontWeight: 700, fontSize: "1rem" }}
          >
            {t.hero.btnWork}
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(72,45,122,0.25)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection("#contact")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full border border-white/15 text-white cursor-pointer"
            style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "1rem" }}
          >
            <span className="w-8 h-8 rounded-full bg-[#482D7A]/40 flex items-center justify-center">
              <Play size={12} className="ml-0.5" fill="white" />
            </span>
            {t.hero.btnStart}
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom solid divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-[#482D7A]/15 w-full" />
      </div>
    </section>
  );
}