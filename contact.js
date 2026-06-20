/* ============================================================
   TOP TECH — Concept 4 · Contact page
   Particle sphere backdrop + animated form.
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

/* ---------------- EmailJS (same setup as the old site) ----------------
   These three values come from your EmailJS dashboard (and were stored as
   VITE_EMAILJS_* on the old Vercel project). They are client-side keys and
   safe to expose. Paste yours below to wire the form to your inbox. */
const EMAILJS_PUBLIC_KEY = "-vRpD7rblXOjDMu1N";
const EMAILJS_SERVICE_ID = "service_wybaj13";
const EMAILJS_TEMPLATE_ID = "template_fz6m9wt";
const CONTACT_TO_EMAIL = "toptechcompany51@gmail.com";
if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

/* ---------------- Particle sphere backdrop ---------------- */
(function universe() {
  const canvas = document.getElementById("gl");
  if (!canvas || !window.THREE) return;
  const COUNT = isTouch ? 5000 : 11000;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 9.5;

  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const phases = new Float32Array(COUNT);
  const purple = new THREE.Color(0x8a63e8);
  const amber = new THREE.Color(0xf9b527);
  const bone = new THREE.Color(0xf5f2ec);
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.39996;
    const R = 2.5 + (Math.random() - 0.5) * 0.2;
    positions[i * 3] = Math.cos(th) * r * R;
    positions[i * 3 + 1] = y * R;
    positions[i * 3 + 2] = Math.sin(th) * r * R;
    const c = Math.random() < 0.62 ? purple : Math.random() < 0.8 ? amber : bone;
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    phases[i] = Math.random() * Math.PI * 2;
  }

  function makeDotTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(255,255,255,0.75)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const dotTex = makeDotTexture();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: isTouch ? 0.055 : 0.045,
    map: dotTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const haloMat = new THREE.PointsMaterial({
    size: isTouch ? 0.16 : 0.13,
    map: dotTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  points.add(new THREE.Points(geo, haloMat)); // cheap bloom halo

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  const base = positions.slice();
  function render() {
    const t = clock.getElapsedTime();
    if (!reducedMotion) {
      const pos = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const wob = Math.sin(t * 1.1 + phases[i]) * 0.05;
        pos[i3] = base[i3] * (1 + wob * 0.04);
        pos[i3 + 1] = base[i3 + 1] * (1 + wob * 0.04);
        pos[i3 + 2] = base[i3 + 2] * (1 + wob * 0.04);
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y += 0.0014;
      points.rotation.x = Math.sin(t * 0.15) * 0.1;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      camera.position.x = mouse.x * 0.8;
      camera.position.y = -mouse.y * 0.6;
      camera.lookAt(0, 0, 0);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  let _rW = window.innerWidth;
  window.addEventListener("resize", () => {
    const w = window.innerWidth, h = window.innerHeight;
    // On touch devices, ignore height-only changes (mobile browser chrome
    // showing/hiding on scroll) to prevent a visual zoom on the canvas.
    if (isTouch && w === _rW) return;
    _rW = w;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();

/* ---------------- Cursor ---------------- */
if (!isTouch) {
  const cursor = document.getElementById("cursor");
  const label = document.getElementById("cursorLabel");
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
  window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
  const LABELS = { go: "GO", hover: "" };
  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => {
      label.textContent = LABELS[el.dataset.cursor] ?? "";
      cursor.classList.add("is-active");
    });
    el.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  });
}

/* magnetic */
if (!isTouch && !reducedMotion) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener("pointerleave", () => { x(0); y(0); });
  });
}

/* ---------------- Intro ---------------- */
gsap.from(".cform__line", { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.12, delay: 0.1 });
gsap.from([".cform__lead", ".cform__contacts li"], { y: 30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.4 });
gsap.from(".cform__form > *", { y: 36, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.5 });

/* ---------------- Form validation + submit ---------------- */
const form = document.getElementById("projectForm");
const note = document.getElementById("formNote");
const success = document.getElementById("formSuccess");
const submitBtn = form.querySelector(".cform__submit");

/* ---------------- Budget tiers depend on the chosen country ---------------- */
const budgetGrid = document.getElementById("budgetGrid");
const budgetCurrency = document.getElementById("budgetCurrency");
const BUDGETS = {
  "Saudi Arabia": { curKey: "cur_sar", tiers: ["5k – 15k", "15k – 50k", "50k +"] },
  "Egypt":        { curKey: "cur_egp", tiers: ["30k – 75k", "75k – 200k", "200k +"] },
};
const T = (k) => (window.TT_T ? window.TT_T(k) : k);

function renderBudget() {
  const checked = form.querySelector('input[name="country"]:checked');
  const country = checked ? checked.value : null;
  if (!country || !BUDGETS[country]) {
    budgetCurrency.textContent = "";
    budgetGrid.innerHTML = `<span class="chips__hint">${T("budget_hint")}</span>`;
    return;
  }
  const { curKey, tiers } = BUDGETS[country];
  const cur = T(curKey);
  budgetCurrency.textContent = "(" + cur + ")";
  const opts = tiers.map((t) => ({ label: t, value: `${t} ${cur}` }));
  opts.push({ label: T("budget_undecided"), value: "Undecided" });
  budgetGrid.innerHTML = opts
    .map((o) => `<label class="chip chip--radio"><input type="radio" name="budget" value="${o.value}" /><span>${o.label}</span></label>`)
    .join("");
}
form.querySelectorAll('input[name="country"]').forEach((r) => r.addEventListener("change", renderBudget));
window.addEventListener("tt-lang", renderBudget); // re-translate currency / labels on language switch
renderBudget();

function fieldWrap(input) { return input.closest(".field"); }

function validate() {
  let ok = true;
  // use form.elements (form.name would return the form's name attribute, not the field)
  const required = [form.elements.name, form.elements.email, form.elements.message];
  required.forEach((input) => {
    const wrap = fieldWrap(input);
    let bad = !input.value.trim();
    if (input.type === "email" && input.value.trim()) {
      bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    }
    wrap.classList.toggle("is-invalid", bad);
    if (bad) ok = false;
  });
  return ok;
}

// clear invalid state as the user types
form.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", () => fieldWrap(el)?.classList.remove("is-invalid"));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  note.textContent = "";
  if (!validate()) {
    note.textContent = window.TT_T ? window.TT_T("err_required") : "Please fill in your name, a valid email and a short message.";
    const firstBad = form.querySelector(".field.is-invalid input, .field.is-invalid textarea");
    firstBad?.focus();
    if (!reducedMotion) gsap.fromTo(form.querySelector(".is-invalid"), { x: -6 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.4)" });
    return;
  }

  submitBtn.disabled = true;
  submitBtn.querySelector(".cform__submit-text").textContent = window.TT_T ? window.TT_T("sending") : "Sending…";

  const f = form.elements;
  const checkedServices = [...form.querySelectorAll('input[name="service"]:checked')].map((c) => c.value);
  const checkedCountry = form.querySelector('input[name="country"]:checked');
  const checkedBudget = form.querySelector('input[name="budget"]:checked');

  // same template params the old site used (extra fields kept as "Not specified")
  const params = {
    from_name: f.name.value.trim(),
    from_email: f.email.value.trim(),
    whatsapp_number: f.whatsapp.value.trim() || "Not provided",
    country: checkedCountry ? checkedCountry.value : "Not specified",
    company_name: f.company.value.trim() || "Not provided",
    budget: checkedBudget ? checkedBudget.value : "Not specified",
    service: checkedServices.length ? checkedServices.join(", ") : "Not specified",
    industry: "Not specified",
    video_duration: "Not specified",
    message: f.message.value.trim(),
    to_email: CONTACT_TO_EMAIL,
  };

  function showSuccess() {
    document.getElementById("successName").textContent = params.from_name.split(" ")[0] || "there";
    success.classList.add("is-open");
    success.setAttribute("aria-hidden", "false");
    if (!reducedMotion) {
      gsap.from("#formSuccess h2, #formSuccess p, .cform__success-back", {
        y: 24, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.1, delay: 0.2,
      });
    }
    form.reset();
    renderBudget();
    submitBtn.disabled = false;
    submitBtn.querySelector(".cform__submit-text").innerHTML = window.TT_T ? window.TT_T("f_submit") : 'Send the brief <i>→</i>';
  }

  function showError() {
    note.textContent = window.TT_T ? window.TT_T("err_send") : "Couldn't send — please try again or message us on WhatsApp.";
    submitBtn.disabled = false;
    submitBtn.querySelector(".cform__submit-text").innerHTML = window.TT_T ? window.TT_T("f_submit") : 'Send the brief <i>→</i>';
  }

  // not configured yet → don't lose the lead, fall back to a success state
  if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    console.warn("EmailJS keys not set — fill EMAILJS_* in contact.js to send to your inbox.");
    setTimeout(showSuccess, 700);
    return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(showSuccess)
    .catch((err) => { console.error(err); showError(); });
});
