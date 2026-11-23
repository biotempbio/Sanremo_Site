import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("business guide compares two-group offers with their own price, stock and photo", () => {
  const page = readFileSync("out/guide/rozhkovaya-kofemashina-ili-superavtomat/index.html", "utf8");
  const products = JSON.parse(readFileSync("out/shop/catalog.json", "utf8")).products;
  const cards = [...page.matchAll(/<a class="editorial-product-card".*?<\/a>/gs)].map(([card]) => card);
  assert.equal(cards.length, 3); // Zoe and D8 in the article; Zoe in the sidebar.
  for (const card of cards) {
    const href = card.match(/href="([^"]+)"/)[1].replaceAll("&amp;", "&");
    const url = new URL(href, "https://sanremomachines.ru");
    const product = products.find((item) => item.code === url.searchParams.get("sku"));
    assert.ok(product, href);
    assert.equal(url.searchParams.get("groups"), "2", href);
    assert.equal(product.url, href);
    assert.match(card, /2 группы/);
    const text = card.replace(/<[^>]+>/g, "").replace(/\s/g, "");
    assert.ok(text.includes(String(product.price)), href);
    assert.equal(card.match(/<img[^>]+src="([^"]+)"/)[1], product.image);
    if (product.free === 0) assert.match(card, /Под заказ/);
    else assert.ok(card.includes(`${product.free} шт`), href);
  }
  assert.ok(cards.some((card) => card.includes("/products/d8/d8/")));
});
