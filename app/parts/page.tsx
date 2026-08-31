import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import PartsClient, { PartRow } from "./PartsClient";
import { parts, partNodes, catalogModels, CATALOG_LINEUP, skuByCode } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Запчасти Sanremo — каталог ЗИП с совместимостью и наличием",
  description:
    "Каталог запасных частей Sanremo в России: поиск по артикулу, названию, модели и узлу, подтверждённая совместимость, рекомендованная цена и складской статус. Поиск открыт без авторизации.",
};

type Props = { searchParams: Promise<{ model?: string; q?: string }> };

export default async function PartsPage({ searchParams }: Props) {
  const { model } = await searchParams;

  const rows: PartRow[] = parts.map((p) => {
    const linked = p.fits.map((c) => skuByCode(c)).filter(Boolean);
    const names = [...new Set(linked.map((s) => s!.modelName))];
    const slugs = [...new Set(linked.map((s) => s!.model))];
    return {
      code: p.code,
      article: p.article,
      name: p.name,
      node: p.node,
      rrp: p.rrp,
      stock: p.stock,
      availability: p.availability,
      models: names,
      modelSlugs: slugs,
    };
  });

  return (
    <>
      <Header active="/service" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { href: "/service", label: "Сервис" }, { label: "Запчасти" }]} />
      <main>
        <section className="wrap" style={{ paddingBottom: 26 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Каталог ЗИП · {rows.length} артикулов</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>Запчасти Sanremo</h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Поиск по артикулу, названию, модели и узлу. В каталоге показаны только запчасти,
                доступные на складе в Москве.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap section-tight">
          <PartsClient
            parts={rows}
            nodes={partNodes()}
            models={catalogModels.map((m) => ({
              slug: m.slug,
              name: CATALOG_LINEUP.find((line) => line.slug === m.slug)?.label ?? m.name,
            }))}
            initialModel={model}
          />
        </section>

        <section className="section bg-gray">
          <div className="wrap">
            <div className="grid g3">
              <div>
                <p className="eyebrow">Как получить</p>
                <h3>Через дилера или напрямую</h3>
                <p className="small">
                  Запрос можно направить авторизованному дилеру своего региона или в BIO. При
                  оформлении указываются способ доставки и регион.
                </p>
              </div>
              <div>
                <p className="eyebrow">Совместимость</p>
                <h3>Схемы и серийные диапазоны</h3>
                <p className="small">
                  Навигация «модель → узел → деталь» и взрыв-схемы из эксплуатационной документации.
                  Совместимость проверяется по модели, конфигурации и серийному диапазону.
                </p>
              </div>
              <div>
                <p className="eyebrow">Не нашли деталь</p>
                <h3>Подберём по серийному номеру</h3>
                <p className="small">
                  Пришлите модель, серийный номер, город и фото узла — специалист подберёт артикул
                  или актуальную замену.
                </p>
                <a className="btn btn-sm" href="/service" style={{ marginTop: 8 }}>Сервисное обращение</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
