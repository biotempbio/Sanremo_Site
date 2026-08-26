import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../out/", import.meta.url);

test("exports the public entry points", async () => {
  await Promise.all([
    access(new URL("index.html", outputRoot)),
    access(new URL("products/index.html", outputRoot)),
    access(new URL("products/zoe/zoe-competition/index.html", outputRoot)),
    access(new URL("robots.txt", outputRoot)),
    access(new URL("sitemap.xml", outputRoot)),
  ]);
});

test("uses the staging domain and blocks indexing", async () => {
  const [home, robots, sitemap] = await Promise.all([
    readFile(new URL("index.html", outputRoot), "utf8"),
    readFile(new URL("robots.txt", outputRoot), "utf8"),
    readFile(new URL("sitemap.xml", outputRoot), "utf8"),
  ]);

  assert.match(home, /https:\/\/staging\.sanremomachines\.ru\/og\.png/);
  assert.doesNotMatch(home, /localhost(?::\d+)?/i);
  assert.match(robots, /Disallow:\s*\//);
  assert.match(sitemap, /https:\/\/staging\.sanremomachines\.ru\/products\//);
});
