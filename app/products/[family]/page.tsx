import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../components/Chrome";
import { BaristaAccessories } from "../../components/BaristaAccessories";
import { ShowroomVisit } from "../../components/ShowroomVisit";
import { Crumbs, Stock } from "../../components/Bits";
import SkuImage from "../../components/SkuImage";
import { ResponsiveImage } from "../../components/ResponsiveImage";
import { FaqBlock } from "../../components/GuideBlocks";
import { familyQuestions } from "@/lib/model-faq";
import { itemList, jsonLd } from "@/lib/seo";
import { familySearchCopy, familyPriceDescription, machineOfferCatalog, modelSearchImage } from "@/lib/product-search";
import { casesForFamily } from "@/lib/cases";
import { CaseCard } from "../../cases/CaseCard";
import { stockSummary } from "@/lib/format";
import {
  families,
  familyBySlug,
  modelsOfFamily,
  skusOfModel,
  stockUnitsOfModel,
  money,
  kw,
  officialImageForFamily,
  architectureForModel,
} from "@/lib/catalog";

type Props = { params: Promise<{ family: string }> };

export function generateStaticParams() {
  return families.map((f) => ({ family: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { family } = await params;
  const f = familyBySlug(family);
  if (!f) return {};
  const entries = modelsOfFamily(family).flatMap((model) => skusOfModel(model.slug));
  return pageMetadata(`/products/${family}/`, {
    title: family === "d8" ? "Кофемашина Sanremo D8 и D8 PRO — цены и наличие" : family === "zoe" ? "Кофемашина Sanremo Zoe — Competition, Compact, SED, SAP: цены" : family === "cafe-racer" ? "Кофемашина Sanremo Café Racer (Cafe Racer) — цены и наличие" : `Кофемашина Sanremo ${f.name} — цены и наличие в России`,
    description: familyPriceDescription(f, entries),
  }, officialImageForFamily(f.slug) ?? undefined);
}

export default async function FamilyPage({ params }: Props) {
  const { family } = await params;
  const f = familyBySlug(family);
  if (!f) notFound();

  const fmodels = modelsOfFamily(family);
  const allSkus = fmodels.flatMap((m) => skusOfModel(m.slug));
  const colors = [...new Map(allSkus.filter((s) => s.color).map((s) => [s.color!, s.colorHex!])).entries()];
  const familyCases = casesForFamily(family);
  const familyFaq = familyQuestions(f, fmodels, allSkus);
  const searchCopy = familySearchCopy(f);
  const offerCatalog = machineOfferCatalog(`Кофемашины Sanremo ${f.name}: исполнения`, allSkus, f);


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
              <h1>Линейка Sanremo {f.name}{family === "d8" ? " и D8 PRO" : ""}</h1>
              <span className="plaque plaque-lg">{f.tagline}</span>
              <p className="lead">{searchCopy.intro}</p>
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
                <a className="btn" href={`/leasing/?model=${encodeURIComponent(f.name)}#leasing-request`}>Купить в лизинг</a>
              </div>
              <ul className="family-trust-details"><li>Гарантия 12 месяцев с даты продажи</li><li>Со склада в Москве или под заказ из Италии за 6–8 недель</li><li>Покупка в лизинг</li><li>Дилеры и сервис по всей России</li></ul>
            </div>
          </div>
        </section>

        <section className="wrap section-tight guide-decision">
          <div><p className="eyebrow">Для каких задач</p><h2>Кому подходит {f.name}</h2>
            <p>{f.scenarios.join(", ")}. Проверьте число групп, архитектуру и условия вашей площадки по выбранной версии.</p></div>
          <div><p className="eyebrow">Выбор исполнения</p><h2>Как выбрать {f.name}</h2>
            <p>{searchCopy.selection}</p><a href="/guide/linejki-sanremo/">Сравнить линейки →</a></div>
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
            {fmodels.map((m, index) => {
              const sk = skusOfModel(m.slug);
              const stockUnits = stockUnitsOfModel(m.slug);
              const hero = sk.find((s) => s.availability === "in_stock") ?? sk[0];
              return (
                <article className="card catalog-card" key={m.slug}>
                  <a className="card-visual catalog-card-visual" href={`/products/${family}/${m.slug}/`} aria-label={`Открыть ${m.name}`}>
                    <SkuImage src={modelSearchImage(m)} alt={`Sanremo ${m.name}`} groups={m.groupsAvailable[0]} color={hero?.colorHex} fit="cover" eager={index === 0} />
                  </a>
                  <div className="card-body">
                    <h3><a href={`/products/${family}/${m.slug}/`}>{m.name}</a></h3>
                    {m.version ? <p className="small" style={{ margin: 0 }}>Версия: {m.version}</p> : null}
                    <div className="chips catalog-card-tags">
                      <span className="tag">{m.groupsAvailable.join("/")} гр.</span>
                      {m.optionsAvailable.slice(0, 3).map((o) => <span className="tag" key={o}>{o}</span>)}
                    </div>
                    <div className="card-foot catalog-card-foot">
                      <p className="catalog-card-price"><span className="price-from">от</span> <span className="price num">{money(m.priceFrom)}</span></p>
                      <div className="catalog-card-availability">
                        <i className={`dot ${stockUnits >= 3 ? "st-in_stock" : stockUnits ? "st-limited" : "st-on_order"}`} aria-hidden="true" />
                        <span>{stockSummary(stockUnits)}</span>
                      </div>
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
                    <th>Бойлеры</th>
                    <th>Мощность</th>
                    <th>Напряжение</th>
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
                        <td>{s.boilerTotal ? `${s.boilerTotal}\u00a0л` : architectureForModel({ slug: s.model, family: s.family })}</td>
                        <td>{s.power ? `${kw(s.power)}\u00a0кВт` : "—"}</td>
                        <td>{s.voltage ? `${s.voltage}\u00a0В` : "—"}</td>
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

        <section className="wrap section-tight"><FaqBlock questions={familyFaq} title={`Частые вопросы о ${f.name}`} />
          <p><a href="/guide/">Как выбрать кофемашину →</a> · <a href="/faq/">Все вопросы о покупке и сервисе →</a></p>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(offerCatalog) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemList(`Модели Sanremo ${f.name}`, fmodels.map((model) => ({ name: `Sanremo ${model.name}`, path: `/products/${family}/${model.slug}/` })))) }} />
      </main>
      <ShowroomVisit />
      <BaristaAccessories />
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
