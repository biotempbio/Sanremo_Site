import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import CatalogClient, { CatalogRow } from "./CatalogClient";
import {
  families,
  models,
  skusOfModel,
  familyBySlug,
  VOLUME_BANDS,
  PRICE_DATE,
  liveSkus,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог профессиональных кофемашин Sanremo — РРЦ и наличие в России",
  description:
    "Все модели Sanremo, доступные в России: количество групп, архитектура бойлеров, исполнения и цвета, рекомендованные розничные цены и складской статус. Фильтры по формату бизнеса и потоку.",
};

export default function ProductsPage() {
  const rows: CatalogRow[] = models.map((m) => {
    const f = familyBySlug(m.family)!;
    const sk = skusOfModel(m.slug);
    const heights = [...new Set(sk.map((s) => s.groupHeight).filter(Boolean))] as string[];
    const hero = sk.find((s) => s.availability === "in_stock") ?? sk[0];
    return {
      slug: m.slug,
      name: m.name,
      family: m.family,
      familyName: f.name,
      familyTagline: f.tagline,
      architecture: f.architecture,
      scenarios: f.scenarios,
      version: m.version,
      groups: m.groupsAvailable,
      heights,
      options: m.optionsAvailable,
      colors: m.colorsAvailable,
      priceFrom: m.priceFrom,
      priceTo: m.priceTo,
      inStockCount: m.inStockCount,
      skuCount: m.skuCount,
      heroColor: hero?.colorHex ?? "#1a1a1a",
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
      url: `https://sanremomachines.ru/products/${r.family}/${r.slug}`,
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
              <p className="eyebrow">Российская матрица · {liveSkus.length} конфигураций</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>
                Профессиональные рожковые кофемашины Sanremo
              </h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                {models.length} моделей в {families.length} семействах. Для каждой конфигурации —
                рекомендованная розничная цена, доступные исполнения и складской статус.
              </p>
              <p className="source-note">
                РРЦ и наличие — данные российского дистрибьютора BIO, обновлено {PRICE_DATE}. Сайт
                не является интернет-магазином: покупка через авторизованного дилера.
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
