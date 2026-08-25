import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { analogs, models, modelBySlug, familyBySlug, money, modelPath, PRICE_DATE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Сравнения: Sanremo и конкуренты на российском рынке",
  description:
    "Честные сравнения профессиональных кофемашин: D8 и Appia Life, Café Racer и Linea PB, F18 и White Eagle T3, Zoe и Classe 5. Архитектура, комплектность, РРЦ и сценарии применения.",
};

/** Обязательные сравнения первого релиза (ТЗ §10.1). */
const PAIRS = [
  { id: "d8", sanremo: "D8", brand: "Nuova Simonelli", model: "Appia Life",
    verdict: "Appia Life — самая распространённая машина у российских дилеров и понятный HX-стандарт. D8 отвечает не ценой, а платформой: контроль температуры на уровне группы, модульность и широкая матрица исполнений в том же ценовом диапазоне." },
  { id: "cafe-racer", sanremo: "Café Racer", brand: "La Marzocco", model: "Linea PB",
    verdict: "Linea PB — отраслевой стандарт specialty с сильнейшей сервисной репутацией. Café Racer конкурирует рабочей эргономикой, регулируемой высотой групп и тем, что машина одновременно формирует визуальный образ точки." },
  { id: "f18", sanremo: "F18", brand: "Victoria Arduino", model: "White Eagle T3",
    verdict: "White Eagle T3 известна заявленной температурной стабильностью T3. F18 в мультибойлерном исполнении отвечает независимостью систем и более рациональной ценой сопоставимой конфигурации." },
  { id: "zoe", sanremo: "Zoe", brand: "Rancilio", model: "Classe 5",
    verdict: "Classe 5 — одна из самых доступных машин «больших» брендов. Zoe стоит дороже базовой Classe 5, но в исполнении Competition даёт более высокие группы и оснащение, ближе к следующему сегменту." },
];

export default function ComparePage() {
  return (
    <>
      <Header active="/compare" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "Сравнить" }]} />
      <main>
        <section className="wrap" style={{ paddingBottom: 30 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Сравнение без лозунгов</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>Sanremo и конкуренты</h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Мы не объявляем Sanremo «лучшей вообще». Задача сравнения — ответить на реальный
                вопрос покупателя: какая архитектура и комплектация рациональнее в его сценарии и
                бюджете.
              </p>
              <p className="source-note">
                Методика: сопоставляются конкретные конфигурации на 2 группы, а не семейства
                целиком. Цены — публичные РРЦ российского рынка, собранные в мастер-каталоге и
                перепроверенные перед публикацией; данные Sanremo — прайс BIO от {PRICE_DATE}.
                Фиктивные тесты, неподтверждённый ресурс и отзывы не публикуются.
              </p>
            </div>
          </div>
        </section>

        {PAIRS.map((p, i) => {
          const rows = analogs.filter(
            (a) => a.sanremo.toLowerCase() === p.sanremo.toLowerCase()
          );
          const direct = rows.find((a) => a.brand === p.brand && a.model.startsWith(p.model));
          const ourModels = models.filter((m) => familyBySlug(m.family)?.name === p.sanremo || m.name === p.sanremo);
          const our = ourModels[0] ?? modelBySlug(p.id);
          return (
            <section key={p.id} id={p.id} className={i % 2 ? "bg-gray" : ""} style={{ scrollMarginTop: 90 }}>
              <div className="wrap section">
                <div className="sec-head">
                  <div>
                    <p className="eyebrow">Сравнение {String(i + 1).padStart(2, "0")}</p>
                    <h2>
                      Sanremo {p.sanremo} <span style={{ color: "var(--muted)" }}>или</span> {p.brand} {p.model}
                    </h2>
                  </div>
                  <p className="lead">{p.verdict}</p>
                </div>

                <div className="table-scroll" style={{ marginBottom: 22 }}>
                  <table className="data">
                    <thead>
                      <tr>
                        <th>Параметр</th>
                        <th>Sanremo {p.sanremo}</th>
                        <th>{p.brand} {p.model}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ color: "var(--muted)" }}>Сегмент</td>
                        <td>{direct?.segment ?? "—"}</td>
                        <td>{direct?.segment ?? "—"}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "var(--muted)" }}>Бойлерная система</td>
                        <td>{ourModels[0] ? familyBySlug(ourModels[0].family)!.architecture : "—"}</td>
                        <td>{direct?.boiler ?? "—"}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "var(--muted)" }}>Групп в сравниваемой конфигурации</td>
                        <td className="num">{direct?.groups ?? 2}</td>
                        <td className="num">{direct?.groups ?? 2}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "var(--muted)" }}>РРЦ, ₽</td>
                        <td className="num"><b>{direct?.priceSanremo ? direct.priceSanremo.toLocaleString("ru-RU") : money(our?.priceFrom ?? null)}</b></td>
                        <td className="num">{direct?.priceRival ? direct.priceRival.toLocaleString("ru-RU") : "—"}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "var(--muted)" }}>Российская доступность</td>
                        <td>
                          Официальная дистрибуция BIO, склад в России
                          {our?.inStockCount ? `, ${our.inStockCount} конфигураций со склада` : ""}
                        </td>
                        <td>{direct?.note ?? "По данным дилеров рынка"}</td>
                      </tr>
                      <tr>
                        <td style={{ color: "var(--muted)" }}>Запчасти и сервис</td>
                        <td>Открытый каталог ЗИП с совместимостью и складским статусом</td>
                        <td>Уточняется у дистрибьютора бренда</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {rows.length > 1 && (
                  <>
                    <h3 style={{ marginBottom: 14 }}>Всё прямое окружение {p.sanremo}</h3>
                    <div className="table-scroll">
                      <table className="data">
                        <thead>
                          <tr>
                            <th>Бренд</th>
                            <th>Модель</th>
                            <th>Тип соответствия</th>
                            <th>Бойлерная система</th>
                            <th className="num">РРЦ, ₽</th>
                            <th className="num">Разница</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((a, n) => {
                            const d = a.priceRival && a.priceSanremo ? a.priceRival - a.priceSanremo : null;
                            return (
                              <tr key={n}>
                                <td><b style={{ fontFamily: "var(--sans)" }}>{a.brand}</b></td>
                                <td>{a.model}{a.note ? <div className="tiny">{a.note}</div> : null}</td>
                                <td className="tiny">{a.matchType}</td>
                                <td className="tiny">{a.boiler}</td>
                                <td className="num">{a.priceRival?.toLocaleString("ru-RU") ?? "—"}</td>
                                <td className="num" style={{ color: d === null ? undefined : d > 0 ? "var(--ok)" : "var(--amber)" }}>
                                  {d === null ? "—" : `${d > 0 ? "+" : "−"}${Math.abs(d).toLocaleString("ru-RU")}`}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="grid g2" style={{ marginTop: 24 }}>
                  <div className="notice calm">
                    <b>Кому Sanremo подойдёт лучше.</b> Тем, кто хочет получить нужную архитектуру и
                    оснащение в более рациональном бюджете, ценит выбор исполнений и планирует
                    обслуживание через официальный склад запчастей в России.
                  </div>
                  <div className="notice">
                    <b>Когда конкурент рациональнее.</b> Если в вашем городе уже стоит сервисная
                    инфраструктура конкурента, персонал обучен на его интерфейсе, а стандарт сети
                    закреплён — смена платформы может стоить дороже разницы в цене машины.
                  </div>
                </div>

                {our && (
                  <p style={{ marginTop: 20 }}>
                    <a className="btn" href={modelPath(our)}>Карточка Sanremo {our.name}</a>
                  </p>
                )}
              </div>
            </section>
          );
        })}

        <section className="section wrap">
          <div className="notice calm">
            <b>Что мы не публикуем.</b> Сравнительные утверждения о ресурсе, скорости или качестве
            чашки без указанного источника и методики; отзывы и «тесты», которые невозможно
            проверить; цены конкурентов без даты, конфигурации и источника.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
