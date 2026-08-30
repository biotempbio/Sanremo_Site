import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "data/seo-agent-artifacts");
const destination = path.join(root, "data/seo-agent-public.json");
const excluded = new Set(["/design-system/"]);
const clean = (value) => String(value ?? "")
  .split(/(?<=[.!?])\s+/)
  .filter((sentence) => !/(уточн|подтверждени|не подтверж|на проверк|не является предложением|дисклеймер)/i.test(sentence))
  .join(" ")
  .trim();

const output = {};
for (const file of (await readdir(sourceDir)).filter((name) => name.endsWith(".json"))) {
  const artifact = JSON.parse(await readFile(path.join(sourceDir, file), "utf8"));
  const route = artifact.page?.url;
  const result = artifact.result;
  if (!route || !result || excluded.has(route)) continue;
  output[route] = {
    title: clean(result.title),
    meta_description: clean(result.meta_description),
    h1: clean(result.h1),
    lead: clean(result.lead),
    body_sections: (result.body_sections ?? []).map((item) => ({ heading: clean(item.heading), text: clean(item.text) })).filter((item) => item.heading && item.text),
    faq: (result.faq ?? []).map((item) => ({ question: clean(item.question), answer: clean(item.answer) })).filter((item) => item.question && item.answer),
    internal_links: (result.internal_links ?? []).filter((item) => item.url && item.anchor && !item.url.includes("design-system")).map((item) => ({ url: item.url, anchor: item.anchor })),
  };
}
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, JSON.stringify(output, null, 2) + "\n");
console.log(`Prepared ${Object.keys(output).length} public SEO records`);
