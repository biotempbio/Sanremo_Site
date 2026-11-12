import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../out/${path}`, import.meta.url), "utf8");

test("home preserves the approved branded presentation", async () => {
  const home = await read("index.html");
  assert.doesNotMatch(home, /<iframe/);
  assert.match(home, /Профессиональные кофемашины Sanremo в России/);
  assert.match(home, /href="\/products\/"/);
});

test("favicon links use versioned, self-contained Sanremo assets", async () => {
  const home = await read("index.html");
  const svg = await read("favicon.svg");
  assert.match(home, /href="\/favicon\.ico\?v=3"/);
  assert.match(home, /href="\/favicon-120\.png\?v=3"/);
  assert.match(home, /href="\/apple-touch-icon\.png\?v=3"/);
  assert.doesNotMatch(home, /rel="icon"[^>]+favicon\.svg/);
  assert.doesNotMatch(home, /href="\/icon\.png"/);
  assert.match(svg, /href="data:image\/png;base64,/);
  assert.doesNotMatch(svg, /href="\/(?!\/)/);
  for (const asset of ["favicon.ico", "favicon-120.png", "apple-touch-icon.png", "icon.png"]) {
    assert.ok((await stat(new URL(`../out/${asset}`, import.meta.url))).size > 0, asset);
  }
});

test("mobile contact and grinder layouts have no fixed outer width", async () => {
  const [contacts, grinders, xOne] = await Promise.all([
    read("contacts/index.html"), read("products/grinders/index.html"), read("products/x-one/index.html"),
  ]);
  assert.match(contacts, /class="data contact-routes"/);
  assert.doesNotMatch(contacts, /min-width:460px/);
  for (const html of [grinders, xOne]) assert.match(html, /class="data spec-table"/);
  const cssDir = new URL("../out/_next/static/chunks/", import.meta.url);
  const cssNames = (await readdir(cssDir)).filter((name) => name.endsWith(".css"));
  const css = (await Promise.all(cssNames.map((name) => readFile(new URL(name, cssDir), "utf8")))).join("\n");
  assert.match(css, /\.contacts-layout/);
  assert.match(css, /\.spec-table/);
  assert.match(css, /grid-template-columns:minmax\(0,1fr\)/);
});

test("SEO output includes canonical, organization, breadcrumbs and families", async () => {
  const [contacts, sitemap] = await Promise.all([read("contacts/index.html"), read("sitemap.xml")]);
  assert.match(contacts, /rel="canonical" href="https:\/\/staging\.sanremomachines\.ru\/contacts\/"/);
  assert.match(contacts, /"@type":"Organization"/);
  assert.match(contacts, /"@type":"BreadcrumbList"/);
  for (const family of ["zoe", "d8", "f18"]) assert.match(sitemap, new RegExp(`/products/${family}/</loc>`));
});

test("lead forms are submit-ready without exposing email credentials", async () => {
  const [contacts, service] = await Promise.all([read("contacts/index.html"), read("service/index.html")]);
  for (const name of ["name", "contact", "city", "format", "model", "timeline", "task", "consent"]) assert.match(contacts, new RegExp(`name="${name}"`));
  for (const name of ["model", "serial", "city", "contact", "symptom", "consent"]) assert.match(service, new RegExp(`name="${name}"`));
  assert.match(contacts, /type="submit"/); assert.match(service, /type="submit"/);
  assert.doesNotMatch(contacts, /SMTP_PASS|SMTP_USER/);
});

test("product pages contain only Sanremo lineup comparisons", async () => {
  const html = await read("products/d8/d8/index.html");
  assert.doesNotMatch(html, /Прямые аналоги рынка|РРЦ конкурента|С чем реально сравнивают/);
  assert.match(html, /Sanremo D8/);
  assert.doesNotMatch(html, /priceValidUntil/);
});

test("guide, FAQ and product pages expose linked HTML and valid structured data", async () => {
  const [home, cafe, restaurant, lineups, faq, catalog, family, model, sitemap, llms] = await Promise.all([
    read("index.html"), read("guide/kofemashina-dlya-kofejni/index.html"),
    read("guide/kofemashina-dlya-restorana/index.html"), read("guide/linejki-sanremo/index.html"),
    read("faq/index.html"), read("products/index.html"), read("products/d8/index.html"),
    read("products/d8/d8/index.html"), read("sitemap.xml"), read("llms.txt"),
  ]);
  const objects = (html) => [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.match(home, /href="\/guide\/"/);
  for (const html of [cafe, restaurant, lineups, faq, catalog, family, model]) {
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.ok(objects(html).length > 0);
  }
  assert.ok(objects(cafe).some((entry) => entry["@type"] === "Article"));
  assert.ok(objects(restaurant).some((entry) => entry["@type"] === "Article"));
  assert.ok(objects(faq).some((entry) => entry["@type"] === "FAQPage" && entry.mainEntity.length >= 12));
  assert.ok(objects(catalog).some((entry) => entry["@type"] === "ItemList"));
  assert.ok(objects(family).some((entry) => entry["@type"] === "ItemList"));
  const group = objects(model).find((entry) => entry["@type"] === "ProductGroup");
  assert.ok(group?.hasVariant?.every((variant) => variant["@type"] === "Product" && variant.sku && variant.offers?.priceCurrency === "RUB" && variant.offers?.seller?.name === "BIO"));
  assert.ok(objects(model).some((entry) => entry["@type"] === "FAQPage"));
  for (const route of ["/faq/", "/guide/", "/guide/kofemashina-dlya-kofejni/", "/guide/kofemashina-dlya-restorana/", "/guide/linejki-sanremo/"]) assert.match(sitemap, new RegExp(`${route}</loc>`));
  assert.match(llms, /\/guide\//);
});

test("document library serves every unique PDF and links model files directly", async () => {
  const manifest = JSON.parse(await readFile(new URL("../data/documents.json", import.meta.url), "utf8"));
  const [library, model] = await Promise.all([read("documents/index.html"), read("products/d8/d8/index.html")]);
  assert.equal(manifest.length, 43);
  assert.equal(new Set(manifest.map((entry) => entry.href)).size, manifest.length);
  assert.match(library, /Все модели/);
  assert.match(library, /Все типы/);
  assert.match(library, /Декларация о соответствии — действует до 23\.01\.2029/);
  assert.match(library, /Взрыв-схема и каталог запчастей Zoe Compact/);
  assert.match(library, /предыдущая ревизия/);
  assert.match(library, /Исходный файл: <!-- -->83011300 ESPLOSI D8\.pdf/);
  assert.match(library, /Запросить документ/);
  assert.match(library, /по запросу/);
  assert.match(model, /Скачать PDF/);
  for (const entry of manifest) {
    const path = new URL(`../out${entry.href}`, import.meta.url);
    assert.equal((await stat(path)).size, entry.bytes, entry.href);
    assert.equal((await readFile(path)).subarray(0, 5).toString(), "%PDF-", entry.href);
    assert.ok(library.includes(`href="${entry.href}"`), entry.href);
  }
});

test("case archive has traceable facts, local photos and only substantive detail pages", async () => {
  const entries = JSON.parse(await readFile(new URL("../data/cases.json", import.meta.url), "utf8"));
  const [listing, detail, home, d8, sitemap] = await Promise.all([
    read("cases/index.html"), read("cases/coffee-combo/index.html"), read("index.html"),
    read("products/d8/index.html"), read("sitemap.xml"),
  ]);
  assert.equal(entries.length, 20);
  assert.match(listing, /Где варят на Sanremo/);
  assert.match(detail, /Coffee Combo — Москва/);
  assert.match(detail, /"@type":"Article"/);
  assert.match(home, /href="\/cases\/"/);
  assert.match(d8, /Где работает/);
  assert.match(d8, /Coffee Combo/);
  const detailed = entries.filter((entry) => entry.page);
  assert.deepEqual(detailed.map((entry) => entry.slug), ["coffee-combo"]);
  for (const entry of entries) {
    for (const [field, value] of Object.entries(entry)) {
      if (["slug", "page"].includes(field)) continue;
      for (const fact of Array.isArray(value) ? value : [value]) {
        assert.match(fact.source, /^(old-site|telegram-\d+)$/, `${entry.slug}.${field}`);
        if (field === "photos") await stat(new URL(`../out${fact.value}`, import.meta.url));
      }
    }
    if (entry.page) {
      assert.ok(entry.story.map((paragraph) => paragraph.value).join(" ").split(/\s+/).length >= 120, entry.slug);
      assert.match(sitemap, new RegExp(`/cases/${entry.slug}/</loc>`));
    } else assert.doesNotMatch(sitemap, new RegExp(`/cases/${entry.slug}/</loc>`));
  }
});
