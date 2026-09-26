"""Builds the Top Tech site — Arabic (default) or English.

    python3 build.py                      Arabic  -> ./            (local preview, relative links)
    python3 build.py --lang en            English -> ./en/         (local preview)
    python3 build.py --deploy ../ar       Arabic  -> toptech.studio/ar
    python3 build.py --lang en --deploy ..   English -> toptech.studio/

Sources
  src/pages/home.html, src/pages/contact.html        Arabic page bodies (hand-written)
  src/pages/en/home.html, src/pages/en/contact.html  English page bodies
  content/*.json, content/en/*.json                   service, article and project content

Inside sources, "@/" means "site root" and is rewritten to the right path for each page.
"""
import json
import re
import shutil
import sys
import time
from html import escape
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
LANG = sys.argv[sys.argv.index("--lang") + 1] if "--lang" in sys.argv else "ar"
EN = LANG == "en"
CONTENT = ROOT / "content" / ("en" if EN else "")
PAGES = ROOT / "src" / "pages" / ("en" if EN else "")
SITE = "https://www.toptech.studio"
BASE = "" if EN else "/ar"         # URL prefix of this language
OTHER = "/ar" if EN else ""        # URL prefix of the other language
VERSION = str(int(time.time()))    # cache-busting for style.css / main.js after each build


def L(ar, en):
    """Pick the string for the language being built."""
    return en if EN else ar


# Marketing-first order — used everywhere (home cards, services page, form chips).
# English names must match the contact-form chip values in src/pages/en/contact.html.
_SERVICES = [
    ("marketing-strategy", "target", ("استراتيجية التسويق", "Marketing Strategy"),
     ("تموضع وأبحاث سوق وخطط انطلاق مبنية على البيانات — لا على التخمين.",
      "Positioning, market research and go-to-market plans built on data — not guesswork.")),
    ("social-media-marketing", "chat", ("تسويق السوشيال ميديا", "Social Media Marketing"),
     ("إدارة حسابات وحملات عضوية ومدفوعة على كل منصة يعيش فيها جمهورك.",
      "Account management and organic and paid campaigns on every platform your audience lives on.")),
    ("media-buying", "trend", ("إعلانات ممولة", "Media Buying"),
     ("حملات مدفوعة مخطّطة ومُدارة ومُحسّنة — تحوّل الإنفاق إلى نمو ملموس.",
      "Paid campaigns planned, run and optimised — turning ad spend into measurable growth.")),
    ("content-management", "grid", ("إدارة المحتوى", "Content Management"),
     ("محتوى سوشيال متكامل — جرافيك وفيديوهات وريلز، مخطّط ومُنتَج لعلامتك.",
      "End-to-end social content — graphics, videos and reels, planned and produced for your brand.")),
    ("branding-design", "pen", ("الهوية والتصميم", "Branding & Design"),
     ("هويات وأنظمة وتصميم جرافيك تجعل علامتك مميّزة من النظرة الأولى.",
      "Identities, systems and graphic design that make your brand recognisable at a glance.")),
    ("motion-video", "play", ("الفيديو والموشن", "Video & Motion"),
     ("فيديوهات إعلانية وموشن جرافيك وريلز تُنتَج لخدمة حملاتك ورسالة علامتك.",
      "Ad videos, motion graphics and reels produced to serve your campaigns and your brand message.")),
]
SERVICES = [{"slug": s, "icon": i, "name": L(*n), "desc": L(*d)} for s, i, n, d in _SERVICES]
SERVICE_BY_SLUG = {s["slug"]: s for s in SERVICES}

CATS = {
    "pricing": ("الأسعار", "Pricing"), "agency": ("اختيار الوكالة", "Choosing an agency"),
    "strategy": ("الاستراتيجية", "Strategy"), "ads": ("الإعلانات", "Paid ads"),
    "content": ("المحتوى والفيديو", "Content & video"), "industries": ("تسويق القطاعات", "Industries"),
}
CATS = {k: L(*v) for k, v in CATS.items()}
ARTICLE_ORDER = [
    ("digital-marketing-agency-cost-saudi-arabia", CATS["pricing"]),
    ("how-to-choose-a-marketing-agency", CATS["agency"]),
    ("is-your-paid-advertising-working", CATS["ads"]),
    ("startup-marketing-strategy", CATS["strategy"]),
    ("common-marketing-mistakes", CATS["strategy"]),
    ("when-you-need-a-full-service-agency", CATS["agency"]),
    ("agency-vs-freelancer", CATS["agency"]),
    ("social-media-management-cost-saudi-arabia", CATS["pricing"]),
    ("real-estate-marketing-saudi-arabia", CATS["industries"]),
    ("branding-vs-marketing", CATS["strategy"]),
    ("video-production-cost-saudi-arabia", CATS["pricing"]),
    ("what-is-motion-graphics", CATS["content"]),
]
ARTICLE_CATS = [CATS[k] for k in ("pricing", "agency", "strategy", "ads", "content", "industries")]
HOME_ARTICLES = ["digital-marketing-agency-cost-saudi-arabia", "how-to-choose-a-marketing-agency", "is-your-paid-advertising-working"]

# Service page sections, keyed by the label the content uses (Arabic or English source).
SERVICE_SECTIONS = {
    "نظرة عامة": "overview", "الجمهور": "audience", "المشكلات": "problems", "النطاق": "scope",
    "المراحل": "process", "المخرجات": "deliverables", "الأسئلة": "faq",
    "Overview": "overview", "Audience": "audience", "Problems": "problems", "Scope": "scope",
    "Process": "process", "Deliverables": "deliverables", "Questions": "faq",
}
SUBNAV_TEXT = {
    "overview": L("نظرة عامة", "Overview"), "audience": L("لمن هذه الخدمة", "Who it's for"),
    "problems": L("المشكلات", "Problems"), "scope": L("ما نقدّمه", "What we do"),
    "process": L("كيف نعمل", "How we work"), "deliverables": L("ماذا تستلم", "What you get"),
    "faq": L("أسئلة شائعة", "FAQ"),
}

NAV = [  # (text, home anchor, standalone page)
    (L("خدماتنا", "Services"), "services", "services/index.html"),
    (L("أعمالنا", "Work"), "work", "projects/index.html"),
    (L("لماذا نحن", "Why us"), "why", None),
    (L("آراء العملاء", "Reviews"), "reviews", None),
    (L("مقالات", "Articles"), "articles", "articles/index.html"),
    (L("أسئلة شائعة", "FAQ"), "faq", None),
]

WA_KSA = "https://wa.me/966592661980"
WA_EG = "https://wa.me/201501030214"
BRAND = L("توب تك", "Top Tech")
HOME_IDS = set(re.findall(r'\sid="([^"]+)"', (PAGES / "home.html").read_text(encoding="utf-8")))


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def icon(name, cls="i"):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#i-{name}"/></svg>'


def contact_href(service=None):
    return f"@/contact.html?service={quote(service)}" if service else "@/contact.html"


ARROW = icon("arrow")


# --------------------------------------------------------------------------- shell

def head(*, title, desc, path, og_title=None, jsonld=None, preload=None):
    ld = "".join(
        f'\n  <script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (jsonld or []))
    pre = f'\n  <link rel="preload" as="image" href="{preload}">' if preload else ""
    fonts = L("family=IBM+Plex+Sans+Arabic:wght@400;500;600;700",
              "family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700")
    return f'''<!doctype html>
<html lang="{LANG}" dir="{L("rtl", "ltr")}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{escape(title)}</title>
  <meta name="description" content="{escape(desc)}">
  <meta name="theme-color" content="#452C7B">
  <link rel="canonical" href="{SITE}{BASE + path or "/"}">
  <link rel="alternate" hreflang="ar" href="{SITE}/ar{path}">
  <link rel="alternate" hreflang="en" href="{SITE}{path or "/"}">
  <link rel="alternate" hreflang="x-default" href="{SITE}{path or "/"}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="{L("ar_SA", "en_US")}">
  <meta property="og:title" content="{escape(og_title or title)}">
  <meta property="og:description" content="{escape(desc)}">
  <meta property="og:image" content="@/assets/img/logo.png">
  <link rel="icon" type="image/png" href="@/assets/img/favicon.png">
  <link rel="apple-touch-icon" href="@/assets/img/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?{fonts}&display=swap" rel="stylesheet">{pre}
  <link rel="stylesheet" href="@/assets/css/style.css?v={VERSION}">
  <script>document.documentElement.classList.add('js')</script>{ld}
</head>
<body id="top">
  <a class="skip-link" href="#main">{L("تخطَّ إلى المحتوى", "Skip to content")}</a>
'''


def header(*, is_home, active=None, cta_href="@/contact.html", alt_path="/"):
    items = []
    for text, anchor, page in NAV:
        on_home = is_home and anchor in HOME_IDS  # sections removed from the homepage fall back to their page
        href = f"#{anchor}" if on_home else (f"@/{page}" if page else f"@/index.html#{anchor}")
        cur = ' class="is-active" aria-current="page"' if active == anchor else ""
        items.append(f'          <li><a href="{href}"{cur}>{text}</a></li>')
    brand_href = "#top" if is_home else "@/index.html"
    other_url = SITE + (OTHER + alt_path if alt_path != "/" else (OTHER or "/"))
    switch = L(f'<a class="lang-switch" href="{other_url}" hreflang="en" lang="en" aria-label="English version">EN</a>',
               f'<a class="lang-switch" href="{other_url}" hreflang="ar" lang="ar" aria-label="النسخة العربية">ع</a>')
    return f'''
  <!-- ============ Header ============ -->
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="{brand_href}" aria-label="{L("توب تك — الصفحة الرئيسية", "Top Tech — home")}">
        <img src="@/assets/img/logo.png" alt="{BRAND}" width="96" height="60">
      </a>

      <nav class="main-nav" id="main-nav" aria-label="{L("القائمة الرئيسية", "Main menu")}">
        <ul>
{chr(10).join(items)}
        </ul>
        <div class="nav-mobile-extra">
          <a class="btn btn-primary btn-block" href="{cta_href}">{L("ابدأ مشروعك", "Start a project")}</a>
          <a class="btn btn-whatsapp btn-block" href="{WA_KSA}" target="_blank" rel="noopener">
            {icon("whatsapp")} {L("واتساب", "WhatsApp")}
          </a>
        </div>
      </nav>

      <div class="header-actions">
        {switch}
        <a class="btn btn-primary btn-sm header-cta" href="{cta_href}">{L("ابدأ مشروعك", "Start a project")}</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="{L("فتح القائمة", "Open menu")}">
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>
'''


def footer(scripts=()):
    svc = "\n".join(f'          <li><a href="@/services/{s["slug"]}.html">{escape(s["name"])}</a></li>' for s in SERVICES)
    return f'''
  <!-- ============ Footer ============ -->
  <footer class="site-footer">
    <img class="footer-scallop" src="@/assets/img/scallop.png" alt="" aria-hidden="true">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="@/assets/img/logo-white.png" alt="{BRAND}" width="120" height="75" loading="lazy">
        <p>{L("وكالة تسويق متكاملة في السعودية ومصر: استراتيجية، سوشيال ميديا، محتوى وإعلانات ممولة — تحت سقف واحد.",
              "A full-service marketing agency in Saudi Arabia and Egypt: strategy, social media, content and paid ads — under one roof.")}</p>
        <ul class="socials">
          <li><a href="https://www.instagram.com/toptechagency/" target="_blank" rel="noopener" aria-label="{L("إنستغرام", "Instagram")}">{icon("instagram")}</a></li>
          <li><a href="https://www.tiktok.com/@toptechagency1" target="_blank" rel="noopener" aria-label="{L("تيك توك", "TikTok")}">{icon("tiktok")}</a></li>
          <li><a href="https://x.com/toptechstudio1" target="_blank" rel="noopener" aria-label="{L("إكس (تويتر)", "X (Twitter)")}">{icon("x")}</a></li>
          <li><a href="https://www.behance.net/TopTechCompany" target="_blank" rel="noopener" aria-label="{L("بيهانس", "Behance")}" class="be">Bē</a></li>
        </ul>
      </div>

      <nav class="footer-col" aria-label="{L("خدماتنا", "Services")}">
        <h4>{L("خدماتنا", "Services")}</h4>
        <ul>
{svc}
        </ul>
      </nav>

      <nav class="footer-col" aria-label="{L("روابط الموقع", "Site links")}">
        <h4>{L("الموقع", "Site")}</h4>
        <ul>
          <li><a href="@/index.html">{L("الرئيسية", "Home")}</a></li>
          <li><a href="@/services/index.html">{L("كل الخدمات", "All services")}</a></li>
          <li><a href="@/projects/index.html">{L("أعمالنا", "Our work")}</a></li>
          <li><a href="@/index.html#why">{L("لماذا توب تك", "Why Top Tech")}</a></li>
          <li><a href="@/index.html#reviews">{L("آراء العملاء", "Reviews")}</a></li>
          <li><a href="@/articles/index.html">{L("مقالات", "Articles")}</a></li>
          <li><a href="@/contact.html">{L("تواصل معنا", "Contact us")}</a></li>
        </ul>
      </nav>

      <div class="footer-col">
        <h4>{L("مكاتبنا", "Offices")}</h4>
        <ul>
          <li>{L("الرياض، السعودية", "Riyadh, Saudi Arabia")}</li>
          <li>{L("القاهرة، مصر", "Cairo, Egypt")}</li>
          <li>{L("الأحد – الخميس · 9ص – 6م", "Sun – Thu · 9am – 6pm")}</li>
          <li><a class="footer-wa" href="{WA_KSA}" target="_blank" rel="noopener" aria-label="{L("واتساب السعودية", "WhatsApp Saudi Arabia")} +966 59 266 1980">{icon("whatsapp")}<span dir="ltr">+966 59 266 1980</span></a></li>
          <li><a class="footer-wa" href="{WA_EG}" target="_blank" rel="noopener" aria-label="{L("واتساب مصر", "WhatsApp Egypt")} +20 15 0103 0214">{icon("whatsapp")}<span dir="ltr">+20 15 0103 0214</span></a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© <span id="year">2026</span> {L("توب تك. جميع الحقوق محفوظة.", "Top Tech. All rights reserved.")}</p>
      <a href="#top" class="to-top">{L("العودة للأعلى", "Back to top")} {icon("up")}</a>
    </div>
  </footer>

  <!-- Media viewer (videos + images) -->
  <dialog class="media-modal" id="media-modal" aria-labelledby="media-title">
    <div class="media-bar">
      <p id="media-title"></p>
      <a class="media-ext" id="media-ext" href="#" target="_blank" rel="noopener" hidden><span class="media-ext-label"></span> {icon("external")}</a>
      <button type="button" class="media-close" id="media-close" aria-label="{L("إغلاق", "Close")}">×</button>
    </div>
    <div class="media-frame" id="media-frame"></div>
  </dialog>

{SPRITE}
{"".join(f'  <script src="{src}" defer></script>{chr(10)}' for src in scripts)}  <script src="@/assets/js/main.js?v={VERSION}" defer></script>
</body>
</html>
'''


# the "forward" arrow points left in Arabic and right in English
_ARROW_PATH = L('<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>', '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>')
SPRITE = f'''
  <!-- ============ Icon sprite ============ -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
    <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{_ARROW_PATH}</symbol>
    <symbol id="i-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></symbol>
    <symbol id="i-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke-width="2.6"/></symbol>
    <symbol id="i-play-fill" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></symbol>
    <symbol id="i-zoom" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></symbol>
    <symbol id="i-reel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 9.5v5l4-2.5z" fill="currentColor"/></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/></symbol>
    <symbol id="i-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M10 8.5v7l5.5-3.5z" fill="currentColor"/></symbol>
    <symbol id="i-trend" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
    <symbol id="i-alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01" stroke-width="2.6"/></symbol>
    <symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10.5 5 8 4.5 3 4.5v14c5 0 7.5.5 9 2 1.5-1.5 4-2 9-2v-14c-5 0-7.5.5-9 2Z"/><path d="M12 6.5v14"/></symbol>
    <symbol id="i-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H5v14h14v-4"/><path d="M14 4h6v6"/><path d="M20 4 11 13"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6 9 7 9-7"/></symbol>
    <symbol id="i-check2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 12.5 4 4 8.5-9"/><path d="m10.5 16.5 1 0 8.5-9"/></symbol>
    <symbol id="i-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></symbol>
    <symbol id="i-instagram" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></symbol>
    <symbol id="i-tiktok" viewBox="0 0 24 24"><path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></symbol>
  </svg>'''


def cta_band(*, service=None):
    return f'''
    <section class="cta-mini-wrap" aria-labelledby="cta-mini-title">
      <div class="container">
        <div class="cta-mini">
          <img class="cta-mini-face" src="@/assets/img/face-wink.webp" alt="" width="96" height="127" loading="lazy">
          <div class="cta-mini-copy">
            <h2 id="cta-mini-title">{L('جاهز <span class="hl hl--light">تطوّر</span> مشروعك؟', 'Ready to <span class="hl hl--light">grow</span> your business?')}</h2>
            <p>{L("احكِ لنا عن مشروعك — نرد خلال 24 ساعة.", "Tell us about your project — we reply within 24 hours.")}</p>
          </div>
          <div class="cta-actions">
            <a class="btn btn-yellow btn-lg" href="{contact_href(service["name"] if service else None)}">{L("ابدأ مشروعك", "Start a project")} {ARROW}</a>
          </div>
        </div>
      </div>
    </section>
'''


def breadcrumb(trail):
    parts = []
    for i, (text, href) in enumerate(trail):
        if i:
            parts.append('<span aria-hidden="true">/</span>')
        parts.append(f'<a href="{href}">{text}</a>' if href else f'<span aria-current="page">{escape(text)}</span>')
    return (f'<nav class="breadcrumb" aria-label="{L("مسار التنقل", "Breadcrumb")}">\n          '
            + "\n          ".join(parts) + "\n        </nav>")


def breadcrumb_ld(trail, path):
    items = []
    for i, (text, href) in enumerate(trail, 1):
        rel = href.replace("@/", "/").replace("index.html", "").replace(".html", "").rstrip("/") if href else path
        items.append({"@type": "ListItem", "position": i, "name": text, "item": SITE + (BASE + rel or "/")})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}


# --------------------------------------------------------------------------- content pieces

def render_pieces(pieces, *, context):
    out = []
    for p in pieces:
        k = p["kind"]
        if k == "prose":
            out.append("\n".join(f"<p>{x}</p>" for x in p["paras"]))
        elif k == "ticks":
            lis = "\n".join(f'<li><span class="tick">{icon("check")}</span><span>{x}</span></li>' for x in p["items"])
            out.append(f'<ul class="ticks">\n{lis}\n</ul>')
        elif k == "cards":
            variant = "problem" if context == "problems" else "scope"
            ic = "alert" if variant == "problem" else "check"
            cards = "\n".join(
                f'<li class="info-card info-card--{variant} reveal"><span class="info-icon">{icon(ic)}</span>'
                f'<h3>{escape(c["title"])}</h3><p>{c["text"]}</p></li>' for c in p["items"])
            out.append(f'<ul class="info-grid">\n{cards}\n</ul>')
        elif k == "steps":
            if context == "process":
                steps = "\n".join(
                    f'<li class="process-step reveal"><span class="step-num">{i}</span><h3>{escape(s["title"])}</h3><p>{s["text"]}</p></li>'
                    for i, s in enumerate(p["items"], 1))
                out.append(f'<ol class="process-grid process-grid--3">\n{steps}\n</ol>')
            else:
                steps = "\n".join(
                    f'<li><span class="sl-num">{i}</span><div><h3>{escape(s["title"])}</h3><p>{s["text"]}</p></div></li>'
                    for i, s in enumerate(p["items"], 1))
                out.append(f'<ol class="steps-list">\n{steps}\n</ol>')
        elif k == "faq":
            items = "\n".join(
                f'<details class="faq-item"{" open" if i == 0 else ""}><summary>{escape(q["q"])}</summary>'
                f'<div class="faq-body">{"".join(f"<p>{a}</p>" for a in q["a"])}</div></details>'
                for i, q in enumerate(p["items"]))
            out.append(f'<div class="faq-list">\n{items}\n</div>')
    return "\n".join(out)


def related_services(items, *, exclude=None):
    slugs = [it["href"].split("/")[-1][:-5] for it in items if it["href"].startswith("@/services/")]
    cards = []
    for slug in slugs:
        s = SERVICE_BY_SLUG.get(slug)
        if not s or slug == exclude:
            continue
        cards.append(f'''<li><a class="rel-card" href="@/services/{slug}.html">
              <span class="service-icon">{icon(s["icon"])}</span>
              <span class="rel-body"><b>{escape(s["name"])}</b><small>{s["desc"]}</small></span>
              <span class="rel-arrow">{ARROW}</span>
            </a></li>''')
    return "\n            ".join(cards)


def read_also(items, articles):
    lis = []
    for it in items:
        slug = it["href"].split("/")[-1][:-5]
        a = articles.get(slug)
        if not a:
            continue
        lis.append(f'<li><a href="@/articles/{slug}.html"><span>{escape(a["title"])}</span>{ARROW}</a></li>')
    return "\n            ".join(lis)


def split_related(blocks):
    main, rel_svc, rel_art = [], [], []
    for b in blocks:
        kinds = [c["kind"] for c in b["content"]]
        if kinds == ["related"]:
            items = b["content"][0]["items"]
            (rel_svc if items and items[0]["href"].startswith("@/services/") else rel_art).extend(items)
        else:
            main.append(b)
    return main, rel_svc, rel_art


def related_section(related, reads):
    return f'''
    <section class="section section--tint svc-related" aria-labelledby="rel-title">
      <div class="container rel-grid">
        <div>
          <h2 id="rel-title" class="rel-heading">{L("خدمات ذات صلة", "Related services")}</h2>
          <ul class="rel-list">
            {related}
          </ul>
        </div>
        <div>
          <h2 class="rel-heading">{L("اقرأ أيضًا", "Further reading")}</h2>
          <ul class="read-list">
            {reads}
          </ul>
        </div>
      </div>
    </section>
'''


# --------------------------------------------------------------------------- cards

def service_cards_home():
    lis = []
    for i, s_ in enumerate(SERVICES, 1):
        lis.append(f'''          <li class="svc-card reveal">
            <span class="svc-card-num" aria-hidden="true">{i:02d}</span>
            <span class="service-icon">{icon(s_["icon"])}</span>
            <h3><a class="svc-card-link" href="@/services/{s_["slug"]}.html">{escape(s_["name"])}</a></h3>
            <p>{s_["desc"]}</p>
            <div class="svc-card-foot">
              <span class="svc-card-go">{L("تفاصيل الخدمة", "Service details")} <span class="go-circle">{ARROW}</span></span>
              <a class="svc-card-pick" href="{contact_href(s_["name"])}">{L("اطلب الخدمة", "Request it")}</a>
            </div>
          </li>''')
    return '        <ul class="services-grid">\n' + "\n".join(lis) + "\n        </ul>"


def article_card(slug, a, cat, *, heading="h3"):
    return f'''<li class="article-card reveal" data-cat="{cat}">
            <a href="@/articles/{slug}.html">
              <span class="article-kicker">{cat}</span>
              <{heading}>{escape(a["title"])}</{heading}>
              <p>{a["excerpt"]}</p>
              <span class="article-foot">
                <span>{icon("book")} {a["read_time"]}</span>
                <span class="article-more">{L("اقرأ المقال", "Read article")} {ARROW}</span>
              </span>
            </a>
          </li>'''


def work_card(w, *, heading="h3"):
    """video → plays in the on-page player · image → opens large · link → external (Behance/Instagram)"""
    t = w["type"]
    if t == "video":
        src, ratio = f'@/assets/img/videos/{w["yt"]}.webp', "16/9"
    elif t == "insta":
        src, ratio = f'@/assets/img/reels/{w["ig"]}.webp', "9/16"
    elif t == "image":
        src, ratio = f'@/assets/img/designs/{w["img"]}.webp', None
    else:
        src, ratio = f'@/assets/img/{w.get("folder", "projects")}/{w["img"]}.webp', w.get("ratio")
    style = f' style="aspect-ratio:{ratio}"' if ratio else ""
    play = f'<span class="play-badge" aria-hidden="true">{icon("play-fill")}</span>' if t in ("video", "insta") else ""
    media = f'<span class="project-media"{style}><img src="{src}" alt="" loading="lazy">{play}</span>'
    where = L("إنستغرام", "Instagram") if "instagram" in w.get("url", "") else "Behance"
    action = {"video": f'{L("شغّل الفيديو", "Play video")} {icon("play-fill")}',
              "insta": f'{L("شغّل الريل", "Play reel")} {icon("play-fill")}',
              "image": f'{L("كبّر التصميم", "View design")} {icon("zoom")}'}.get(
        t, f'{L("شاهد على", "View on")} {where} {icon("external")}')
    body = f'''<span class="project-body">
                <{heading}>{escape(w["title"])}</{heading}>
                <span class="project-client">{escape(w["client"])}</span>
                <span class="project-link">{action}</span>
              </span>'''
    title = escape(w["title"])
    if t == "video":
        return f'<li class="project-card reveal"><button type="button" class="card-btn" data-video="{w["yt"]}" data-title="{title}">{media}{body}</button></li>'
    if t == "insta":
        return f'<li class="project-card reveal"><button type="button" class="card-btn" data-insta="{w["ig"]}" data-title="{title}">{media}{body}</button></li>'
    if t == "image":
        return f'<li class="project-card reveal"><button type="button" class="card-btn" data-image="{src}" data-title="{title}">{media}{body}</button></li>'
    return f'<li class="project-card reveal"><a href="{w["url"]}" target="_blank" rel="noopener">{media}{body}</a></li>'


def works_grid(items, key):
    return f'<ul class="projects-grid projects-grid--{key}">\n          ' + "\n          ".join(work_card(w) for w in items) + "\n        </ul>"


def shot_btn(x, cls="shot-btn"):
    src = f'@/assets/img/cases/{x["src"]}.webp'
    return (f'<button type="button" class="{cls}" data-image="{src}" data-title="{escape(x["alt"])}">'
            f'<img src="{src}" alt="{escape(x["alt"])}" width="{x["w"]}" height="{x["h"]}" loading="lazy"></button>')


def logo_alt(client):
    return L(f"شعار {client}", f"{client} logo")


def case_card(c):
    facts = "".join(f'<li><span class="tick">{icon("check")}</span><span>{f}</span></li>' for f in c["facts"])
    plats = "".join(f"<span>{x}</span>" for x in c["platforms"])
    return f'''<article class="case-card reveal">
          <div class="case-copy">
            <div class="case-head">
              <img src="@/assets/img/cases/{c["id"]}-logo.webp" alt="{logo_alt(c["client"])}" width="64" height="64" loading="lazy">
              <div><h3 dir="auto">{c["client"]}</h3><p>{c["industry"]} · {c["country"]}</p></div>
            </div>
            <p class="case-stat"><b><span dir="ltr">{c["value"]}</span> <small>{c["unit"]}</small></b><span>{c["label"]}</span></p>
            {f'<p class="case-badge"><span>{c["badge"]["label"]}</span><b>{c["badge"]["value"]}</b></p>' if c.get("badge") else ""}
            <ul class="case-facts">{facts}</ul>
            <p class="case-platforms">{plats}</p>
          </div>
          <figure class="case-shots case-shots--{len(c["shots"])}">
            {"".join(shot_btn(x) for x in c["shots"])}
            <figcaption>{L("لقطات من لوحات النتائج الفعلية — اضغط لتكبير الصورة", "Screenshots from the actual results dashboards — click to enlarge")}</figcaption>
          </figure>
        </article>'''


def case_minis(cases, *, heading="h3"):
    lis = "\n          ".join(f'''<li class="case-mini reveal">
            <div class="case-head">
              <img src="@/assets/img/cases/{c["id"]}-logo.webp" alt="{logo_alt(c["client"])}" width="52" height="52" loading="lazy">
              <div><{heading} dir="auto">{c["client"]}</{heading}><p>{c["industry"]} · {c["country"]}</p></div>
            </div>
            <p class="case-stat"><b><span dir="ltr">{c["value"]}</span> <small>{c["unit"]}</small></b><span>{c["label"]}</span></p>
            <p class="case-note">{(c["badge"]["label"] + ": " + c["badge"]["value"] + " · ") if c.get("badge") else ""}{c["facts"][0]}</p>
            <div class="mini-shots mini-shots--{min(len(c["shots"]), 3)}">{"".join(shot_btn(x, "shot-btn") for x in c["shots"][:3])}</div>
          </li>''' for c in cases)
    return f'<ul class="case-minis">\n          {lis}\n        </ul>'


# --------------------------------------------------------------------------- pages

def page(head_html, header_html, body, scripts=()):
    return head_html + header_html + '\n  <main id="main">\n' + body + "  </main>\n" + footer(scripts)


def build_projects(data):
    trail = [(L("الرئيسية", "Home"), "@/index.html"), (L("أعمالنا", "Our work"), None)]
    subnav = "".join(f'<a href="#{sp["key"]}">{icon(sp["icon"])}<span>{sp["name"]}</span></a>' for sp in data["specialties"])
    sections = []
    for n, sp in enumerate(data["specialties"]):
        content = (f'<div class="cases-list">{"".join(case_card(c) for c in data["cases"])}</div>'
                   if sp["key"] == "ads" else works_grid(data["works"][sp["key"]], sp["key"]))
        title = L("نتائج حقيقية، لا وعود.", "Real results, not promises.") if sp["key"] == "ads" else sp["name"]
        sections.append(f'''
    <section class="section svc-section{" section--tint" if n % 2 else ""}" id="{sp["key"]}" aria-labelledby="{sp["key"]}-title">
      <div class="container">
        <header class="section-head reveal">
          <p class="eyebrow">{icon(sp["icon"])} {sp["name"]}</p>
          <h2 id="{sp["key"]}-title">{title}</h2>
          <p class="section-lead">{sp["lead"]}</p>
        </header>
        {content}
      </div>
    </section>''')
    body = f'''
    <section class="page-hero">
      <div class="container">
        {breadcrumb(trail)}
        <p class="eyebrow">{L("أعمالنا", "Our work")}</p>
        <h1>{L('أعمال ونتائج <span class="hl">نفخر بها</span>.', 'Work and results <span class="hl">we’re proud of</span>.')}</h1>
        <p class="page-lead">{data["lead"]}</p>
      </div>
    </section>

    <nav class="subnav subnav--tabs" aria-label="{L("التخصصات", "Specialties")}">
      <div class="container subnav-inner">
        {subnav}
      </div>
    </nav>
{"".join(sections)}

    <section class="section projects-more-wrap">
      <div class="container projects-more">
        <a class="btn btn-ghost btn-lg" href="{data["behance"]}" target="_blank" rel="noopener">{L("شاهد كل أعمالنا على Behance", "See all our work on Behance")} {icon("external")}</a>
      </div>
    </section>
{cta_band()}'''
    return page(head(title=L("أعمالنا — توب تك، وكالة تسويق في السعودية ومصر", "Our Work — Top Tech, Marketing Agency in KSA & Egypt"),
                     desc=L("أعمال توب تك حسب التخصص: نتائج الإعلانات الممولة، موشن جرافيك، ريلز ومونتاج، وتصاميم سوشيال ميديا لعلامات في السعودية ومصر.",
                            "Top Tech's work by specialty: media buying results, motion graphics, reels and editing, and social media design for brands in Saudi Arabia and Egypt."),
                     path="/projects", jsonld=[breadcrumb_ld(trail, "/projects")]),
                header(is_home=False, active="work", alt_path="/projects"), body)


def work_tabs(data):
    tabs, panels = [], []
    for n, sp in enumerate(data["specialties"]):
        k = sp["key"]
        sel = n == 0
        tabs.append(f'<button type="button" role="tab" class="work-tab" id="tab-{k}" aria-controls="panel-{k}" aria-selected="{str(sel).lower()}" tabindex="{0 if sel else -1}">{icon(sp["icon"])}<span>{sp["name"]}</span></button>')
        content = case_minis(data["cases"]) if k == "ads" else works_grid(data["works"][k][:3], k)
        more = L(f"كل أعمال {sp['name']}", f"See all {sp['name'].lower()} work")
        panels.append(f'''<div class="work-panel" role="tabpanel" id="panel-{k}" aria-labelledby="tab-{k}" tabindex="0"{"" if sel else " hidden"}>
          <p class="work-panel-lead">{sp["lead"]}</p>
          {content}
          <p class="work-panel-more"><a class="btn btn-primary btn-lg" href="@/projects/index.html#{k}">{more} {ARROW}</a></p>
        </div>''')
    return (f'        <div class="work-tabs" role="tablist" aria-label="{L("التخصصات", "Specialties")}">\n          ' + "\n          ".join(tabs)
            + "\n        </div>\n        " + "\n        ".join(panels))


def build_home(articles, projects):
    body = (PAGES / "home.html").read_text(encoding="utf-8")
    body = body.replace("{{SERVICE_CARDS}}", service_cards_home())
    body = body.replace("{{WORK_TABS}}", work_tabs(projects))
    cards = "\n          ".join(article_card(s, articles[s], dict(ARTICLE_ORDER)[s]) for s in HOME_ARTICLES)
    body = body.replace("{{ARTICLE_CARDS}}", f'        <ul class="articles-grid">\n          {cards}\n        </ul>')
    org = {
        "@context": "https://schema.org", "@type": "ProfessionalService", "name": L("توب تك — Top Tech", "Top Tech"),
        "description": L("وكالة تسويق متكاملة في السعودية ومصر", "Full-service marketing agency in Saudi Arabia and Egypt"),
        "url": SITE + (BASE or "/"),
        "email": "toptechcompany51@gmail.com", "telephone": ["+966592661980", "+201501030214"],
        "areaServed": ["SA", "EG", "GCC"], "openingHours": "Su-Th 09:00-18:00",
        "address": [{"@type": "PostalAddress", "addressLocality": L("الرياض", "Riyadh"), "addressCountry": "SA"},
                    {"@type": "PostalAddress", "addressLocality": L("القاهرة", "Cairo"), "addressCountry": "EG"}],
        "sameAs": ["https://www.instagram.com/toptechagency/", "https://www.tiktok.com/@toptechagency1",
                   "https://x.com/toptechstudio1", "https://www.behance.net/TopTechCompany"],
    }
    return (head(title=L("توب تك — وكالة تسويق متكاملة في السعودية ومصر", "Top Tech — Full-Service Marketing Agency in Saudi Arabia & Egypt"),
                 desc=L("توب تك وكالة تسويق متكاملة في الرياض والقاهرة: استراتيجية تسويق، سوشيال ميديا، إعلانات ممولة، إدارة محتوى، هوية بصرية وفيديو. نرد خلال 24 ساعة.",
                        "Top Tech is a full-service marketing agency in Riyadh and Cairo: marketing strategy, social media, media buying, content, branding and video. We reply within 24 hours."),
                 path="", og_title=L("توب تك — نساعدك تطوّر مشروعك", "Top Tech — We help your business grow"),
                 jsonld=[org], preload="@/assets/img/mascot-jump.webp")
            + header(is_home=True) + '\n  <main id="main">\n\n' + body + "  </main>\n" + footer())


def build_contact():
    body = (PAGES / "contact.html").read_text(encoding="utf-8")
    return page(head(title=L("تواصل معنا — توب تك", "Contact Us — Top Tech"),
                     desc=L("ابدأ مشروعك مع توب تك: أرسل تفاصيل مشروعك، ونرد خلال 24 ساعة. مكاتبنا في الرياض والقاهرة.",
                            "Start a project with Top Tech: send us your project details and we'll reply within 24 hours. Offices in Riyadh and Cairo."),
                     path="/contact"),
                header(is_home=False, cta_href="#brief-form", alt_path="/contact"), body,
                scripts=["https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"])


def build_service(pg, articles, projects):
    s = SERVICE_BY_SLUG[pg["slug"]]
    blocks, rel_svc, rel_art = split_related(pg["blocks"])
    trail = [(L("الرئيسية", "Home"), "@/index.html"), (L("الخدمات", "Services"), "@/services/index.html"), (pg["title"], None)]
    path = f"/services/{pg['slug']}"

    sections, subnav = [], []
    for n, b in enumerate(blocks):
        key = SERVICE_SECTIONS.get(b["label"], f"sec-{n}")
        subnav.append(f'<a href="#{key}">{SUBNAV_TEXT.get(key, b["label"])}</a>')
        tint = " section--tint" if n % 2 else ""
        pieces = render_pieces(b["content"], context=key)
        head_html = f'''<header class="section-head reveal">
            <p class="eyebrow">{escape(b["label"])}</p>
            <h2>{escape(b["title"])}</h2>
          </header>'''
        if key in ("overview", "audience", "deliverables", "faq"):
            inner = f'''<div class="container svc-split">
          {head_html}
          <div class="svc-content{" prose" if key == "overview" else ""}{" deliverables" if key == "deliverables" else ""} reveal">
{pieces}
          </div>
        </div>'''
        else:
            inner = f'''<div class="container">
          {head_html}
{pieces}
        </div>'''
        sections.append(f'''
    <section class="section svc-section{tint}" id="{key}" aria-label="{escape(b["title"])}">
        {inner}
    </section>''')
        if key == "overview" and pg["slug"] == "media-buying":
            sections.append(f'''
    <section class="section svc-section section--tint" id="results" aria-labelledby="results-title">
      <div class="container">
        <header class="section-head section-head--split reveal">
          <div>
            <p class="eyebrow">{L("نتائج حملاتنا", "Our campaign results")}</p>
            <h2 id="results-title">{L("أرقام من حملات أدرناها فعلًا.", "Numbers from campaigns we actually ran.")}</h2>
          </div>
          <a class="link-arrow" href="@/projects/index.html">{L("التفاصيل واللقطات", "Details and screenshots")} {ARROW}</a>
        </header>
        {case_minis(projects["cases"])}
      </div>
    </section>''')
            subnav.append(f'<a href="#results">{L("النتائج", "Results")}</a>')

    num = SERVICES.index(s) + 1
    body = f'''
    <section class="page-hero page-hero--service">
      <div class="container ph-grid">
        <div>
        {breadcrumb(trail)}
          <p class="eyebrow">{L("الخدمات", "Services")} — {num:02d}</p>
          <h1>{escape(pg["title"])}</h1>
          <p class="page-lead">{pg["lead"]}</p>
          <div class="hero-ctas">
            <a class="btn btn-primary btn-lg" href="{contact_href(s["name"])}">{L("اطلب هذه الخدمة", "Request this service")} {ARROW}</a>
          </div>
        </div>
        <div class="ph-icon" aria-hidden="true">
          <img class="ph-asterisk" src="@/assets/img/asterisk.webp" alt="" width="80" height="80">
          {icon(s["icon"])}
        </div>
      </div>
    </section>

    <nav class="subnav" aria-label="{L("أقسام الصفحة", "Page sections")}">
      <div class="container subnav-inner">
        {"".join(subnav)}
      </div>
    </nav>
{"".join(sections)}
{related_section(related_services(rel_svc, exclude=pg["slug"]), read_also(rel_art[:4], articles))}{cta_band(service=s)}'''
    ld = [breadcrumb_ld(trail, path), {
        "@context": "https://schema.org", "@type": "Service", "name": pg["title"], "description": pg["meta_description"],
        "areaServed": ["SA", "EG"], "provider": {"@type": "Organization", "name": "Top Tech", "url": SITE + (BASE or "/")}}]
    return page(head(title=pg["meta_title"], desc=pg["meta_description"], path=path, jsonld=ld),
                header(is_home=False, active="services", cta_href=contact_href(s["name"]), alt_path=path), body)


def build_article(slug, pg, cat, articles):
    blocks, rel_svc, rel_art = split_related(pg["blocks"])
    trail = [(L("الرئيسية", "Home"), "@/index.html"), (L("المقالات", "Articles"), "@/articles/index.html"), (pg["title"], None)]
    path = f"/articles/{slug}"
    parts = []
    for b in blocks:
        bid = b["id"] or ("faq" if any(c["kind"] == "faq" for c in b["content"]) else None)
        id_attr = f' id="{bid}"' if bid else ""
        lbl = f'<p class="eyebrow">{escape(b["label"])}</p>\n          ' if b["label"] else ""
        parts.append(f'''        <section class="art-section"{id_attr}>
          {lbl}<h2>{escape(b["title"])}</h2>
{render_pieces(b["content"], context="article")}
        </section>''')
    toc = "\n".join(f'            <li><a href="#{t["id"]}">{escape(t["text"])}</a></li>' for t in pg["toc"])
    if any(b["id"] is None and any(c["kind"] == "faq" for c in b["content"]) for b in blocks):
        toc += f'\n            <li><a href="#faq">{L("أسئلة شائعة", "FAQ")}</a></li>'

    body = f'''
    <div class="read-progress" aria-hidden="true"><span></span></div>

    <section class="page-hero page-hero--article">
      <div class="container">
        {breadcrumb(trail)}
        <span class="article-kicker">{cat}</span>
        <h1>{escape(pg["title"])}</h1>
        <p class="page-lead">{pg["lead"]}</p>
        <p class="art-meta">
          <span><img src="@/assets/img/favicon.png" alt="" width="28" height="28"> {escape(pg["author"])}</span>
          <span>{icon("calendar")} <time datetime="{pg["date"]}">{pg["date_display"]}</time></span>
          <span>{icon("book")} {pg["read_time"]}</span>
        </p>
      </div>
    </section>

    <div class="container art-layout">
      <aside class="toc-wrap">
        <nav class="toc" aria-label="{L("في هذا المقال", "In this article")}">
          <p class="toc-label">{L("في هذا المقال", "In this article")}</p>
          <ol>
{toc}
          </ol>
        </nav>
      </aside>

      <article class="art-body">
{chr(10).join(parts)}
      </article>
    </div>
{related_section(related_services(rel_svc), read_also(rel_art, articles))}{cta_band()}'''
    ld = [breadcrumb_ld(trail, path), {
        "@context": "https://schema.org", "@type": "Article", "headline": pg["title"], "description": pg["meta_description"],
        "datePublished": pg["date"], "inLanguage": LANG,
        "author": {"@type": "Organization", "name": "Top Tech"},
        "publisher": {"@type": "Organization", "name": "Top Tech", "url": SITE + (BASE or "/")}}]
    return page(head(title=pg["meta_title"], desc=pg["meta_description"], path=path, jsonld=ld),
                header(is_home=False, active="articles", alt_path=path), body)


def build_services_index(idx):
    rows = []
    for i, s in enumerate(SERVICES, 1):
        desc = next((r["desc"] for r in idx["services"] if r["slug"] == s["slug"]), s["desc"])
        rows.append(f'''          <li class="svc-row reveal">
            <a href="@/services/{s["slug"]}.html">
              <span class="svc-num">{i:02d}</span>
              <span class="service-icon">{icon(s["icon"])}</span>
              <span class="svc-text"><h2>{escape(s["name"])}</h2><p>{desc}</p></span>
              <span class="svc-arrow">{ARROW}</span>
            </a>
          </li>''')
    trail = [(L("الرئيسية", "Home"), "@/index.html"), (L("الخدمات", "Services"), None)]
    body = f'''
    <section class="page-hero">
      <div class="container">
        {breadcrumb(trail)}
        <p class="eyebrow">{L("الخدمات", "Services")}</p>
        <h1>{L('كل ما تحتاجه علامتك <span class="hl">لتنمو</span>.', 'Everything your brand needs to <span class="hl">grow</span>.')}</h1>
        <p class="page-lead">{idx["lead"]}</p>
      </div>
    </section>

    <section class="section svc-index">
      <div class="container">
        <ul class="svc-rows">
{chr(10).join(rows)}
        </ul>
      </div>
    </section>
{cta_band()}'''
    return page(head(title=L("خدمات التسويق — توب تك، وكالة تسويق في السعودية ومصر", "Marketing Services — Top Tech, Marketing Agency in KSA & Egypt"),
                     desc=L("خدمات توب تك: استراتيجية التسويق، تسويق السوشيال ميديا، الإعلانات الممولة، إدارة المحتوى، الهوية والتصميم، والفيديو — يديرها فريق واحد.",
                            "Top Tech services: marketing strategy, social media marketing, media buying, content management, branding & design, and video — run by one team."),
                     path="/services", jsonld=[breadcrumb_ld(trail, "/services")]),
                header(is_home=False, active="services", alt_path="/services"), body)


def build_articles_index(articles, aidx):
    cards = "\n          ".join(article_card(s, articles[s], c, heading="h2") for s, c in ARTICLE_ORDER)
    chips = "".join(f'<button type="button" class="filter-chip" data-filter="{c}" aria-pressed="false">{c}</button>'
                    for c in ARTICLE_CATS)
    trail = [(L("الرئيسية", "Home"), "@/index.html"), (L("المقالات", "Articles"), None)]
    n = len(ARTICLE_ORDER)
    body = f'''
    <section class="page-hero">
      <div class="container">
        {breadcrumb(trail)}
        <p class="eyebrow">{L("المقالات", "Articles")}</p>
        <h1>{L('إجابات مباشرة <span class="hl">قبل أن تتعاقد</span>.', 'Straight answers <span class="hl">before you sign</span>.')}</h1>
        <p class="page-lead">{aidx["lead"]}</p>
      </div>
    </section>

    <section class="section art-index">
      <div class="container">
        <div class="filter-bar" role="group" aria-label="{L("تصفية حسب الموضوع", "Filter by topic")}" data-grid="art-grid" data-count="art-count" data-nouns="{L("مقال واحد|مقالان|مقالات|مقالًا", "1 article|2 articles|articles|articles")}">
          <button type="button" class="filter-chip" data-filter="all" aria-pressed="true">{L("الكل", "All")}</button>{chips}
        </div>
        <p class="filter-count" aria-live="polite"><span id="art-count">{L(f"{n} مقالًا", f"{n} articles")}</span></p>
        <ul class="articles-grid" id="art-grid">
          {cards}
        </ul>
      </div>
    </section>
{cta_band()}'''
    return page(head(title=L("مقالات عن التسويق في السعودية ومصر — توب تك", "Marketing Articles for Saudi Arabia & Egypt — Top Tech"),
                     desc=L("مقالات توب تك: كم تكلّف خدمات التسويق، وكيف تختار وكالة، وكيف تعرف أن حملاتك تحقّق نتائج فعلية.",
                            "Top Tech articles: what marketing services cost, how to choose an agency, and how to tell whether your campaigns are really working."),
                     path="/articles", jsonld=[breadcrumb_ld(trail, "/articles")]),
                header(is_home=False, active="articles", alt_path="/articles"), body)


# --------------------------------------------------------------------------- write

# --deploy DIR: production output — folder-style pages (x/index.html) and root-absolute clean
# links (/ar/services/x or /services/x), matching the URLs Google already indexes.
DEPLOY = Path(sys.argv[sys.argv.index("--deploy") + 1]).resolve() if "--deploy" in sys.argv else None
PREFIX = BASE + "/"   # "/ar/" or "/"


def deploy_path(rel):
    if rel == "index.html" or rel.endswith("/index.html"):
        return rel
    return rel[:-5] + "/index.html"  # contact.html -> contact/index.html


def deploy_html(html):
    html = html.replace("@/", PREFIX)
    html = re.sub(r'(href="' + re.escape(PREFIX) + r'[^"#?]*?)(?:/?index)?\.html', r"\1", html)  # x.html -> x
    if BASE:
        html = html.replace(f'href="{BASE}/"', f'href="{BASE}"').replace(f'href="{BASE}/#', f'href="{BASE}#')
    html = html.replace(f'property="og:image" content="{PREFIX}', f'property="og:image" content="{SITE}{PREFIX}')
    return html


def write(rel, html):
    if DEPLOY:
        out = DEPLOY / deploy_path(rel)
        html = deploy_html(html)
    else:
        # local preview: Arabic at ./, English at ./en/ (sharing ./assets)
        depth = rel.count("/")
        up = "../" * depth
        if EN:
            html = html.replace("@/assets/", "../" + up + "assets/")
        html = html.replace("@/", up)
        out = ROOT / ("en" if EN else "") / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    return rel


def main():
    aidx = load(CONTENT / "articles-index.json")
    articles = {}
    for slug, _ in ARTICLE_ORDER:
        a = load(CONTENT / "articles" / f"{slug}.json")
        a["excerpt"] = aidx["excerpts"].get(slug, "")
        articles[slug] = a
    sidx = load(CONTENT / "services-index.json")
    projects = load(CONTENT / "projects.json")

    built = [write("index.html", build_home(articles, projects)), write("contact.html", build_contact()),
             write("projects/index.html", build_projects(projects)),
             write("services/index.html", build_services_index(sidx)),
             write("articles/index.html", build_articles_index(articles, aidx))]
    for s in SERVICES:
        built.append(write(f"services/{s['slug']}.html", build_service(load(CONTENT / "services" / f"{s['slug']}.json"), articles, projects)))
    for slug, cat in ARTICLE_ORDER:
        built.append(write(f"articles/{slug}.html", build_article(slug, articles[slug], cat, articles)))
    if DEPLOY:
        shutil.copytree(ROOT / "assets", DEPLOY / "assets", dirs_exist_ok=True)
    print(f"built {len(built)} {LANG} pages" + (f" into {DEPLOY}" if DEPLOY else ""))


if __name__ == "__main__":
    main()
