# Top Tech — Arabic site (source)

This folder is the source of **toptech.studio/ar**. It is not deployed (see `.vercelignore`).

## Publish
```bash
cd ar-src
python3 build.py --deploy ../ar   # regenerates /ar with clean /ar/... links
```
then commit `ar/` and push to `main` (Vercel deploys automatically).

Static site, Arabic (RTL) first. Local preview (relative links) — videos only play inside the page when it's served, not on `file://`:

```bash
python3 build.py && python3 -m http.server 8321
```

## Editing
- **Service / article text:** edit the JSON in `content/`, then run `python3 build.py`.
- **Projects:** `content/projects.json` (covers in `assets/img/projects/`, named by Behance id); `featured` = the 3 shown on the homepage.
- **Homepage / contact page:** edit `src/pages/home.html` / `src/pages/contact.html`, then run `python3 build.py`.
- **Header, footer, service order, article categories:** in `build.py`.
- **Styles / behaviour:** `assets/css/style.css`, `assets/js/main.js` (no build needed).

Don't edit the generated `index.html`, `contact.html`, `services/*.html`, `articles/*.html`, `projects/*.html` — they're overwritten by the build.

After building, `python3 tools/check_links.py` confirms every link works when the files are opened from disk.

## Contact form
Sends through EmailJS with the same account/template as the live toptech.studio form (keys at the bottom of `assets/js/main.js`). If EmailJS restricts allowed domains, add the new domain in the EmailJS dashboard.
