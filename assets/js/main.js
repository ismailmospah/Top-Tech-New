(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the same script serves the Arabic (/ar) and English (/) sites
  const EN = root.lang === 'en';
  const t = (ar, en) => (EN ? en : ar);

  /* ---------- Header shadow ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? t('إغلاق القائمة', 'Close menu') : t('فتح القائمة', 'Open menu'));
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Active nav link ---------- */
  const navLinks = [...document.querySelectorAll('.main-nav ul a[href^="#"]')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // stagger siblings slightly
        const siblings = [...entry.target.parentElement.children].filter((c) => c.classList.contains('reveal'));
        entry.target.style.transitionDelay = Math.min(siblings.indexOf(entry.target), 5) * 70 + 'ms';
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll('.count');
  const runCount = (el) => {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        co.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Highlight the link of the section in view (article TOC, service sub-nav) ---------- */
  document.querySelectorAll('.toc, .subnav').forEach((navEl) => {
    const links = [...navEl.querySelectorAll('a[href^="#"]')];
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const scroller = navEl.querySelector('.subnav-inner');
    const setActive = (id) => links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      // keep the active chip visible in the horizontally scrolling sub-nav (without scrolling the page)
      if (on && scroller) {
        const ar = a.getBoundingClientRect(), sr = scroller.getBoundingClientRect();
        scroller.scrollBy({ left: (ar.left + ar.width / 2) - (sr.left + sr.width / 2), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    targets.forEach((t) => spy.observe(t));
  });

  /* ---------- Article reading progress ---------- */
  const progress = document.querySelector('.read-progress span');
  const artBody = document.querySelector('.art-body');
  if (progress && artBody) {
    const update = () => {
      const r = artBody.getBoundingClientRect();
      const p = Math.min(Math.max(-r.top / (r.height - window.innerHeight * 0.6), 0), 1);
      progress.style.transform = `scaleX(${p})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Filter chips (articles, projects) ---------- */
  document.querySelectorAll('.filter-bar[data-grid]').forEach((bar) => {
    const chips = bar.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll(`#${bar.dataset.grid} > li`);
    const count = document.getElementById(bar.dataset.count);
    // Arabic number agreement: [one, two, 3–10, 11+]
    const [one, two, few, many] = bar.dataset.nouns.split('|');
    chips.forEach((chip) => chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      let n = 0;
      cards.forEach((card) => {
        const show = f === 'all' || card.dataset.cat === f;
        card.hidden = !show;
        if (show) { n += 1; card.classList.add('is-in'); }
      });
      count.textContent = n === 1 ? one : n === 2 ? two : n <= 10 ? `${n} ${few}` : `${n} ${many}`;
    }));
  });

  /* ---------- Work tabs (homepage specialties) ---------- */
  document.querySelectorAll('.work-tabs').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on) panel.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        // the next tab sits to the left in Arabic (RTL) and to the right in English
        const step = (EN ? { ArrowRight: 1, ArrowLeft: -1 } : { ArrowLeft: 1, ArrowRight: -1 })[e.key];
        if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* ---------- Media viewer: YouTube videos play in-page, designs/screenshots open large ---------- */
  const modal = document.getElementById('media-modal');
  if (modal && typeof modal.showModal === 'function') {
    const frame = document.getElementById('media-frame');
    const title = document.getElementById('media-title');
    const ext = document.getElementById('media-ext');
    const extLabel = ext.querySelector('.media-ext-label');
    let opener = null;
    const close = () => modal.close();
    modal.addEventListener('close', () => {
      frame.replaceChildren(); // stops the video
      modal.classList.remove('is-video', 'is-insta');
      if (opener) opener.focus({ preventScroll: true });
    });
    // click on the dark backdrop closes
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.getElementById('media-close').addEventListener('click', close);

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-video], [data-image], [data-insta]');
      if (!btn) return;
      e.preventDefault();
      // opened straight from disk (file://): YouTube/Instagram refuse to play embeds there (error 153),
      // so send the viewer to the video itself instead of showing a broken player
      if (location.protocol === 'file:' && (btn.dataset.video || btn.dataset.insta)) {
        const url = btn.dataset.video ? `https://www.youtube.com/watch?v=${btn.dataset.video}` : `https://www.instagram.com/reel/${btn.dataset.insta}/`;
        window.open(url, '_blank', 'noopener');
        return;
      }
      opener = btn;
      title.textContent = btn.dataset.title || '';
      modal.classList.remove('is-video', 'is-insta');
      if (btn.dataset.insta) {
        // Instagram's own embed player — the reel plays inside the page
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.instagram.com/reel/${btn.dataset.insta}/embed/`;
        iframe.title = btn.dataset.title || t('ريل', 'Reel');
        iframe.allow = 'autoplay; encrypted-media; fullscreen';
        frame.replaceChildren(iframe);
        ext.href = `https://www.instagram.com/reel/${btn.dataset.insta}/`;
        extLabel.textContent = t('افتح على إنستغرام', 'Open on Instagram');
        ext.hidden = false;
        modal.classList.add('is-insta');
      } else if (btn.dataset.video) {
        const id = btn.dataset.video;
        const iframe = document.createElement('iframe');
        // YouTube needs to know which site embeds it (else "Error 153"), so send the origin explicitly
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&enablejsapi=0&origin=${encodeURIComponent(location.origin)}`;
        iframe.title = btn.dataset.title || t('فيديو', 'Video');
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.allowFullscreen = true;
        frame.replaceChildren(iframe);
        ext.href = `https://www.youtube.com/watch?v=${id}`;
        extLabel.textContent = t('افتح على YouTube', 'Open on YouTube');
        ext.hidden = false;
        modal.classList.add('is-video');
      } else {
        const img = document.createElement('img');
        img.src = btn.dataset.image;
        img.alt = btn.dataset.title || '';
        frame.replaceChildren(img);
        ext.hidden = true;
      }
      modal.showModal();
    });
  }

  /* ---------- Contact page only from here on ---------- */
  const form = document.getElementById('brief-form');
  if (!form) return;

  // EmailJS — the same account/template the live toptech.studio form uses (client-side keys, safe to expose)
  const EMAILJS = { publicKey: '-vRpD7rblXOjDMu1N', serviceId: 'service_wybaj13', templateId: 'template_fz6m9wt' };
  const TO_EMAIL = 'toptechcompany51@gmail.com';
  if (window.emailjs) window.emailjs.init({ publicKey: EMAILJS.publicKey });

  const $ = (id) => document.getElementById(id);
  const val = (name) => (form.elements[name].value || '').trim();
  const market = () => form.querySelector('input[name="market"]:checked');

  // "request this service" links here with ?service=… — tick that service
  const requested = new URLSearchParams(location.search).get('service');
  if (requested) {
    const box = [...form.querySelectorAll('input[name="services"]')].find((b) => b.value === requested);
    if (box) box.checked = true;
  }

  /* budget ranges follow the chosen market (SAR / EGP) */
  const syncBudget = () => {
    const key = market().dataset.market;
    form.querySelectorAll('.budget-group').forEach((g) => {
      const on = g.dataset.market === key;
      g.hidden = !on;
      if (!on) g.querySelectorAll('input').forEach((i) => { i.checked = false; });
    });
    $('budget-currency').textContent = key === 'eg' ? t('(جنيه مصري)', '(EGP)') : t('(ريال سعودي)', '(SAR)');
    $('f-phone').placeholder = key === 'eg' ? '+20 1X XXXX XXXX' : '+966 5X XXX XXXX';
  };
  form.querySelectorAll('input[name="market"]').forEach((r) => r.addEventListener('change', syncBudget));
  syncBudget();

  /* validation */
  const rules = [
    ['f-name', 'err-name', (v) => v.length > 1],
    ['f-phone', 'err-phone', (v) => v.replace(/\D/g, '').length >= 8],
    ['f-msg', 'err-msg', (v) => v.length > 2],
  ];
  const check = ([inputId, errId, ok]) => {
    const input = $(inputId);
    const good = ok(input.value.trim());
    $(errId).hidden = good;
    input.closest('.field').classList.toggle('has-error', !good);
    input.setAttribute('aria-invalid', String(!good));
    if (good) input.removeAttribute('aria-describedby'); else input.setAttribute('aria-describedby', errId);
    return good;
  };
  const validate = () => rules.map(check).every(Boolean);
  rules.forEach((r) => $(r[0]).addEventListener('input', () => { if (!$(r[1]).hidden) check(r); }));

  /* a readable summary, used for the WhatsApp link */
  const summary = () => {
    const services = [...form.querySelectorAll('input[name="services"]:checked')].map((c) => c.value);
    const budget = form.querySelector('input[name="budget"]:checked');
    const lines = [t('مرحبًا توب تك 👋', 'Hi Top Tech 👋'), t('أرغب في بدء مشروع معكم.', "I'd like to start a project with you.")];
    const add = (label, v) => { if (v) lines.push(`${label}: ${v}`); };
    if (val('name') || val('brand') || services.length || val('message')) lines.push('');
    add(t('الاسم', 'Name'), val('name'));
    add(t('العلامة / الشركة', 'Brand / company'), val('brand'));
    add(t('الخدمات', 'Services'), services.join(t('، ', ', ')));
    add(t('السوق', 'Market'), val('name') || services.length ? market().dataset.label : '');
    add(t('الميزانية', 'Budget'), budget && budget.value);
    if (val('message')) lines.push('', t('تفاصيل المشروع:', 'Project details:'), val('message'));
    return lines.join('\n');
  };
  const waUrl = () => `https://wa.me/${market().value}?text=${encodeURIComponent(summary())}`;

  // the WhatsApp link carries whatever has been typed so far — no validation needed
  const waAlt = $('wa-alt');
  const refreshWa = () => { waAlt.href = waUrl(); $('success-wa').href = waUrl(); };
  form.addEventListener('input', refreshWa);
  form.addEventListener('change', refreshWa);
  refreshWa();

  /* submit → EmailJS */
  const btn = $('form-submit');
  const btnLabel = btn.querySelector('.btn-label');
  const note = $('form-note');
  const setBusy = (busy) => {
    btn.disabled = busy;
    btn.classList.toggle('is-busy', busy);
    btnLabel.textContent = busy ? t('جارٍ الإرسال…', 'Sending…') : t('إرسال', 'Send');
  };
  const showNote = (msg) => { note.textContent = msg; note.hidden = !msg; };

  const showSuccess = () => {
    $('success-name').textContent = val('name').split(/\s+/)[0];
    refreshWa();
    form.classList.add('is-sent');
    $('form-success').hidden = false;
    $('form-success').focus({ preventScroll: true });
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showNote('');
    if (!validate()) {
      form.querySelector('.has-error input, .has-error textarea').focus();
      return;
    }
    if (!window.emailjs) {
      showNote(t('تعذّر الإرسال الآن. تواصل معنا عبر واتساب وسنرد عليك فورًا.', "We couldn't send right now. Message us on WhatsApp and we'll reply right away."));
      return;
    }
    const services = [...form.querySelectorAll('input[name="services"]:checked')].map((c) => c.value);
    const budget = form.querySelector('input[name="budget"]:checked');
    // same template parameters as the live site's form
    const params = {
      from_name: val('name'),
      from_email: '', // the form asks for WhatsApp instead of email
      whatsapp_number: val('phone'),
      country: market().dataset.label,
      company_name: val('brand') || t('غير مذكور', 'Not provided'),
      budget: budget ? budget.value : t('غير محدد', 'Not specified'),
      service: services.length ? services.join(t('، ', ', ')) : t('غير محدد', 'Not specified'),
      industry: t('غير محدد', 'Not specified'),
      video_duration: t('غير محدد', 'Not specified'),
      message: val('message'),
      to_email: TO_EMAIL,
    };
    setBusy(true);
    window.emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, params)
      .then(showSuccess)
      .catch((err) => {
        console.error(err);
        showNote(t('تعذّر الإرسال. حاول مرة أخرى، أو تواصل معنا عبر واتساب.', "Couldn't send. Please try again, or message us on WhatsApp."));
      })
      .finally(() => setBusy(false));
  });

  $('success-reset').addEventListener('click', () => {
    form.reset();
    syncBudget();
    refreshWa();
    form.classList.remove('is-sent');
    $('form-success').hidden = true;
    $('f-name').focus();
  });
})();
