/// <reference types="vite/client" />

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, ExternalLink, ArrowLeft, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import projectsData from "../data/projects.json";

type ProjectItem = {
  id: number | string;
  title: string;
  category: string;
  image: string;
  accent: string;
  youtubeUrl: string | null;
  isDesign?: boolean;
};

const getYouTubeId = (url: string | null) => {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    if (parsed.pathname.includes("/embed/")) {
      return parsed.pathname.split("/embed/")[1]?.split("/")[0] ?? null;
    }

    if (parsed.pathname.includes("/shorts/")) {
      return parsed.pathname.split("/shorts/")[1]?.split("/")[0] ?? null;
    }

    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
};

const getYouTubeEmbedUrl = (url: string | null) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

const getYouTubeThumbnail = (url: string | null) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

export function ProjectsPage() {
  const { t, lang } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const designCategoryLabel = lang === "ar" ? "تصاميم" : "Designs";
  const videographyCategoryLabel = lang === "ar" ? "تصوير" : "Videography";
  const designImages = Object.values(
    import.meta.glob("/src/assets/projects/designs/*.{png,jpg,jpeg,webp,svg}", {
      eager: true,
      import: "default",
    }),
  ) as string[];

  const categories = [...t.portfolio.categories, designCategoryLabel, videographyCategoryLabel];

  const projects: ProjectItem[] = projectsData.map((p) => ({
    id: p.id,
    title: lang === "ar" ? p.titleAr : p.title,
    category: lang === "ar" ? p.categoryAr : p.category,
    image: getYouTubeThumbnail(p.youtubeUrl) ?? p.image,
    accent: p.accent,
    youtubeUrl: getYouTubeEmbedUrl(p.youtubeUrl),
  }));

  const designProjects: ProjectItem[] = designImages.map((image, idx) => ({
    id: `design-${idx}`,
    title: `Design ${idx + 1}`,
    category: designCategoryLabel,
    image,
    accent: "#FAB51F",
    youtubeUrl: null,
    isDesign: true,
  }));

  const allProjects: ProjectItem[] = [...projects, ...designProjects];
  const filteredProjects =
    activeIndex === 0
      ? allProjects
      : allProjects.filter((project) => project.category === categories[activeIndex]);

  return (
    <section id="projects" className="py-16 md:py-24 bg-[#1a0533] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12"
        >
          <div>
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-[#482D7A]/20 text-[#C4B5FD] mb-4"
              style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
            >
              {t.portfolio.badge}
            </span>
            <h1
              className="text-white"
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
            </h1>
          </div>

          <button
            onClick={() => {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.9rem" }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center justify-start md:justify-center gap-2 mb-10 overflow-x-auto pb-2"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -6 }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${project.isDesign ? "aspect-square" : "aspect-[4/3]"}`}
              onClick={() => {
                if (project.youtubeUrl) {
                  setActiveVideoUrl(project.youtubeUrl);
                }
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {!project.isDesign ? (
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0533] via-[#1a0533]/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
              ) : null}

              {!project.isDesign ? (
                <motion.div
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <ExternalLink size={16} className="text-white" />
                </motion.div>
              ) : null}

              {!project.isDesign ? (
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
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    <Play size={12} className="text-[#FAB51F]" fill="#FAB51F" />
                    <span
                      className="text-[#FAB51F]"
                      style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.82rem" }}
                    >
                      {t.portfolio.viewProject}
                    </span>
                  </div>
                  {project.youtubeUrl ? (
                    <div
                      className="text-white/80 mt-2"
                      style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.78rem" }}
                    >
                      Live video: YouTube
                    </div>
                  ) : null}
                </div>
              ) : null}

              {!project.isDesign ? (
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 2px ${project.accent}40` }}
                />
              ) : null}
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {activeVideoUrl ? (
            <motion.div
              className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideoUrl(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => setActiveVideoUrl(null)}
                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                    aria-label="Close video"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden bg-black">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={activeVideoUrl}
                    title="Project video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
