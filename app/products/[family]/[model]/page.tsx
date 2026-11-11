import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../../components/Chrome";
import { Crumbs, Stock } from "../../../components/Bits";
import ConfigPicker, { PickerSku } from "./ConfigPicker";
import { ResponsiveImage } from "../../../components/ResponsiveImage";
import { modelQuestions } from "@/lib/model-faq";
import { documentsForModel, fileSizeMb } from "@/lib/documents";
import { absoluteUrl, faqSchema, jsonLd } from "@/lib/seo";
import {
  models,
  modelBySlug,
  modelsOfFamily,
  familyBySlug,
  skusOfModel,
  partsForSku,
  dealerCities,
  VOLUME_BANDS,
  PRICE_DATE,
  money,
  moneyPrecise,
  kw,
  officialImageForModel,
  catalogModels,
  stockUnitsOfModel,
} from "@/lib/catalog";

type Props = { params: Promise<{ family: string; model: string }> };

export function generateStaticParams() {
  return models.map((m) => ({ family: m.family, model: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params;
  const m = modelBySlug(model);
  if (!m) return {};
  return {
    title: `Sanremo ${m.name} — характеристики, цена и наличие`,
    description: `Sanremo ${m.name}: характеристики и конфигурации в России. Группы, цвет, цена и наличие по артикулу; контакты дилеров, сервис и запчасти.`,
  };
}

export default async function ModelPage({ params }: Props) {
  const { family, model } = await params;
  const m = modelBySlug(model);
  if (!m || m.family !== family) notFound();
  const f = familyBySlug(family)!;

  const sk = skusOfModel(m.slug);
  const hero = sk.find((s) => s.code === m.heroSku) ?? sk[0];
  const siblings = modelsOfFamily(family).filter((x) => x.slug !== m.slug);
  const bands = VOLUME_BANDS.filter((b) => b.models.includes(m.slug));
  const partCodes = [...new Set(sk.flatMap((s) => s.spareParts))];
  const modelParts = [...new Map(sk.flatMap((s) => partsForSku(s.code)).map((p) => [p.code, p])).values()];
  const feats = [
    m.groupsAvailable.length ? `Исполнения с ${m.groupsAvailable.join(" / ")} группами — выбирайте число рабочих мест под пиковую нагрузку.` : null,
    hero?.boilerTotal ? `Общий объем бойлеров — ${hero.boilerTotal}\u00a0л для выбранной конфигурации.` : null,
    hero?.control ? `Управление: ${hero.control}.` : null,
    m.optionsAvailable.length ? `Доступные опции: ${m.optionsAvailable.join(", ")}.` : null,
    m.family === "d8" && m.slug === "d8-pro" ? "Версия PRO позволяет отдельно настраивать температуру групп." : null,
  ].filter((item): item is string => Boolean(item));
  const cities = dealerCities().slice(0, 8);
  const currentLineSlug = m.family === "d8" ? "d8" : m.family === "zoe" ? "zoe-competition" : m.slug;
  const questions = modelQuestions(m, f);
  const modelDocuments = documentsForModel(m.slug);
  const unavailableGroups = [1, 2, 3].filter((group) => !m.groupsAvailable.includes(group));

  const pickerSkus: PickerSku[] = sk.map((s) => ({
    code: s.code, vendorCode: s.vendorCode, title: s.title, groups: s.groups,
    groupHeight: s.groupHeight, color: s.color, colorHex: s.colorHex, edition: s.edition,
    options: s.options, rrp: s.rrp, availability: s.availability, free: s.free,
    power: s.power, voltage: s.voltage, image: officialImageForModel(m.slug),
  }));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: `Sanremo ${m.name}`,
    brand: { "@type": "Brand", name: "Sanremo" },
    category: "Профессиональные рожковые кофемашины",
    description: `Sanremo ${m.name}: ${f.architecture}. Доступные конфигурации, характеристики и цены в России.`,
    image: officialImageForModel(m.slug) ? absoluteUrl(officialImageForModel(m.slug)!) : undefined,
    url: absoluteUrl(`/products/${family}/${m.slug}/`),
    productGroupID: m.slug,
    variesBy: ["https://schema.org/color", "https://schema.org/size"],
    hasVariant: sk.map((s) => ({
      "@type": "Product", name: `Sanremo ${m.name} — ${s.title}`,
      sku: s.vendorCode ?? s.code,
      brand: { "@type": "Brand", name: "Sanremo" },
      image: officialImageForModel(m.slug) ? absoluteUrl(officialImageForModel(m.slug)!) : undefined,
      color: s.color ?? undefined,
      url: absoluteUrl(`/products/${family}/${m.slug}/#sku-${encodeURIComponent(s.code)}`),
      offers: { "@type": "Offer", price: s.rrp, priceCurrency: "RUB",
        availability: s.availability === "in_stock" || s.availability === "limited" ? "https://schema.org/InStock" : s.availability === "reserved" ? "https://schema.org/OutOfStock" : "https://schema.org/PreOrder",
        seller: { "@type": "Organization", name: "BIO", url: absoluteUrl("/") },
      },
    })),
  };

  return (
    <>
      <Header active="/products" />
      <Crumbs
        items={[
          { href: "/", label: "Главная" },
          { href: "/products/", label: "Кофемашины" },
          ...(f.name !== m.name ? [{ href: `/products/${family}/`, label: f.name }] : []),
          { label: m.name },
        ]}
      />
      <main>
        {/* 7.1 — первый экран */}
        <section className="wrap" style={{ paddingBottom: "clamp(34px,4vw,64px)" }}>
          <div style={{ maxWidth: "72ch", marginBottom: 28 }}>
            <p className="eyebrow">{f.name} · {f.architecture}</p>
            <h1 style={{ fontSize: "clamp(34px,4vw,62px)" }}>Sanremo {m.name}</h1>
            <p className="lead" style={{ marginTop: 14 }}>{f.territory}</p>
          </div>
          <ConfigPicker skus={pickerSkus} modelName={m.name} priceDate={PRICE_DATE} />
        </section>

        {/* 7.2.1 — кому подходит */}
        <section className="section bg-sage">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Кому подходит</p>
              <h2>Где {m.name} подходит по формату и нагрузке</h2>
              </div>
            </div>
            <div className="grid g3">
              {f.scenarios.map((s) => (
                <div className="card" key={s}>
                  <div className="card-body">
                    <h3>{s}</h3>
                    <p className="small" style={{ margin: 0 }}>
                      Доступные группы: {m.groupsAvailable.join(" / ")} · {f.architecture}.
                      {m.optionsAvailable.length ? ` Опции: ${m.optionsAvailable.join(", ")}.` : " Базовая комплектация."}
                    </p>
                  </div>
                </div>
              ))}
              {bands.length > 0 && (
                <div className="card" style={{ background: "var(--ink)", color: "#fff", borderColor: "var(--ink)" }}>
                  <div className="card-body">
                    <h3 style={{ color: "#fff" }}>Рабочий поток</h3>
                    <div className="chips">
                      {bands.map((b) => (
                        <span className="tag" key={b.id} style={{ background: "transparent", color: "#fff", borderColor: "#5a5854" }}>
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="callout" style={{ marginTop: 26 }}><h3>Когда {m.name} не подходит</h3>
              <p>{unavailableGroups.length ? `Нет исполнения с ${unavailableGroups.join(" / ")} группами. ` : ""}Если параметры питания или габариты выбранного артикула не соответствуют площадке, сравните другие модели.</p>
              <a href="/guide/linejki-sanremo/">Сравнить линейки Sanremo →</a>
            </div>
          </div>
        </section>

        {/* 7.2.2 — ключевые функции */}
        {feats.length > 0 && (
          <section className="section wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Ключевые функции</p>
                <h2>Что это даёт в смене</h2>
              </div>
            </div>
            <div className="grid g2">
              {feats.map((b, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                  <span className="num" style={{ fontFamily: "var(--sans)", fontWeight: 700, color: "var(--muted)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{ margin: 0, fontSize: 15 }}>{b}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7.2.3 — полная техническая таблица */}
        <section className="section bg-gray">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Спецификация</p>
                <h2>Технические характеристики</h2>
              </div>
            </div>
            <div className="grid g2" style={{ alignItems: "start" }}>
              <div>
                <SpecGroup title="Архитектура и гидравлика">
                  <Spec k="Семейство" v={f.name} />
                  <Spec k="Версия" v={m.version} />
                  <Spec k="Архитектура бойлеров" v={f.architecture} />
                  <Spec k="Общий объем бойлеров" v={hero?.boilerTotal ? `${hero.boilerTotal}\u00a0л` : null} />
                  <Spec k="Количество групп" v={m.groupsAvailable.join(" / ")} />
                  <Spec k="Посадка (высота) группы" v={hero?.seat} />
                </SpecGroup>
                <SpecGroup title="Управление и эксплуатация">
                  <Spec k="Тип управления" v={hero?.control} />
                  <Spec k="Подсветка" v={hero?.lighting} />
                  <Spec k="Экономайзер" v={hero?.economizer} />
                  <Spec k="Доступные опции" v={m.optionsAvailable.join(", ") || null} />
                </SpecGroup>
              </div>
              <div>
                <SpecGroup title="Подключение">
                  <Spec k="Мощность" v={hero?.power ? `${kw(hero.power)}\u00a0кВт` : null} />
                  <Spec k="Напряжение" v={hero?.voltage ? `${hero.voltage}\u00a0В` : null} />
                </SpecGroup>
                <SpecGroup title="Габариты и масса">
                  <Spec k="Ширина" v={hero?.sizeNet ? `${hero.sizeNet.w}\u00a0мм` : null} />
                  <Spec k="Высота" v={hero?.sizeNet ? `${hero.sizeNet.h}\u00a0мм` : null} />
                  <Spec k="Глубина" v={hero?.sizeNet ? `${hero.sizeNet.d}\u00a0мм` : null} />
                  <Spec k="Масса нетто" v={hero?.weightNet ? `${hero.weightNet}\u00a0кг` : null} />
                </SpecGroup>
                <SpecGroup title="Цены и наличие">
                  <Spec k="Конфигураций в РФ" v={String(m.skuCount)} />
                  <Spec k="Цена" v={`${money(m.priceFrom)} — ${money(m.priceTo)}`} />
                  <Spec k="Цены и наличие на" v={PRICE_DATE} />
                </SpecGroup>
              </div>
            </div>
          </div>
        </section>

        {/* 7.2.4 — российские конфигурации */}
        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Российские конфигурации</p>
              <h2>Исполнение, цена и наличие</h2>
            </div>
            <p className="small" style={{ maxWidth: "54ch" }}>Доступные исполнения, цены и наличие.</p>
          </div>
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th>Артикул</th>
                  <th className="num">Групп</th>
                  <th>Высота</th>
                  <th>Исполнение / цвет</th>
                  <th>Опции</th>
                  <th className="num">Цена</th>
                  <th>Наличие</th>
                </tr>
              </thead>
              <tbody>
                  {sk.sort((a, b) => a.rrp - b.rrp).map((s) => (
                  <tr key={s.code} id={`sku-${s.code}`}>
                    <td className="tiny sku">{s.vendorCode ?? s.code}</td>
                    <td className="num">{s.groups ?? "—"}</td>
                    <td>{s.groupHeight ?? "—"}</td>
                    <td>
                      <span className="swatches">
                        {s.colorHex ? <i className="swatch" style={{ background: s.colorHex }} /> : null}
                        {s.color ?? "—"}
                      </span>
                    </td>
                    <td className="tiny">{s.options.join(", ") || "—"}</td>
                    <td className="num">{money(s.rrp)}</td>
                    <td><Stock status={s.availability} free={s.free} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7.2.6 — сравнение версий в семействе */}
        {siblings.length > 0 && (
          <section className="section bg-cream">
            <div className="wrap">
              <div className="sec-head">
                <div>
                  <p className="eyebrow">Внутри семейства</p>
                  <h2>{m.name} и другие версии {f.name}</h2>
                </div>
                <p className="small" style={{ maxWidth: "54ch" }}>
                  Сравниваем конкретные исполнения и объясняем, за какие функции есть смысл
                  доплачивать именно в вашем сценарии.
                </p>
              </div>
              <div className="table-scroll">
                <table className="data">
                  <thead>
                    <tr>
                      <th>Параметр</th>
                      <th>{m.name}</th>
                      {siblings.map((s) => <th key={s.slug}>{s.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <CmpRow label="Версия" a={m.version ?? "—"} rest={siblings.map((s) => s.version ?? "—")} />
                    <CmpRow label="Групп" a={m.groupsAvailable.join(" / ")} rest={siblings.map((s) => s.groupsAvailable.join(" / "))} />
                    <CmpRow label="Конфигураций в РФ" a={String(m.skuCount)} rest={siblings.map((s) => String(s.skuCount))} />
                    <CmpRow label="Опции" a={m.optionsAvailable.join(", ") || "—"} rest={siblings.map((s) => s.optionsAvailable.join(", ") || "—")} />
                    <CmpRow label="Цена от" a={money(m.priceFrom)} rest={siblings.map((s) => money(s.priceFrom))} />
                    <CmpRow label="На складе в Москве" a={String(stockUnitsOfModel(m.slug))} rest={siblings.map((s) => String(stockUnitsOfModel(s.slug)))} />
                    <CmpRow
                      label="Карточка"
                      a="—"
                      rest={siblings.map((s) => s.slug)}
                      linkFamily={family}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 7.2.8 — сервис и запчасти */}
        <section className="section bg-gray">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Владение</p>
                <h2>Сервис, расходники и запчасти для {m.name}</h2>
              </div>
              <p className="small" style={{ maxWidth: "54ch" }}>Запчастей для модели: <b>{Math.max(modelParts.length, partCodes.length)}</b>.</p>
            </div>
            {modelParts.length > 0 ? (
              <div className="table-scroll">
                <table className="data">
                  <thead>
                    <tr>
                      <th>Артикул</th>
                      <th>Наименование</th>
                      <th>Узел</th>
                      <th className="num">Цена</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelParts.slice(0, 10).map((p) => (
                      <tr key={p.code}>
                        <td className="tiny sku">{p.article ?? p.code}</td>
                        <td>{p.name}</td>
                        <td className="tiny">{p.node}</td>
                        <td className="num">{moneyPrecise(p.rrp)}</td>
                        <td><Stock status={p.availability} free={p.stock} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty">
                <p className="small" style={{ margin: 0 }}>
                  Связи запчастей для этой конфигурации ещё импортируются. Поиск по артикулу и узлу
                  доступен в общем каталоге ЗИП.
                </p>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
              <a className="btn" href={`/parts/?model=${m.slug}`}>Все запчасти модели</a>
              <a className="btn" href="/service/">Сервисное обращение</a>
            </div>
          </div>
        </section>

        {/* 7.2.10 — документы */}
        {modelDocuments.length > 0 && (
          <section className="section wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Документы</p>
                <h2>Инструкции, схемы и декларации</h2>
              </div>
              <p className="lead">Файлы для {m.name} можно скачать без запроса и регистрации.</p>
            </div>
            <ul className="model-documents">{modelDocuments.map((document) => <li key={document.id}>
              <span><b>{document.name}</b><small>{document.type}</small></span>
              <a className="link-arrow" href={document.href} download>Скачать PDF · {fileSizeMb(document.bytes)}</a>
            </li>)}</ul>
            <p style={{ marginTop: 20 }}><a href={`/documents/?model=${m.slug}`}>Все документы для {m.name} →</a></p>
          </section>
        )}

        {/* 7.2.11 — FAQ + дилеры */}
        <section className="section bg-petrol">
          <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "clamp(24px,4vw,64px)" }}>
            <div>
              <p className="eyebrow">Частые вопросы</p>
              <h2 style={{ marginBottom: 24 }}>О покупке и эксплуатации {m.name}</h2>
              {questions.map(({ question, answer }) => (
                <details key={question} style={{ borderTop: "1px solid var(--line-strong)", padding: "14px 0" }}>
                  <summary style={{ cursor: "pointer", fontFamily: "var(--sans)", fontWeight: 600, fontSize: 15.5 }}>{question}</summary>
                  <p className="small" style={{ margin: "10px 0 0" }}>{answer}</p>
                </details>
              ))}
              <p style={{ marginTop: 20 }}><a href="/faq/">Все вопросы о покупке и сервисе →</a></p>
            </div>
            <div>
              <p className="eyebrow">Где купить</p>
              <h3 style={{ marginBottom: 16 }}>Дилеры и сервис в вашем регионе</h3>
              <div className="chips">
                {cities.map((c) => (
                  <a className="tag" key={c.city} href={`/dealers/?city=${encodeURIComponent(c.city)}`} style={{ textDecoration: "none" }}>
                    {c.city} · {c.count}
                  </a>
                ))}
              </div>
              <a className="btn btn-block btn-solid" style={{ marginTop: 20 }} href="/dealers/">Все дилеры</a>
            </div>
          </div>
        </section>

        {/* 7.2.12 — весь модельный ряд */}
        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Каталог Sanremo</p>
              <h2>Весь модельный ряд Sanremo</h2>
            </div>
            <p className="small" style={{ maxWidth: "54ch" }}>
              Остальные шесть линеек бренда — от рациональной базы до флагманских инструментов
              контроля и профилирования.
            </p>
          </div>
          <div className="grid g3">
            {catalogModels
              .filter((x) => x.slug !== currentLineSlug)
              .map((x) => (
                <article className="card" key={x.slug}>
                  <div className="card-media">
                    <ResponsiveImage src={officialImageForModel(x.slug)!} alt={`Sanremo ${x.name}`} width={1536} height={864} sizes="(max-width: 620px) 100vw, 33vw" />
                  </div>
                  <div className="card-body">
                    <p className="eyebrow" style={{ margin: 0 }}>{familyBySlug(x.family)!.name}</p>
                    <h3><a href={`/products/${x.family}/${x.slug}/`}>{x.name}</a></h3>
                    <p className="small" style={{ margin: 0 }}>{familyBySlug(x.family)!.tagline}</p>
                    <div className="card-foot">
                      <div>
                        <span className="price-from">Цена от</span>
                        <span className="price num" style={{ fontSize: 19 }}>{money(x.priceFrom)}</span>
                      </div>
                      <span className="link-arrow">Открыть →</span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(questions)) }} />
      </main>
      <Footer />
    </>
  );
}

function SpecGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="spec-group">
      <h4>{title}</h4>
      <dl style={{ margin: 0 }}>{children}</dl>
    </section>
  );
}

function Spec({ k, v }: { k: string; v: string | null | undefined }) {
  if (!v) return null;
  return (
    <div className="spec-row">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function CmpRow({
  label, a, rest, linkFamily,
}: { label: string; a: string; rest: string[]; linkFamily?: string }) {
  return (
    <tr>
      <td style={{ color: "var(--muted)" }}>{label}</td>
      <td><b>{a}</b></td>
      {rest.map((r, i) =>
        linkFamily ? (
          <td key={i}><a className="link-arrow" href={`/products/${linkFamily}/${r}/`}>Открыть →</a></td>
        ) : (
          <td key={i}>{r}</td>
        )
      )}
    </tr>
  );
}
