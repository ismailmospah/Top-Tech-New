"""Checks the production build (python3 build.py --deploy <repo>/ar) before pushing.

    python3 tools/check_deploy.py <repo>/ar

Every internal href/src must be root-absolute under /ar/ and resolve to a real file
(/ar/x -> ar/x/index.html or ar/x). A relative path like "assets/img/x.webp" is flagged:
on toptech.studio/ar (no trailing slash) it would resolve to /assets/... and break.
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

AR = Path(sys.argv[1]).resolve()
SITE_ROOT = AR.parent
EXTERNAL = ("http:", "https:", "mailto:", "tel:", "data:", "#", "javascript:")

pages = list(AR.rglob("*.html"))
ids = {p: set(re.findall(r'\sid="([^"]+)"', p.read_text(encoding="utf-8"))) for p in pages}
problems, checked = [], 0

for page in pages:
    html = page.read_text(encoding="utf-8")
    for url in re.findall(r'\s(?:href|src)="([^"]*)"', html):
        if url.startswith(EXTERNAL):
            continue
        checked += 1
        where = page.relative_to(SITE_ROOT)
        if not url.startswith("/ar"):
            problems.append(f"{where}: not under /ar -> {url}")
            continue
        parts = urlsplit(url)
        target = SITE_ROOT / unquote(parts.path).lstrip("/")
        hit = next((c for c in (target, target / "index.html") if c.is_file()), None)
        if not hit:
            problems.append(f"{where}: missing {url}")
        elif parts.fragment and hit.suffix == ".html" and parts.fragment not in ids.get(hit, set()):
            problems.append(f"{where}: no #{parts.fragment} in {url}")

print(f"{len(pages)} pages, {checked} internal links checked, {len(problems)} problems")
for p in problems[:40]:
    print("  -", p)
sys.exit(1 if problems else 0)
