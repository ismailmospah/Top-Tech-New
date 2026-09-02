/* ============================================================
   TOP TECH — local preview server
   ------------------------------------------------------------
   Serves the site the way Vercel does, by reading vercel.json:
   the same redirects, rewrites and trailing-slash behaviour. Use it
   to check routing and rendered HTML before pushing.

       node tools/dev-server.mjs [port]
   ============================================================ */

import { createServer } from "node:http";
import { readFileSync, statSync, createReadStream } from "node:fs";
import { dirname, resolve, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = JSON.parse(readFileSync(resolve(ROOT, "vercel.json"), "utf8"));
const PORT = Number(process.argv[2] || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const exists = (p) => {
  try { return statSync(p).isFile(); } catch { return false; }
};

createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);

  // trailing-slash normalisation
  if (CONFIG.trailingSlash === false && pathname !== "/" && pathname.endsWith("/")) {
    res.writeHead(308, { Location: pathname.replace(/\/+$/, "") });
    return res.end();
  }

  // configured redirects
  for (const r of CONFIG.redirects || []) {
    if (r.source === pathname) {
      res.writeHead(r.permanent ? 301 : 302, { Location: r.destination });
      return res.end();
    }
  }

  // configured rewrites
  for (const r of CONFIG.rewrites || []) {
    if (r.source === pathname) pathname = r.destination;
  }

  // static file, then directory index
  const candidates = [join(ROOT, pathname), join(ROOT, pathname, "index.html")];
  const file = candidates.find(exists);

  if (!file) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>404</h1>");
  }

  res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`preview on http://127.0.0.1:${PORT}`));
