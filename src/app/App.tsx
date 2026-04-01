import "../styles/fonts.css";
import { useEffect, useState } from "react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { ServicesSection } from "./components/ServicesSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { ProcessSection } from "./components/ProcessSection";
import { ClientsSection } from "./components/ClientsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { CTASection } from "./components/CTASection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { ProjectsPage } from "./components/ProjectsPage";
import { BlogsPage } from "./components/BlogsPage";

function AppInner() {
  const { isRTL, t } = useLanguage();
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const isProjectsPage = pathname === "/projects";
  const isBlogsPage = pathname === "/blogs";
  const isContactPage = pathname === "/contact";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen overflow-x-hidden"
      style={{ fontFamily: t.fontBody }}
    >
      <Navbar />
      {isProjectsPage ? (
        <ProjectsPage />
      ) : isBlogsPage ? (
        <BlogsPage />
      ) : isContactPage ? (
        <ContactSection />
      ) : (
        <>
          <HeroSection />
          <StatsSection />
          <ServicesSection />
          <PortfolioSection />
          <ProcessSection />
          <ClientsSection />
          <TestimonialsSection />
          <CTASection />
        </>
      )}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}