import { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import emailjs from "@emailjs/browser";
//todo : make it in env 
const EMAILJS_SERVICE_ID = "service_wybaj13";
const EMAILJS_TEMPLATE_ID = "template_fz6m9wt";
const EMAILJS_PUBLIC_KEY = "-vRpD7rblXOjDMu1N";

export function ContactSection() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    country: "",
    countryOther: "",
    companyName: "",
    service: "",
    budget: "",
    details: "",
    industry: "",
    videoDuration: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isMotionService) {
      const durationSeconds = Number(form.videoDuration);
      const isValidSeconds = Number.isInteger(durationSeconds) && durationSeconds > 1;

      if (!isValidSeconds) {
        setError("Video duration must be a whole number in seconds greater than 1.");
        return;
      }
    }

    setLoading(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: "not-provided@toptech.local",
          whatsapp_number: form.whatsapp,
          country: form.country === "Other" ? form.countryOther : form.country,
          company_name: form.companyName,
          budget: form.budget || "Not specified",
          service: form.service || "Not specified",
          industry: form.industry || "Not specified",
          video_duration: form.videoDuration || "Not specified",
          message: form.details || "Not specified",
          to_email: "YOUR_EMAIL@gmail.com", // 🔧 your email here
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-[#e5e7eb] bg-white focus:outline-none focus:border-[#482D7A] focus:ring-2 focus:ring-[#482D7A]/20 transition-all duration-200 text-[#482D7A] placeholder-[#9ca3af]";

  const showProjectFields = Boolean(form.service);
  const isMotionService = form.service === "motion";
  const isOtherCountry = form.country === "Other";

  return (
    <section id="contact" className="py-16 md:py-28 bg-white">
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
            className="inline-block px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#482D7A] mb-4"
            style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
          >
            {t.contact.badge}
          </span>
          <p
            className="text-[#717182] max-w-md mx-auto"
            style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "1rem", lineHeight: 1.7 }}
          >
            {t.contact.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full"
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
                  {/* Error message */}
                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                      style={{ fontFamily: t.fontBody }}>
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5">
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
                        {t.contact.form.whatsapp} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={t.contact.form.whatsappPlaceholder}
                        className={inputClass}
                        style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                        value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label
                        className="block text-[#374151] mb-2"
                        style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                      >
                        {t.contact.form.country} *
                      </label>
                      <select
                        required
                        className={inputClass}
                        style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                        value={form.country}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            country: e.target.value,
                            countryOther: e.target.value === "Other" ? form.countryOther : "",
                          })
                        }
                      >
                        <option value="">{t.contact.form.countryPlaceholder}</option>
                        {t.contact.form.countryOptions.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {isOtherCountry && (
                      <div>
                        <label
                          className="block text-[#374151] mb-2"
                          style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                        >
                          {t.contact.form.otherCountry} *
                        </label>
                        <input
                          type="text"
                          required={isOtherCountry}
                          placeholder={t.contact.form.otherCountryPlaceholder}
                          className={inputClass}
                          style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                          value={form.countryOther}
                          onChange={(e) => setForm({ ...form, countryOther: e.target.value })}
                        />
                      </div>
                    )}

                    <div>
                      <label
                        className="block text-[#374151] mb-2"
                        style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                      >
                        {t.contact.form.companyName} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.contact.form.companyNamePlaceholder}
                        className={inputClass}
                        style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[#374151] mb-2"
                      style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                    >
                        {t.contact.form.service}
                      </label>
                      <select
                        required
                        className={inputClass}
                        style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                        value={form.service}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            service: e.target.value,
                            budget: "",
                            details: "",
                            industry: "",
                            videoDuration: "",
                          })
                        }
                      >
                        <option value="">{t.contact.form.servicePlaceholder}</option>
                        <option value="motion">{t.contact.form.motionService}</option>
                        <option value="digital">{t.contact.form.digitalService}</option>
                      </select>
                  </div>

                  {showProjectFields && (
                    <>
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <label
                            className="block text-[#374151] mb-2"
                            style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                          >
                            {t.contact.form.budget} *
                          </label>
                          <input
                            type="text"
                            required={showProjectFields}
                            placeholder={t.contact.form.budgetPlaceholder}
                            className={inputClass}
                            style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          />
                        </div>

                        <div>
                          <label
                            className="block text-[#374151] mb-2"
                            style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                          >
                            {t.contact.form.industry} *
                          </label>
                          <input
                            type="text"
                            required={showProjectFields}
                            placeholder={t.contact.form.industryPlaceholder}
                            className={inputClass}
                            style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                            value={form.industry}
                            onChange={(e) => setForm({ ...form, industry: e.target.value })}
                          />
                        </div>
                      </div>

                      {isMotionService && (
                        <div>
                          <label
                            className="block text-[#374151] mb-2"
                            style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                          >
                            {t.contact.form.videoDuration} *
                          </label>
                          <input
                            type="number"
                            min={2}
                            step={1}
                            required={isMotionService}
                            placeholder={t.contact.form.videoDurationPlaceholder}
                            className={inputClass}
                            style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                            value={form.videoDuration}
                            onChange={(e) => setForm({ ...form, videoDuration: e.target.value })}
                          />
                        </div>
                      )}

                      <div>
                        <label
                          className="block text-[#374151] mb-2"
                          style={{ fontFamily: t.fontBody, fontWeight: 500, fontSize: "0.875rem" }}
                        >
                          {t.contact.form.details} *
                        </label>
                        <textarea
                          required={showProjectFields}
                          rows={5}
                          placeholder={t.contact.form.detailsPlaceholder}
                          className={`${inputClass} resize-none`}
                          style={{ fontFamily: t.fontBody, fontSize: "0.95rem" }}
                          value={form.details}
                          onChange={(e) => setForm({ ...form, details: e.target.value })}
                        />
                      </div>
                    </>
                  )}

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

                  <motion.a
                    href="https://wa.me/966592661980"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.01, boxShadow: "0 12px 32px rgba(37,211,102,0.25)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-[#25D366] text-white cursor-pointer"
                  >
                    <MessageCircle size={20} strokeWidth={1.8} />
                    <div className="text-center">
                      <div style={{ fontFamily: t.fontHeading, fontWeight: 700, fontSize: "0.95rem" }}>
                        {t.contact.whatsapp}
                      </div>
                      <div style={{ fontFamily: t.fontBody, fontWeight: 400, fontSize: "0.8rem", opacity: 0.9 }}>
                        {t.contact.whatsappSub}
                      </div>
                    </div>
                  </motion.a>
                </form>
              )}
            </div>
        </motion.div>
      </div>
    </section>
  );
}