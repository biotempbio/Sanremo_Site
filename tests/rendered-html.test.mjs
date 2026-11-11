import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../out/${path}`, import.meta.url), "utf8");

test("home preserves the approved branded presentation", async () => {
  const home = await read("index.html");
  assert.doesNotMatch(home, /<iframe/);
  assert.match(home, /Профессиональные кофемашины Sanremo в России/);
  assert.match(home, /href="\/products\/"/);
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
  assert.match(html, /priceValidUntil/);
});
