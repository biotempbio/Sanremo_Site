import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { extractDescription } from '../lib/product-description.mjs';
import { bestLargeImage, imageUrls } from '../lib/bio-media.mjs';
import { groupCount, visualIdentity } from '../lib/sku-identity.mjs';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (name) => JSON.parse(await readFile(path.join(root, name), 'utf8'));
const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const amount = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(String(value).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};
const truth = (value) => value === true || /^(1|true|yes|да)$/i.test(clean(value));
const positive = (value) => Math.max(0, Math.trunc(amount(value) ?? 0));
const first = (obj, names) => names.map((name) => obj?.[name]).find((value) => value !== undefined && value !== null && value !== '');
const warrantyText = (value) => {
  const raw = clean(value);
  if (!raw || raw === '0') return null;
  return /^\d+$/.test(raw) ? `${raw} месяцев` : raw;
};

export function modelSlug(name) {
  const value = clean(name).toLowerCase().replaceAll('ё', 'е');
  if (/cafe racer|café racer/.test(value)) return 'cafe-racer';
  if (/\bd8\s*pro\b/.test(value)) return 'd8-pro';
  if (/\bd8\b/.test(value)) return 'd8';
  if (/\bf18\s*sb\b/.test(value)) return 'f18-sb';
  if (/\bf18\b/.test(value)) return 'f18-mb';
  if (/\bopera\b/.test(value)) return 'opera';
  if (/\byou\b/.test(value)) return 'you';
  if (/\bzoe\s*competition\b/.test(value)) return 'zoe-competition';
  if (/\bzoe\s*compact\b/.test(value)) return 'zoe-compact';
  if (/\bzoe\s*sap\b/.test(value)) return 'zoe-sap';
  if (/\bzoe\s*sed\b/.test(value)) return 'zoe-sed';
  return null;
}

export function secondaryProps(raw) {
  const result = [];
  const add = (name, value, unit = '') => {
    const label = clean(name);
    const display = clean(typeof value === 'object' && value !== null ? first(value, ['value', 'Value', 'Значение']) : value);
    if (!label || !display || /(diler|dealer|дилер|закуп|оптов|себесто|in(?:stock|reserve|access|wait)|остат|резерв|receiptdate)/i.test(label)) return;
    const rendered = clean(`${display} ${clean(unit)}`);
    if (!result.some((item) => item.name === label && item.value === rendered)) result.push({ name: label.slice(0, 160), value: rendered.slice(0, 300) });
  };
  if (Array.isArray(raw)) {
    for (const item of raw) if (item && typeof item === 'object') add(first(item, ['name', 'prop', 'key', 'title', 'caption', 'propertyName', 'Наименование']), first(item, ['value', 'val', 'text', 'valueText', 'propertyValue', 'Значение']), first(item, ['unit', 'unitName', 'Единица']));
  } else if (raw && typeof raw === 'object') {
    for (const [key, value] of Object.entries(raw)) add(key, value);
  }
  return result.slice(0, 60);
}

function dimensions(raw) {
  const source = first(raw, ['sizeNett', 'sizeNet']);
  if (source && typeof source === 'object' && !Array.isArray(source)) {
    const w = amount(first(source, ['width', 'w', 'Ширина']));
    const h = amount(first(source, ['height', 'h', 'Высота']));
    const d = amount(first(source, ['depth', 'd', 'Глубина']));
    return w && h && d ? { w, h, d } : null;
  }
  const parts = clean(source).split(/[xх×]/i).map(amount);
  if (parts.length === 3 && parts.every((n) => n && n > 0)) return { w: parts[0], h: parts[1], d: parts[2] };
  const nested = raw.dimensions && typeof raw.dimensions === 'object' ? raw.dimensions : raw;
  const w = amount(first(nested, ['width', 'Ширина']));
  const h = amount(first(nested, ['height', 'Высота']));
  const d = amount(first(nested, ['depth', 'length', 'Глубина', 'Длина']));
  return w && h && d ? { w, h, d } : null;
}

export function normalizeExport(payload) {
  if (Array.isArray(payload)) return payload;
  for (const key of ['items', 'products', 'data', 'result']) if (Array.isArray(payload?.[key])) return payload[key];
  throw new Error('BIO export has no product array');
}

export function sanitize(rawItems, { tiers, categoryGroups, existingCatalog }) {
  const knownEquipment = new Set([...existingCatalog.skus, ...existingCatalog.grinders].map((x) => x.code));
  const knownParts = new Set(existingCatalog.parts.map((x) => x.code));
  const groupTier = new Map(tiers.tiers.flatMap((tier) => tier.groups.map((group) => [group, tier.id])));
  const hidden = { markdown: 0, retired: 0, invalid: 0, otherBrand: 0, unknownEquipment: 0, excludedGroup: 0, duplicate: 0 };
  const warnings = new Set();
  const seen = new Set();
  const accessByCode = new Map();
  const products = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') { hidden.invalid++; continue; }
    const brand = clean(first(raw, ['brand', 'Бренд']));
    if (brand.toLowerCase() !== 'sanremo') { hidden.otherBrand++; continue; }
    const code = clean(first(raw, ['code', 'Код']));
    const name = clean(first(raw, ['name', 'Наименование']));
    if (!code || !name) { hidden.invalid++; continue; }
    if (seen.has(code)) { hidden.duplicate++; continue; }
    seen.add(code);
    if (truth(first(raw, ['isMarkdown', 'Уценка'])) || /^[УВ]/i.test(code)) { hidden.markdown++; continue; }
    const category = clean(first(raw, ['category', 'Категория']));
    const group = clean(first(raw, ['categoryGroup', 'ГруппаКатегории'])) || categoryGroups[category] || '';
    if (tiers.excludedGroups.includes(group)) { hidden.excludedGroup++; continue; }
    const tier = groupTier.get(group) ?? tiers.unknownTier;
    if (!group || !groupTier.has(group)) warnings.add(`Неизвестная группа: ${group || category || '(пусто)'}`);
    const isCoffeeEquipment = tier === 1 || knownEquipment.has(code) || /^(Кофемашина|Кофемолка)/i.test(name);
    const isGrinder = /кофемолка/i.test(name);
    if (isCoffeeEquipment && /\b(Napoli|Cube|Verona(?:\s+RS)?|Torino)\b/i.test(name)) { hidden.retired++; continue; }
    const slug = isCoffeeEquipment && !isGrinder ? modelSlug(name) : null;
    if (isCoffeeEquipment && !isGrinder && !slug) { hidden.unknownEquipment++; warnings.add(`Нераспознанная модель: ${code}`); continue; }
    const kind = isGrinder ? 'grinder' : slug ? 'machine' : 'part';
    const rrp = amount(first(raw, ['priceRUB', 'РРЦРуб']));
    const dealer = amount(first(raw, ['dilerPriceRUB', 'dealerPriceRUB', 'ДилерскаяЦенаРуб']));
    // The dealer price is used only for validation and is never serialized.
    const safePrice = rrp !== null && rrp > 0 && dealer !== null && dealer >= 0 && rrp >= dealer ? Math.round(rrp) : null;
    const image = clean(first(raw, ['img', 'image', 'Картинка']));
    const stock = positive(first(raw, ['inStock', 'Остаток']));
    accessByCode.set(code, positive(first(raw, ['inAccess', 'Доступно'])) > 0);
    const weight = amount(first(raw, ['weightNett', 'weightNet', 'weight', 'Вес']));
    const warranty = warrantyText(first(raw, ['warranty', 'Гарантия']));
    const description = extractDescription(raw);
    if (kind !== 'part' && warranty && !/(?:12\s*мес|1\s*год|один\s*год)/i.test(warranty)) {
      warnings.add(`Гарантия требует сверки: ${code} (${warranty.slice(0, 80)})`);
    }
    const product = {
      code, name, kind, tier, modelSlug: slug,
      vendorCode: clean(first(raw, ['vendorCode', 'article', 'Артикул'])) || null,
      category, categoryGroup: group,
      price: safePrice, inStock: stock,
      image: /^https:\/\//i.test(image) || image.startsWith('/api/img/') ? image : null,
      sizeNet: dimensions(raw), weightNet: weight && weight > 0 ? weight : null,
      warranty: warranty || null,
      description: description.text,
      descriptionBlocks: description.blocks,
      secondaryProps: secondaryProps(first(raw, ['secondaryProps', 'Характеристики'])),
    };
    if (knownParts.has(code) && kind === 'part') product.tier = tier;
    products.push(product);
  }
  products.sort((a, b) => a.tier - b.tier || Number(b.price !== null && !!b.image) - Number(a.price !== null && !!a.image) || Number(accessByCode.get(b.code)) - Number(accessByCode.get(a.code)) || (b.price ?? 0) - (a.price ?? 0));
  return { products, hidden, warnings: [...warnings].sort(), received: seen.size, published: products.length, stockedProducts: products.filter((item) => item.inStock > 0).length };
}

export async function fetchSnapshot({ key, fetcher = fetch, previousState = null }) {
  const response = await fetcher('https://portal.holdingbio.ru/api/catalog/export?brand=Sanremo', {
    headers: { 'X-API-Key': key, Accept: 'application/json', 'Accept-Encoding': 'gzip' },
    signal: AbortSignal.timeout(180_000),
  });
  if (!response.ok) throw new Error(`BIO API returned HTTP ${response.status}`);
  const rawItems = normalizeExport(await response.json());
  const [tiers, categoryGroups, existingCatalog] = await Promise.all([
    readJson('config/catalog-tiers.json'), readJson('config/sanremo-category-groups.json'), readJson('data/catalog.json'),
  ]);
  const result = sanitize(rawItems, { tiers, categoryGroups, existingCatalog });
  const prior = Math.max(463, Number(previousState?.received) || 0);
  if (result.received < Math.floor(prior * 0.8)) throw new Error(`BIO snapshot below 80% of prior count: ${result.received}/${prior}`);
  if (result.published === 0) throw new Error('BIO snapshot has no published products');
  if (result.stockedProducts === 0) throw new Error('BIO snapshot has zero stock across all products');
  const dataAsOf = clean(response.headers.get('X-Data-As-Of'));
  if (!dataAsOf || Number.isNaN(Date.parse(dataAsOf))) throw new Error('BIO snapshot missing valid X-Data-As-Of');
  return { ...result, dataAsOf, syncedAt: new Date().toISOString() };
}

async function attachEquipmentMedia(products, key, { fetcher = fetch } = {}) {
  const equipment = products.filter((item) => item.kind !== 'part');
  const cache = new Map();
  const report = { checked: equipment.length, exactLarge: 0, sameColorPeer: 0, officialColor: 0, placeholder: 0, cardsFailed: 0, items: [] };
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(5, equipment.length) }, async () => {
    while (cursor < equipment.length) {
      const item = equipment[cursor++];
      const record = { code: item.code, model: item.modelSlug, fullCard: false, candidates: 0, largest: null, selected: null };
      try {
        const response = await fetcher(`https://portal.holdingbio.ru/api/catalog/products/${encodeURIComponent(item.code)}`, {
          headers: { 'X-API-Key': key, Accept: 'application/json' }, signal: AbortSignal.timeout(30_000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const card = payload.product ?? payload.data ?? payload.result ?? payload;
        record.fullCard = true;
        // Export img remains a candidate if the full card omits its primary image.
        const media = await bestLargeImage({ ...card, exportImage: item.image }, { fetcher, imageCache: cache });
        record.candidates = imageUrls({ ...card, exportImage: item.image }).length;
        record.largest = media.inspected[0] ? `${media.inspected[0].width}×${media.inspected[0].height}` : null;
        if (media.selected) {
          const directory = path.join(root, 'public/photo/catalog');
          await mkdir(directory, { recursive: true });
          const filename = `${item.code}.webp`;
          await writeFile(path.join(directory, filename), await sharp(media.selected.bytes).webp({ quality: 86, effort: 4 }).toBuffer());
          item.imageLocal = `/photo/catalog/${filename}`;
          item.imageWidth = media.selected.width;
          item.imageHeight = media.selected.height;
          record.selected = `${media.selected.width}×${media.selected.height}`;
          report.exactLarge++;
        }
      } catch (error) {
        record.error = error instanceof Error ? error.message : String(error);
        report.cardsFailed++;
      }
      report.items.push(record);
    }
  }));
  const baseSkus = (await readJson('data/catalog.json')).skus;
  const baseByCode = new Map(baseSkus.map((sku) => [sku.code, sku]));
  const groupOf = (item) => groupCount(item.name) || baseByCode.get(item.code)?.groups || 0;
  const identityOf = (item) => visualIdentity(item, baseByCode.get(item.code));
  for (const item of equipment.filter((entry) => !entry.imageLocal)) {
    const identity = identityOf(item);
    const peers = identity ? equipment.filter((peer) => peer.imageLocal && !peer.imagePeerCode && peer.code !== item.code
      && identityOf(peer) === identity && groupOf(peer) !== groupOf(item)) : [];
    peers.sort((a, b) => (b.imageWidth * b.imageHeight) - (a.imageWidth * a.imageHeight));
    const peer = peers[0];
    const record = report.items.find((entry) => entry.code === item.code);
    if (peer) {
      item.imagePeerCode = peer.code;
      item.imageLocal = peer.imageLocal;
      item.imageWidth = peer.imageWidth;
      item.imageHeight = peer.imageHeight;
      item.imagePeerGroups = groupOf(peer);
      record.substitutedFrom = peer.code;
      record.peerGroups = item.imagePeerGroups;
      record.source = 'same-color-peer';
      report.sameColorPeer++;
    } else {
      record.source = 'placeholder';
      report.placeholder++;
    }
  }
  report.items.sort((a, b) => Number(a.code) - Number(b.code));
  return report;
}

async function main() {
  const key = process.env.BIO_CATALOG_API_KEY;
  if (!key) { console.log('BIO catalog sync skipped: no key in build environment'); return; }
  let previousState = await readJson('public/catalog-sync-state.json');
  try {
    const live = await fetch('https://sanremomachines.ru/catalog-sync-state.json', { signal: AbortSignal.timeout(8_000), cache: 'no-store' });
    if (live.ok) previousState = await live.json();
  } catch { /* A first staging build or a temporary DNS issue uses the checked baseline. */ }
  const result = await fetchSnapshot({ key, previousState });
  const media = await attachEquipmentMedia(result.products, key);
  await writeFile(path.join(root, 'public/catalog-media-audit.json'), JSON.stringify(media));
  await writeFile(path.join(root, 'data/bio-catalog.snapshot.json'), JSON.stringify({
    dataAsOf: result.dataAsOf, syncedAt: result.syncedAt, received: result.received, products: result.products,
  }));
  await writeFile(path.join(root, 'public/catalog-sync-state.json'), JSON.stringify({
    dataAsOf: result.dataAsOf, syncedAt: result.syncedAt, received: result.received,
    published: result.published, stockedProducts: result.stockedProducts, hidden: result.hidden, warnings: result.warnings,
  }));
  console.log(`BIO Sanremo catalog: received ${result.received}, published ${result.published}, hidden ${Object.values(result.hidden).reduce((a, b) => a + b, 0)}; as of ${result.dataAsOf}`);
  console.log(`BIO Sanremo media: checked ${media.checked}, exact >=600px ${media.exactLarge}, same-colour peer ${media.sameColorPeer}, official colour ${media.officialColor}, placeholder ${media.placeholder}, full cards failed ${media.cardsFailed}`);
  for (const warning of result.warnings) console.warn(warning);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error) => { console.error(`BIO catalog sync rejected: ${error.message}`); process.exitCode = 1; });
