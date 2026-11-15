import sharp from 'sharp';

const ORIGIN = 'https://portal.holdingbio.ru';
const IMAGE_PATH = /^\/api\/img\/[0-9a-f-]{36}(?:\.(?:jpe?g|png|webp))?(?:\?.*)?$/i;
const IMAGE_KEY = /^(?:img|image|imageId|images|photo|photos|gallery|pictures|media|files|картинка|изображения|фото)$/i;

export function imageUrls(card) {
  const found = new Set();
  const walk = (value, imageContext = false, depth = 0) => {
    if (depth > 8 || value == null) return;
    if (typeof value === 'string') {
      if (!imageContext && !value.includes('/api/img/')) return;
      try {
        const url = new URL(imageContext && /^[0-9a-f-]{36}$/i.test(value) ? `/api/img/${value}` : value, ORIGIN);
        if (url.origin === ORIGIN && IMAGE_PATH.test(url.pathname + url.search)) {
          url.search = ''; // A width query can turn an original into a thumbnail.
          found.add(url.href);
        }
      } catch { /* Non-URL gallery metadata. */ }
      return;
    }
    if (Array.isArray(value)) { for (const item of value) walk(item, imageContext, depth + 1); return; }
    if (typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (/^(?:description|html|text|secondaryProps|characteristics|documents|docs)$/i.test(key)) continue;
      walk(child, imageContext || IMAGE_KEY.test(key), depth + 1);
    }
  };
  walk(card);
  return [...found];
}

export async function bestLargeImage(card, { fetcher = fetch, imageCache = new Map() } = {}) {
  const inspected = [];
  for (const url of imageUrls(card)) {
    if (!imageCache.has(url)) {
      imageCache.set(url, (async () => {
        const response = await fetcher(url, { signal: AbortSignal.timeout(25_000) });
        if (!response.ok || !/^image\//i.test(response.headers.get('content-type') ?? '')) return null;
        const bytes = Buffer.from(await response.arrayBuffer());
        const { width, height } = await sharp(bytes).metadata();
        return width && height ? { bytes, width, height } : null;
      })().catch(() => null));
    }
    const media = await imageCache.get(url);
    if (media) inspected.push({ ...media, url });
  }
  inspected.sort((a, b) => b.width * b.height - a.width * a.height || b.width - a.width);
  return { selected: inspected.find((item) => item.width >= 600) ?? null,
    inspected: inspected.map(({ url, width, height }) => ({ url, width, height })) };
}
