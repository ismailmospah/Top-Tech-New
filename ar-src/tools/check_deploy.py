"""Checks a production build before pushing.

    python3 tools/check_deploy.py <repo>/ar      Arabic build  (pages under /ar)
    python3 tools/check_deploy.py <repo> --en    English build (pages at the site root)

Every internal href/src must be root-absolute and resolve to a real file
(/x -> x/index.html or x). A relative path like "assets/img/x.webp" is flagged:
on a clean URL such as /ar or /services/x it would resolve to the wrong folder and break.
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

EN = "--en" in sys.argv
TARGET = Path(next(a for a in sys.argv[1:] if not a.startswith("--"))).resolve()
SITE_ROOT = TARGET if EN else TARGET.parent
PREFIX = "/" if EN else "/ar"
EXTERNAL = ("http:", "https:", "mailto:", "tel:", "data:", "#", "javascript:")
# English pages live at the root next to the Arabic site and repo tooling — skip those folders
SKIP = {"ar", "ar-src", "tools", "docs", ".git", "node_modules"}

pages = [p for p in TARGET.rglob("*.html") if not (EN and SKIP & set(p.relative_to(TARGET).parts))]
ids = {}
problems, checked = [], 0


def ids_of(path):
    if path not in ids:
        ids[path] = set(re.findall(r'\sid="([^"]+)"', path.read_text(encoding="utf-8")))
    return ids[path]


for page in pages:
    html = page.read_text(encoding="utf-8")
    for url in re.findall(r'\s(?:href|src)="([^"]*)"', html):
        if url.startswith(EXTERNAL):
            continue
        checked += 1
        where = page.relative_to(SITE_ROOT)
        into_arabic = url == "/ar" or url.startswith(("/ar/", "/ar#", "/ar?"))
        if not url.startswith(PREFIX) or (EN and into_arabic):
            problems.append(f"{where}: not under {PREFIX} -> {url}")
            continue
        parts = urlsplit(url)
        target = SITE_ROOT / unquote(parts.path).lstrip("/")
        hit = next((c for c in (target, target / "index.html") if c.is_file()), None)
        if not hit:
            problems.append(f"{where}: missing {url}")
        elif parts.fragment and hit.suffix == ".html" and parts.fragment not in ids_of(hit):
            problems.append(f"{where}: no #{parts.fragment} in {url}")

print(f"{len(pages)} pages, {checked} internal links checked, {len(problems)} problems")
for p in problems[:40]:
    print("  -", p)
sys.exit(1 if problems else 0)
