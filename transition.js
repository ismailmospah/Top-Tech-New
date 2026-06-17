/* ============================================================
   TOP TECH — Concept 4 · Page transitions
   Iris wipe through the void so index ↔ contact feels seamless.
   Shared by both pages (loaded after lang.js).
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const overlay = document.createElement("div");
  overlay.className = "page-transition";
  document.documentElement.appendChild(overlay);

  // index.html runs its own preloader, so only iris-reveal on pages without it
  const hasPreloader = !!document.getElementById("loader");

  if (!hasPreloader && !reduce) {
    overlay.classList.add("cover"); // start covered…
    requestAnimationFrame(() => {
      overlay.classList.add("anim");
      requestAnimationFrame(() => overlay.classList.remove("cover")); // …iris open
    });
  }

  function leaveTo(href) {
    if (reduce) { window.location.href = href; return; }
    overlay.classList.add("anim", "cover");
    setTimeout(() => { window.location.href = href; }, 620);
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    let url;
    try { url = new URL(a.href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;             // external / mailto / tel
    if (url.pathname === location.pathname && url.search === location.search) return; // same page (#anchors)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    leaveTo(url.href);
  });

  // restore from bfcache (back/forward) without a stuck overlay
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) overlay.classList.remove("cover");
  });
})();
