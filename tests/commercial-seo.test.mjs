import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(`out/${path}`, "utf8");
const products = () => JSON.parse(read("shop/catalog.json")).products;
const text = (html) => html.replace(/<!--.*?-->/gs, "").replace(/<[^>]*>/g, "").replace(/\s/g, "");
const families = ["zoe", "d8", "f18", "cafe-racer", "opera", "you"];
const linkUrl = (html) => new URL(html.match(/href="([^"]+)"/)[1].replaceAll("&amp;", "&"), "https://sanremomachines.ru");

test("commercial landings lead with purchasable models and an exact two-group Zoe", () => {
  for (const slug of ["kofejnya", "professionalnye-kofemashiny"]) {
    const html = read(`solutions/${slug}/index.html`);
    assert.equal([...html.matchAll(/id="models"/g)].length, 1);
    assert.ok(html.indexOf('id="models"') < html.indexOf("Что проверить"));
    const zoeLink = html.match(/href="(\/products\/zoe\/zoe-competition\/\?sku=[^"]+)"/);
    assert.ok(zoeLink, slug);
    const url = new URL(zoeLink[1].replaceAll("&amp;", "&"), "https://sanremomachines.ru");
    assert.equal(url.searchParams.get("groups"), "2");
    const sku = products().find((p) => p.code === url.searchParams.get("sku"));
    assert.ok(sku);
    const peers = products().filter((p) => new URL(p.url, url.origin).pathname === url.pathname && new URL(p.url, url.origin).searchParams.get("groups") === "2");
    if (peers.some((p) => p.free > 0)) assert.ok(sku.free > 0, slug);
    assert.ok(text(html).includes(String(sku.price)));
    assert.match(html, /href="\/order-terms\/"/);
    assert.match(html, /href="\/delivery\/"/);
  }
});

test("family cards show the price and stock of their linked execution", () => {
  let checked = 0;
  for (const family of families) {
    const html = read(`products/${family}/index.html`);
    for (const [card] of html.matchAll(/<article class="card catalog-card".*?<\/article>/gs)) {
      const url = linkUrl(card);
      const code = url.searchParams.get("sku");
      if (!code) continue;
      const sku = products().find((p) => p.code === code);
      assert.ok(sku, code);
      assert.equal(url.pathname + url.search, sku.url);
      const peers = products().filter((p) => {
        const candidate = new URL(p.url, url.origin);
        return candidate.pathname === url.pathname && candidate.searchParams.get("groups") === url.searchParams.get("groups");
      });
      const stocked = peers.filter((p) => p.free > 0);
      const pool = stocked.length ? stocked : peers;
      if (stocked.length) assert.ok(sku.free > 0, code);
      assert.equal(sku.price, Math.min(...pool.map((p) => p.price)), code);
      const twoGroups = products().some((p) => {
        const candidate = new URL(p.url, url.origin);
        return candidate.pathname === url.pathname && candidate.searchParams.get("groups") === "2";
      });
      if (twoGroups) assert.equal(url.searchParams.get("groups"), "2", code);
      const price = card.match(/<p class="catalog-card-price">.*?<\/p>/s)?.[0];
      assert.ok(price && text(price).includes(String(sku.price)), code);
      assert.match(price, /РРЦ/);
      if (sku.free === 0) assert.match(card, /Под заказ/);
      else assert.doesNotMatch(card, /Под заказ/);
      if (sku.free >= 3) assert.ok(card.includes(`${sku.free} шт.`), code);
      checked++;
    }
  }
  assert.ok(checked >= 7);
});

test("family matrices open the exact execution rather than the model default", () => {
  let checked = 0;
  for (const family of families) {
    const html = read(`products/${family}/index.html`);
    const matrix = html.match(/<table class="data">.*?<\/table>/s)?.[0];
    assert.ok(matrix);
    for (const [row] of matrix.matchAll(/<tr>.*?<\/tr>/gs)) {
      if (!row.includes('class="link-arrow"')) continue;
      const url = linkUrl(row);
      const sku = products().find((p) => p.code === url.searchParams.get("sku"));
      assert.ok(sku, url.href);
      assert.equal(url.pathname + url.search, sku.url);
      assert.ok(text(row).includes(String(sku.price)), sku.code);
      checked++;
    }
  }
  assert.ok(checked >= 50);
});

test("commercial pages keep canonical URLs, crawlable links and no index blocks", () => {
  const sitemap = read("sitemap.xml");
  for (const path of ["solutions/kofejnya", "solutions/professionalnye-kofemashiny", ...families.map((f) => `products/${f}`)]) {
    const html = read(`${path}/index.html`);
    assert.match(html, new RegExp(`rel="canonical" href="https://sanremomachines.ru/${path}/"`));
    assert.ok(sitemap.includes(`<loc>https://sanremomachines.ru/${path}/</loc>`), path);
    assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/);
    assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
  }
  for (const path of ["index.html", "products/index.html"]) {
    const main = read(path).match(/<main[\s>].*?<\/main>/s)[0];
    assert.match(main, /href="\/solutions\/professionalnye-kofemashiny\/"/);
    assert.match(main, /href="\/solutions\/kofejnya\/"/);
  }
});
