# Top Tech — site source (Arabic + English)

This folder (`ar-src/` in the repo) is the source of **toptech.studio** — the Arabic site at `/ar`
and the English site at `/`. It is not deployed itself (see `.vercelignore`).

## Publish
```bash
cd ar-src
python3 build.py --deploy ../ar                 # Arabic  -> /ar/...
python3 build.py --lang en --deploy ..          # English -> /...
python3 tools/check_deploy.py ../ar             # every link/image must resolve under /ar
python3 tools/check_deploy.py .. --en           # ...and at the root for English
```
then commit the regenerated `ar/`, `index.html`, `services/`, `articles/`, `projects/`, `contact/`, `assets/`
and push to `main` (Vercel deploys automatically).

> The old site's generators in the repo's root `tools/` folder (`build-*.mjs`) produce the **previous** design —
> don't run them, they would overwrite the new English pages.

## Local preview
Videos only play inside the page when it's served, not on `file://`:
```bash
python3 build.py && python3 build.py --lang en && python3 -m http.server 8321
```
Arabic at `http://localhost:8321/`, English at `http://localhost:8321/en/`.

## Editing
| What | Arabic | English |
|---|---|---|
| Homepage / contact page | `src/pages/home.html`, `contact.html` | `src/pages/en/home.html`, `contact.html` |
| Service / article text | `content/services/`, `content/articles/` | `content/en/services/`, `content/en/articles/` |
| Work & results | `content/projects.json` | `content/en/projects.json` |
| Header, footer, service names, article categories | `build.py` — every string is `L("عربي", "English")` | same |

- **Styles / behaviour:** `assets/css/style.css`, `assets/js/main.js` (shared by both languages; no build needed).
- Image paths in `src/pages` must start with `@/assets/…`.
- Don't edit the generated pages (`index.html`, `contact.html`, `services/`, `articles/`, `projects/`, `en/`) — the build overwrites them.
- After a local build, `python3 tools/check_links.py` confirms every link works from disk.

## Contact form
Sends through EmailJS with the same account/template as the previous toptech.studio form (keys in `assets/js/main.js`).
The Arabic form sends Arabic values, the English form English values; both require a WhatsApp number (no email field).
