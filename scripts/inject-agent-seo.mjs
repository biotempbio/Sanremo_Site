import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceFile = path.join(root, "data/seo-agent-public.json");
const outDir = path.join(root, "out");

const esc = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (value) => String(value ?? "")
  .split(/(?<=[.!?])\s+/)
  .filter((sentence) => !/(уточн|подтверждени|не подтверж|на проверк|не является предложением|дисклеймер)/i.test(sentence))
  .join(" ")
  .trim();

function replaceMeta(html, key, value, property = false) {
  const attr = property ? "property" : "name";
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<meta\\s+${attr}=["']${escaped}["'][^>]*>`, "i");
  const tag = `<meta ${attr}="${key}" content="${esc(value)}">`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `${tag}\n</head>`);
}

function contentBlock(result) {
  const sections = (result.body_sections ?? [])
    .map((item) => ({ heading: clean(item.heading), text: clean(item.text) }))
    .filter((item) => item.heading && item.text)
    .map((item) => `<section><h2>${esc(item.heading)}</h2><p>${esc(item.text)}</p></section>`)
    .join("\n");
  const faq = (result.faq ?? [])
    .map((item) => ({ question: clean(item.question), answer: clean(item.answer) }))
    .filter((item) => item.question && item.answer)
    .map((item) => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`)
    .join("\n");
  const links = (result.internal_links ?? [])
    .filter((item) => item.url && item.anchor && !item.url.includes("design-system"))
    .map((item) => `<a href="${esc(item.url)}">${esc(item.anchor)}</a>`)
    .join("");
  return `<section class="agent-seo" data-seo-agent="approved"><div class="wrap">
    <p class="lead">${esc(clean(result.lead))}</p>
    <div class="agent-seo-sections">${sections}</div>
    ${faq ? `<div class="agent-seo-faq"><h2>Частые вопросы</h2>${faq}</div>` : ""}
    ${links ? `<nav class="agent-seo-links" aria-label="Полезные разделы">${links}</nav>` : ""}
  </div></section>`;
}

const records = JSON.parse(await readFile(sourceFile, "utf8"));
let injected = 0;
for (const [route, result] of Object.entries(records)) {
  const htmlPath = path.join(outDir, route.replace(/^\//, ""), "index.html");
  let html;
  try { html = await readFile(htmlPath, "utf8"); } catch { continue; }
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(result.title)}</title>`);
  html = replaceMeta(html, "description", result.meta_description);
  html = replaceMeta(html, "og:title", result.title, true);
  html = replaceMeta(html, "og:description", result.meta_description, true);
  html = replaceMeta(html, "twitter:title", result.title);
  html = replaceMeta(html, "twitter:description", result.meta_description);
  if (result.h1) html = html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${esc(result.h1)}</h1>`);
  const block = contentBlock(result);
  html = html.includes("<footer") ? html.replace("<footer", `${block}<footer`) : html.replace("</main>", `${block}</main>`);
  await writeFile(htmlPath, html);
  injected++;
}

console.log(`Injected approved SEO into ${injected} Sanremo pages`);
