import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs, Stock } from "../../components/Bits";
import SkuImage from "../../components/SkuImage";
import {
  families,
  familyBySlug,
  modelsOfFamily,
  skusOfModel,
  analogsFor,
  PRICE_DATE,
  money,
  imgUrl,
} from "@/lib/catalog";

type Props = { params: Promise<{ family: string }> };

export function generateStaticParams() {
  return families.map((f) => ({ family: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { family } = await params;
  const f = familyBySlug(family);
  if (!f) return {};
  return {
    title: `Sanremo ${f.name} — конфигурации, цвета, РРЦ и наличие`,
    description: `${f.name}: ${f.tagline}. Доступные в России модели, группы, исполнения и цвета, рекомендованные розничные цены и складской статус. Данные дистрибьютора BIO.`,
  };
}

export default async function FamilyPage({ params }: Props) {
  const { family } = await params;
  const f = familyBySlug(family);
  if (!f) notFound();

  const fmodels = modelsOfFamily(family);
  const allSkus = fmodels.flatMap((m) => skusOfModel(m.slug));
  const colors = [...new Map(allSkus.filter((s) => s.color).map((s) => [s.color!, s.colorHex!])).entries()];
  const rivals = [...new Set(fmodels.flatMap((m) => analogsFor(m.name).map((a) => `${a.brand} ${a.model}`)))];

  return (
    <>
      <Header active="/products" />
      <Crumbs
        items={[
          { href: "/", label: "Главная" },
          { href: "/products", label: "Кофемашины" },
          { label: f.name },
        ]}
      />
      <main>
        {/* Первый экран семейства */}
        <section>
          <div className="module a">
            <div className="module-photo" style={{ minHeight: 420 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.photo} alt={`Sanremo ${f.name}`} />
            </div>
            <div className="module-copy">
              <p className="eyebrow">Семейство · {f.architecture}</p>
              <h1>{f.name}</h1>
              <span className="plaque plaque-lg">{f.tagline}</span>
              <p className="lead">{f.territory}</p>
              <div className="chips" style={{ margin: "6px 0 20px" }}>
                {f.scenarios.map((s) => <span className="tag tag-solid" key={s}>{s}</span>)}
              </div>
              <div className="grid g3" style={{ gap: 14, marginBottom: 24 }}>
                <Fact k="Моделей" v={String(fmodels.length)} />
                <Fact k="Конфигураций" v={String(allSkus.length)} />
                <Fact k="РРЦ от" v={money(Math.min(...fmodels.map((m) => m.priceFrom ?? Infinity)))} />
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btn btn-solid" href="/choose">Подобрать конфигурацию</a>
                <a className="btn" href="/dealers">Где купить</a>
              </div>
            </div>
          </div>
        </section>

        {/* Модели внутри семейства */}
        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Что доступно в России</p>
              <h2>Модели и версии</h2>
            </div>
            <p className="small" style={{ maxWidth: "56ch" }}>
              Показана реально поддерживаемая матрица BIO, а не маркетинговая линейка
              производителя целиком. Позиции без российских поставок в каталоге не публикуются.
            </p>
          </div>
          <div className="grid g3">
            {fmodels.map((m) => {
              const sk = skusOfModel(m.slug);
              const hero = sk.find((s) => s.availability === "in_stock") ?? sk[0];
              return (
                <article className="card" key={m.slug}>
                  <div className="card-visual">
                    <SkuImage src={imgUrl(hero?.image)} alt={`Sanremo ${m.name}`} groups={m.groupsAvailable[0]} color={hero?.colorHex} label={m.name} />
                  </div>
                  <div className="card-body">
                    <h3><a href={`/products/${family}/${m.slug}`}>{m.name}</a></h3>
                    {m.version ? <p className="small" style={{ margin: 0 }}>Версия: {m.version}</p> : null}
                    <div className="chips">
                      <span className="tag">{m.groupsAvailable.join("/")} гр.</span>
                      {m.optionsAvailable.slice(0, 3).map((o) => <span className="tag" key={o}>{o}</span>)}
                    </div>
                    <div className="card-foot">
                      <div>
                        <span className="price-from">РРЦ от</span>
                        <span className="price num">{money(m.priceFrom)}</span>
                      </div>
                      <span className="stock-label">
                        <i className={`dot ${m.inStockCount ? "st-in_stock" : "st-on_order"}`} />
                        {m.inStockCount ? `${m.inStockCount} со склада` : "Под заказ"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Матрица конфигураций */}
        <section className="section bg-gray">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Матрица</p>
                <h2>Модель × группы × исполнение × РРЦ</h2>
              </div>
              <p className="source-note" style={{ maxWidth: "56ch" }}>
                Источник: файл ассортимента и прайс РРЦ компании BIO, обновлён {PRICE_DATE}.
                Точное количество на складе и срок поставки подтверждает менеджер.
              </p>
            </div>
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    <th>Модель</th>
                    <th className="num">Групп</th>
                    <th>Высота групп</th>
                    <th>Исполнение / цвет</th>
                    <th>Опции</th>
                    <th className="num">РРЦ</th>
                    <th>Наличие</th>
                  </tr>
                </thead>
                <tbody>
                  {allSkus
                    .sort((a, b) => a.rrp - b.rrp)
                    .map((s) => (
                      <tr key={s.code}>
                        <td>
                          <a className="link-arrow" href={`/products/${family}/${s.model}`} style={{ border: 0 }}>
                            {s.modelName}
                          </a>
                          <div className="tiny sku">{s.vendorCode ?? s.code}</div>
                        </td>
                        <td className="num">{s.groups ?? "—"}</td>
                        <td>{s.groupHeight ?? "—"}</td>
                        <td>
                          <span className="swatches">
                            {s.colorHex ? <i className="swatch" style={{ background: s.colorHex }} /> : null}
                            {s.color ?? "—"}
                          </span>
                          {s.edition && s.edition !== "Base" ? <div className="tiny">{s.edition}</div> : null}
                        </td>
                        <td className="tiny">{s.options.length ? s.options.join(", ") : "—"}</td>
                        <td className="num">{s.rrp.toLocaleString("ru-RU")} ₽</td>
                        <td><Stock status={s.availability} free={s.free} /></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {colors.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h4 style={{ marginBottom: 12 }}>Исполнения и цвета в российском ассортименте</h4>
                <div className="chips">
                  {colors.map(([name, hex]) => (
                    <span className="tag" key={name}>
                      <i className="swatch" style={{ background: hex, marginRight: 7, verticalAlign: "-3px" }} />
                      {name}
                    </span>
                  ))}
                </div>
                <p className="source-note" style={{ marginTop: 10 }}>
                  Фотография каждого публикуемого цвета подключается из медиабиблиотеки Sanremo/BIO.
                  Подменять реальное исполнение рендером другого SKU запрещено (ТЗ §8.1).
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Конкурентное окружение */}
        {rivals.length > 0 && (
          <section className="section wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Прямое окружение</p>
                <h2>С чем сравнивают {f.name}</h2>
              </div>
              <p className="small" style={{ maxWidth: "56ch" }}>
                Сопоставляем архитектуру, функции, комплектность и цену сопоставимых исполнений —
                без утверждений об абсолютном превосходстве.
              </p>
            </div>
            <div className="chips">
              {rivals.slice(0, 14).map((r) => <span className="tag" key={r}>{r}</span>)}
            </div>
            <p style={{ marginTop: 20 }}>
              <a className="btn" href={`/compare#${family}`}>Детальное сравнение</a>
            </p>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 10 }}>
      <span className="tiny" style={{ textTransform: "uppercase", letterSpacing: ".1em" }}>{k}</span>
      <b className="num" style={{ display: "block", fontFamily: "var(--sans)", fontSize: 19 }}>{v}</b>
    </div>
  );
}
