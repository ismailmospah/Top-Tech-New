# Phase 2 — Service pages

Internal working document (never deployed — see `.vercelignore`).

## What was added

Fourteen new pages, seven per language:

| English | Arabic |
| --- | --- |
| `/services` | `/ar/services` |
| `/services/marketing-strategy` | `/ar/services/marketing-strategy` |
| `/services/social-media-marketing` | `/ar/services/social-media-marketing` |
| `/services/content-management` | `/ar/services/content-management` |
| `/services/branding-design` | `/ar/services/branding-design` |
| `/services/motion-video` | `/ar/services/motion-video` |
| `/services/media-buying` | `/ar/services/media-buying` |

The sitemap now carries 18 URLs. Every page has a self-referencing canonical and
reciprocal `en` / `ar` / `x-default` hreflang.

## Why the Arabic is not a translation

Unlike the homepage, these pages are **not** generated from the English by
swapping `data-i18n` values. Both languages are written independently in
`tools/content/services/<slug>.mjs` and rendered by the same template. English
and Arabic answer the same brief but are phrased for their own market — the
Arabic uses the terms people actually search (`إدارة حسابات التواصل الاجتماعي`,
`الموشن جرافيك`, `ميديا باينج`, `الهوية البصرية`) rather than literal renderings
of the English headings.

Rendered body copy per page: 886–1108 words in English, 757–963 in Arabic. These
are not thin keyword pages.

## Page structure

Each service page carries a single `h1`, then: what the service is · who it is
for · the problems it solves · what we do · how we work · what you get · FAQ ·
related services · the site's standing contact CTA. Roughly 34 headings per page
in a clean h1 → h2 → h3 hierarchy.

FAQ questions are real `<h3>` elements inside `<summary>`, so the outline holds
up even though the answers are collapsed.

## Structured data

Per service page: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`,
`Service`, `FAQPage`. The services index carries `ItemList` instead of the last
two. `FAQPage` is only emitted from FAQ content that is visibly rendered on the
page. Still no address, reviews or ratings anywhere — the business information
does not support them.

## Design

No new visual language. The pages reuse the existing tokens, the `.phase` card
treatment, the display type, the header, the WebGL backdrop and the closing
contact block. New CSS is scoped to new class names and written with logical
properties (`padding-inline-start`, `inset-inline-start`) so Arabic RTL mirrors
correctly without a separate stylesheet.

Two things were changed deliberately after seeing the pages render:

- **A scrim** (`.page-scrim`) now sits between the particle canvas and the
  content on generated pages only. Long-form body copy over the bright particle
  field was hard to read, badly so on mobile Arabic. The homepage is untouched —
  its hero still gets the particles at full strength.
- **Section kickers were renamed.** Every service used "What we do" as both the
  small amber kicker and the `h2` beneath it. They now read Overview · Audience ·
  Problems · Scope · Process · Deliverables · Questions.

## Changes to shared files

- `index.html` — each of the six service names on the homepage is now a link to
  its page (a stretched link, so the whole row stays clickable and the hover
  animation is unchanged), plus an "All services" link below the list. The
  homepage `OfferCatalog` now points at the real service URLs.
- `lang.js` — one new key, `services_all`.
- `main.js` — two changes:
  1. **The preloader intro is now guarded.** It dereferenced `#loaderPct` and
     `#loaderBar` inside a GSAP `onUpdate`. Content pages share this script and
     have no preloader, so it would have thrown on every animation tick.
  2. Content-page reveals were added, and they **never animate opacity**. The
     first attempt reused the site's usual fade-up, and QA caught 13 cards per
     page sitting at `opacity: 0` until scrolled. On a page whose whole purpose
     is text that should be read and indexed, that was the wrong trade — the new
     reveal only translates, so nothing is ever invisible.
- `style.css` — appended content-page styles. Nothing existing was modified
  except adding `position: relative` to `.service` for the stretched link.

## Tooling added

| File | Purpose |
| --- | --- |
| `tools/content/services/*.mjs` | one file per service, both languages, validated on import |
| `tools/build-services.mjs` | renders all 14 pages |
| `tools/template.mjs` | shared head/header/footer; lifts the analytics block out of `index.html` so tracking IDs live in one place |
| `tools/schema.mjs` | Schema.org builders |
| `tools/i18n.mjs` | shared reader for the `lang.js` dictionary |
| `tools/check-links.mjs` | crawls every page: internal links, canonical, hreflang, one `h1` each |

`tools/content/services/index.mjs` throws on import if a service is missing a
section, a heading, a language, or references an unknown related slug — a
half-written page cannot be built by accident.

## Verification

- `check-links.mjs`: 18 pages, 280 internal links, 20 unique targets — no 404s,
  no internal redirects, no relative links, every page exactly one `h1`, every
  canonical self-referenced in its own hreflang set.
- Chromium at 1440×900 and 390×844: correct `lang`/`dir`, no horizontal overflow
  in RTL or LTR, no same-origin request failures, no uncaught exceptions, no
  content left invisible on load.
- Homepage and contact page re-checked after the `main.js` edit — preloader,
  hero animation and WebGL unchanged.
- Both generators re-run produce byte-identical output.

## Not done

- **No case studies.** The brief asks service pages to link to relevant case
  studies. None exist on the site and none were invented, so the pages link to
  related services and the contact page instead. This is the main gap to close
  next, and it needs real project material from Top Tech.
- No location or industry pages yet.
- No articles yet.
