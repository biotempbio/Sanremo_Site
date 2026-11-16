import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { Crumbs } from "../components/Bits";
import CatalogClient, { CatalogRow } from "./CatalogClient";
import { pluralize } from "@/lib/format";
import { xOneVariants, xOneHasPrice, xOnePriceFrom, xOneStockLabel } from "@/lib/x-one";
import { itemList, jsonLd } from "@/lib/seo";
import {
  catalogModels,
  CATALOG_LINEUP,
  skus,
  money,
  skusOfModel,
  stockUnitsOfModel,
  architectureForModel,
  familyBySlug,
  VOLUME_BANDS,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Купить кофемашину Sanremo — все модели, цены и наличие",
  description:
    "Каталог рожковых кофемашин Sanremo: Zoe, D8, F18, Café Racer, YOU, Opera — от одной до трёх групп. Сравните цены, наличие и характеристики исполнений.",
};

export default function ProductsPage() {
  const currentPrices = skus.map((sku) => sku.rrp).filter((price) => price > 0);
  const minPrice = Math.min(...currentPrices);
  const maxPrice = Math.max(...currentPrices);
  const rows: CatalogRow[] = catalogModels.map((m) => {
    const f = familyBySlug(m.family)!;
    const sk = skusOfModel(m.slug);
    const stocked = sk.filter((s) => s.free > 0);
    const stockUnits = stockUnitsOfModel(m.slug);
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
      architecture: architectureForModel(m),
      scenarios: f.scenarios,
      version: m.version,
      groups: m.groupsAvailable,
      heights,
      options: m.optionsAvailable,
      colors: stockColors,
      priceFrom: m.priceFrom,
      priceTo: m.priceTo,
      stockUnits,
      stockExecutions,
      skuCount: m.skuCount,
      heroColor: "#1a1a1a",
      heroImage: line.image,
      volumeBands: VOLUME_BANDS.filter((b) => b.models.includes(m.slug)).map((b) => b.id),
    };
  });
  const listSchema = itemList("Профессиональные кофемашины и кофемолки Sanremo в России", [
    ...rows.map((row) => ({ name: `Кофемашина Sanremo ${row.name}`, path: row.href ?? `/products/${row.family}/${row.slug}/` })),
    { name: "Кофемолка Sanremo X-One", path: "/products/x-one/" },
  ]);

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
                Кофемашины Sanremo: все модели
              </h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                {CATALOG_LINEUP.length} {pluralize(CATALOG_LINEUP.length, "профессиональная линейка", "профессиональные линейки", "профессиональных линеек")} Sanremo (Сан Ремо). Цены на кофемашины — от {money(minPrice)} до {money(maxPrice)}.
              </p>
              <p className="small" style={{ maxWidth: "62ch", margin: 0 }}>
                На страницах моделей указаны группы, бойлеры, мощность и наличие каждого исполнения. Гарантия — 12 месяцев с даты продажи. Машины со склада в Москве доступны к отгрузке; поставка из Италии под заказ занимает 6–8 недель. Дилеры и сервисные партнёры работают по всей России.
              </p>
            </div>
          </div>
        </section>
        <section className="wrap section-tight">
          <CatalogClient rows={rows} bands={VOLUME_BANDS.map((b) => ({ id: b.id, label: b.label }))} />
        </section>
        <section className="wrap section-tight catalog-xone" aria-labelledby="catalog-xone-title"><div className="catalog-xone-visual"><a href="/products/x-one/"><ResponsiveImage src="/photo/official/x-one.webp" alt="Кофемолка Sanremo X-One" width={1536} height={864} sizes="(max-width: 800px) 100vw, 45vw" /></a></div><div className="catalog-xone-copy"><p className="eyebrow">Кофемолки</p><h2 id="catalog-xone-title">Кофемолка к вашей кофемашине</h2><p><strong>X-One</strong> работает с тремя сортами зерна: два основных бункера по 1,2 кг и фронтальный для разовой порции. Зерно взвешивается до помола.</p><div className="catalog-xone-variants">{xOneVariants.map((variant) => <span key={variant.color}>{variant.color} · {xOneStockLabel(variant)}</span>)}</div><p className="catalog-xone-price">{xOneHasPrice ? `от ${money(xOnePriceFrom)}` : "Цена по запросу"}</p><a className="btn btn-solid" href="/products/x-one/">Смотреть X-One</a></div></section>
        <section className="wrap section-tight"><div className="callout"><h2 style={{ fontSize: 28 }}>С чего начать выбор?</h2><p>Сравните рабочий поток, группы, бойлеры и условия подключения. В гиде эти вопросы разобраны на примере актуальных линеек Sanremo.</p><a href="/guide/kofemashina-dlya-kofejni/">Гид для кофейни →</a> · <a href="/guide/kofemashina-dlya-restorana/">Гид для ресторана →</a> · <a href="/guide/linejki-sanremo/">Сравнение линеек →</a><p style={{marginTop:16,marginBottom:0}}><a href="/solutions/kofejnya/">Кофейня</a> · <a href="/solutions/professionalnye-kofemashiny/">Профессиональные машины</a> · <a href="/solutions/restoran/">Ресторан</a> · <a href="/leasing/">Лизинг</a></p></div></section>
        <section className="wrap section-tight" aria-labelledby="discontinued-models">
          <div className="callout">
            <h2 id="discontinued-models" style={{ fontSize: "clamp(24px,2.4vw,34px)", marginBottom: 12 }}>Модели, снятые с поставки</h2>
            <p style={{ margin: 0 }}><a href="/products/napoli/">Napoli</a>, <a href="/products/cube/">Cube</a>, <a href="/products/verona/">Verona</a>, <a href="/products/verona-rs/">Verona RS</a>, <a href="/products/torino/">Torino</a>, <a href="/products/capri/">Capri</a>. На архивных страницах — сервис, поиск запчастей и подбор актуальной замены.</p>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(listSchema) }} />
      </main>
      <Footer />
    </>
  );
}
