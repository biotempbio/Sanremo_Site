import { liveSkus, skuHeroMedia } from './catalog';
import { skuProductPath } from './product-search';
import { xOneEntries, xOneProductPath, xOneProductImage } from './x-one';
export type ShopProduct = { code:string; article:string; name:string; price:number; free:number; url:string; image:string|null };
export function shopProducts(): ShopProduct[] {
  return [...liveSkus.filter(s=>s.rrp>0).map(s=>({code:s.code,article:s.vendorCode||s.code,name:`Sanremo ${s.modelName} · ${s.groups ?? ''} гр. · ${[s.color,s.edition && s.edition!=='Base'?s.edition:null].filter(Boolean).join(' · ')}`,price:s.rrp,free:s.free,url:skuProductPath(s),image:skuHeroMedia(s).exact?skuHeroMedia(s).image:null})),...xOneEntries.filter(s=>s.rrp>0).map(s=>({code:s.code,article:s.code,name:s.name,price:s.rrp,free:'inStock' in s?Number(s.inStock):0,url:xOneProductPath(s),image:xOneProductImage(s)}))];
}
