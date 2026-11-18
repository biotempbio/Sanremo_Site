import { readFile, writeFile, rename, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export { fetchSnapshot, normalizeExport, sanitize, secondaryProps, modelSlug } from './import-bio-content.mjs';
import { normalizeExport } from './import-bio-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async name => JSON.parse(await readFile(path.join(root,name),'utf8'));
const number = value => value === null || value === undefined || value === '' ? null : Number(String(value).replace(/\s/g,'').replace(',','.'));
const day = value => new Date(new Date(value).getTime()+3*3600_000).toISOString().slice(0,10);
const week = value => { const d=new Date(`${day(value)}T00:00:00Z`);d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10); };

export function refreshDue(snapshot, now=new Date(), force='') {
  const clock=new Date(new Date(now).getTime()+3*3600_000);
  const windowOpen=clock.getUTCHours()*60+clock.getUTCMinutes()>=390; // 06:30 Moscow, after the upstream 05:30 snapshot.
  const stockAt=snapshot.stockSyncedAt ?? snapshot.syncedAt;
  const priceAt=snapshot.priceSyncedAt ?? snapshot.syncedAt;
  return {
    stock: ['stock','all'].includes(force) || windowOpen && (!stockAt || day(stockAt)!==day(now)),
    prices: ['prices','all'].includes(force) || windowOpen && (!priceAt || week(priceAt)!==week(now)),
  };
}

/** Update existing public SKUs only. Content, specifications and media remain untouched. */
export function mergeCommercial(snapshot, rawItems, {stock=true,prices=false,dataAsOf,now=new Date()}={}) {
  if (!snapshot.products?.length) throw new Error('No frozen catalog: run the one-time content import first');
  if (!dataAsOf || !Number.isFinite(Date.parse(dataAsOf))) throw new Error('BIO export has no valid X-Data-As-Of');
  if (Date.parse(dataAsOf)>new Date(now).getTime()+3600_000) throw new Error('BIO export timestamp is in the future');
  if (new Date(now).getTime()-Date.parse(dataAsOf)>48*3600_000) throw new Error('BIO export is older than 48 hours');
  const byCode=new Map();
  for(const raw of rawItems) {
    if(String(raw.brand ?? raw['Бренд'] ?? '').toLowerCase()!=='sanremo')continue;
    const code=String(raw.code ?? raw['Код'] ?? '').trim();
    if(byCode.has(code))throw new Error(`Duplicate BIO code: ${code}`);
    if(code)byCode.set(code,raw);
  }
  const missing=snapshot.products.filter(p=>!byCode.has(p.code)).map(p=>p.code);
  if(missing.length)throw new Error(`BIO export is incomplete: ${missing.length} known SKUs missing`);
  let totalStock=0;
  const updatedAt=new Date(now).toISOString();
  const products=snapshot.products.map(item=>{
    const raw=byCode.get(item.code), next={...item};
    if(stock) {
      const n=number(raw.inStock ?? raw['Остаток']);
      if(!Number.isFinite(n)||n<0)throw new Error(`Missing or invalid stock: ${item.code}`);
      next.inStock=Math.trunc(n); next.stockDataAsOf=dataAsOf;totalStock+=next.inStock;
    }
    if(prices) {
      const retail=number(raw.priceRUB ?? raw['РРЦРуб']);
      const dealer=number(raw.dilerPriceRUB ?? raw.dealerPriceRUB ?? raw['ДилерскаяЦенаРуб']);
      if(!Number.isFinite(retail)||retail<0||!Number.isFinite(dealer)||dealer<0)throw new Error(`Missing or invalid price: ${item.code}`);
      next.price=retail>0&&retail>=dealer ? Math.round(retail) : null;
      next.priceDataAsOf=dataAsOf;
    }
    return next;
  });
  if(stock&&totalStock===0)throw new Error('BIO export has zero stock across the catalog; previous data retained');
  const retained={...snapshot};
  delete retained.lastSyncError; delete retained.lastSyncAttempt;
  return {
    ...retained, products,
    ...(stock?{dataAsOf,syncedAt:updatedAt,stockDataAsOf:dataAsOf,stockSyncedAt:updatedAt}:{}),
    ...(prices?{priceDataAsOf:dataAsOf,priceSyncedAt:updatedAt}:{}),
  };
}

async function atomicJson(name,value) {
  const target=path.join(root,name),temporary=`${target}.${process.pid}.tmp`;
  await mkdir(path.dirname(target),{recursive:true});
  await writeFile(temporary,JSON.stringify(value));await rename(temporary,target);
}

export async function fetchCommercial({key,fetcher=fetch}) {
  // This is the documented BIO export. Other response fields are never merged.
  // No product-card endpoint and no image endpoint is called here.
  const r=await fetcher('https://portal.holdingbio.ru/api/catalog/export?brand=Sanremo',{
    headers:{'X-API-Key':key,Accept:'application/json','Accept-Encoding':'gzip'},signal:AbortSignal.timeout(60_000),
  });
  if(!r.ok)throw new Error(`BIO API returned HTTP ${r.status}`);
  return {items:normalizeExport(await r.json()),dataAsOf:r.headers.get('X-Data-As-Of')};
}

export function applyCommercialCache(local,cached) {
  if(!local.products?.length)return local;
  const newer=(a,b)=>Number.isFinite(Date.parse(a))&&Date.parse(a)>Date.parse(b??'1970-01-01');
  const stock=newer(cached.stockSyncedAt,local.stockSyncedAt??local.syncedAt);
  const prices=newer(cached.priceSyncedAt,local.priceSyncedAt??local.syncedAt);
  if(!stock&&!prices)return local;
  if(!Array.isArray(cached.products))throw new Error('Invalid commercial cache');
  const map=new Map(cached.products.map(p=>[p.code,p]));
  if(map.size!==cached.products.length||map.size!==local.products.length)throw new Error('Commercial cache SKU coverage changed');
  if(stock&&!Number.isFinite(Date.parse(cached.stockDataAsOf)))throw new Error('Invalid cached stock date');
  if(prices&&!Number.isFinite(Date.parse(cached.priceDataAsOf)))throw new Error('Invalid cached price date');
  const products=local.products.map(item=>{
    const row=map.get(item.code);if(!row)throw new Error('Commercial cache is incomplete');
    const next={...item};
    if(stock){if(!Number.isFinite(row.inStock)||row.inStock<0)throw new Error('Invalid cached stock');next.inStock=row.inStock;next.stockDataAsOf=cached.stockDataAsOf;}
    if(prices){if(row.price!==null&&(!Number.isFinite(row.price)||row.price<=0))throw new Error('Invalid cached price');next.price=row.price;next.priceDataAsOf=cached.priceDataAsOf;}
    return next;
  });
  if(stock&&products.every(p=>p.inStock===0))throw new Error("All-zero commercial cache");
  return {...local,products,
    ...(stock?{dataAsOf:cached.stockDataAsOf,syncedAt:cached.stockSyncedAt,stockDataAsOf:cached.stockDataAsOf,stockSyncedAt:cached.stockSyncedAt}:{}),
    ...(prices?{priceDataAsOf:cached.priceDataAsOf,priceSyncedAt:cached.priceSyncedAt}:{}),
  };
}

async function restoreSnapshot(local,fetcher=fetch) {
  // Only commercial values are restored. Text/specifications/media stay in the repository.
  try {
    const response=await fetcher('https://sanremomachines.ru/catalog-commercial.json',{signal:AbortSignal.timeout(12_000),cache:'no-store'});
    if(response.ok)return applyCommercialCache(local,await response.json());
  } catch { /* Retain checked-in last successful values if the public cache is unavailable. */ }
  return local;
}

async function main() {
  let snapshot=await restoreSnapshot(await readJson('data/bio-catalog.snapshot.json'));
  const key=process.env.BIO_CATALOG_API_KEY;
  const due=refreshDue(snapshot,new Date(),process.env.BIO_SYNC_FORCE);
  if(snapshot.products?.length && key && (due.stock||due.prices)) {
    try {
      const incoming=await fetchCommercial({key});
      if(due.stock)snapshot=mergeCommercial(snapshot,incoming.items,{stock:true,prices:false,dataAsOf:incoming.dataAsOf,now:new Date()});
      if(due.prices)snapshot=mergeCommercial(snapshot,incoming.items,{stock:false,prices:true,dataAsOf:incoming.dataAsOf,now:new Date()});
      console.log(`BIO commercial refresh: stock=${due.stock}, prices=${due.prices}, SKUs=${snapshot.products.length}`);
    } catch(error) {
      console.warn(`BIO commercial refresh failed; last successful data retained: ${error.message}`);
      snapshot={...snapshot,lastSyncError:String(error.message),lastSyncAttempt:new Date().toISOString()};
    }
  } else console.log(`BIO commercial refresh: ${!snapshot.products?.length?'frozen snapshot not initialized':!key?'no API key; retained data':'already current for the Moscow refresh window'}`);
  if(snapshot.products?.length) {
    await atomicJson('data/bio-catalog.snapshot.json',snapshot);
    await atomicJson('public/catalog-commercial.json',{
      stockDataAsOf:snapshot.stockDataAsOf??snapshot.dataAsOf,stockSyncedAt:snapshot.stockSyncedAt??snapshot.syncedAt,
      priceDataAsOf:snapshot.priceDataAsOf??snapshot.dataAsOf,priceSyncedAt:snapshot.priceSyncedAt??snapshot.syncedAt,
      products:snapshot.products.map(({code,price,inStock})=>({code,price,inStock})),
    });
    await atomicJson('public/catalog-sync-state.json',{
      dataAsOf:snapshot.stockDataAsOf??snapshot.dataAsOf,syncedAt:snapshot.stockSyncedAt??snapshot.syncedAt,
      stockDataAsOf:snapshot.stockDataAsOf??snapshot.dataAsOf,stockSyncedAt:snapshot.stockSyncedAt??snapshot.syncedAt,
      priceDataAsOf:snapshot.priceDataAsOf??snapshot.dataAsOf,priceSyncedAt:snapshot.priceSyncedAt??snapshot.syncedAt,
      contentImportedAt:snapshot.contentImportedAt??null,received:snapshot.received,published:snapshot.products.length,
      stockedProducts:snapshot.products.filter(p=>p.inStock>0).length,hidden:snapshot.hidden??{},warnings:snapshot.warnings??[],
      ...(snapshot.lastSyncError?{lastSyncError:snapshot.lastSyncError,lastSyncAttempt:snapshot.lastSyncAttempt}:{}),
    });
    // A deployment must retain every frozen local product image; never silently lose them.
    for(const file of new Set(snapshot.products.map(p=>p.imageLocal).filter(Boolean))) {
      await access(path.join(root,'public',file));
    }
  }
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(`BIO sync stopped: ${error.message}`);process.exitCode=1;});
