import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const posts = JSON.parse(readFileSync(path.join(root, 'data/news.json'), 'utf8'));
const sitemap = readFileSync(path.join(root, 'out/sitemap.xml'), 'utf8');

test('all ten original news posts have full local pages, images and original dates', () => {
  assert.equal(posts.length, 10);
  for (const post of posts) {
    assert.match(post.oldPath, /^\/tpost\//);
    assert.match(post.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(post.paragraphs.length > 0, post.slug);
    assert.ok(post.images.length > 0, post.slug);
    for (const image of post.images) assert.ok(existsSync(path.join(root, 'public', image.src)), image.src);
    const page = readFileSync(path.join(root, 'out/news', post.slug, 'index.html'), 'utf8');
    assert.ok(page.includes(post.title), post.slug);
    assert.ok(page.includes('"@type":"Article"'), post.slug);
    assert.ok(page.includes(`"datePublished":"${post.publishedAt}"`), post.slug);
    assert.ok(sitemap.includes(`/news/${post.slug}/`), post.slug);
  }
});

test('five lower-priority Tilda URLs have canonical instant move pages', () => {
  const moved = posts.filter((post) => existsSync(path.join(root, 'out', post.oldPath, 'index.html')));
  assert.equal(moved.length, 5);
  assert.deepEqual(new Set(moved.map((post) => post.oldPath)), new Set([
    '/tpost/9ejdiik9o1-360-sanremo-3',
    '/tpost/ou8np6rss1-360-sanremo-2',
    '/tpost/2oe6krp6j1-vo-ves-opor',
    '/tpost/akxi35jl41-komandnaya-rabota-kak-sposob-dostizheniy',
    '/tpost/g105rcvzb1-nash-novii-ambassador-martin-shabaya',
  ]));
  for (const post of moved) {
    const page = readFileSync(path.join(root, 'out', post.oldPath, 'index.html'), 'utf8');
    assert.match(page, /http-equiv="refresh" content="0;url=\/news\//);
    assert.match(page, /name="robots" content="noindex,follow"/);
    assert.ok(page.includes(`/news/${post.slug}/`), post.slug);
    assert.ok(!page.includes(post.paragraphs.join(' ')), post.slug);
  }
});
