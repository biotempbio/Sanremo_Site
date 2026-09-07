import { readdir, stat } from "node:fs/promises";
import { extname, join, parse } from "node:path";
import sharp from "sharp";

const root = new URL("../public/", import.meta.url);
const widths = [480, 960, 1440];
const sourcePattern = /\.(?:jpe?g|png|webp)$/i;
const generatedPattern = /-w(?:480|960|1440)\.(?:jpe?g|webp)$/i;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}

let created = 0;
for (const source of await walk(root.pathname)) {
  if (!sourcePattern.test(source) || generatedPattern.test(source)) continue;
  let metadata;
  try { metadata = await sharp(source).metadata(); }
  catch { console.warn(`Responsive images: skipped unsupported ${source.slice(root.pathname.length)}`); continue; }
  if (!metadata.width || !metadata.height) continue;
  const file = parse(source);
  for (const width of widths.filter((value) => value <= metadata.width)) {
    for (const format of ["webp", "jpg"]) {
      const output = join(file.dir, `${file.name}-w${width}.${format}`);
      try {
        const [inputInfo, outputInfo] = await Promise.all([stat(source), stat(output)]);
        if (outputInfo.mtimeMs >= inputInfo.mtimeMs) continue;
      } catch {}
      let pipeline = sharp(source).resize({ width, withoutEnlargement: true });
      pipeline = format === "webp" ? pipeline.webp({ quality: 80, effort: 4 }) : pipeline.jpeg({ quality: 84, progressive: true });
      await pipeline.toFile(output); created++;
    }
  }
}
console.log(`Responsive images: ${created ? `${created} generated` : "up to date"}`);
