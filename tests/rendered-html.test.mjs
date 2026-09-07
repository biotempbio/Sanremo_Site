import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../out/${path}`, import.meta.url), "utf8");

test("home preserves the approved branded presentation", async () => {
  const [shell, home] = await Promise.all([read("index.html"), read("sanremo-russia.html")]);
  assert.match(shell, /<iframe[^>]+src="\/sanremo-russia\.html"/);
  assert.match(home, /Sanremo\. Центр вашего кофейного проекта/);
  assert.match(home, /home-hero-cafe-racer-v2\.jpg/);
  assert.match(home, /sanremo-official-black-v4\.svg/);
  assert.match(home, /font-family:\s*'Oswald Web'/);
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
