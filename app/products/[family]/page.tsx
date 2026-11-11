import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs, Stock } from "../../components/Bits";
import SkuImage from "../../components/SkuImage";
import { ResponsiveImage } from "../../components/ResponsiveImage";
import { FaqBlock } from "../../components/GuideBlocks";
import { familyQuestions } from "@/lib/model-faq";
import { itemList, jsonLd } from "@/lib/seo";
import { casesForFamily } from "@/lib/cases";
import { CaseCard } from "../../cases/CaseCard";
import {
  families,
  familyBySlug,
  modelsOfFamily,
  skusOfModel,
  stockUnitsOfModel,
  money,
  officialImageForFamily,
  officialImageForModel,
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
    title: `Sanremo ${f.name} — конфигурации, цвета, цены и наличие`,
    description: `Sanremo ${f.name}: модели и конфигурации каталога Sanremo. Сравните группы, исполнения, цены и наличие, затем найдите дилера и сервис в регионе.`,
  };
}

export default async function FamilyPage({ params }: Props) {
  const { family } = await params;
  const f = familyBySlug(family);
  if (!f) notFound();

  const fmodels = modelsOfFamily(family);
  const allSkus = fmodels.flatMap((m) => skusOfModel(m.slug));
  const colors = [...new Map(allSkus.filter((s) => s.color).map((s) => [s.color!, s.colorHex!])).entries()];
  const familyCases = casesForFamily(family);

  return (
    <>
      <Header active="/products" />
      <Crumbs
        items={[
          { href: "/", label: "Главная" },
          { href: "/products/", label: "Кофемашины" },
          { label: f.name },
        ]}
      />
      <main>
        {/* Первый экран семейства */}
        <section>
          <div className="module a">
            <div className="module-photo" style={{ minHeight: 420 }}>
              <ResponsiveImage src={officialImageForFamily(f.slug) ?? ""} alt={`Sanremo ${f.name}`} width={1536} height={864} priority sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="module-copy">
              <p className="eyebrow">Линейка · {f.architecture}</p>
              <h1>{f.name}</h1>
              <span className="plaque plaque-lg">{f.tagline}</span>
              <p className="lead">{f.territory}</p>
              <div className="chips" style={{ margin: "6px 0 20px" }}>
                {f.scenarios.map((s) => <span className="tag tag-solid" key={s}>{s}</span>)}
              </div>
              <div className="grid g3" style={{ gap: 14, marginBottom: 24 }}>
                <Fact k="Моделей" v={String(fmodels.length)} />
                <Fact k="Исполнений" v={String(allSkus.length)} />
                <Fact k="Цена от" v={money(Math.min(...fmodels.map((m) => m.priceFrom ?? Infinity)))} />
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btn btn-solid" href="/choose/">Подобрать версию</a>
                <a className="btn" href="/dealers/">Где купить</a>
              </div>
              <ul className="family-trust-details"><li>Гарантия 12 месяцев с даты продажи</li><li>Со склада в Москве или под заказ из Италии за 6–8 недель</li><li>Покупка в лизинг</li><li>Дилеры и сервис по всей России</li></ul>
            </div>
          </div>
        </section>

        <section className="wrap section-tight guide-decision">
          <div><p className="eyebrow">Для каких задач</p><h2>Кому подходит {f.name}</h2>
            <p>{f.scenarios.join(", ")}. Проверьте число групп, архитектуру и условия вашей площадки по выбранной версии.</p></div>
          <div><p className="eyebrow">Граница выбора</p><h2>Когда смотреть другую линейку</h2>
            <p>Если нужного числа групп нет среди версий {f.name} или мощность, напряжение и габариты исполнения не подходят площадке, сравните другие линейки Sanremo.</p><a href="/guide/linejki-sanremo/">Сравнить линейки →</a></div>
        </section>

        {/* Модели внутри семейства */}
        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Что доступно в России</p>
              <h2>Модели и версии</h2>
            </div>
            <p className="small" style={{ maxWidth: "56ch" }}>
              Показаны модели и исполнения, доступные для заказа в России.
              Актуальное наличие и сроки поставки указаны в карточках версий.
            </p>
          </div>
          <div className="grid g3">
            {fmodels.map((m) => {
              const sk = skusOfModel(m.slug);
              const stockUnits = stockUnitsOfModel(m.slug);
              const hero = sk.find((s) => s.availability === "in_stock") ?? sk[0];
              return (
                <article className="card" key={m.slug}>
                  <div className="card-visual">
                    <SkuImage src={officialImageForModel(m.slug)} alt={`Sanremo ${m.name}`} groups={m.groupsAvailable[0]} color={hero?.colorHex} label={m.name} />
                  </div>
                  <div className="card-body">
                    <h3><a href={`/products/${family}/${m.slug}/`}>{m.name}</a></h3>
                    {m.version ? <p className="small" style={{ margin: 0 }}>Версия: {m.version}</p> : null}
                    <div className="chips">
                      <span className="tag">{m.groupsAvailable.join("/")} гр.</span>
                      {m.optionsAvailable.slice(0, 3).map((o) => <span className="tag" key={o}>{o}</span>)}
                    </div>
                    <div className="card-foot">
                      <div>
                        <span className="price-from">Цена от</span>
                        <span className="price num">{money(m.priceFrom)}</span>
                      </div>
                      <span className="stock-label">
                        <i className={`dot ${stockUnits ? "st-in_stock" : "st-on_order"}`} />
                        {stockUnits ? `На складе в Москве${stockUnits >= 3 ? ` · ${stockUnits} шт.` : ""}` : "Под заказ"}
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
                <h2>Модель × группы × исполнение × цена</h2>
              </div>
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
                    <th className="num">Цена</th>
                    <th>Наличие</th>
                  </tr>
                </thead>
                <tbody>
                  {allSkus
                    .sort((a, b) => a.rrp - b.rrp)
                    .map((s) => (
                      <tr key={s.code}>
                        <td>
                          <a className="link-arrow" href={`/products/${family}/${s.model}/`} style={{ border: 0 }}>
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
                        <td className="num">{money(s.rrp)}</td>
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
              </div>
            )}
          </div>
        </section>

        {familyCases.length > 0 && <section className="wrap section family-cases">
          <div className="sec-head"><div><p className="eyebrow">Реальные проекты</p><h2>Где работает {f.name}</h2></div><p className="small">Фотографии кофеен, где модель указана в опубликованном проекте.</p></div>
          <div className="home-cases-grid">{familyCases.slice(0, 3).map((entry) => <CaseCard key={entry.slug} entry={entry} compact />)}</div>
          <p className="home-cases-more"><a href={`/cases/?model=${family}`}>Все проекты с {f.name} →</a></p>
        </section>}

        <section className="wrap section-tight"><FaqBlock questions={familyQuestions(f, fmodels, allSkus)} title={`Частые вопросы о ${f.name}`} />
          <p><a href="/guide/">Как выбрать кофемашину →</a> · <a href="/faq/">Все вопросы о покупке и сервисе →</a></p>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemList(`Модели Sanremo ${f.name}`, fmodels.map((model) => ({ name: `Sanremo ${model.name}`, path: `/products/${family}/${model.slug}/` })))) }} />
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
