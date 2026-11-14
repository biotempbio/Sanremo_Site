import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeExport, sanitize } from '../scripts/sync-bio-catalog.mjs';

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
  assert.doesNotMatch(serialized, /dilerPriceRUB|900000|Дилерская цена|inReserve/);
});

test('API envelopes are accepted but empty exports are rejected', () => {
  assert.equal(normalizeExport({ products: [machine()] }).length, 1);
  assert.throws(() => normalizeExport({ message: 'error' }), /no product array/);
});

test('warranty warnings apply to machines, not spare parts without a warranty', () => {
  const result = sanitize([
    machine({ warranty: '24 месяца' }),
    { brand: 'Sanremo', code: 'PART-TEST', name: 'Помпа Sanremo', category: 'Запчасти и комплектующие', categoryGroup: 'Запчасти и комплектующие', warranty: 0, priceRUB: 1000, dilerPriceRUB: 500 },
  ], options);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /208791/);
});
