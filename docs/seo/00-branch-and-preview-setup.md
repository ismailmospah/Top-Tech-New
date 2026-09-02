# Phase 0 — Branch & Vercel Preview setup

Internal working document. Excluded from the Vercel deployment via `.vercelignore`,
so nothing in `docs/` is ever served on the website.

## Purpose of this branch

`seo-multilingual-improvements` is the isolated working branch for the SEO /
multilingual (Arabic + English) enhancement programme. Production (`main`,
serving https://www.toptech.studio/) must remain untouched until changes on this
branch are reviewed on a Vercel Preview URL and explicitly approved.

## Git state at branch creation

| Item | Value |
| --- | --- |
| Remote | `origin` → https://github.com/ismailmospah/Top-Tech-New |
| Production branch | `main` |
| Base commit | `9fcda86` — *Merge pull request #21 from ismailmospah/claude/form-contact-fields-layout-vk8etr* |
| New branch | `seo-multilingual-improvements` (created from `origin/main`) |
| Working tree before branching | clean |

Existing remote branches at that point: `main`, `new-design`,
`fix/marquee-visibility`, `fix/mobile-improvements`,
`claude/contact-form-url-change-1b964t`, `claude/form-contact-fields-layout-vk8etr`,
`claude/mobile-scroll-zoom-bug-bij25l`, `claude/seo-multilingual-setup-dsolb5`.
None of them were modified, reset, deleted, or force-pushed.

## Deployment setup as found

The project is a **hand-written static site** — no framework, no build step, no
`package.json`, no `node_modules`.

`vercel.json` at the repo root:

- `framework: null`, `installCommand` and `buildCommand` are no-ops,
  `outputDirectory: "."` — the repository root is served verbatim.
- Redirects: `/index.html → /` (301), `/contact.html → /contact` (301).
- Rewrite: `/contact → /contact.html`.

Consequence for later phases: **every file committed to the repo root is publicly
served**. Any new page must be added as a real file plus, where a clean URL is
wanted, a matching `rewrites` entry in `vercel.json`. Internal notes therefore live
under `docs/` and are ignored by the deployment.

There is no `.vercel/` project link directory in the repository, and this session
has no Vercel CLI, no `VERCEL_TOKEN`, and no network access to `vercel.com` /
`api.vercel.com` (blocked by the environment's egress policy). The Vercel project
is linked to the GitHub repository through the Vercel ↔ GitHub integration, which
builds a Preview Deployment automatically for every pushed non-production branch.

## SEO baseline observed (read-only — no changes made in this phase)

Files: `index.html`, `contact.html`, `style.css`, `main.js`, `lang.js`,
`contact.js`, `transition.js`, `assets/{logo-original.svg,logo-white.svg,og-image.jpg}`.

Present today:

- Unique `<title>` and `<meta name="description">` per page.
- Open Graph + Twitter card tags on the homepage.
- Google Analytics (`G-NXWC3SFZJ2`), Meta Pixel (`2116622618904017`), TikTok Pixel,
  Facebook domain verification. **All existing tracking must be preserved.**
- Language switching handled client-side in `lang.js`.

Missing / to address in later phases:

- No `robots.txt`, no `sitemap.xml`.
- No `<link rel="canonical">` on any page.
- No `hreflang` annotations, and no distinct URL per language — Arabic and English
  share one URL, so the Arabic version is currently not independently indexable.
- `contact.html` has no Open Graph / Twitter tags.
- No Schema.org structured data.
- `<html lang="en" dir="ltr">` is static in the markup; Arabic is applied by script
  after load.

These are recorded here as the audit baseline only. No remediation is included in
this commit.

## Phase 0 scope

This commit intentionally contains **zero website changes**: one internal document
and one deployment-ignore rule. Its only functional effect is to give the branch a
distinct commit so the Vercel GitHub integration produces a Preview Deployment.
