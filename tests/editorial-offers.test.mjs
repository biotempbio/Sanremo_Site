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
    const stocked = products.filter((item) => {
      const candidate = new URL(item.url, "https://sanremomachines.ru");
      return candidate.pathname === url.pathname && candidate.searchParams.get("groups") === "2" && item.free > 0;
    });
    if (stocked.length) {
      assert.ok(product.free > 0, `${url.pathname}: stocked versions must precede cheaper unavailable versions`);
      assert.equal(product.price, Math.min(...stocked.map((item) => item.price)));
    }
    assert.match(card, /2 группы/);
    const text = card.replace(/<[^>]+>/g, "").replace(/\s/g, "");
    assert.ok(text.includes(String(product.price)), href);
    assert.equal(card.match(/<img[^>]+src="([^"]+)"/)[1], product.image);
    if (product.free === 0) assert.match(card, /Под заказ/);
    else assert.ok(card.includes(`${product.free} шт`), href);
  }
  assert.ok(cards.some((card) => card.includes("/products/d8/d8/")));
});

test("comparison tables prefer stocked two-group executions and fall back only when none are stocked", () => {
  const products = JSON.parse(readFileSync("out/shop/catalog.json", "utf8")).products;
  for (const route of ["compare", "compare/sanremo-vs-nuova-simonelli-appia", "compare/sanremo-vs-la-marzocco-linea", "compare/sanremo-vs-victoria-arduino-eagle-one"]) {
    const page = readFileSync(`out/${route}/index.html`, "utf8");
    const links = [...new Set([...page.matchAll(/href="([^\"]*\?sku=\d+&amp;groups=2)"/g)].map((match) => match[1].replaceAll("&amp;", "&")))];
    assert.ok(links.length >= 2, route);
    for (const href of links) {
      const url = new URL(href, "https://sanremomachines.ru");
      const selected = products.find((item) => item.code === url.searchParams.get("sku"));
      assert.ok(selected, href);
      const versions = products.filter((item) => {
        const candidate = new URL(item.url, url.origin);
        return candidate.pathname === url.pathname && candidate.searchParams.get("groups") === "2";
      });
      const stocked = versions.filter((item) => item.free > 0);
      if (stocked.length) assert.ok(selected.free > 0, `${route}: ${href}`);
      assert.equal(selected.price, Math.min(...(stocked.length ? stocked : versions).map((item) => item.price)), href);
    }
  }
});
