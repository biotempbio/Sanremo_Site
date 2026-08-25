import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../../components/Chrome";
import { Crumbs, Stock } from "../../../components/Bits";
import ConfigPicker, { PickerSku } from "./ConfigPicker";
import {
  models,
  modelBySlug,
  modelsOfFamily,
  familyBySlug,
  skusOfModel,
  analogsFor,
  partsForSku,
  dealerCities,
  VOLUME_BANDS,
  PRICE_DATE,
  money,
  moneyPrecise,
  kw,
  imgUrl,
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
    description: `Sanremo ${m.name}: ${f.tagline}. Полная спецификация, доступные в России исполнения и цвета, рекомендованная розничная цена, складской статус, документы, запчастии и дилеры.`,
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
  const rivals = analogsFor(m.name);
  const bands = VOLUME_BANDS.filter((b) => b.models.includes(m.slug));
  const partCodes = [...new Set(sk.flatMap((s) => s.spareParts))];
  const modelParts = [...new Map(sk.flatMap((s) => partsForSku(s.code)).map((p) => [p.code, p])).values()];
  const feats = bullets(m.description);
  const cities = dealerCities().slice(0, 8);

  const pickerSkus: PickerSku[] = sk.map((s) => ({
    code: s.code, vendorCode: s.vendorCode, title: s.title, groups: s.groups,
    groupHeight: s.groupHeight, color: s.color, colorHex: s.colorHex, edition: s.edition,
    options: s.options, rrp: s.rrp, availability: s.availability, free: s.free,
    power: s.power, voltage: s.voltage, image: imgUrl(s.image),
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
              <p className="small" style={{ maxWidth: "54ch" }}>
                Сценарии и диапазоны нагрузки — редакционная рекомендация BIO, а не паспортная
                производительность производителя.
              </p>
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
                    <h3 style={{ color: "#fff" }}>Ориентир по потоку</h3>
                    <div className="chips">
                      {bands.map((b) => (
                        <span className="tag" key={b.id} style={{ background: "transparent", color: "#fff", borderColor: "#5a5854" }}>
                          {b.label}
                        </span>
                      ))}
                    </div>
                    <p className="tiny" style={{ color: "#b9b6b1", margin: 0 }}>
                      Зависит от меню, пиковой нагрузки, числа бариста, воды и кофемолок.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="notice calm" style={{ marginTop: 24 }}>
              <b>Ограничения.</b> Проверьте ширину рабочей зоны ({hero?.sizeNet ? `${hero.sizeNet.w} мм` : "см. габариты"}),
              допустимую мощность и фазность ({hero?.power ? `${kw(hero.power)} кВт` : "см. таблицу"},{" "}
              {hero?.voltage ? `${hero.voltage} В` : "напряжение уточняется"}), подготовку воды и слив.
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
              <p className="source-note" style={{ maxWidth: "54ch" }}>
                Формулировки функций — по данным производителя (эксплуатационная документация
                Sanremo). Числовые заявления производителя не пересчитываются и не усиливаются.
              </p>
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
              <p className="source-note" style={{ maxWidth: "54ch" }}>
                Единый справочник полей и единиц измерения для всех моделей и конкурентов. Пустые
                поля не выводятся. Источник: выгрузка BIO и документация Sanremo, проверено {PRICE_DATE}.
              </p>
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
            <p className="small" style={{ maxWidth: "54ch" }}>
              Публичный статус наличия. Точное количество раскрывается по правилу публикации BIO;
              срок поставки подтверждает менеджер или дилер.
            </p>
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
                    <CmpRow label="Со склада" a={String(m.inStockCount)} rest={siblings.map((s) => String(s.inStockCount))} />
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

        {/* 7.2.7 — прямые аналоги */}
        {rivals.length > 0 && (
          <section className="section wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Прямые аналоги рынка</p>
                <h2>С чем реально сравнивают {m.name}</h2>
              </div>
              <p className="source-note" style={{ maxWidth: "54ch" }}>
                Цены конкурентов — публичные РРЦ, собранные в мастер-каталоге российского рынка;
                перед публикацией каждая позиция перепроверяется. Сравнивать следует сопоставимые
                исполнения, а не семейства целиком.
              </p>
            </div>
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    <th>Бренд</th>
                    <th>Модель</th>
                    <th>Сегмент</th>
                    <th>Бойлерная система</th>
                    <th className="num">РРЦ конкурента</th>
                    <th className="num">Разница к Sanremo</th>
                  </tr>
                </thead>
                <tbody>
                  {rivals.slice(0, 12).map((a, i) => {
                    const d = a.priceRival && a.priceSanremo ? a.priceRival - a.priceSanremo : null;
                    return (
                      <tr key={i}>
                        <td><b style={{ fontFamily: "var(--sans)" }}>{a.brand}</b></td>
                        <td>{a.model}{a.note ? <div className="tiny">{a.note}</div> : null}</td>
                        <td className="tiny">{a.segment}</td>
                        <td className="tiny">{a.boiler}</td>
                        <td className="num">{a.priceRival ? `${a.priceRival.toLocaleString("ru-RU")} ₽` : "—"}</td>
                        <td className="num" style={{ color: d === null ? undefined : d > 0 ? "var(--ok)" : "var(--amber)" }}>
                          {d === null ? "—" : `${d > 0 ? "+" : "−"}${Math.abs(d).toLocaleString("ru-RU")} ₽`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 18 }}>
              <a className="btn" href="/compare">Детальные сравнения с методикой</a>
            </p>
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
              <p className="small" style={{ maxWidth: "54ch" }}>
                Совместимость подтверждена связями «запчасть ↔ конфигурация» в базе BIO.
                Артикулов, связанных с этой моделью: <b>{Math.max(modelParts.length, partCodes.length)}</b>.
              </p>
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
              <a className="btn" href={`/parts?model=${m.slug}`}>Все запчасти модели</a>
              <a className="btn" href="/service">Сервисное обращение</a>
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
              <p className="source-note" style={{ maxWidth: "54ch" }}>
                Ключевые факты дублируются в тексте страницы и не спрятаны только в PDF (ТЗ §17.3).
              </p>
            </div>
            <div className="grid g3">
              {m.docs.map((d) => (
                <div className="card" key={d.ref}>
                  <div className="card-body">
                    <span className="tag" style={{ alignSelf: "flex-start" }}>{d.type}</span>
                    <h3 style={{ fontSize: 15, lineHeight: 1.35 }}>{d.name}</h3>
                    <a className="link-arrow" style={{ marginTop: "auto" }} href={`/documents#${d.ref}`}>
                      Открыть документ
                    </a>
                  </div>
                </div>
              ))}
            </div>
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
                 "«На складе» — позиция доступна к отгрузке, «Ограниченное количество» — остаток меньше трёх единиц, «Под заказ» — поставка формируется партией. Точное количество и срок подтверждает менеджер."],
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
                  <a className="tag" key={c.city} href={`/dealers?city=${encodeURIComponent(c.city)}`} style={{ textDecoration: "none" }}>
                    {c.city} · {c.count}
                  </a>
                ))}
              </div>
              <a className="btn btn-block btn-solid" style={{ marginTop: 20 }} href="/dealers">Все дилеры</a>
            </div>
          </div>
        </section>

        {/* 7.2.12 — другие подходящие модели */}
        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Рядом по задаче</p>
              <h2>Другие подходящие модели</h2>
            </div>
            <p className="small" style={{ maxWidth: "54ch" }}>
              Подборка по сценарию и диапазону нагрузки, а не случайная карусель каталога.
            </p>
          </div>
          <div className="grid g4">
            {models
              .filter((x) => x.slug !== m.slug)
              .map((x) => ({
                x,
                score:
                  VOLUME_BANDS.filter((b) => b.models.includes(x.slug) && b.models.includes(m.slug)).length * 2 +
                  (familyBySlug(x.family)!.scenarios.filter((s) => f.scenarios.includes(s)).length),
              }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 4)
              .map(({ x }) => (
                <article className="card" key={x.slug}>
                  <div className="card-body">
                    <p className="eyebrow" style={{ margin: 0 }}>{familyBySlug(x.family)!.name}</p>
                    <h3><a href={`/products/${x.family}/${x.slug}`}>{x.name}</a></h3>
                    <p className="small" style={{ margin: 0 }}>{familyBySlug(x.family)!.tagline}</p>
                    <div className="card-foot">
                      <div>
                        <span className="price-from">РРЦ от</span>
                        <span className="price num" style={{ fontSize: 19 }}>{money(x.priceFrom)}</span>
                      </div>
                      <span className="link-arrow">Открыть модель</span>
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
          <td key={i}><a className="link-arrow" href={`/products/${linkFamily}/${r}`}>Открыть модель</a></td>
        ) : (
          <td key={i}>{r}</td>
        )
      )}
    </tr>
  );
}
