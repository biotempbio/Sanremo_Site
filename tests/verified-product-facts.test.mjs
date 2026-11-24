import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { applyVerifiedProductFacts } from "../lib/verified-product-facts.mjs";

const catalog = JSON.parse(await fs.readFile(new URL("../data/catalog.json", import.meta.url)));
const snapshot = JSON.parse(await fs.readFile(new URL("../data/bio-catalog.snapshot.json", import.meta.url)));

test("a fresh import cannot restore old boiler values in new Zoe executions", () => {
  for (const code of ["205904", "208942", "208943"]) {
    const base = catalog.skus.find((s) => s.code === code);
    const imported = snapshot.products.find((s) => s.code === code);
    const input = { ...base, ...imported, model: base.model, groups: base.groups };
    const before = structuredClone(input);
    const result = applyVerifiedProductFacts(input);
    assert.equal(result.boilerTotal, "7", code);
    assert.equal(result.secondaryProps.find((p) => /бойлера/.test(p.name)).value, "7", code);
    assert.doesNotMatch(JSON.stringify([result.description, result.descriptionBlocks]), /(?:9|10) л|медный бойлер/iu, code);
    assert.equal(result.power, 3, code);
    assert.equal(result.price, input.price);
    assert.equal(result.inStock, input.inStock);
    assert.equal(result.image, input.image);
    assert.deepEqual(input, before, "source export must remain untouched");
    assert.deepEqual(applyVerifiedProductFacts(result), result, "normalization must be idempotent");
    assert.equal(applyVerifiedProductFacts(base).boilerTotal, "7", "static fallback");
    assert.equal(applyVerifiedProductFacts({ ...input, vendorCode: "different-execution" }).boilerTotal, input.boilerTotal);
  }
});

test("older Zoe, Compact, D8 and other executions retain their own specifications", () => {
  for (const sku of catalog.skus.filter((s) => !["205904", "208942", "208943"].includes(s.code))) {
    assert.equal(applyVerifiedProductFacts(sku), sku, sku.code);
  }
});

test("new Zoe boiler agrees in the exported schema, feed and all competitor tables", async () => {
  const read = (path) => fs.readFile(new URL(`../out/${path}`, import.meta.url), "utf8");
  const html = await read("products/zoe/zoe-competition/index.html");
  const jsonLd = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const group = jsonLd.find((s) => s["@type"] === "ProductGroup");
  const feed = await read("feed/yandex.yml");
  for (const code of ["205904", "208942", "208943"]) {
    const variant = group.hasVariant.find((s) => new URL(s.url).searchParams.get("sku") === code);
    assert.ok(variant, code);
    assert.match(variant.description, /7 л/, code);
    assert.doesNotMatch(variant.description, /(?:9|10) л|медный бойлер/iu, code);
    const offer = [...feed.matchAll(/<offer\b[^>]*>([\s\S]*?)<\/offer>/g)].find((m) => m[1].includes(`sku=${code}`));
    if (offer) {
      assert.match(offer[1], /7 л/, code);
      assert.doesNotMatch(offer[1], /(?:9|10) л|медный бойлер/iu, code);
    }
  }
  for (const entry of await fs.readdir(new URL("../out/compare/", import.meta.url), { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith("sanremo-vs-")) continue;
    const page = await read(`compare/${entry.name}/index.html`);
    if (!page.includes("Zoe Competition")) continue;
    assert.doesNotMatch(page, /10 л, паровой бойлер/);
    assert.match(page, /7 л суммарно/);
    assert.match(page, /\/documents\/brochures\/zoe-stainless-en.pdf/);
  }
});
