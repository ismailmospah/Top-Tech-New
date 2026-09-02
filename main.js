/* ============================================================
   TOP TECH — Concept 4 · "Orbit"
   One particle field morphs through the brand story as you scroll:
   play button → wave → ring → scatter → bars → sphere.
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

/* ---------------- Smooth scroll ---------------- */
const lenis = new Lenis({ lerp: 0.1, smoothWheel: !reducedMotion });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  });
});

/* ============================================================
   PARTICLE UNIVERSE
   ============================================================ */
const COUNT = isTouch ? 6000 : 16000;
const canvas = document.getElementById("gl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 7;

/* ----- shape generators (each returns COUNT*3 positions) ----- */
function makePlay() {
  // Filled play-button triangle, like the amber "o" in the logo
  const arr = new Float32Array(COUNT * 3);
  const A = [-1.7, 2.1], B = [-1.7, -2.1], C = [2.3, 0];
  for (let i = 0; i < COUNT; i++) {
    let u = Math.random(), v = Math.random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    arr[i * 3] = A[0] + u * (B[0] - A[0]) + v * (C[0] - A[0]);
    arr[i * 3 + 1] = A[1] + u * (B[1] - A[1]) + v * (C[1] - A[1]);
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  return arr;
}
function makeWave() {
  const arr = new Float32Array(COUNT * 3);
  const cols = Math.ceil(Math.sqrt(COUNT * 2));
  const rows = Math.ceil(COUNT / cols);
  let i = 0;
  for (let r = 0; r < rows && i < COUNT; r++) {
    for (let c = 0; c < cols && i < COUNT; c++, i++) {
      const x = (c / cols - 0.5) * 11;
      const z = (r / rows - 0.5) * 6;
      arr[i * 3] = x;
      arr[i * 3 + 1] = Math.sin(x * 1.1) * 0.7 + Math.cos(z * 1.6) * 0.5 - 0.5;
      arr[i * 3 + 2] = z;
    }
  }
  return arr;
}
function makeRing() {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = Math.random() * Math.PI * 2;
    const R = 2.4, tube = 0.5 * Math.sqrt(Math.random());
    arr[i * 3] = (R + tube * Math.cos(p)) * Math.cos(t);
    arr[i * 3 + 1] = (R + tube * Math.cos(p)) * Math.sin(t) * 0.85;
    arr[i * 3 + 2] = tube * Math.sin(p);
  }
  return arr;
}
function makeScatter() {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 14;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  return arr;
}
function makeBars() {
  // Four ascending columns — the growth chart
  const arr = new Float32Array(COUNT * 3);
  const xs = [-2.7, -0.9, 0.9, 2.7];
  const hs = [1.4, 2.2, 3.1, 4.2];
  for (let i = 0; i < COUNT; i++) {
    const b = i % 4;
    arr[i * 3] = xs[b] + (Math.random() - 0.5) * 1.1;
    arr[i * 3 + 1] = -2.2 + Math.random() * hs[b];
    arr[i * 3 + 2] = (Math.random() - 0.5) * 1.1;
  }
  return arr;
}
function makeSphere() {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.39996; // golden angle
    const R = 2.3 + (Math.random() - 0.5) * 0.15;
    arr[i * 3] = Math.cos(th) * r * R;
    arr[i * 3 + 1] = y * R;
    arr[i * 3 + 2] = Math.sin(th) * r * R;
  }
  return arr;
}

const SHAPES = {
  play: makePlay(),
  wave: makeWave(),
  ring: makeRing(),
  scatter: makeScatter(),
  bars: makeBars(),
  sphere: makeSphere(),
};
let currentTarget = SHAPES.play;

/* ----- geometry: positions start at scatter, colors mix brand hues ----- */
const positions = new Float32Array(SHAPES.scatter);
const colors = new Float32Array(COUNT * 3);
const phases = new Float32Array(COUNT);
const purple = new THREE.Color(0x8a63e8);
const amber = new THREE.Color(0xf9b527);
const bone = new THREE.Color(0xf5f2ec);
for (let i = 0; i < COUNT; i++) {
  const r = Math.random();
  const c = r < 0.62 ? purple : r < 0.92 ? amber : bone;
  colors[i * 3] = c.r;
  colors[i * 3 + 1] = c.g;
  colors[i * 3 + 2] = c.b;
  phases[i] = Math.random() * Math.PI * 2;
}

/* soft round glow sprite so each particle reads as a light, not a square */
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
  size: isTouch ? 0.06 : 0.05,
  map: dotTex,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const points = new THREE.Points(geo, mat);
scene.add(points);

/* oversized faint copy of the same cloud = cheap, build-free bloom */
const haloMat = new THREE.PointsMaterial({
  size: isTouch ? 0.16 : 0.14,
  map: dotTex,
  vertexColors: true,
  transparent: true,
  opacity: 0.16,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
points.add(new THREE.Points(geo, haloMat)); // child → shares the morph + transform

/* ----- mouse parallax ----- */
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener("pointermove", (e) => {
  mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* ----- render loop ----- */
const clock = new THREE.Clock();
const LERP = reducedMotion ? 1 : 0.045;
const interactive = !reducedMotion && !isTouch;
function render() {
  const t = clock.getElapsedTime();
  const pos = geo.attributes.position.array;
  // cursor mapped into the cloud's space (it roughly fills x,y ∈ [-3.4, 3.4])
  const mWX = mouse.x * 3.4, mWY = -mouse.y * 3.4;
  const R = 1.3, R2 = R * R;
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const wob = reducedMotion ? 0 : Math.sin(t * 1.4 + phases[i]) * 0.04;
    pos[i3] += (currentTarget[i3] - pos[i3]) * LERP;
    pos[i3 + 1] += (currentTarget[i3 + 1] + wob - pos[i3 + 1]) * LERP;
    pos[i3 + 2] += (currentTarget[i3 + 2] - pos[i3 + 2]) * LERP;
    if (interactive) {
      const dx = pos[i3] - mWX, dy = pos[i3 + 1] - mWY;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2) {                              // push particles away from the cursor
        const d = Math.sqrt(d2) || 0.0001;
        const f = (1 - d / R) * 0.5;
        pos[i3] += (dx / d) * f;
        pos[i3 + 1] += (dy / d) * f;
      }
    }
  }
  geo.attributes.position.needsUpdate = true;

  if (!reducedMotion && !isTouch) {
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    camera.position.x = mouse.x * 0.5;
    camera.position.y = -mouse.y * 0.4;
    camera.lookAt(0, 0, 0);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

let _rW = window.innerWidth;
window.addEventListener("resize", () => {
  const w = window.innerWidth, h = window.innerHeight;
  // On touch devices, only respond to width changes (true orientation flip).
  // Height-only changes are caused by the mobile browser chrome appearing /
  // disappearing on scroll and would make the canvas visually zoom in/out.
  if (isTouch && w === _rW) return;
  _rW = w;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

/* ----- morph driver: each section declares its shape ----- */
document.querySelectorAll("[data-shape]").forEach((sec) => {
  if (!sec.dataset.shape || !SHAPES[sec.dataset.shape]) return;
  ScrollTrigger.create({
    trigger: sec,
    start: "top 55%",
    end: "bottom 55%",
    onEnter: () => (currentTarget = SHAPES[sec.dataset.shape]),
    onEnterBack: () => (currentTarget = SHAPES[sec.dataset.shape]),
  });
});

/* ============================================================
   CURSOR
   ============================================================ */
if (!isTouch) {
  const cursor = document.getElementById("cursor");
  const label = document.getElementById("cursorLabel");
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
  window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });

  const LABELS = { play: "PLAY", view: "VIEW", go: "GO", hover: "" };
  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => {
      label.textContent = LABELS[el.dataset.cursor] ?? "";
      cursor.classList.add("is-active");
    });
    el.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  });
}

/* ----- magnetic buttons ----- */
if (!isTouch && !reducedMotion) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.35);
      y((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener("pointerleave", () => { x(0); y(0); });
  });
}

/* Text splitting for [data-split] is handled by lang.js (it must run
   per-language so Arabic splits by word and keeps its cursive joining). */

/* ============================================================
   PRELOADER → HERO INTRO
   ============================================================ */
const pct = document.getElementById("loaderPct");
const bar = document.getElementById("loaderBar");
const counter = { v: 0 };

/* Only the homepage carries the preloader. Content pages share this file, so
   the intro timeline is skipped there rather than animating missing nodes. */
const hasPreloader = !!(document.getElementById("loader") && pct && bar);
if (hasPreloader) {

/* logo slides up → counter fills → amber curtain wipes up → hero types in
   (the entrance from concept 1, ported to the Orbit build) */
const intro = gsap.timeline();
intro
  .to("#loaderLogo", { y: 0, duration: 1.0, ease: "power4.out" })
  .to(counter, {
    v: 100,
    duration: reducedMotion ? 0.1 : 1.6,
    ease: "power2.inOut",
    onUpdate() {
      pct.textContent = String(Math.round(counter.v)).padStart(3, "0");
      bar.style.width = counter.v + "%";
    },
  }, "-=0.4")
  .to(".loader__inner", { opacity: 0, y: -30, duration: 0.45, ease: "power2.in" })
  .to(".loader__curtain", { scaleY: 1, duration: 0.55, ease: "power4.inOut" }, "-=0.15")
  .set(".loader__curtain", { transformOrigin: "top" })
  .set("#loader", { background: "transparent" })
  .to(".loader__curtain", { scaleY: 0, duration: 0.65, ease: "power4.inOut" })
  .set("#loader", { display: "none" })
  // hero intro
  .from(".hero .char", {
    yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.025, ease: "expo.out",
  }, "-=0.45")
  .from(".reveal-line > span", {
    yPercent: 110, duration: 0.9, stagger: 0.08, ease: "expo.out",
  }, "-=0.7")
  .from(".header, .hero__scroll, .concepts", { opacity: 0, duration: 0.7 }, "-=0.5");
}

/* ============================================================
   SCROLL CHOREOGRAPHY
   ============================================================ */
gsap.to("#progressBar", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: { trigger: document.body, start: "top top", end: "max", scrub: 0.4 },
});

/* hero parallax fade-out */
gsap.to(".hero__title, .hero__foot", {
  yPercent: -12,
  opacity: isTouch ? 0.55 : 0.15,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "bottom 90%", end: "bottom 30%", scrub: true },
});

/* The marquee scroll is a pure CSS animation (see .marquee__row in style.css).
   CSS keyframes are GPU-composited and independent of JS/scroll, so the strip
   can never freeze, gap, or disappear when scrolling away and back. */

/* section heads rise in */
document.querySelectorAll(".section-head, .stats .section-head__index, .contact__kicker").forEach((el) => {
  gsap.from(el, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "expo.out",
    scrollTrigger: { trigger: el, start: "top 86%" },
  });
});

/* service rows cascade */
gsap.from(".service", {
  y: 60,
  opacity: 0,
  duration: 0.9,
  ease: "expo.out",
  stagger: 0.08,
  scrollTrigger: { trigger: ".services__list", start: "top 82%" },
});

/* Content pages carry the text we want read and indexed, so their reveal
   moves elements without ever fading them out. Anything below the fold stays
   fully visible and merely slides into place — nothing sits at opacity 0
   waiting for a scroll that a crawler or a keyboard user may never make. */
document.querySelectorAll(".cards, .steps, .ticks, .related").forEach((group) => {
  gsap.from(group.children, {
    y: 34,
    duration: 0.85,
    ease: "expo.out",
    stagger: 0.06,
    scrollTrigger: { trigger: group, start: "top 88%" },
  });
});

document.querySelectorAll(".phero__title, .block__title").forEach((el) => {
  gsap.from(el, {
    y: 40,
    duration: 0.9,
    ease: "expo.out",
    scrollTrigger: { trigger: el, start: "top 90%" },
  });
});

/* story phases cascade in */
gsap.set(".phase", { y: 70, opacity: 0 });
gsap.to(".phase", {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "expo.out",
  stagger: 0.12,
  clearProps: "all",
  scrollTrigger: {
    trigger: ".story__phases",
    start: "top 80%",
    toggleActions: "play none none none",
  },
});

/* reviews — two opposing auto-marquees, velocity-reactive */
function reviewMarquee(id, dir) {
  const track = document.getElementById(id);
  if (!track) return null;
  // duplicate the bubbles once for a seamless loop
  track.innerHTML += track.innerHTML;
  const half = track.scrollWidth / 2;
  const from = dir < 0 ? 0 : -half;
  const to = dir < 0 ? -half : 0;
  return gsap.fromTo(track, { x: from }, { x: to, ease: "none", duration: 32, repeat: -1 });
}
const rA = reviewMarquee("reviewRowA", -1);
const rB = reviewMarquee("reviewRowB", 1);
if (!reducedMotion && (rA || rB)) {
  ScrollTrigger.create({
    trigger: ".reviews",
    start: "top bottom",
    end: "bottom top",
    onUpdate(self) {
      const v = gsap.utils.clamp(0.4, 4, 1 + Math.abs(self.getVelocity()) / 400);
      rA && rA.timeScale(v);
      rB && rB.timeScale(v);
    },
  });
}

/* stat counters */
document.querySelectorAll(".count").forEach((el) => {
  const target = +el.dataset.count;
  ScrollTrigger.create({
    trigger: el,
    start: "top 88%",
    once: true,
    onEnter: () =>
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target,
        duration: reducedMotion ? 0.1 : 1.8,
        ease: "power2.out",
        snap: { textContent: 1 },
      }),
  });
});

/* contact giant type */
gsap.from(".contact__line", {
  yPercent: 105,
  duration: 1.2,
  ease: "expo.out",
  stagger: 0.12,
  scrollTrigger: { trigger: ".contact", start: "top 70%" },
});
gsap.from(".contact__mail, .contact__meta", {
  y: 40,
  opacity: 0,
  duration: 1,
  ease: "expo.out",
  stagger: 0.1,
  scrollTrigger: { trigger: ".contact__mail", start: "top 92%" },
});
