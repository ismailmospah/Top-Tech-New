/* ============================================================
   TOP TECH — Concept 4 · Bilingual engine (EN / AR)
   In-place language toggle with RTL + Arabic typography.
   Shared by index.html and contact.html.
   ============================================================ */

const I18N = {
  /* ---------- header / chrome ---------- */
  nav_story:    { en: "Story",            ar: "قصتنا" },
  nav_services: { en: "Services",         ar: "خدماتنا" },
  nav_clients:  { en: "Clients",          ar: "عملاؤنا" },
  nav_insights: { en: "Insights",         ar: "مقالات" },
  nav_contact:  { en: "Contact",          ar: "تواصل" },
  nav_cta:      { en: "Start a project",  ar: "ابدأ مشروعك" },
  loader_label: { en: "Engineering attention", ar: "نهندس الانتباه" },

  /* ---------- hero ---------- */
  hero_kicker: { en: "Marketing Agency — KSA & Egypt", ar: "وكالة تسويق — السعودية ومصر" },
  hero_title: {
    en: '<span class="hero__line"><span class="split" data-split>WE</span>&nbsp;<span class="split" data-split>MAKE</span></span> <span class="hero__line hero__line--accent"><span class="split" data-split>BRANDS</span>&nbsp;<span class="split split--outline" data-split>GROW</span><span class="split hero__dot" data-split>.</span></span>',
    ar: '<span class="hero__line"><span class="split" data-split>نُنمّي</span></span> <span class="hero__line hero__line--accent"><span class="split split--outline" data-split>العلامات</span><span class="split hero__dot" data-split>.</span></span>',
  },
  hero_blurb: {
    en: "Top Tech is a full-service marketing agency born from motion.<br>We combine creativity with strategy to deliver content that<br>doesn't just look good — it actually performs.",
    ar: "توب تك وكالة تسويق متكاملة وُلدت من رحم الموشن جرافيك.<br>نمزج الإبداع بالاستراتيجية لنصنع محتوى لا يبدو رائعًا فحسب<br>— بل يحقق نتائج حقيقية.",
  },
  hero_scroll: { en: "Scroll", ar: "مرّر" },
  marquee_a: {
    en: "Strategy ✳ Social Media ✳ Media Buying ✳ Motion ✳ Move your brand ✳ Reels",
    ar: "استراتيجية ✳ سوشيال ميديا ✳ شراء إعلانات ✳ موشن جرافيك ✳ حرّك علامتك ✳ ريلز",
  },
  marquee_b: {
    en: "80+ Brands ✳ 200+ Motion Videos ✳ 150+ Designs ✳ One Obsession",
    ar: "80+ علامة ✳ 200+ فيديو موشن ✳ 150+ تصميم ✳ هوسٌ واحد",
  },

  /* ---------- story ---------- */
  story_index:    { en: "01 — The evolution", ar: "01 — رحلتنا" },
  story_headline: {
    en: "Born in motion.<br><em>Built for marketing.</em>",
    ar: "وُلدنا من الحركة.<br><em>بُنينا للتسويق.</em>",
  },
  phase1_title: { en: "The Studio Era", ar: "زمن الاستوديو" },
  phase1_desc:  { en: "We started as Saudi Arabia's premier motion graphics studio — crafting animation, video and visual stories that made brands unforgettable.", ar: "بدأنا كأبرز استوديو موشن جرافيك في السعودية — نصنع الأنميشن والفيديو والقصص البصرية التي تجعل العلامات لا تُنسى." },
  phase1_label: { en: "Motion Graphics", ar: "موشن جرافيك" },
  phase2_title: { en: "The Content Years", ar: "سنوات المحتوى" },
  phase2_desc:  { en: "Brands didn't just want videos. They wanted audiences. So we built full content engines — planning, producing and publishing across every platform.", ar: "العلامات لم تكتفِ بالفيديوهات. أرادت جمهورًا. فبنينا محركات محتوى متكاملة — تخطيط وإنتاج ونشر على كل منصة." },
  phase2_label: { en: "Content & Social", ar: "محتوى وسوشيال" },
  phase3_title: { en: "The Agency. Now.", ar: "الوكالة. الآن." },
  phase3_desc:  { en: "Today Top Tech is a full-stack marketing agency. Strategy, campaigns, performance and creative under one roof. The craft stayed. The mission grew.", ar: "اليوم توب تك وكالة تسويق متكاملة. استراتيجية وحملات وأداء وإبداع تحت سقف واحد. الحِرفة باقية، والرسالة أكبر." },
  phase3_label: { en: "Full-Service Marketing", ar: "تسويق متكامل" },

  /* ---------- services ---------- */
  services_index: { en: "02 — What we do", ar: "02 — ماذا نقدّم" },
  services_title: {
    en: "Everything your brand needs<br><em>to grow loud.</em>",
    ar: "كل ما تحتاجه علامتك<br><em>لتنمو بصوتٍ عالٍ.</em>",
  },
  svc1_name: { en: "Marketing Strategy", ar: "استراتيجية التسويق" },
  svc1_desc: { en: "Positioning, market research and go-to-market plans built on data — not guesswork.", ar: "تموضع وأبحاث سوق وخطط انطلاق مبنية على البيانات — لا على التخمين." },
  svc2_name: { en: "Social Media Marketing", ar: "تسويق السوشيال ميديا" },
  svc2_desc: { en: "Organic and paid campaigns across every platform your audience lives on.", ar: "حملات عضوية ومدفوعة على كل منصة يعيش فيها جمهورك." },
  svc3_name: { en: "Content Management", ar: "إدارة المحتوى" },
  svc3_desc: { en: "End-to-end social content — graphics, videos and reels, planned and produced for your brand.", ar: "محتوى سوشيال متكامل — جرافيك وفيديوهات وريلز، مخطّط ومُنتَج لعلامتك." },
  svc4_name: { en: "Branding & Design", ar: "الهوية والتصميم" },
  svc4_desc: { en: "Identities, systems and graphic design that make brands recognisable at a glance.", ar: "هويات وأنظمة وتصميم جرافيك تجعل علامتك مميّزة من النظرة الأولى." },
  svc5_name: { en: "Motion & Video", ar: "الموشن والفيديو" },
  svc5_desc: { en: "Our origin craft — motion graphics, video editing and videography with cinematic polish.", ar: "حرفتنا الأصلية — موشن جرافيك ومونتاج وتصوير بلمسة سينمائية." },
  svc6_name: { en: "Media Buying", ar: "إعلانات ممولة" },
  services_all: { en: 'All services <i aria-hidden="true">&rarr;</i>', ar: 'كل الخدمات <i aria-hidden="true">&rarr;</i>' },
  svc6_desc: { en: "Paid campaigns planned, placed and optimised — turning ad spend into measurable growth.", ar: "حملات مدفوعة مخططة ومُدارة ومُحسّنة — تحوّل الإنفاق إلى نمو ملموس." },

  /* ---------- reviews ---------- */
  reviews_index: { en: "03 — Client love", ar: "03 — رأي عملائنا" },
  reviews_title: {
    en: "Straight from our<br><em>clients' chats.</em>",
    ar: "مباشرةً من<br><em>محادثات عملائنا.</em>",
  },

  /* ---------- stats ---------- */
  stats_index: { en: "04 — Signal strength", ar: "04 — قوة الإشارة" },
  stat1: { en: "Brands trust us across KSA & the GCC", ar: "علامة تثق بنا في السعودية والخليج" },
  stat2: { en: "Motion videos produced", ar: "فيديو موشن أنتجناه" },
  stat3: { en: "Social media designs delivered", ar: "تصميم سوشيال سلّمناه" },
  stat4: { en: "Response time on every brief", ar: "وقت الرد على كل طلب" },

  /* ---------- contact (homepage footer) ---------- */
  contact_kicker: { en: "05 — Ready when you are", ar: "05 — جاهزون وقتما تشاء" },
  contact_title: {
    en: '<span class="contact__line">LET\'S MAKE</span> <span class="contact__line contact__line--outline">NOISE</span>',
    ar: '<span class="contact__line">لنُحدث</span> <span class="contact__line contact__line--outline">ضجّة.</span>',
  },
  contact_sub: { en: "Tell us about your project — we reply within 24 hours.", ar: "احكِ لنا عن مشروعك — نرد خلال 24 ساعة." },
  contact_cta: { en: 'Start a project <i>→</i>', ar: 'ابدأ مشروعك <i>→</i>' },
  meta_talk:    { en: "Talk now", ar: "تواصل الآن" },
  meta_socials: { en: "Socials", ar: "السوشيال" },
  meta_base:    { en: "Offices", ar: "مكاتبنا" },
  meta_base_text: { en: "Riyadh, KSA · Cairo, Egypt<br>Sun–Thu · 9am–6pm", ar: "الرياض، السعودية · القاهرة، مصر<br>الأحد–الخميس · 9ص–6م" },
  meta_copy:      { en: "© 2026", ar: "© 2026" },
  meta_copy_text: { en: "Top Tech.<br>All signals reserved.", ar: "توب تك.<br>جميع الحقوق محفوظة." },

  /* ---------- contact page ---------- */
  back_home:    { en: "Back home", ar: "العودة للرئيسية" },
  cform_index:  { en: "Transmission open", ar: "القناة مفتوحة" },
  cform_title: {
    en: '<span class="cform__line">LET\'S BUILD</span> <span class="cform__line cform__line--outline">SOMETHING.</span>',
    ar: '<span class="cform__line">لنبنِ</span> <span class="cform__line cform__line--outline">شيئًا معًا.</span>',
  },
  cform_lead: {
    en: "Tell us about your brand and what you're trying to move. We reply within <strong>24 hours</strong>.",
    ar: "احكِ لنا عن علامتك وما الذي تريد تحريكه. نرد خلال <strong>24 ساعة</strong>.",
  },
  cform_c_wa:        { en: "WhatsApp", ar: "واتساب" },
  cform_c_email:     { en: "Email", ar: "البريد" },
  cform_c_base:      { en: "Offices", ar: "مكاتبنا" },
  cform_c_base_text: { en: "Riyadh, KSA · Cairo, Egypt · Sun–Thu, 9am–6pm", ar: "الرياض، السعودية · القاهرة، مصر · الأحد–الخميس، 9ص–6م" },
  f_name:    { en: "Your name", ar: "اسمك" },
  f_email:   { en: "Email", ar: "البريد الإلكتروني" },
  f_company: { en: 'Company <em>(optional)</em>', ar: 'الشركة <em>(اختياري)</em>' },
  f_needs:   { en: "What do you need?", ar: "ماذا تحتاج؟" },
  f_whatsapp:{ en: "WhatsApp number", ar: "رقم الواتساب" },
  f_country: { en: "Which country?", ar: "أي دولة؟" },
  country_ksa: { en: "Saudi Arabia", ar: "السعودية" },
  country_eg:  { en: "Egypt", ar: "مصر" },
  f_budget:  { en: "Budget range", ar: "نطاق الميزانية" },
  budget_hint: { en: "Pick a country first", ar: "اختر الدولة أولاً" },
  budget_undecided: { en: "Not decided yet", ar: "لم يتم التحديد بعد" },
  cur_sar: { en: "SAR", ar: "ريال" },
  cur_egp: { en: "EGP", ar: "جنيه" },
  f_message: { en: "Tell us about the project", ar: "احكِ لنا عن المشروع" },
  f_submit:  { en: 'Send the brief <i>→</i>', ar: 'أرسل البريف <i>→</i>' },
  success_title: { en: "Brief received.", ar: "تم استلام طلبك." },
  success_text: {
    en: 'Thanks <span id="successName">there</span> — we\'ll be in touch within 24 hours. For anything urgent, ping us on WhatsApp.',
    ar: 'شكرًا <span id="successName">صديقنا</span> — سنتواصل معك خلال 24 ساعة. لأي أمر عاجل، راسلنا على واتساب.',
  },
  success_back: { en: "Back to home", ar: "العودة للرئيسية" },

  /* ---------- JS strings (read by contact.js) ---------- */
  err_required: { en: "Please fill in your name, a valid email and a short message.", ar: "من فضلك أدخل اسمك وبريدًا صحيحًا ورسالة قصيرة." },
  err_send: { en: "Couldn't send — please try again or message us on WhatsApp.", ar: "تعذّر الإرسال — حاول مرة أخرى أو راسلنا على واتساب." },
  sending:      { en: "Sending…", ar: "جارٍ الإرسال…" },
};

const LANG_KEY = "toptech-lang";

/* ------------------------------------------------------------
   Language is decided by the URL, not by JavaScript.
   Every page ships its own language in the markup:
     /            /contact           →  <html lang="en" dir="ltr">
     /ar          /ar/contact        →  <html lang="ar" dir="rtl">
   That makes both languages crawlable and independently indexable.
   This file keeps the shared dictionary (contact.js reads it through
   window.TT_T), splits headings for the animations, and turns the
   toggle into a link to the current page's translated counterpart.
   ------------------------------------------------------------ */

window.TT_LANG = (document.documentElement.lang || "en").toLowerCase().startsWith("ar") ? "ar" : "en";
window.TT_T = (key) => (I18N[key] ? I18N[key][window.TT_LANG] : "");

/* the counterpart URL comes from the page's own hreflang annotations,
   so the toggle can never drift out of sync with the SEO markup */
function alternateUrl(lang) {
  const link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
  if (!link) return null;
  // hreflang carries an absolute production URL, which is what search engines
  // need. For navigation we take only the path and stay on the origin the
  // visitor is actually on — otherwise a preview or a local build would send
  // them to the live domain, where the page may not exist yet.
  const target = new URL(link.getAttribute("href"), location.href);
  return target.pathname + target.search + target.hash;
}

/* split a heading's data-split spans into animatable .char pieces.
   Arabic splits by word (preserves cursive joining); Latin by character. */
function splitNode(el, lang) {
  const text = el.textContent;
  let parts;
  if (lang === "ar") {
    parts = text.split(/(\s+)/); // keep spaces as their own tokens
  } else {
    parts = [...text];
  }
  el.innerHTML = parts
    .map((p) => (/^\s+$/.test(p) ? p : `<span class="char">${p === " " ? "&nbsp;" : p}</span>`))
    .join("");
}

/* prepare the page that was already rendered in its own language */
function hydrateLang() {
  const lang = window.TT_LANG;

  // build animated headings
  document.querySelectorAll("[data-split]").forEach((el) => splitNode(el, lang));

  // (re)build marquees — repeat the phrase enough to always overflow the
  // viewport (no gaps on scroll), then duplicate the group for a seamless loop
  document.querySelectorAll("[data-marquee]").forEach((el) => {
    const entry = I18N[el.dataset.marquee];
    if (!entry) return;
    const group = (entry[lang] + " ✳ ").repeat(4);
    el.innerHTML = `<span>${group}</span><span>${group}</span>`;
  });

  // toggle button active state
  document.querySelectorAll("#langToggle [data-lang]").forEach((s) => {
    s.classList.toggle("is-active", s.dataset.lang === lang);
  });

  // let other scripts (e.g. the contact form's budget chips) render in this language
  window.dispatchEvent(new CustomEvent("tt-lang", { detail: lang }));
}

hydrateLang();

/* ------------------------------------------------------------
   The toggle is a real navigation to the translated URL.
   It is rendered as a <button> in the markup, so we upgrade it to an
   anchor-like control and remember the choice for the next visit.
   ------------------------------------------------------------ */
const langToggle = document.getElementById("langToggle");
if (langToggle) {
  const other = window.TT_LANG === "en" ? "ar" : "en";
  const href = alternateUrl(other);

  if (href) {
    langToggle.setAttribute("aria-label", other === "ar" ? "التبديل إلى العربية" : "Switch to English");
    langToggle.addEventListener("click", () => {
      try { localStorage.setItem(LANG_KEY, other); } catch (e) { /* private mode */ }
      // transition.js only intercepts <a> clicks, so navigate directly
      window.location.href = href;
    });
  } else {
    langToggle.hidden = true; // no translated counterpart for this page
  }
}

/* remember the language of the page actually being viewed, so the
   homepage can send a returning visitor straight back to it */
try { localStorage.setItem(LANG_KEY, window.TT_LANG); } catch (e) { /* private mode */ }
