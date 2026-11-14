import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

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
    if (!label || !display || /(diler|dealer|дилер|закуп|оптов|себесто|in(?:stock|reserve|access|wait)|остат|резерв|receiptdate)/i.test(`${label} ${display}`)) return;
    const rendered = clean(`${display} ${clean(unit)}`);
    if (!result.some((item) => item.name === label && item.value === rendered)) result.push({ name: label.slice(0, 160), value: rendered.slice(0, 300) });
  };
  if (Array.isArray(raw)) {
    for (const item of raw) if (item && typeof item === 'object') add(first(item, ['name', 'key', 'title', 'caption', 'propertyName', 'Наименование']), first(item, ['value', 'val', 'text', 'valueText', 'propertyValue', 'Значение']), first(item, ['unit', 'unitName', 'Единица']));
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
    const warranty = clean(first(raw, ['warranty', 'Гарантия']));
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
  if (previousState?.stockedProducts > 0 && result.stockedProducts === 0) throw new Error('BIO snapshot has zero stock across all products');
  const dataAsOf = clean(response.headers.get('X-Data-As-Of'));
  if (!dataAsOf || Number.isNaN(Date.parse(dataAsOf))) throw new Error('BIO snapshot missing valid X-Data-As-Of');
  return { ...result, dataAsOf, syncedAt: new Date().toISOString() };
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
  await writeFile(path.join(root, 'data/bio-catalog.snapshot.json'), JSON.stringify({
    dataAsOf: result.dataAsOf, syncedAt: result.syncedAt, received: result.received, products: result.products,
  }));
  await writeFile(path.join(root, 'public/catalog-sync-state.json'), JSON.stringify({
    dataAsOf: result.dataAsOf, syncedAt: result.syncedAt, received: result.received,
    published: result.published, stockedProducts: result.stockedProducts, hidden: result.hidden, warnings: result.warnings,
  }));
  console.log(`BIO Sanremo catalog: received ${result.received}, published ${result.published}, hidden ${Object.values(result.hidden).reduce((a, b) => a + b, 0)}; as of ${result.dataAsOf}`);
  for (const warning of result.warnings) console.warn(warning);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error) => { console.error(`BIO catalog sync rejected: ${error.message}`); process.exitCode = 1; });
