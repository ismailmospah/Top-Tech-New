export type Lang = "en" | "ar";

export const translations = {
  en: {
    // Fonts
    fontHeading: "'Syne', sans-serif",
    fontBody: "'Inter', sans-serif",

    // Navbar
    nav: {
      services: "Services",
      work: "Work",
      blogs: "Blogs",
      process: "Process",
      clients: "Clients",
      contact: "Contact",
      cta: "Start a Project",
    },

    // Hero
    hero: {
      badge: "Saudi Arabia's Premier Motion Graphics Studio",
      heading1: "We Turn Ideas",
      heading2: "Into Motion",
      description:
        "We craft stunning motion graphics, brand animations, and video content that elevate your brand and captivate your audience across every platform.",
      btnWork: "View Our Work",
      btnStart: "Start Your Project",
      stats: [
        { value: "150+", label: "Projects Done" },
        { value: "80+", label: "Happy Clients" },
        { value: "7+", label: "Years of Mastery" },
        // { value: "20+", label: "Awards Won" },
      ],
    },

    // Services
    services: {
      badge: "OUR SERVICES",
      heading: "Everything You Need to",
      headingAccent: "Move Your Brand Forward",
      description:
        "From concept to delivery, we offer a full suite of motion graphics and video services tailored for ambitious brands.",
      learnMore: "Learn more",
      customBadge: "CUSTOM PACKAGES",
      customHeading: "Need Something Unique?",
      customDescription:
        "We create custom motion solutions tailored to your exact vision. Let's talk and build something extraordinary together.",
      customCta: "Get a Custom Quote",
      items: [
        {
          title: "Motion Graphic",
          description:
            "Eye-catching motion graphics that bring your brand story to life with dynamic visuals, kinetic typography, and seamless transitions.",
        },
        {
          title: "Content Creation",
          description:
            "Engaging content creation services including scripts, storyboards, and creative assets tailored for your brand.",
        },
        {
          title: "Social Media Marketing",
          description:
            "Grow your digital presence with scroll-stopping animated and static content for all social platforms.",
        },
      ],
    },

    // Portfolio
    portfolio: {
      badge: "OUR WORK",
      heading: "Projects That Speak",
      headingAccent: "Louder Than Words",
      description:
        "A curated selection of our most impactful projects delivered for brands across the region.",
      categories: [
        "All",
        "Motion Graphics",
        "Branding",
        "Social Media",
        "Video",
      ],
      viewProject: "View Project",
      viewAll: "View All Projects",
      projects: [
        { title: "Vision 2030 Campaign", category: "Motion Graphics" },
        { title: "Brand Identity Reveal", category: "Branding" },
        { title: "TechStartup Explainer", category: "Video" },
        { title: "Social Reels Package", category: "Social Media" },
        { title: "3D Product Showcase", category: "Motion Graphics" },
        { title: "Corporate Event Film", category: "Video" },
      ],
    },

    // Process
    process: {
      badge: "HOW WE WORK",
      heading: "Our Creative",
      headingAccent: "Process",
      ctaHeading: "Ready to start your project?",
      ctaSubtext: "We typically respond within 24 hours.",
      ctaBtn: "Let's Get Started →",
      steps: [
        {
          title: "Idea",
          description:
            "We dive deep into your brand, goals, and audience to shape a creative concept that perfectly aligns with your vision.",
        },
        {
          title: "Storyboard",
          description:
            "Our creative directors craft a detailed storyboard mapping every scene, transition, and visual beat before production begins.",
        },
        {
          title: "Animation",
          description:
            "Our motion artists bring the storyboard to life with stunning animations, effects, and motion-designed sequences.",
        },
        {
          title: "Delivery",
          description:
            "We export your final video in all required formats optimized for every platform, on time and above expectations.",
        },
      ],
    },

    // Clients
    clients: {
      trusted: "TRUSTED BY LEADING BRANDS ACROSS THE REGION",
      heading: "Brands That Trust",
      headingAccent: "Top Tech",
      more: "+ 70 more companies across Saudi Arabia and the GCC",
    },

    // Testimonials
    testimonials: {
      badge: "TESTIMONIALS",
      heading: "Clients Love",
      headingAccent: "What We Create",
      items: [
        {
          name: "Ahmed Al-Rashidi",
          role: "Marketing Director",
          company: "STC Group",
          text: "Motio transformed our brand presentation completely. Their motion graphics are unlike anything we've seen from agencies in the region. The quality, speed, and creativity are simply world-class. Our campaign engagement increased by 3x after working with them.",
        },
        {
          name: "Sara Al-Otaibi",
          role: "Brand Manager",
          company: "Almarai",
          text: "Working with Motio was an incredible experience. They understood our brand DNA instantly and delivered animations that felt both premium and uniquely us. The team is professional, creative, and genuinely passionate about their craft.",
        },
        {
          name: "Khalid Al-Harbi",
          role: "CEO",
          company: "TechVentures KSA",
          text: "Our product explainer video generated more leads in one week than our previous campaigns did in months. Motio didn't just create a video—they built a conversion machine. Absolutely worth every riyal.",
        },
        {
          name: "Noura Al-Mansouri",
          role: "Digital Lead",
          company: "NEOM",
          text: "Exceptional storytelling through motion. Motio helped us communicate the scale and vision of NEOM in a way that words simply couldn't. The animations are breathtaking and exactly on brand. Highly recommended.",
        },
      ],
    },

    // CTA
    cta: {
      badge: "Ready to elevate your brand?",
      heading: "Let's Create Something",
      headingAccent: "Amazing",
      description:
        "Join 80+ brands across Saudi Arabia and the GCC who trust Motio to power their visual storytelling.",
      btnStart: "Start a Project",
      btnWork: "See Our Work",
    },

    // Contact
    contact: {
      badge: "CONTACT US",
      heading: "Let's Start Your",
      headingAccent: "Motion Journey",
      description:
        "Tell us about your project and we'll get back to you within 24 hours.",
      emailLabel: "Email Us",
      locationLabel: "Our Location",
      locationValue: "Riyadh, Saudi Arabia",
      whatsapp: "Chat on WhatsApp",
      whatsappSub: "Available Sun–Thu, 9am–6pm",
      turnaround: "🚀 Fast Turnaround",
      turnaroundText:
        "Most projects delivered within 5–15 business days, depending on scope.",
      form: {
        name: "Full Name",
        namePlaceholder: "Your name",
        email: "Email Address",
        emailPlaceholder: "your@email.com",
        budget: "Budget",
        budgetPlaceholder: "Your expected budget",
        service: "Service Needed",
        servicePlaceholder: "Select a service",
        serviceOptions: [
          "Motion Graphics",
          "Content Creation ",
          "Social Media Marketing",
        ],
        message: "Project Details",
        messagePlaceholder:
          "Tell us about your project, goals, and any specific requirements...",
        submit: "Send Message",
        sending: "Sending...",
        successTitle: "Message Sent!",
        successText:
          "We've received your message and will get back to you within 24 hours.",
      },
    },

    // Footer
    footer: {
      tagline:
        "Saudi Arabia's leading motion graphics studio. We create visual stories that move brands forward.",
      links: {
        Services: [
          "Motion Graphics",
          "Content Creation",
          "Social Media Marketing"
        ],
        Company: ["About Us", "Our Process", "Portfolio", "Careers", "Blog"],
        Contact: [
          "toptechcompany51@gmail.com",
          "https://top-tech.framer.website/",
          "https://linktr.ee/Top_Tech_Company",
          "wa.me/966592661980",
          "https://www.behance.net/TopTechCompany",
          "https://www.tiktok.com/@toptechcompany?_t=8mDY8zdjT8w&_r=1",
          "https://x.com/toptechcompany5?s=21",
          "https://www.facebook.com/share/16vibMnJEv/?mibextid=wwXIfr",
          "https://www.instagram.com/toptech.company?igsh=eXZqeHY5cnU3Mm8z",
        ],
      },
      newsletter: "Stay Inspired",
      newsletterSub: "Get motion tips, project showcases, and studio updates.",
      emailPlaceholder: "Enter your email",
      copyright: "© 2026 Top Tech Studio. All rights reserved.",
      legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  },

  ar: {
    // Fonts
    fontHeading: "'IBM Plex Sans Arabic', sans-serif",
    fontBody: "'IBM Plex Sans Arabic', sans-serif",

    // Navbar
    nav: {
      services: "خدماتنا",
      work: "أعمالنا",
      blogs: "المدونة",
      process: "منهجيتنا",
      clients: "عملاؤنا",
      contact: "تواصل معنا",
      cta: "ابدأ مشروعك",
    },

    // Hero
    hero: {
      badge: "استوديو الموشن جرافيك الأول في المملكة العربية السعودية",
      heading1: "نحوّل أفكارك",
      heading2: "إلى حركة",
      description:
        "نصنع موشن جرافيك مبهر، وانيميشن للعلامات التجارية، ومحتوى مرئي احترافي يرفع مستوى علامتك التجارية ويجذب جمهورك عبر جميع المنصات.",
      btnWork: "استعرض أعمالنا",
      btnStart: "ابدأ مشروعك",
      stats: [
        { value: "+150", label: "مشروع منجز" },
        { value: "+80", label: "عميل سعيد" },
        { value: "+7", label: "سنوات من الإبداع" },
        // { value: "+20", label: "جائزة مكتسبة" },
      ],
    },

    // Services
    services: {
      badge: "خدماتنا",
      heading: "كل ما تحتاجه",
      headingAccent: "لتحريك علامتك التجارية",
      description:
        "من الفكرة إلى التسليم، نقدم مجموعة متكاملة من خدمات الموشن جرافيك والفيديو المصممة للعلامات التجارية الطموحة.",
      learnMore: "اعرف أكثر",
      customBadge: "باقات مخصصة",
      customHeading: "تحتاج شيئاً مختلفاً؟",
      customDescription:
        "نصمم حلول موشن مخصصة تتناسب تماماً مع رؤيتك. دعنا نتحدث ونبني شيئاً استثنائياً معاً.",
      customCta: "احصل على عرض سعر",
      items: [
        {
          title: "موشن جرافيك",
          description:
            "موشن جرافيك جذاب يجسّد قصة علامتك التجارية بصور ديناميكية وطباعة حركية وانتقالات سلسة لا تُنسى.",
        },
        {
          title: "صناعة المحتوى",
          description:
            "خدمات صناعة محتوى إبداعي تشمل كتابة النصوص، السيناريوهات، وتصميم الأصول الإبداعية لعلامتك التجارية.",
        },
        {
          title: "تسويق عبر وسائل التواصل",
          description:
            "نمِّ حضورك الرقمي بمحتوى متحرك وثابت يجذب الانتباه لجميع منصات التواصل الاجتماعي.",
        },
      ],
    },

    // Portfolio
    portfolio: {
      badge: "أعمالنا",
      heading: "مشاريع تتحدث",
      headingAccent: "بصوت أعلى من الكلمات",
      description:
        "مجموعة مختارة من أكثر مشاريعنا تأثيراً التي أنجزناها للعلامات التجارية في المنطقة.",
      categories: [
        "الكل",
        "موشن جرافيك",
        "هوية بصرية",
        "وسائل التواصل",
        "فيديو",
      ],
      viewProject: "عرض المشروع",
      viewAll: "عرض جميع المشاريع",
      projects: [
        { title: "حملة رؤية 2030", category: "موشن جرافيك" },
        { title: "كشف الهوية البصرية", category: "هوية بصرية" },
        { title: "فيديو تعريفي لشركة ناشئة", category: "فيديو" },
        { title: "باقة ريلز سوشيال", category: "وسائل التواصل" },
        { title: "عرض منتج ثلاثي الأبعاد", category: "موشن جرافيك" },
        { title: "فيلم حدث مؤسسي", category: "فيديو" },
      ],
    },

    // Process
    process: {
      badge: "كيف نعمل",
      heading: "منهجيتنا",
      headingAccent: "الإبداعية",
      ctaHeading: "هل أنت مستعد لبدء مشروعك؟",
      ctaSubtext: "عادةً ما نرد خلال 24 ساعة.",
      ctaBtn: "لنبدأ معاً ←",
      steps: [
        {
          title: "الفكرة",
          description:
            "نتعمق في فهم علامتك التجارية وأهدافك وجمهورك لنصوغ مفهوماً إبداعياً يتوافق تماماً مع رؤيتك.",
        },
        {
          title: "السيناريو",
          description:
            "يضع مديرو الإبداع لدينا سيناريو تفصيلياً يرسم كل مشهد وانتقال وإيقاع بصري قبل بدء الإنتاج.",
        },
        {
          title: "الانيميشن",
          description:
            "يجسّد فنانو الحركة لدينا السيناريو بانيميشن مبهر ومؤثرات بصرية وتسلسلات موشن مصممة باحترافية.",
        },
        {
          title: "التسليم",
          description:
            "نُصدّر فيديوك النهائي بجميع الصيغ المطلوبة المُحسَّنة لكل منصة، في الوقت المحدد وبمستوى يفوق التوقعات.",
        },
      ],
    },

    // Clients
    clients: {
      trusted: "موثوق بنا من كبرى العلامات التجارية في المنطقة",
      heading: "علامات تجارية تثق بـ",
      headingAccent: "موشيو",
      more: "+ 70 شركة أخرى في المملكة العربية السعودية ودول الخليج",
    },

    // Testimonials
    testimonials: {
      badge: "آراء عملائنا",
      heading: "عملاؤنا يعشقون",
      headingAccent: "ما نصنعه",
      items: [
        {
          name: "أحمد الرشيدي",
          role: "مدير تسويق",
          company: "مجموعة STC",
          text: "غيّر موشيو طريقة تقديم علامتنا التجارية كلياً. موشن جرافيكهم لا يضاهيه أي استوديو في المنطقة. الجودة والسرعة والإبداع ببساطة على مستوى عالمي. ارتفع تفاعل حملتنا ثلاثة أضعاف بعد العمل معهم.",
        },
        {
          name: "سارة العتيبي",
          role: "مديرة العلامة التجارية",
          company: "المراعي",
          text: "كان العمل مع موشيو تجربة رائعة حقاً. فهموا هوية علامتنا التجارية على الفور وقدموا انيميشن يحمل روحنا المميزة. الفريق محترف ومبدع وشغوف بعمله بصدق.",
        },
        {
          name: "خالد الحربي",
          role: "الرئيس التنفيذي",
          company: "TechVentures KSA",
          text: "فيديو المنتج التعريفي أدى في أسبوع واحد ما لم تؤده حملاتنا السابقة في أشهر. موشيو لم يصنعوا فيديو فحسب، بل بنوا آلة تحويل حقيقية. يستحق كل ريال بلا شك.",
        },
        {
          name: "نورة المنصوري",
          role: "قائدة التحول الرقمي",
          company: "نيوم",
          text: "قصص استثنائية عبر الحركة. ساعدنا موشيو على توصيل حجم رؤية نيوم وطموحها بطريقة لا تستطيعها الكلمات. الانيميشن خلاب ومنسجم تماماً مع هويتنا. أنصح بهم بشدة.",
        },
      ],
    },

    // CTA
    cta: {
      badge: "مستعد لرفع مستوى علامتك التجارية؟",
      heading: "دعنا نصنع شيئاً",
      headingAccent: "مذهلاً",
      description:
        "انضم إلى أكثر من 80 علامة تجارية في المملكة العربية السعودية ودول الخليج تثق بموشيو لإحياء قصصها البصرية.",
      btnStart: "ابدأ مشروعك",
      btnWork: "استعرض أعمالنا",
    },

    // Contact
    contact: {
      badge: "تواصل معنا",
      heading: "لنبدأ رحلتك في",
      headingAccent: "عالم الحركة",
      description: "أخبرنا عن مشروعك وسنعود إليك خلال 24 ساعة.",
      emailLabel: "راسلنا",
      locationLabel: "موقعنا",
      locationValue: "الرياض، المملكة العربية السعودية",
      whatsapp: "تواصل عبر واتساب",
      whatsappSub: "متاحون الأحد–الخميس، 9ص–6م",
      turnaround: "🚀 تسليم سريع",
      turnaroundText: "معظم المشاريع تُسلَّم خلال 5–15 يوم عمل حسب النطاق.",
      form: {
        name: "الاسم الكامل",
        namePlaceholder: "اسمك",
        email: "البريد الإلكتروني",
        emailPlaceholder: "بريدك@الإلكتروني.com",
        budget: "الميزانية",
        budgetPlaceholder: "ميزانيتك المتوقعة",
        service: "الخدمة المطلوبة",
        servicePlaceholder: "اختر خدمة",
        serviceOptions: ["موشن جرافيك", "صناعة المحتوى", "تسويق عبر وسائل التواصل"],
        message: "تفاصيل المشروع",
        messagePlaceholder: "أخبرنا عن مشروعك وأهدافك وأي متطلبات ...",
        submit: "إرسال الرسالة",
        sending: "جارٍ الإرسال...",
        successTitle: "تم إرسال رسالتك!",
        successText: "استلمنا رسالتك وسنتواصل معك خلال 24 ساعة.",
      },
    },

    // Footer
    footer: {
      tagline:
        "استوديو الموشن جرافيك الرائد في المملكة العربية السعودية. نصنع قصصاً بصرية تحرّك العلامات التجارية إلى الأمام.",
      links: {
        الخدمات: [
          "موشن جرافيك",
          "صناعة المحتوى",
          "تسويق عبر وسائل التواصل"
        ],
        الشركة: ["من نحن", "منهجيتنا", "أعمالنا", "الوظائف", "المدونة"],
        التواصل: [
          "toptechcompany51@gmail.com",
          "https://top-tech.framer.website/",
          "https://linktr.ee/Top_Tech_Company",
          "wa.me/966592661980",
          "https://www.behance.net/TopTechCompany",
          "https://www.tiktok.com/@toptechcompany?_t=8mDY8zdjT8w&_r=1",
          "https://x.com/toptechcompany5?s=21",
          "https://www.facebook.com/share/16vibMnJEv/?mibextid=wwXIfr",
          "https://www.instagram.com/toptech.company?igsh=eXZqeHY5cnU3Mm8z",
        ],
      },
      newsletter: "ابقَ ملهماً",
      newsletterSub:
        "احصل على نصائح الموشن وعروض المشاريع وآخر أخبار الاستوديو.",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      copyright: "© 2026 استوديو توب تيك. جميع الحقوق محفوظة. .",
      legal: ["سياسة الخصوصية", "شروط الخدمة", "سياسة ملفات تعريف الارتباط"],
    },
  },
};
