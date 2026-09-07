import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../../components/Chrome";
import { Crumbs, Stock } from "../../../components/Bits";
import ConfigPicker, { PickerSku } from "./ConfigPicker";
import { ResponsiveImage } from "../../../components/ResponsiveImage";
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
  PRICE_VALID_UNTIL,
  money,
  moneyPrecise,
  kw,
  officialImageForModel,
  catalogModels,
} from "@/lib/catalog";

type Props = { params: Promise<{ family: string; model: string }> };

export function generateStaticParams() {
  return models.map((m) => ({ family: m.family, model: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await params;
  const m = modelBySlug(model);
  if (!m) return {};
  const f = familyBySlug(m.family)!;
  return {
    title: `Sanremo ${m.name} — характеристики, РРЦ ${money(m.priceFrom)}, наличие`,
    description: `Sanremo ${m.name}: ${f.tagline}. Полная спецификация, доступные в России исполнения и цвета, рекомендованная розничная цена, наличие, документы, запчасти и дилеры.`,
  };
}

/** Ключевые пункты из описания производителя. */
function bullets(text: string): string[] {
  return text
    .split(/\n|(?=•)/)
    .map((l) => l.replace(/^[\s•\-–—\t]+/, "").trim())
    .filter((l) => l.length > 24 && l.length < 240)
    .slice(0, 8);
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
  const feats = bullets(m.description);
  const cities = dealerCities().slice(0, 8);
  const currentLineSlug = m.family === "d8" ? "d8" : m.family === "zoe" ? "zoe-competition" : m.slug;

  const pickerSkus: PickerSku[] = sk.map((s) => ({
    code: s.code, vendorCode: s.vendorCode, title: s.title, groups: s.groups,
    groupHeight: s.groupHeight, color: s.color, colorHex: s.colorHex, edition: s.edition,
    options: s.options, rrp: s.rrp, availability: s.availability, free: s.free,
    power: s.power, voltage: s.voltage, image: officialImageForModel(m.slug),
  }));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Sanremo ${m.name}`,
    brand: { "@type": "Brand", name: "Sanremo" },
    category: "Профессиональные рожковые кофемашины",
    description: m.description.slice(0, 400),
    offers: sk.map((s) => ({
      "@type": "Offer",
      sku: s.vendorCode ?? s.code,
      name: s.title,
      price: s.rrp,
      priceCurrency: "RUB",
      priceValidUntil: PRICE_VALID_UNTIL,
      availability:
        s.availability === "in_stock" || s.availability === "limited"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: "BIO — официальный дистрибьютор Sanremo в России" },
    })),
  };

  return (
    <>
      <Header active="/products" />
      <Crumbs
        items={[
          { href: "/", label: "Главная" },
          { href: "/products", label: "Кофемашины" },
          ...(f.name !== m.name ? [{ href: `/products/${family}`, label: f.name }] : []),
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
                <h2>Сценарии, в которых {m.name} — рациональный выбор</h2>
              </div>
            </div>
            <div className="grid g3">
              {f.scenarios.map((s) => (
                <div className="card" key={s}>
                  <div className="card-body">
                    <h3>{s}</h3>
                    <p className="small" style={{ margin: 0 }}>
                      {m.groupsAvailable.join("/")} группы · {f.architecture}.
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
                  <Spec k="Общий объём бойлеров" v={hero?.boilerTotal ? `${hero.boilerTotal} л` : null} />
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
                  <Spec k="Мощность" v={hero?.power ? `${kw(hero.power)} кВт` : null} />
                  <Spec k="Напряжение" v={hero?.voltage ? `${hero.voltage} В` : null} />
                  <Spec k="Подключение к воде" v="Требуется, с подготовкой и фильтрацией" />
                </SpecGroup>
                <SpecGroup title="Габариты и масса">
                  <Spec k="Ширина" v={hero?.sizeNet ? `${hero.sizeNet.w} мм` : null} />
                  <Spec k="Высота" v={hero?.sizeNet ? `${hero.sizeNet.h} мм` : null} />
                  <Spec k="Глубина" v={hero?.sizeNet ? `${hero.sizeNet.d} мм` : null} />
                  <Spec k="Масса нетто" v={hero?.weightNet ? `${hero.weightNet} кг` : null} />
                </SpecGroup>
                <SpecGroup title="Коммерческие данные">
                  <Spec k="Конфигураций в РФ" v={String(m.skuCount)} />
                  <Spec k="РРЦ" v={`${money(m.priceFrom)} — ${money(m.priceTo)}`} />
                  <Spec k="Дата актуальности РРЦ" v={PRICE_DATE} />
                  <Spec k="Владелец данных" v="Компания BIO" />
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
              <h2>SKU, исполнение, РРЦ и наличие</h2>
            </div>
            <p className="small" style={{ maxWidth: "54ch" }}>Доступные исполнения, рекомендованные цены и складской статус.</p>
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
                  <th className="num">РРЦ</th>
                  <th>Наличие</th>
                </tr>
              </thead>
              <tbody>
                {sk.sort((a, b) => a.rrp - b.rrp).map((s) => (
                  <tr key={s.code}>
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
                    <td className="num">{s.rrp.toLocaleString("ru-RU")} ₽</td>
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
                    <CmpRow label="РРЦ от" a={money(m.priceFrom)} rest={siblings.map((s) => money(s.priceFrom))} />
                    <CmpRow label="На складе в Москве" a={String(m.inStockCount)} rest={siblings.map((s) => String(s.inStockCount))} />
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
                      <th className="num">РРЦ</th>
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
        {m.docs.length > 0 && (
          <section className="section wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Документы</p>
                <h2>Инструкции, схемы и спецификации</h2>
              </div>
            </div>
            <div className="card"><div className="card-body"><span className="tag" style={{ alignSelf: "flex-start" }}>{m.docs.length} документов</span><h3 style={{ fontSize: 17 }}>Документация для {m.name}</h3><p className="small">Инструкции и схемы предоставляются по запросу, пока медиабиблиотека проходит проверку ссылок.</p><a className="link-arrow" href={`/contacts/?model=${encodeURIComponent(m.name)}`}>Запросить документ →</a></div></div>
          </section>
        )}

        {/* 7.2.11 — FAQ + дилеры */}
        <section className="section bg-petrol">
          <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "clamp(24px,4vw,64px)" }}>
            <div>
              <p className="eyebrow">Частые вопросы</p>
              <h2 style={{ marginBottom: 24 }}>О покупке и эксплуатации {m.name}</h2>
              {[
                ["Можно ли купить машину на сайте?",
                 "Нет. Сайт публикует рекомендованную розничную цену и наличие, а продажу, монтаж и обслуживание выполняет авторизованный дилер или отдел продаж BIO."],
                ["Что означает статус наличия?",
                 "«На складе в Москве» — позиция доступна к отгрузке, «Ограниченное количество» — остаток меньше трёх единиц, «Под заказ» — поставка формируется партией."],
                ["Отличается ли комплектация от европейской?",
                 "Публикуются только конфигурации, поддерживаемые российским дистрибьютором: сочетание групп, высоты, опций и цвета из матрицы BIO."],
                ["Как обстоит дело с запчастями?",
                 `Каталог ЗИП открыт без авторизации: артикул, узел, совместимость и складской статус. Для ${m.name} в базе связано ${Math.max(modelParts.length, partCodes.length)} артикулов.`],
              ].map(([q, a]) => (
                <details key={q} style={{ borderTop: "1px solid var(--line-strong)", padding: "14px 0" }}>
                  <summary style={{ cursor: "pointer", fontFamily: "var(--sans)", fontWeight: 600, fontSize: 15.5 }}>{q}</summary>
                  <p className="small" style={{ margin: "10px 0 0" }}>{a}</p>
                </details>
              ))}
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
                        <span className="price-from">РРЦ от</span>
                        <span className="price num" style={{ fontSize: 19 }}>{money(x.priceFrom)}</span>
                      </div>
                      <span className="link-arrow">Открыть →</span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
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
