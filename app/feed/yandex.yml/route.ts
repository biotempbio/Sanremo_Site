import { skuProductPath, skuSearchDescription } from "@/lib/product-search";
import { families, models, liveSkus, skuHeroMedia } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";
import { X_ONE_SHORT_DESCRIPTION, xOneEntries, xOneProductPath, xOneProductImage } from "@/lib/x-one";

export const dynamic = "force-static";

const xml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export function GET() {
  const categories = families.flatMap((family) => family.slug === "f18"
    ? [{ slug: "f18-sb", name: "F18 Single Boiler" }, { slug: "f18-mb", name: "F18 MB" }]
    : [{ slug: family.slug, name: family.name }]).map((category, index) => ({ ...category, id: index + 2 }));
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category.id]));
  const modelBySlug = new Map(models.map((model) => [model.slug, model]));
  const machineOffers = liveSkus.filter((sku) => !sku.markdown && sku.rrp > 0 && sku.model && categoryBySlug.has(sku.family === "f18" ? sku.model : sku.family)).map((sku) => {
    const model = modelBySlug.get(sku.model);
    const media = skuHeroMedia(sku);
    const image = media.exact && media.width >= 300 && media.height >= 400 ? media.image : null;
    // Current Yandex Search feed requirements: available=true and a usable exact photo.
    if (sku.availability === "reserved" || sku.free <= 0 || !image) return null;
    const name = `Кофемашина Sanremo ${model?.name ?? sku.model}${sku.groups ? `, ${sku.groups} гр.` : ""} — ${sku.title}`;
    return `      <offer id="${xml(sku.code)}" available="true">
        <url>${xml(absoluteUrl(skuProductPath(sku)))}</url>
        <price>${sku.rrp}</price><currencyId>RUR</currencyId>
        <categoryId>${categoryBySlug.get(sku.family === "f18" ? sku.model : sku.family)}</categoryId>
        ${image ? `<picture>${xml(absoluteUrl(image))}</picture>` : ""}
        <vendor>Sanremo</vendor><model>${xml(model?.name ?? sku.model)}</model>
        <name>${xml(name)}</name>
        <vendorCode>${xml(sku.vendorCode ?? sku.code)}</vendorCode>
        <description>${xml(skuSearchDescription(sku))}</description>
      </offer>`;
  });
  const grinderOffers = xOneEntries.filter((grinder) => grinder.rrp > 0).map((grinder) => {
    const image = xOneProductImage(grinder);
    const available = "inStock" in grinder && typeof grinder.inStock === "number" ? grinder.inStock > 0 : grinder.availability === "in_stock";
    if (!available || !image) return null;
    return `      <offer id="${xml(grinder.code)}" available="${"inStock" in grinder && typeof grinder.inStock === "number" ? grinder.inStock > 0 : grinder.availability === "in_stock"}">
        <url>${xml(absoluteUrl(xOneProductPath(grinder)))}</url>
        <price>${grinder.rrp}</price><currencyId>RUR</currencyId><categoryId>100</categoryId>
        ${image ? `<picture>${xml(absoluteUrl(image))}</picture>` : ""}
        <vendor>Sanremo</vendor><model>X-One</model><name>${xml(grinder.name)}</name>
        <vendorCode>${xml(grinder.code)}</vendorCode>
        <description>${xml(X_ONE_SHORT_DESCRIPTION)}</description>
      </offer>`;
  });
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${new Date().toISOString()}">
  <shop>
    <name>Sanremo в России</name><company>ООО «КОМПАНИЯ БИО»</company><url>${xml(absoluteUrl("/"))}</url>
    <currencies><currency id="RUR" rate="1"/></currencies>
    <categories>
      <category id="1">Кофемашины</category>
${categories.map((category) => `      <category id="${category.id}" parentId="1">${xml(category.name)}</category>`).join("\n")}
      <category id="100">Кофемолки</category>
    </categories>
    <offers>
${[...machineOffers, ...grinderOffers].filter(Boolean).join("\n")}
    </offers>
  </shop>
</yml_catalog>`;
  return new Response(feed, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
