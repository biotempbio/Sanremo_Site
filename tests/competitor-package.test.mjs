import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("new brand comparisons have independent metadata, verifiable versions and crawlable entry points", () => {
  const cases = [
    ["carimali", "Carimali", "Cento 2 GR", "Bubble 2 GR", "https://carimali.com/wp-content/uploads/2023/10/Cento_EN.pdf", "https://carimali.com/wp-content/uploads/2023/10/Bubble_EN.pdf"],
    ["la-cimbali", "La Cimbali", "M26 SE DT2 Tall Cup", "M23UP", "https://www.cimbali.com/sites/default/files/dati_tecnici_m26.pdf", "https://www.cimbali.com/sites/default/files/documenti/6l_lc_m26-final.pdf"],
    ["fiamma", "Fiamma", "Caravel 2 CV", "Compass 2 SE", "https://fiammaespresso.com/en/p/caravel-2-cv-2262563301", "https://fiammaespresso.com/en/p/compass-2-se-1711524845"],
  ];
  const sitemap = readFileSync("out/sitemap.xml", "utf8");
  const titles = new Set();
  const descriptions = new Set();
  for (const [slug, brand, ...facts] of cases) {
    const path = `/compare/sanremo-vs-${slug}/`;
    const page = readFileSync(`out${path}index.html`, "utf8");
    assert.equal([...page.matchAll(/<h1\b/g)].length, 1, path);
    assert.ok(page.match(/<h1[^>]*>(.*?)<\/h1>/s)[1].includes(brand), path);
    assert.ok(page.includes(`rel="canonical" href="https://sanremomachines.ru${path}"`), path);
    assert.doesNotMatch(page, /<meta name="robots" content="[^"]*noindex/);
    titles.add(page.match(/<title>(.*?)<\/title>/s)[1]);
    descriptions.add(page.match(/<meta name="description" content="([^"]+)"/)[1]);
    for (const fact of facts) assert.ok(page.includes(fact), `${path}: ${fact}`);
    const schemas = [...page.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
    const article = schemas.find((schema) => schema["@type"] === "Article");
    assert.ok(article, path);
    assert.equal(article.datePublished, "2026-11-24");
    assert.equal(article.dateModified, "2026-11-24");
    assert.ok(sitemap.includes(`https://sanremomachines.ru${path}`), path);
    for (const route of ["compare", "guide", "solutions/kofejnya", "guide/kofemashina-dlya-kofejni"]) {
      assert.ok(readFileSync(`out/${route}/index.html`, "utf8").includes(`href="${path}"`), `${route} must link to ${path}`);
    }
    assert.ok(page.includes('href="/leasing/"') && page.includes('href="/dealers/"'), path);
    const reading = page.match(/<section class="competitor-reading">(.*?)<\/section>/s)[1];
    assert.doesNotMatch(reading, /проверен[ыо].*\d{2}\.\d{2}\.\d{4}|Материал подготовлен|не является.*офертой|TODO/i);
  }
  assert.equal(titles.size, 3);
  assert.equal(descriptions.size, 3);
});
