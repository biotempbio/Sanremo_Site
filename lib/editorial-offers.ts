import { modelBySlug, modelPath, skusOfModel, skuHeroMedia, type Sku } from "./catalog";

export function compareEditorialSkus(a: Sku, b: Sku) {
  return Number(b.free > 0) - Number(a.free > 0)
    || a.rrp - b.rrp || b.free - a.free || a.code.localeCompare(b.code);
}

/** Business comparisons start with two groups; single-group selections are explicit. */
export function editorialOffer(slug: string, groups = 2) {
  const model = modelBySlug(slug);
  if (!model) return null;
  const sku = skusOfModel(slug)
    .filter((item) => item.groups === groups && item.rrp > 0)
    .sort(compareEditorialSkus)[0];
  if (!sku) return null;
  const media = skuHeroMedia(sku);
  const image = media.exact || sku.imagePeerGroups === groups ? media.image : null;
  return { model, sku, image, href: `${modelPath(model)}?sku=${encodeURIComponent(sku.code)}&groups=${groups}` };
}
