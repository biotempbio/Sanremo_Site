import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve('out'),origin=process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sanremomachines.ru';
const read=p=>readFile(`${root}${p.endsWith('/')?`${p}index.html`:p}`,'utf8');
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'");
const meta=(s,key)=>decode([...s.matchAll(/<meta\s+[^>]*>/g)].map(x=>x[0]).find(x=>new RegExp(`(?:property|name)="${key}"`).test(x))?.match(/content="([^"]*)"/)?.[1]??'');
const schemas=s=>[...s.matchAll(/<script\s+[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(x=>JSON.parse(x[1]));
function all(value, type){if(!value||typeof value!=='object')return[];return [...(!Array.isArray(value)&&value['@type']===type?[value]:[]),...Object.values(value).flatMap(x=>all(x,type))];}
const routes=['/','/products/','/products/cafe-racer/','/products/cafe-racer/cafe-racer/','/products/you/you/','/products/x-one/','/contacts/','/prices/','/dealers/','/news/zoe-2026/','/cases/coffee-combo/','/about/world/','/about/world/cafe-racer-cairo-ratio/','/search/'];
let checks=0;
for(const route of routes){
 const s=await read(route),title=decode(s.match(/<title>(.*?)<\/title>/)?.[1]??'');
 assert.ok(title,route);assert.equal(meta(s,'og:title'),title,route);assert.equal(meta(s,'twitter:title'),title,route);
 assert.equal(meta(s,'og:url'),`${origin}${route}`,route);assert.ok(meta(s,'og:description'),route);assert.ok(meta(s,'og:image').startsWith(origin+'/'),route);
 assert.equal((s.match(/rel="canonical"/g)??[]).length,1,route);assert.ok(s.includes(`rel="canonical" href="${origin}${route}"`),route);
 const objects=schemas(s);assert.equal(all(objects,'Organization').filter(x=>x['@id']===origin+'/#organization').length,1,route);
 assert.equal(all(objects,'WebSite').length,1,route);assert.equal(all(objects,'AggregateRating').length,0,route);assert.equal(all(objects,'Review').length,0,route);
 for(const tag of s.matchAll(/<img\b[^>]*>/g)){
  assert.match(tag[0],/\balt="[^"]*"/,route);
  if(/src="\/photo\/(world|catalog)\//.test(tag[0]))assert.doesNotMatch(tag[0],/\balt=""/,route);
 }
 checks++;
}
const home=await read('/'),you=await read('/products/you/you/');
for(const s of [home,you]) assert.doesNotMatch(s,/<img\b[^>]*src="\/photo\/official\/you.png"/);
const manifest=JSON.parse(await readFile('data/image-variants.json','utf8'));
for(const source of ['/photo/official/you.png','/photo/home-hero-cafe-racer-v2.jpg']){
 const e=manifest[source];assert.ok((await stat('out'+e.fallback)).size<(await stat('out'+source)).size);
 for(const v of [...e.webp,...(e.avif??[])])assert.ok((await stat('out'+v.src)).size>0);
 assert.match(home,new RegExp(e.fallback.replaceAll('.','\\.')));
}
const family=await read('/products/cafe-racer/'),card=await read('/products/cafe-racer/cafe-racer/');
const h1=s=>decode(s.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1].replaceAll(/<!--.*?-->/g,'')??'');
assert.notEqual(h1(family),h1(card));
const aggregate=all(schemas(family),'AggregateOffer')[0];assert.ok(aggregate.lowPrice>0);assert.equal(aggregate.priceCurrency,'RUB');assert.ok(aggregate.offerCount>0);assert.ok(aggregate.availability.length>0);assert.equal(aggregate.url,origin+'/products/cafe-racer/');
const group=all(schemas(card),'ProductGroup')[0];assert.ok(group.hasVariant.every(x=>x.offers.price>0&&x.offers.availability));
assert.ok(all(schemas(await read('/contacts/')),'LocalBusiness')[0].address.addressCountry==='RU');
const archives=await Promise.all(['napoli','cube','verona'].map(m=>read(`/products/${m}/`)));
assert.equal(new Set(archives.map(s=>s.match(/<section class="wrap section-tight"><h2>(.*?)<\/section>/)?.[1])).size,3);
assert.match(await read('/search/'),/name="robots" content="noindex, follow"/);assert.doesNotMatch(await read('/sitemap.xml'),/<loc>[^<]*\/search\//);
for(const [source,e]of Object.entries(manifest))for(const v of e.webp)assert.ok((await stat('out'+v.src)).size>0,source);
console.log(`SEO audit: ${checks} representative routes, schema, OG, alt, responsive assets, archive text, search and sitemap passed`);
console.log(`Café Racer identity HTML: ${(await stat(root+'/products/cafe-racer/cafe-racer/index.html')).size} bytes`);
