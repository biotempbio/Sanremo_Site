import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fetchSnapshot, normalizeExport, sanitize } from '../scripts/sync-bio-catalog.mjs';
import { descriptionHtml } from '../lib/product-description.mjs';
import { normalizeCatalogSearch } from '../lib/search-normalization.mjs';

const tiers = JSON.parse(readFileSync(new URL('../config/catalog-tiers.json', import.meta.url)));
const categoryGroups = JSON.parse(readFileSync(new URL('../config/sanremo-category-groups.json', import.meta.url)));
const existingCatalog = JSON.parse(readFileSync(new URL('../data/catalog.json', import.meta.url)));
const options = { tiers, categoryGroups, existingCatalog };
const machine = (overrides = {}) => ({
  brand: 'Sanremo', code: '208791', name: 'Кофемашина Sanremo Cafe Racer Naked 2 гр. чёрная',
  category: 'Кофемашины традиционные', inStock: 7, inAccess: 2,
  priceRUB: 1_100_000, dilerPriceRUB: 900_000,
  secondaryProps: [{ name: 'Мощность', value: '4 кВт' }, { name: 'Дилерская цена', value: '900000' }],
  ...overrides,
});

test('public snapshot keeps total stock, filters private values and validates RRP', () => {
  const result = sanitize([
    machine(),
    machine({ code: '211503', inStock: 1, priceRUB: 800_000, dilerPriceRUB: 900_000 }),
    machine({ code: 'У5512', isMarkdown: true }),
    machine({ code: '165347', name: 'Кофемашина Sanremo Verona 2 гр.' }),
  ], options);
  assert.equal(result.received, 4);
  assert.equal(result.published, 2);
  assert.equal(result.hidden.markdown, 1);
  assert.equal(result.hidden.retired, 1);
  assert.equal(result.products[0].inStock, 7);
  assert.equal(result.products[0].price, 1_100_000);
  assert.equal(result.products[1].price, null);
  assert.equal(result.products[1].modelSlug, 'cafe-racer');
  const serialized = JSON.stringify(result.products);
  assert.doesNotMatch(serialized, /dilerPriceRUB|900000|Дилерская цена|inReserve|inAccess|available/);
});

test('API envelopes are accepted but empty exports are rejected', () => {
  assert.equal(normalizeExport({ products: [machine()] }).length, 1);
  assert.throws(() => normalizeExport({ message: 'error' }), /no product array/);
});

test('warranty warnings apply to machines, not spare parts without a warranty', () => {
  const result = sanitize([
    machine({ warranty: '24 месяца' }),
    machine({ code: 'MACHINE-12', warranty: 12 }),
    machine({ code: 'MACHINE-0', warranty: 0 }),
    { brand: 'Sanremo', code: 'PART-TEST', name: 'Помпа Sanremo', category: 'Запчасти и комплектующие', categoryGroup: 'Запчасти и комплектующие', warranty: 0, priceRUB: 1000, dilerPriceRUB: 500 },
  ], options);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /208791/);
  assert.equal(result.products.find((item) => item.code === 'MACHINE-12')?.warranty, '12 месяцев');
  assert.equal(result.products.find((item) => item.code === 'MACHINE-0')?.warranty, null);
});

test('an all-zero stock export is rejected before replacing the last good snapshot', async () => {
  const items = Array.from({ length: 463 }, (_, index) => machine({ code: `TEST-${index}`, inStock: 0 }));
  const fetcher = async () => ({ ok: true, json: async () => items, headers: { get: () => '2026-11-14T02:30:00Z' } });
  await assert.rejects(fetchSnapshot({ key: 'test-only', fetcher }), /zero stock/);
});

test('full public descriptions survive import and unsafe HTML is not rendered', () => {
  const result = sanitize([machine({
    description: '<h2>ОСОБЕННОСТИ МОДЕЛИ</h2><p>Остатки кофе легко убрать.</p><script>alert(1)</script><p>Контроль <b>помола</b>.</p>',
    secondaryProps: [{ prop: 'Объём', value: 'Резервуар 2 л' }, { prop: 'Закупочная цена', value: '500000' }],
  })], options);
  const item = result.products[0];
  assert.match(item.description, /Остатки кофе/);
  assert.deepEqual(item.descriptionBlocks.map((block) => block.type), ['heading', 'paragraph', 'paragraph']);
  assert.equal(item.secondaryProps.length, 1);
  assert.equal(item.secondaryProps[0].value, 'Резервуар 2 л');
  assert.doesNotMatch(JSON.stringify(item), /alert\(1\)|500000/);
  assert.doesNotMatch(descriptionHtml(item.description, item.descriptionBlocks), /<script|<b>/);
});

test('search keys treat Cyrillic lookalikes as Latin without changing source text', () => {
  assert.equal(normalizeCatalogSearch('SР 300'), normalizeCatalogSearch('SP 300'));
  assert.equal(normalizeCatalogSearch('Х-ONE'), normalizeCatalogSearch('X-ONE'));
});
