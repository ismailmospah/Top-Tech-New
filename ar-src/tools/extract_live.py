"""One-off: convert the live toptech.studio/ar service + article pages into content/*.json.

Usage: python3 tools/extract_live.py <dir with services/*.html, articles/*.html> [--lang en]
Internal links are stored as "@/services/x.html" / "@/articles/x.html" / "@/contact.html" / "@/index.html";
build.py rewrites the "@/" prefix to the right relative path for each page.
"""
import json
import re
import sys
from html import escape, unescape
from html.parser import HTMLParser
from pathlib import Path

VOID = {"br", "img", "meta", "link", "input", "hr"}
KEEP_INLINE = {"strong", "em", "a", "br"}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    @property
    def cls(self):
        return self.attrs.get("class", "").split()

    def find_all(self, pred):
        for c in self.children:
            if isinstance(c, Node):
                if pred(c):
                    yield c
                yield from c.find_all(pred)

    def find(self, pred):
        return next(self.find_all(pred), None)

    def kids(self):
        return [c for c in self.children if isinstance(c, Node)]

    def text(self):
        return re.sub(r"\s+", " ", "".join(c if isinstance(c, str) else c.text() for c in self.children)).strip()


class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = self.cur = Node("root", {})

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def by_class(name):
    return lambda n: name in n.cls


def by_tag(name):
    return lambda n: n.tag == name


def link(href):
    """Internal links (Arabic /ar/... or English /...) -> "@/..." so build.py can make them relative."""
    href, _, frag = href.partition("#")
    frag = f"#{frag}" if frag else ""
    m = re.fullmatch(r"(?:/ar)?/(services|articles)/([\w-]+)/?", href)
    if m:
        return f"@/{m.group(1)}/{m.group(2)}.html{frag}"
    m = re.fullmatch(r"(?:/ar)?/(services|articles)/?", href)
    if m:
        return f"@/{m.group(1)}/index.html{frag}"
    if re.fullmatch(r"(?:/ar)?/contact/?", href):
        return f"@/contact.html{frag}"
    if href in ("/ar", "/ar/", "/", ""):
        return f"@/index.html{frag}"
    return href + frag


def inline(node):
    """Inner HTML keeping only strong/em/a/br; everything else unwrapped."""
    out = []
    for c in node.children:
        if isinstance(c, str):
            out.append(escape(c, quote=False))
        elif c.tag in KEEP_INLINE:
            if c.tag == "br":
                out.append("<br>")
            elif c.tag == "a":
                out.append(f'<a href="{link(c.attrs.get("href", ""))}">{inline(c)}</a>')
            else:
                out.append(f"<{c.tag}>{inline(c)}</{c.tag}>")
        else:
            out.append(inline(c))
    return re.sub(r"\s+", " ", "".join(out)).strip()


def parse_block_content(section):
    """Ordered content pieces inside a .block section (after its label/title)."""
    pieces = []
    for c in section.kids():
        if "block__index" in c.cls or "block__title" in c.cls:
            continue
        if "prose" in c.cls:
            paras = [inline(p) for p in c.kids() if p.tag == "p"] or [inline(c)]
            pieces.append({"kind": "prose", "paras": paras})
        elif "ticks" in c.cls:
            pieces.append({"kind": "ticks", "items": [inline(li) for li in c.kids()]})
        elif "cards" in c.cls:
            pieces.append({"kind": "cards", "items": [
                {"title": card.find(by_class("card__title")).text(), "text": inline(card.find(by_class("card__text")))}
                for card in c.kids()]})
        elif "steps" in c.cls:
            items = []
            for li in c.kids():
                h3 = li.find(by_tag("h3"))
                p = [inline(x) for x in li.find_all(by_tag("p"))]
                items.append({"title": h3.text() if h3 else "", "text": " ".join(p)})
            pieces.append({"kind": "steps", "items": items})
        elif "faq" in c.cls:
            items = []
            for d in c.kids():
                q = d.find(by_tag("summary")).text()
                a = d.find(by_class("faq__answer"))
                items.append({"q": q, "a": [inline(p) for p in a.kids() if p.tag == "p"] or [inline(a)]})
            pieces.append({"kind": "faq", "items": items})
        elif "related" in c.cls:
            pieces.append({"kind": "related", "items": [
                {"href": link(a.attrs["href"]), "text": a.find(by_tag("span")).text()} for a in c.kids() if a.tag == "a"]})
    return pieces


def parse_page(path, kind):
    tb = TreeBuilder()
    raw = path.read_text(encoding="utf-8")
    tb.feed(raw)
    main = tb.root.find(by_tag("main"))
    hero = main.find(by_class("phero"))
    page = {
        "slug": path.stem,
        "meta_title": unescape(re.search(r"<title>(.*?)</title>", raw, re.S).group(1).strip()),
        "meta_description": unescape(re.search(r'<meta name="description" content="([^"]*)"', raw).group(1)),
        "title": hero.find(by_tag("h1")).text(),
        "lead": inline(hero.find(by_class("phero__lead"))),
    }
    label = hero.find(by_class("block__index"))
    if label:
        page["label"] = label.text()
    if kind == "article":
        t = hero.find(by_tag("time"))
        page["date"] = t.attrs.get("datetime")
        page["date_display"] = t.text()
        meta_spans = [s.text() for s in hero.find(by_class("artmeta")).kids() if s.tag == "span" and "artmeta__sep" not in s.cls]
        page["author"] = meta_spans[0]
        page["read_time"] = meta_spans[-1]
        page["toc"] = [{"id": a.attrs["href"].lstrip("#"), "text": a.text()}
                       for a in main.find(by_class("toc")).find_all(by_tag("a"))]
    blocks = []
    for sec in main.find_all(lambda n: n.tag == "section" and "block" in n.cls):
        if "artcta" in sec.cls:
            continue
        lbl = sec.find(by_class("block__index"))
        ttl = sec.find(by_class("block__title"))
        blocks.append({
            "id": sec.attrs.get("id"),
            "label": lbl.text() if lbl else None,
            "title": ttl.text() if ttl else None,
            "content": parse_block_content(sec),
        })
    page["blocks"] = blocks
    return page


def parse_services_index(path):
    tb = TreeBuilder()
    tb.feed(path.read_text(encoding="utf-8"))
    main = tb.root.find(by_tag("main"))
    hero = main.find(by_class("phero"))
    rows = [{"slug": link(r.find(by_class("svclist__link")).attrs["href"]).split("/")[-1][:-5],
             "name": r.find(by_class("svclist__name")).text(),
             "desc": inline(r.find(by_class("svclist__desc")))}
            for r in main.find_all(by_class("svclist__row"))]
    return {"title": hero.find(by_tag("h1")).text(), "lead": inline(hero.find(by_class("phero__lead"))), "services": rows}


def main():
    src = Path(sys.argv[1])
    out = Path(__file__).resolve().parent.parent / "content"
    if "--lang" in sys.argv and sys.argv[sys.argv.index("--lang") + 1] == "en":
        out = out / "en"
    for kind, folder in (("service", "services"), ("article", "articles")):
        (out / folder).mkdir(parents=True, exist_ok=True)
        for f in sorted((src / folder).glob("*.html")):
            if f.stem.startswith("_"):
                continue
            data = parse_page(f, kind)
            (out / folder / f"{f.stem}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"{folder}/{f.stem}: {len(data['blocks'])} blocks")
    idx = parse_services_index(src / "services" / "_index.html")
    (out / "services-index.json").write_text(json.dumps(idx, ensure_ascii=False, indent=2), encoding="utf-8")
    print("services-index:", len(idx["services"]), "services")


if __name__ == "__main__":
    main()
