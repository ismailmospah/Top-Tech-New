import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function ContactSection() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-[#e5e7eb] bg-white focus:outline-none focus:border-[#482D7A] focus:ring-2 focus:ring-[#482D7A]/20 transition-all duration-200 text-[#482D7A] placeholder-[#9ca3af]";

  const infoCards = [
    {
      icon: Mail,
      label: t.contact.emailLabel,
      value: "hello@motio.sa",
      color: "#482D7A",
      bg: "#EDE9FE",
    },
    {
      icon: MapPin,
      label: t.contact.locationLabel,
      value: t.contact.locationValue,
      color: "#5B21B6",
      bg: "#DDD6FE",
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#482D7A] mb-4"
            style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
          >
            {t.contact.badge}
          </span>
          <h2
            className="text-[#482D7A] mb-4"
            style={{
              fontFamily: t.fontHeading,
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
            }}
          >
            {t.contact.heading}
            <br />
            <span className="text-[#482D7A]">{t.contact.headingAccent}</span>
          </h2>
          <p
            className="text-[#717182] max-w-md mx-auto"
            style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "1rem", lineHeight: 1.7 }}
          >
            {t.contact.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Info Cards */}
            {infoCards.map((info) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.label}
                  whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(124,58,237,0.1)" }}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-[#e5e7eb] bg-white transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: info.bg }}
                  >
                    <Icon size={22} color={info.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div
                      className="text-[#717182] mb-0.5"
                      style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.8rem" }}
                    >
                      {info.label}
                    </div>
                    <div
                      className="text-[#482D7A]"
                      style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.95rem" }}
                    >
                      {info.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, boxShadow: "0 12px 32px rgba(37,211,102,0.25)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-[#25D366] text-white cursor-pointer"
            >
              <MessageCircle size={22} strokeWidth={1.8} />
              <div>
                <div style={{ fontFamily: t.fontHeading, fontWeight: 700, fontSize: "0.95rem" }}>
                  {t.contact.whatsapp}
                </div>
                <div style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.8rem", opacity: 0.85 }}>
                  {t.contact.whatsappSub}
                </div>
              </div>
            </motion.a>

            {/* Decorative card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#3a2260] to-[#482D7A] text-white mt-auto">
              <div
                className="mb-2"
                style={{ fontFamily: t.fontHeading, fontWeight: 700, fontSize: "1.1rem" }}
              >
                {t.contact.turnaround}
              </div>
              <p
                style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.6, opacity: 0.8 }}
              >
                {t.contact.turnaroundText}
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="p-5 sm:p-8 md:p-10 rounded-3xl border border-[#e5e7eb] bg-white shadow-xl shadow-purple-50">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#EDE9FE] flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} color="#482D7A" />
                  </div>
                  <h3
                    className="text-[#482D7A] mb-3"
                    style={{ fontFamily: t.fontHeading, fontWeight: 800, fontSize: "1.5rem" }}
                  >
                    {t.contact.form.successTitle}
                  </h3>
                  <p
                    className="text-[#717182]"
                    style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.95rem", lineHeight: 1.7 }}
                  >
                    {t.contact.form.successText}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="block text-[#374151] mb-2"
                        style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                      >
                        {t.contact.form.name} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.contact.form.namePlaceholder}
                        className={inputClass}
                        style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[#374151] mb-2"
                        style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                      >
                        {t.contact.form.email} *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={t.contact.form.emailPlaceholder}
                        className={inputClass}
                        style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="block text-[#374151] mb-2"
                        style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                      >
                        {t.contact.form.company}
                      </label>
                      <input
                        type="text"
                        placeholder={t.contact.form.companyPlaceholder}
                        className={inputClass}
                        style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[#374151] mb-2"
                        style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                      >
                        {t.contact.form.service}
                      </label>
                      <select
                        className={inputClass}
                        style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                      >
                        <option value="">{t.contact.form.servicePlaceholder}</option>
                        {t.contact.form.serviceOptions.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[#374151] mb-2"
                      style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                    >
                      {t.contact.form.message} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={t.contact.form.messagePlaceholder}
                      className={`${inputClass} resize-none`}
                      style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#482D7A] text-white disabled:opacity-70 transition-all duration-200"
                    style={{ fontFamily: t.fontBody, fontWeight: 700, fontSize: "1rem" }}
                  >
                    {loading ? (
                      <span>{t.contact.form.sending}</span>
                    ) : (
                      <>
                        {t.contact.form.submit}
                        <Send size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}