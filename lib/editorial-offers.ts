import { modelBySlug, modelPath, skusOfModel, skuHeroMedia } from "./catalog";

/** Business comparisons start with two groups; single-group selections are explicit. */
export function editorialOffer(slug: string, groups = 2) {
  const model = modelBySlug(slug);
  if (!model) return null;
  const sku = skusOfModel(slug)
    .filter((item) => item.groups === groups && item.rrp > 0)
    .sort((a, b) => a.rrp - b.rrp || b.free - a.free || a.code.localeCompare(b.code))[0];
  if (!sku) return null;
  const media = skuHeroMedia(sku);
  const image = media.exact || sku.imagePeerGroups === groups ? media.image : null;
  return { model, sku, image, href: `${modelPath(model)}?sku=${encodeURIComponent(sku.code)}&groups=${groups}` };
}
