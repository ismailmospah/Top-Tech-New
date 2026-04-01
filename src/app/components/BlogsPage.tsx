import { ArrowLeft } from "lucide-react";
import blogsData from "../data/blogs.json";
import { useLanguage } from "../context/LanguageContext";

export function BlogsPage() {
  const { t, lang } = useLanguage();
  const blogs = blogsData;

  return (
    <section id="blogs" className="py-16 md:py-24 bg-[#1a0533] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <span
              className="inline-block px-4 py-1.5 rounded-full bg-[#482D7A]/20 text-[#C4B5FD] mb-4"
              style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
            >
              {lang === "ar" ? "المدونة" : "BLOG"}
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
              {lang === "ar" ? "مقالاتنا قريباً" : "Blogs Coming Soon"}
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
            {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </button>
        </div>

      
      </div>
    </section>
  );
}
