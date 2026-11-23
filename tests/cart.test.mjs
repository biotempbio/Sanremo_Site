import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readCart,changeCart } from '../lib/cart-core.mjs';
test('persisted basket rejects malformed quantities and never trusts client price or customer data',()=>{
 assert.deepEqual(readCart('not json'),[]);assert.deepEqual(readCart(JSON.stringify([{code:'A',quantity:2,price:1,email:'private'}, {code:'B',quantity:-1},{code:'C',quantity:1.5}])),[{code:'A',quantity:2}]);
 let items=changeCart([],'A',1);items=changeCart(items,'A',3);assert.deepEqual(items,[{code:'A',quantity:3}]);assert.deepEqual(changeCart(items,'A',0),[]);assert.throws(()=>changeCart(items,'A',100));
});
test('checkout catalog covers every feed offer at exactly the same RRP and variant URL',async()=>{
 const catalog=JSON.parse(await readFile('out/shop/catalog.json','utf8')).products;const feed=await readFile('out/feed/yandex.yml','utf8');
 const offers=[...feed.matchAll(/<offer\s+id="([^"]+)"[\s\S]*?<\/offer>/g)];assert.equal(catalog.length,offers.length);assert.equal(new Set(catalog.map(s=>s.code)).size,catalog.length);
 for(const [,id] of offers){const p=catalog.find(s=>s.code===id);assert.ok(p,id);const offer=offers.find(s=>s[1]===id)[0];assert.equal(Number(offer.match(/<price>([^<]+)<\/price>/)[1]),p.price);assert.ok(Number.isSafeInteger(p.free)&&p.free>=0);assert.ok(p.url.includes(id)||p.url.includes('color='));}
});
test('private basket stays out of sitemap and search index; actual terms are linked',async()=>{
 const cart=await readFile('out/cart/index.html','utf8');const sitemap=await readFile('out/sitemap.xml','utf8');assert.match(cart,/name="robots" content="noindex, follow"/);assert.ok(!sitemap.includes('/cart/'));assert.ok(sitemap.includes('/order-terms/'));assert.ok(sitemap.includes('/delivery/'));assert.match(cart,/4632236086/);
});

test('phone validation works with the current HTML Unicode-sets pattern mode',async()=>{
 const html=await readFile('out/cart/index.html','utf8');const pattern=html.match(/<input(?=[^>]*name="phone")[^>]*>/)[0].match(/pattern="([^"]+)"/)[1];const regex=new RegExp(`^(?:${pattern})$`,'v');
 for(const value of ['+7 (495) 363-38-01','89211252501'])assert.ok(regex.test(value));
 for(const value of ['abcdefghijk','123'])assert.equal(regex.test(value),false);
});
