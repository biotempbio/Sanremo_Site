import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import CatalogClient, { CatalogRow } from "./CatalogClient";
import {
  catalogModels,
  CATALOG_LINEUP,
  skusOfModel,
  familyBySlug,
  VOLUME_BANDS,
} from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Каталог профессиональных кофемашин Sanremo — РРЦ и наличие в России",
  description:
    "Все модели Sanremo, доступные в России: количество групп, архитектура бойлеров, исполнения и цвета, рекомендованные розничные цены и складской статус. Фильтры по формату бизнеса и потоку.",
};

export default function ProductsPage() {
  const rows: CatalogRow[] = catalogModels.map((m) => {
    const f = familyBySlug(m.family)!;
    const sk = skusOfModel(m.slug);
    const stocked = sk.filter((s) => s.free > 0);
    const stockUnits = stocked.reduce((sum, s) => sum + s.free, 0);
    const stockExecutions = new Set(
      stocked.map((s) => [s.groups, s.color ?? "", s.edition ?? ""].join("|"))
    ).size;
    const stockColors = [...new Map(
      stocked.filter((s) => s.color && s.colorHex).map((s) => [s.color!, { name: s.color!, hex: s.colorHex! }])
    ).values()];
    const heights = [...new Set(sk.map((s) => s.groupHeight).filter(Boolean))] as string[];
    const line = CATALOG_LINEUP.find((item) => item.slug === m.slug)!;
    return {
      slug: m.slug,
      name: line.label,
      family: m.family,
      familyName: f.name,
      familyTagline: f.tagline,
      architecture: f.architecture,
      scenarios: f.scenarios,
      version: m.version,
      groups: m.groupsAvailable,
      heights,
      options: m.optionsAvailable,
      colors: stockColors,
      priceFrom: m.priceFrom,
      priceTo: m.priceTo,
      inStockCount: m.inStockCount,
      stockUnits,
      stockExecutions,
      skuCount: m.skuCount,
      heroColor: "#1a1a1a",
      heroImage: line.image,
      volumeBands: VOLUME_BANDS.filter((b) => b.models.includes(m.slug)).map((b) => b.id),
    };
  });

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Профессиональные кофемашины Sanremo в России",
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Sanremo ${r.name}`,
      url: new URL(`products/${r.family}/${r.slug}/`, siteUrl).toString(),
    })),
  };

  return (
    <>
      <Header active="/products" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "Кофемашины" }]} />
      <main>
        <section className="wrap" style={{ paddingBottom: 34 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Официальная линейка Sanremo в России</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>
                Профессиональные рожковые кофемашины Sanremo
              </h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Шесть основных линеек. Для каждой конфигурации —
                рекомендованная розничная цена, доступные исполнения и складской статус.
              </p>
            </div>
          </div>
        </section>
        <section className="wrap section-tight">
          <CatalogClient rows={rows} bands={VOLUME_BANDS.map((b) => ({ id: b.id, label: b.label }))} />
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      </main>
      <Footer />
    </>
  );
}
