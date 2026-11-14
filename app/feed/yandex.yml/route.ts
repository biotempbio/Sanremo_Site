import { families, grinders, imgUrl, models, skus } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const xml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export function GET() {
  const categories = families.map((family, index) => ({ id: index + 2, slug: family.slug, name: family.name }));
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category.id]));
  const modelBySlug = new Map(models.map((model) => [model.slug, model]));
  const machineOffers = skus.filter((sku) => sku.rrp > 0 && sku.model && categoryBySlug.has(sku.family)).map((sku) => {
    const model = modelBySlug.get(sku.model);
    const image = imgUrl(sku.image);
    const name = `Кофемашина Sanremo ${model?.name ?? sku.model}${sku.groups ? `, ${sku.groups} гр.` : ""} — ${sku.title}`;
    return `      <offer id="${xml(sku.code)}" available="${sku.free > 0}">
        <url>${xml(absoluteUrl(`/products/${sku.family}/${sku.model}/#sku-${encodeURIComponent(sku.code)}`))}</url>
        <price>${sku.rrp}</price><currencyId>RUB</currencyId>
        <categoryId>${categoryBySlug.get(sku.family)}</categoryId>
        ${image ? `<picture>${xml(image)}</picture>` : ""}
        <vendor>Sanremo</vendor><model>${xml(model?.name ?? sku.model)}</model>
        <name>${xml(name)}</name>
        <vendorCode>${xml(sku.vendorCode ?? sku.code)}</vendorCode>
        <description>${xml(sku.description || model?.description || `Профессиональная кофемашина Sanremo ${model?.name ?? sku.model}.`)}</description>
      </offer>`;
  });
  const grinderOffers = grinders.filter((grinder) => grinder.rrp > 0).map((grinder) => {
    const image = imgUrl(grinder.image);
    return `      <offer id="${xml(grinder.code)}" available="${"inStock" in grinder && typeof grinder.inStock === "number" ? grinder.inStock > 0 : grinder.availability === "in_stock"}">
        <url>${xml(absoluteUrl("/products/x-one/"))}</url>
        <price>${grinder.rrp}</price><currencyId>RUB</currencyId><categoryId>100</categoryId>
        ${image ? `<picture>${xml(image)}</picture>` : ""}
        <vendor>Sanremo</vendor><model>X-One</model><name>${xml(grinder.name)}</name>
        <vendorCode>${xml(grinder.code)}</vendorCode>
        <description>${xml(grinder.description || "Профессиональная кофемолка Sanremo X-One.")}</description>
      </offer>`;
  });
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${new Date().toISOString()}">
  <shop>
    <name>Sanremo в России</name><company>BIO</company><url>${xml(absoluteUrl("/"))}</url>
    <currencies><currency id="RUB" rate="1"/></currencies>
    <categories>
      <category id="1">Кофемашины</category>
${categories.map((category) => `      <category id="${category.id}" parentId="1">${xml(category.name)}</category>`).join("\n")}
      <category id="100">Кофемолки</category>
    </categories>
    <offers>
${[...machineOffers, ...grinderOffers].join("\n")}
    </offers>
  </shop>
</yml_catalog>`;
  return new Response(feed, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
