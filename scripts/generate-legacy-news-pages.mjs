import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Timeweb has only five spare HTTP 301 rules. These five lower-priority Tilda
// addresses use an instant HTML move page until a server-side rule is available.
const htmlMoves = new Set([
  '9ejdiik9o1-360-sanremo-3',
  'ou8np6rss1-360-sanremo-2',
  '2oe6krp6j1-vo-ves-opor',
  'akxi35jl41-komandnaya-rabota-kak-sposob-dostizheniy',
  'g105rcvzb1-nash-novii-ambassador-martin-shabaya',
]);

const news = JSON.parse(await readFile(new URL('../data/news.json', import.meta.url), 'utf8'));
const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanremomachines.ru';
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');

for (const entry of news) {
  const legacy = entry.oldPath.split('/').filter(Boolean).at(-1);
  if (!htmlMoves.has(legacy)) continue;
  const target = `/news/${entry.slug}/`;
  const canonical = new URL(target, site).toString();
  const file = join(process.cwd(), 'public', 'tpost', legacy, 'index.html');
  await mkdir(join(process.cwd(), 'public', 'tpost', legacy), { recursive: true });
  await writeFile(file, `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0;url=${escape(target)}">
<link rel="canonical" href="${escape(canonical)}">
<title>${escape(entry.title)} — статья переехала</title>
<script>location.replace(${JSON.stringify(target).replaceAll('<', '\\u003c')})</script>
</head><body><main><h1>Статья переехала</h1>
<p><a href="${escape(target)}">Открыть статью «${escape(entry.title)}»</a></p>
</main></body></html>\n`);
}
console.log(`Generated ${htmlMoves.size} legacy news move pages`);
