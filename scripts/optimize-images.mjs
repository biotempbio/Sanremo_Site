import { readdir, stat, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const root = new URL("../public/", import.meta.url).pathname;
const generatedPattern = /(?:-w\d+\.(?:jpe?g|webp|avif)|-optimized\.webp)$/i;
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const manifest = {};
let created = 0;
for (const source of (await walk(root)).sort()) {
  if (!/\.(?:jpe?g|png|webp)$/i.test(source) || generatedPattern.test(source)) continue;
  let metadata;
  try { metadata = await sharp(source).metadata(); }
  catch { console.warn(`Responsive images: skipped unsupported ${source.slice(root.length)}`); continue; }
  if (!metadata.width || !metadata.height) continue;
  const file = parse(source), url = `/${source.slice(root.length)}`;
  const width = Math.min(1440, metadata.width);
  const widths = [...new Set([480, 960, width].filter((value) => value <= width))].sort((a,b)=>a-b);
  const entry = { width: metadata.width, height: metadata.height, fallback: url, webp: [] };
  const formats = /(?:\/official\/you\.png|\/home-hero-cafe-racer-v2\.jpg)$/.test(source) ? ["webp", "avif"] : ["webp"];
  for (const format of formats) {
    entry[format] = [];
    for (const size of widths) {
      const name = `${file.name}-w${size}.${format}`, output = join(file.dir, name);
      let current = false;
      try { current = (await stat(output)).mtimeMs >= (await stat(source)).mtimeMs; } catch {}
      if (!current) {
        const pipeline = sharp(source).rotate().resize({ width: size, withoutEnlargement: true });
        await (format === "avif" ? pipeline.avif({ quality: 55, effort: 4 }) : pipeline.webp({ quality: 80, effort: 4 })).toFile(output);
        created++;
      }
      entry[format].push({ src: `/${output.slice(root.length)}`, width: size });
    }
  }
  entry.fallback = entry.webp.at(-1).src;
  manifest[url] = entry;
}
await writeFile(new URL("../data/image-variants.json", import.meta.url), `${JSON.stringify(manifest)}\n`);
console.log(`Responsive images: ${Object.keys(manifest).length} sources, ${created} generated`);
