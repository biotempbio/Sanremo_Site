import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";

const origin = "https://sanremomachines.ru";
const read = (path) => readFile(new URL(`../out/${path}`, import.meta.url), "utf8");
const decode = (s) => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const schemas = (html) => [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
const catalog = JSON.parse(await readFile(new URL("../data/catalog.json", import.meta.url), "utf8"));
const feed = await read("feed/yandex.yml");
const offers = [...feed.matchAll(/<offer id="([^"]+)" available="([^"]+)">([\s\S]*?)<\/offer>/g)].map(([, id, available, body]) => {
  const field = (name) => decode(body.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`))?.[1] ?? "");
  return { id: decode(id), available: available === "true", url: field("url"), image: field("picture"), price: Number(field("price")), description: field("description") };
});
const feedByUrl = new Map(offers.map((offer) => [offer.url, offer]));
const imageVariants = JSON.parse(await readFile(new URL("../data/image-variants.json", import.meta.url), "utf8"));

async function eligible(image, availability) {
  if (!image || availability !== "https://schema.org/InStock") return false;
  const {width,height} = await sharp(new URL(`../out${new URL(image).pathname}`,import.meta.url).pathname).metadata();
  return width >= 300 && height >= 400;
}

test("every model publishes matching product data and a real representative photo", async () => {
  for (const model of catalog.models) {
    const path = `products/${model.family}/${model.slug}/`;
    const html = await read(`${path}index.html`);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, path);
    assert.ok(html.includes(`rel="canonical" href="${origin}/${path}"`), path);
    const group = schemas(html).find((entry) => entry["@type"] === "ProductGroup");
    assert.ok(group?.hasVariant?.length, path);
    const cover = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    const imagePath = new URL(group.image).pathname;
    assert.equal(cover, origin + (imageVariants[imagePath]?.fallback ?? imagePath), path);
    assert.ok(cover?.startsWith(`${origin}/photo/`), path);
    assert.ok((await stat(new URL(`../out${new URL(cover).pathname}`, import.meta.url))).size > 0);
    for (const variant of group.hasVariant) {
      assert.ok(variant.description, variant.name);
      assert.equal(variant.offers?.url, variant.url, variant.name);
      assert.equal(new URL(variant.url).pathname, `/${path}`, variant.name);
      assert.ok(new URL(variant.url).searchParams.get("sku"), variant.name);
      assert.equal(variant.offers.priceCurrency, "RUB", variant.name);
      const offer = feedByUrl.get(variant.url);
      assert.equal(Boolean(offer), await eligible(variant.image, variant.offers.availability), variant.name);
      if (!offer) continue;
      assert.equal(offer.price, variant.offers.price, variant.name);
      assert.equal(offer.available, variant.offers.availability === "https://schema.org/InStock", variant.name);
      assert.equal(offer.image, variant.image ?? "", variant.name);
      assert.equal(offer.description, variant.description, variant.name);
    }
  }
});

test("every family lists its actual executions without treating the entire family as one product", async () => {
  for (const family of catalog.families) {
    const path = `products/${family.slug}/`;
    const html = await read(`${path}index.html`);
    assert.ok(html.includes(`rel="canonical" href="${origin}/${path}"`), path);
    assert.doesNotMatch(html, /Если нужного числа групп нет среди версий/);
    const objects = schemas(html);
    assert.equal(objects.filter((entry) => entry["@type"] === "Product" || entry["@type"] === "AggregateOffer").length, 0, path);
    const lists = objects.filter((entry) => entry["@type"] === "OfferCatalog");
    assert.equal(lists.length, 1, path);
    const list = lists[0];
    assert.ok(list.description && list.image && list.itemListElement.length, path);
    for (const offer of list.itemListElement) {
      assert.equal(new URL(offer.url).pathname.split("/")[2], family.slug, offer.url);
      const feedOffer = feedByUrl.get(offer.url);
      assert.equal(Boolean(feedOffer), await eligible(offer.image, offer.availability), offer.url);
      if (!feedOffer) continue;
      assert.equal(offer.price, feedOffer.price, offer.url);
      assert.equal(offer.image ?? "", feedOffer.image, offer.url);
    }
  }
});

test("feed execution links select SKU or X-One colour and never claim the wrong photo", async () => {
  assert.equal(new Set(offers.map((offer) => offer.id)).size, offers.length);
  assert.equal(feedByUrl.size, offers.length);
  assert.ok(offers.length > 0);
  assert.ok(feed.includes("<currency id=\"RUR\""));
  assert.ok(!feed.includes("<currencyId>RUB</currencyId>"));
  const grinderHtml = await read("products/x-one/index.html");
  const grinder = schemas(grinderHtml).find((entry) => entry["@type"] === "ProductGroup");
  assert.equal(grinder.hasVariant.length, 2);
  for (const variant of grinder.hasVariant) {
    const offer = feedByUrl.get(variant.url);
    assert.equal(Boolean(offer), await eligible(variant.image, variant.offers.availability), variant.url);
    if (!offer) continue;
    assert.equal(offer.price, variant.offers.price);
    assert.equal(offer.image, variant.image ?? "");
    assert.equal(new URL(variant.url).searchParams.get("color"), variant.color.toLowerCase());
  }
  for (const offer of offers) {
    const url = new URL(offer.url);
    assert.equal(url.origin, origin);
    assert.equal(url.hash, "");
    assert.ok(url.searchParams.get("sku") || url.searchParams.get("color"), offer.url);
    assert.ok(offer.price > 0 && offer.description, offer.id);
    assert.equal(offer.available, true);
    assert.ok(offer.image);
    assert.equal(await eligible(offer.image,"https://schema.org/InStock"),true);
    if (offer.image) assert.ok((await stat(new URL(`../out${new URL(offer.image).pathname}`, import.meta.url))).size > 0, offer.image);
  }
});

test("archive pages remain service pages and keep their canonical URLs", async () => {
  for (const slug of ["napoli", "cube", "verona", "verona-rs", "torino", "capri"]) {
    const html = await read(`products/${slug}/index.html`);
    assert.ok(html.includes(`rel="canonical" href="${origin}/products/${slug}/"`));
    assert.ok(!schemas(html).some((entry) => ["Product", "ProductGroup", "OfferCatalog"].includes(entry["@type"])));
  }
});

test('reviewed originals reach their exact variants without enlargement', async()=>{
 const reviewed=JSON.parse(await readFile(new URL('../data/verified-product-media.json',import.meta.url),'utf8'));
 for(const[code,entry]of Object.entries(reviewed)){
  const model=catalog.models.find(m=>m.slug===entry.model);
  const group=schemas(await read(`products/${model.family}/${model.slug}/index.html`)).find(s=>s['@type']==='ProductGroup');
  const variant=group.hasVariant.find(v=>new URL(v.url).searchParams.get('sku')===code);
  assert.equal(variant.image,origin+entry.image,code);
  const actual=await sharp(new URL(`../public${entry.image}`,import.meta.url).pathname).metadata();
  assert.equal(actual.width,entry.width);assert.equal(actual.height,entry.height);
  assert.ok(entry.source.startsWith('https://'));assert.ok(entry.groups>0);
 }
});
