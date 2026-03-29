import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

const clients = [
  { name: "Aramco", abbr: "AR" },
  { name: "STC Group", abbr: "STC" },
  { name: "Almarai", abbr: "ALM" },
  { name: "NEOM", abbr: "NM" },
  { name: "Jarir", abbr: "JR" },
  { name: "Savola", abbr: "SV" },
  { name: "stc pay", abbr: "STP" },
  { name: "Noon", abbr: "NN" },
];

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {clients.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(124,58,237,0.12)" }}
              className="group flex flex-col items-center justify-center gap-3 p-8 rounded-2xl bg-white border border-[#e5e7eb] cursor-pointer transition-all duration-300"
            >
              {/* Logo placeholder */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-[#482D7A]"
                style={{ backgroundColor: "#EDE9FE" }}
              >
                <span
                  className="text-[#482D7A] group-hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.05em" }}
                >
                  {client.abbr}
                </span>
              </div>
              <span
                className="text-[#717182] group-hover:text-[#482D7A] transition-colors duration-300"
                style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.875rem" }}
              >
                {client.name}
              </span>
            </motion.div>
          ))}
        </div>

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