"""Checks every relative href/src in the built pages resolves to a file on disk (so the site works
when opened directly from Finder), and that #fragment targets exist in the target page.

    python3 tools/check_links.py
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
pages = [p for p in ROOT.rglob("*.html") if not {"src", "tools", "content", "node_modules"} & set(p.relative_to(ROOT).parts)]
ids_cache = {}


def ids_of(path):
    if path not in ids_cache:
        ids_cache[path] = set(re.findall(r'\sid="([^"]+)"', path.read_text(encoding="utf-8")))
    return ids_cache[path]


problems = []
checked = 0
for page in pages:
    html = page.read_text(encoding="utf-8")
    # ignore the SVG sprite's <use href="#i-…"> and inline JSON-LD
    for attr, url in re.findall(r'\s(href|src)="([^"]+)"', html):
        if url.startswith(("http:", "https:", "mailto:", "tel:", "data:", "#i-")):
            continue
        checked += 1
        parts = urlsplit(url)
        target = page if not parts.path else (page.parent / unquote(parts.path)).resolve()
        if parts.path and parts.path.endswith("/"):
            problems.append(f"{page.relative_to(ROOT)}: directory link {url} (breaks when opened from disk)")
        elif not target.exists():
            problems.append(f"{page.relative_to(ROOT)}: missing {url}")
        elif parts.fragment and target.suffix == ".html" and parts.fragment not in ids_of(target):
            problems.append(f"{page.relative_to(ROOT)}: no #{parts.fragment} in {url or page.name}")

print(f"{len(pages)} pages, {checked} links checked, {len(problems)} problems")
for p in problems:
    print("  -", p)
sys.exit(1 if problems else 0)
