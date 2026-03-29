import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, ExternalLink } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const projectImages = [
  "https://images.unsplash.com/photo-1737768437560-9d523fa3adc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3Rpb24lMjBncmFwaGljcyUyMGFic3RyYWN0JTIwcHVycGxlJTIwYW5pbWF0aW9ufGVufDF8fHx8MTc3MzAwNzExOHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1762787863004-767d5d7eac07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGRlc2lnbiUyMGxvZ28lMjBpZGVudGl0eXxlbnwxfHx8fDE3NzMwMDcxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1651085039733-ff793bd5af27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsYWluZXIlMjB2aWRlbyUyMGFuaW1hdGlvbiUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MzAwNzEyMHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1764664281874-95ebc77286a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGRpZ2l0YWwlMjBjb250ZW50JTIwY3JlYXRpdmV8ZW58MXx8fHwxNzczMDA3MTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1662658825247-8fe2a88da496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFuaW1hdGlvbiUyMHJlbmRlciUyMGFic3RyYWN0JTIwY29sb3JmdWx8ZW58MXx8fHwxNzczMDA3MTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1762028892567-6ebfbb894992?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMHByb2R1Y3Rpb24lMjBzdHVkaW8lMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NzI5NTMwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

const accents = ["#482D7A", "#FAB51F", "#8B7BB8", "#FAB51F", "#482D7A", "#8B7BB8"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export function PortfolioSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = t.portfolio.categories;
  const projects = t.portfolio.projects.map((p, i) => ({
    ...p,
    id: i + 1,
    image: projectImages[i],
    accent: accents[i],
  }));

  const filtered =
    activeIndex === 0
      ? projects
      : projects.filter((p) => p.category === categories[activeIndex]);

  return (
    <section id="portfolio" className="py-16 md:py-28 bg-[#1a0533]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#482D7A]/20 text-[#C4B5FD] mb-4"
            style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
          >
            {t.portfolio.badge}
          </span>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: t.fontHeading,
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
            }}
          >
            {t.portfolio.heading}
            <br />
            <span className="text-[#FAB51F]">{t.portfolio.headingAccent}</span>
          </h2>
          <p
            className="text-white/50 max-w-xl mx-auto"
            style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "1rem", lineHeight: 1.7 }}
          >
            {t.portfolio.description}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveIndex(i)}
              className="px-4 md:px-5 py-2 rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0"
              style={{
                fontFamily: t.fontBody,
                fontWeight: 600,
                fontSize: "0.875rem",
                backgroundColor: activeIndex === i ? "#FAB51F" : "rgba(255,255,255,0.08)",
                color: activeIndex === i ? "#482D7A" : "rgba(255,255,255,0.6)",
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0533] via-[#1a0533]/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* External link icon */}
                <motion.div
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <ExternalLink size={16} className="text-white" />
                </motion.div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span
                    className="inline-block px-3 py-1 rounded-full mb-3"
                    style={{
                      fontFamily: t.fontBody,
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      backgroundColor: project.accent + "33",
                      color: project.accent,
                      border: `1px solid ${project.accent}50`,
                    }}
                  >
                    {project.category}
                  </span>
                  <h3
                    className="text-white"
                    style={{ fontFamily: t.fontHeading, fontWeight: 700, fontSize: "1.15rem" }}
                  >
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    <Play size={12} className="text-[#FAB51F]" fill="#FAB51F" />
                    <span
                      className="text-[#FAB51F]"
                      style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.82rem" }}
                    >
                      {t.portfolio.viewProject}
                    </span>
                  </div>
                </div>

                {/* Accent border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 2px ${project.accent}40` }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(72,45,122,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full border border-[#482D7A]/50 text-white hover:bg-[#482D7A]/20 transition-colors duration-200"
            style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.95rem" }}
          >
            {t.portfolio.viewAll}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}