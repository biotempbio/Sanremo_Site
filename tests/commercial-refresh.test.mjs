import test from 'node:test';
import assert from 'node:assert/strict';
import { refreshDue, mergeCommercial, fetchCommercial, applyCommercialCache } from '../scripts/sync-bio-catalog.mjs';
const now=new Date('2026-11-18T04:00:00Z');
const prior={dataAsOf:'2026-11-17T02:30:00Z',syncedAt:'2026-11-17T03:30:00Z',stockSyncedAt:'2026-11-17T03:30:00Z',priceSyncedAt:'2026-11-16T03:30:00Z',priceDataAsOf:'2026-11-16T02:30:00Z',products:[{code:'A',name:'Original name',price:500,inStock:4,description:'Editorial text',descriptionBlocks:[{type:'paragraph',text:'Editorial text'}],imageLocal:'/photo/catalog/A.webp',secondaryProps:[{name:'Power',value:'4 kW'}]}]};
const row={brand:'Sanremo',code:'A',inStock:8,inReserve:7,inAccess:1,priceRUB:800,dilerPriceRUB:600,description:'Do not import',img:'https://invalid.test/new.jpg'};
const date='2026-11-18T02:30:00Z';
test('stocks refresh daily in Moscow; prices refresh once per Moscow week',()=>{
 assert.deepEqual(refreshDue(prior,now),{stock:true,prices:false});
 assert.deepEqual(refreshDue({...prior,stockSyncedAt:now.toISOString()},now),{stock:false,prices:false});
 assert.deepEqual(refreshDue(prior,new Date('2026-11-23T03:30:00Z')),{stock:true,prices:true});
 assert.deepEqual(refreshDue(prior,new Date('2026-11-23T00:00:00Z')),{stock:false,prices:false});
});
test('daily refresh changes stock and its date, retaining price and all content',()=>{
 const out=mergeCommercial(prior,[row],{stock:true,prices:false,dataAsOf:date,now});
 assert.equal(out.products[0].inStock,8);assert.equal(out.products[0].price,500);assert.equal(out.priceDataAsOf,prior.priceDataAsOf);
 for(const k of ['name','description','descriptionBlocks','imageLocal','secondaryProps'])assert.deepEqual(out.products[0][k],prior.products[0][k]);
 assert.equal(out.products[0].inReserve,undefined);assert.equal(out.products[0].inAccess,undefined);
 assert.equal(prior.products[0].inStock,4);
});
test('weekly refresh updates public prices without leaking dealer prices',()=>{
 const out=mergeCommercial(prior,[row],{stock:true,prices:true,dataAsOf:date,now});
 assert.equal(out.products[0].price,800);assert.equal(out.priceDataAsOf,date);
 assert.doesNotMatch(JSON.stringify(out),/dilerPrice|dealerPrice|inReserve|inAccess/);
});
test('missing stock/price, incomplete and all-zero responses never overwrite prior data',()=>{
 for(const incoming of [[],[{...row,inStock:null}],[{...row,inStock:0}],[{...row,inStock:-1}]])assert.throws(()=>mergeCommercial(prior,incoming,{stock:true,dataAsOf:date,now}));
 assert.throws(()=>mergeCommercial(prior,[{...row,priceRUB:null}],{stock:true,prices:true,dataAsOf:date,now}),/price/);
 assert.equal(prior.products[0].price,500);assert.equal(prior.products[0].inStock,4);
});
test('invalid or stale snapshot timestamps are rejected',()=>{
 for(const dataAsOf of ['',null,'2026-11-10T02:30:00Z','2027-01-01T00:00:00Z'])assert.throws(()=>mergeCommercial(prior,[row],{dataAsOf,now}));
});
test('commercial refresh requests only one export, never cards or media',async()=>{
 const urls=[];const result=await fetchCommercial({key:'test',fetcher:async(url)=>{urls.push(url);return {ok:true,json:async()=>[row],headers:{get:()=>date}}}});
 assert.equal(result.items.length,1);assert.deepEqual(urls,['https://portal.holdingbio.ru/api/catalog/export?brand=Sanremo']);
 await assert.rejects(fetchCommercial({key:'test',fetcher:async()=>({ok:false,status:401})}),/401/);
});

test('persisted commercial cache cannot replace text, photos or specifications',()=>{
 const out=applyCommercialCache(prior,{stockSyncedAt:now.toISOString(),stockDataAsOf:date,priceSyncedAt:prior.priceSyncedAt,products:[{code:'A',inStock:9,price:100,description:'malicious replacement',imageLocal:'/new.jpg'}]});
 assert.equal(out.products[0].inStock,9);assert.equal(out.products[0].price,500);
 assert.equal(out.products[0].description,'Editorial text');assert.equal(out.products[0].imageLocal,'/photo/catalog/A.webp');
 assert.equal(out.priceSyncedAt,prior.priceSyncedAt);
});
