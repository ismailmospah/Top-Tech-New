/* Shared access to the site dictionary that lives in lang.js.
   Keeping one copy means the chrome (nav, footer, contact details) on
   generated pages always matches the hand-written pages. */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function loadI18N() {
  const src = readFileSync(resolve(ROOT, "lang.js"), "utf8");
  const start = src.indexOf("const I18N = {");
  const end = src.indexOf("\n};", start);
  if (start === -1 || end === -1) throw new Error("could not locate I18N in lang.js");
  const body = src.slice(start + "const I18N = ".length, end + 3);
  return new Function(`return ${body}`)();
}

export const I18N = loadI18N();
export const t = (key, lang) => {
  const entry = I18N[key];
  if (!entry) throw new Error(`missing i18n key: ${key}`);
  return entry[lang];
};
export { ROOT };
