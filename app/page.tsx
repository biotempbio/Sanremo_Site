import { Header, Footer } from "./components/Chrome";
import { Price, Stock } from "./components/Bits";
import {
  families,
  familyPriceFrom,
  familyStockCount,
  liveSkus,
  models,
  modelsOfFamily,
  modelBySlug,
  modelPath,
  chains,
  dealerCities,
  parts,
  SCENARIOS,
  VOLUME_BANDS,
  PRICE_DATE,
} from "@/lib/catalog";

export default function Home() {
  const cities = dealerCities();
  const inStock = liveSkus.filter((s) => s.availability === "in_stock" || s.availability === "limited");
  const ladder = ["zoe", "d8", "f18", "cafe-racer", "opera"];

  return (
    <>
      <Header active="/" />
      <main>
        {/* ── 1. Первый экран ─────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photo/machine-marble.webp" alt="Профессиональная кофемашина Sanremo" />
            <div className="hero-shade" />
          </div>
          <div className="wrap hero-inner">
            <p className="eyebrow" style={{ color: "#c9c4bd" }}>Италия · Официальная дистрибуция в России</p>
            <h1>Профессиональные кофемашины Sanremo в России</h1>
            <p className="lead" style={{ marginTop: 22 }}>
              Выбор по бизнес-задаче, а не по картинке: формат заведения, поток, меню и бюджет —
              две-три обоснованные конфигурации с РРЦ, наличием и дилером в вашем регионе.
            </p>
            <div className="hero-actions">
              <a className="btn btn-amber" href="/choose">Подобрать машину</a>
              <a className="btn" href="/products">Смотреть каталог</a>
            </div>
            <div className="hero-facts">
              <div>
                <b className="num">{models.length}</b>
                <span>моделей в российской матрице</span>
              </div>
              <div>
                <b className="num">{liveSkus.length}</b>
                <span>конфигураций с РРЦ</span>
              </div>
              <div>
                <b className="num">{inStock.length}</b>
                <span>позиций доступно со склада</span>
              </div>
              <div>
                <b className="num">{parts.length}</b>
                <span>артикулов запчастей в каталоге</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Строка доверия ───────────────────────────────────────── */}
        <section className="trustline">
          <div className="wrap">
            <div>
              <b>Официальный дистрибьютор</b>
              <span>Компания BIO отвечает за российский контур бренда</span>
            </div>
            <div>
              <b>РРЦ и склад в России</b>
              <span>Цены и наличие обновлены {PRICE_DATE}</span>
            </div>
            <div>
              <b>Дилерская сеть</b>
              <span>{cities.length} городов: продажа, монтаж, обучение</span>
            </div>
            <div>
              <b>Сервис и запчасти</b>
              <span>Каталог ЗИП с совместимостью и складским статусом</span>
            </div>
          </div>
        </section>

        {/* ── 3. Вход по сценарию ─────────────────────────────────────── */}
        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Начните с задачи</p>
              <h2>Что должна уметь машина в вашем заведении</h2>
            </div>
            <p className="lead">
              Семь типовых сценариев. В каждом — основная рекомендация, экономичная альтернатива и
              апгрейд с объяснением, за что вы доплачиваете.
            </p>
          </div>
          <div className="grid g4">
            {SCENARIOS.map((s) => {
              const m = modelBySlug(s.main);
              return (
                <a key={s.id} className="card" href={`/solutions#${s.id}`} style={{ textDecoration: "none" }}>
                  <div className="card-visual">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.photo} alt="" />
                  </div>
                  <div className="card-body">
                    <h3>{s.title}</h3>
                    <p className="small" style={{ margin: 0 }}>{s.question}</p>
                    <div className="card-foot">
                      <div>
                        <span className="price-from">Рекомендация</span>
                        <b style={{ fontFamily: "var(--sans)", fontSize: 16 }}>{m?.name}</b>
                      </div>
                      <span className="link-arrow">Посмотреть решение</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── 4. Вход по объёму ───────────────────────────────────────── */}
        <section className="section bg-sage">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Вход по потоку</p>
                <h2>Сколько чашек в день вы готовите</h2>
              </div>
              <p className="small" style={{ maxWidth: "58ch" }}>
                Диапазоны — редакционный ориентир BIO, а не паспортная производительность. Итог
                зависит от меню, пиковой нагрузки, числа бариста, воды и кофемолок. Методику
                публикуем на странице подбора.
              </p>
            </div>
            <div className="grid g" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
              {VOLUME_BANDS.map((b) => (
                <a key={b.id} href={`/choose?volume=${b.id}`} className="card" style={{ textDecoration: "none" }}>
                  <div className="card-body">
                    <span className="plaque plaque-gray" style={{ alignSelf: "flex-start" }}>{b.label}</span>
                    <p className="small" style={{ margin: 0 }}>
                      {b.models
                        .map((s) => modelBySlug(s)?.name)
                        .filter(Boolean)
                        .slice(0, 4)
                        .join(" · ")}
                    </p>
                    <span className="link-arrow" style={{ marginTop: "auto" }}>Подобрать</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Продуктовая лестница ─────────────────────────────────── */}
        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Продуктовая лестница</p>
              <h2>От первой машины до R&amp;D-флагмана</h2>
            </div>
            <p className="lead">
              Zoe, D8, F18, Café Racer и Opera образуют последовательную продуктовую лестницу. YOU — отдельный компактный specialty-маршрут для
              точек с дефицитом места.
            </p>
          </div>
          <div className="ladder">
            {ladder.map((slug, i) => {
              const f = families.find((x) => x.slug === slug)!;
              return (
                <a key={slug} href={`/products/${slug}`}>
                  <span className="step">Ступень {i + 1}</span>
                  <h3>{f.name}</h3>
                  <p className="small" style={{ margin: 0, flex: 1 }}>{f.tagline}</p>
                  <div>
                    <span className="price-from">РРЦ от</span>
                    <b className="num" style={{ fontFamily: "var(--sans)", fontSize: 17 }}>
                      {familyPriceFrom(slug)?.toLocaleString("ru-RU")} ₽
                    </b>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── 6. Модульные блоки семейств ─────────────────────────────── */}
        {["cafe-racer", "d8", "f18"].map((slug, i) => {
          const f = families.find((x) => x.slug === slug)!;
          const fmodels = modelsOfFamily(slug);
          const flip = i % 2 === 1;
          return (
            <section key={slug} className={i % 2 ? "bg-cream" : ""}>
              <div className={`module ${flip ? "b" : "a"}`}>
                {flip ? null : (
                  <div className="module-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.photo} alt={`Sanremo ${f.name}`} />
                  </div>
                )}
                <div className="module-copy">
                  <p className="eyebrow">Семейство · {f.architecture}</p>
                  <h2>{f.name}</h2>
                  <span className="plaque plaque-lg">{f.tagline}</span>
                  <p className="lead">{f.territory}</p>
                  <div className="grid g2" style={{ margin: "10px 0 22px", gap: 12 }}>
                    {fmodels.map((m) => (
                      <div key={m.slug} style={{ borderLeft: "2px solid var(--line-strong)", paddingLeft: 12 }}>
                        <b style={{ fontFamily: "var(--sans)", fontSize: 15 }}>{m.name}</b>
                        <div className="tiny">
                          {m.groupsAvailable.join("/")} гр. · от {m.priceFrom?.toLocaleString("ru-RU")} ₽
                          {m.inStockCount ? ` · ${m.inStockCount} на складе` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a className="btn" href={`/products/${slug}`}>Семейство {f.name}</a>
                    <a className="btn btn-sm" style={{ minHeight: 50 }} href={`/compare#${slug}`}>Прямые аналоги</a>
                  </div>
                </div>
                {flip ? (
                  <div className="module-photo flip">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.photo} alt={`Sanremo ${f.name}`} />
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}

        {/* ── 7. Наличие ──────────────────────────────────────────────── */}
        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Российский склад</p>
              <h2>Что можно поставить в ближайшие недели</h2>
            </div>
            <p className="small" style={{ maxWidth: "56ch" }}>
              Публичный статус наличия по данным дистрибьютора BIO, обновлён {PRICE_DATE}. Точное
              количество и срок поставки подтверждает менеджер или дилер.
            </p>
          </div>
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th>Конфигурация</th>
                  <th>Групп</th>
                  <th>Исполнение / цвет</th>
                  <th className="num">РРЦ</th>
                  <th>Наличие</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {inStock
                  .sort((a, b) => a.rrp - b.rrp)
                  .slice(0, 12)
                  .map((s) => {
                    const m = modelBySlug(s.model)!;
                    return (
                      <tr key={s.code}>
                        <td>
                          <b style={{ fontFamily: "var(--sans)" }}>{m.name}</b>
                          <div className="tiny">{s.title}</div>
                        </td>
                        <td className="num">{s.groups ?? "—"}</td>
                        <td>
                          {s.color ?? "—"}
                          {s.edition && s.edition !== "Base" ? ` · ${s.edition}` : ""}
                        </td>
                        <td className="num">{s.rrp.toLocaleString("ru-RU")} ₽</td>
                        <td><Stock status={s.availability} free={s.free} /></td>
                        <td><a className="link-arrow" href={modelPath(m)}>Карточка модели</a></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 18 }}>
            <a className="btn" href="/products">Весь каталог и фильтры</a>
          </p>
        </section>

        {/* ── 8. Кофейни выбирают Sanremo ─────────────────────────────── */}
        <section className="section bg-gray">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Кофейни выбирают Sanremo</p>
                <h2>Российские установки</h2>
              </div>
              <p className="small" style={{ maxWidth: "58ch" }}>
                Сети и заведения, работающие на Sanremo. Публикация названий, логотипов и фотографий
                — только после документального подтверждения установки и согласия клиента (ТЗ §13).
              </p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
              {chains.map((c) => (
                <div key={c} className="card" style={{ padding: "26px 20px", alignItems: "center", justifyContent: "center" }}>
                  <b style={{ fontFamily: "var(--sans)", fontSize: 17 }}>{c}</b>
                  <span className="tiny">на подтверждении</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 22 }}>
              <a className="link-arrow" href="/cases">Все кейсы с моделями и фотографиями</a>
            </p>
          </div>
        </section>

        {/* ── 9. Сервис / запчасти / дилеры ───────────────────────────── */}
        <section className="section wrap">
          <div className="grid g3">
            <div className="card">
              <div className="card-body">
                <p className="eyebrow">Где купить</p>
                <h3>{dealerCities().length} городов дилерской сети</h3>
                <p className="small">
                  Продажа, шоурум, демонстрация, обучение, монтаж, гарантийный и постгарантийный
                  сервис. Если партнёра рядом нет — заявку принимает BIO.
                </p>
                <div className="chips" style={{ marginTop: 6 }}>
                  {cities.slice(0, 6).map((c) => (
                    <span className="tag" key={c.city}>{c.city} · {c.count}</span>
                  ))}
                </div>
                <a className="btn btn-block" style={{ marginTop: "auto" }} href="/dealers">Найти дилера</a>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <p className="eyebrow">Запчасти</p>
                <h3>{parts.length} артикулов с совместимостью</h3>
                <p className="small">
                  Поиск по артикулу, названию, модели и узлу. Складской статус виден без
                  авторизации; коммерческие условия — через дилера или BIO.
                </p>
                <a className="btn btn-block" style={{ marginTop: "auto" }} href="/parts">Найти запчасть</a>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <p className="eyebrow">Сервис</p>
                <h3>Подготовка, монтаж, регламент</h3>
                <p className="small">
                  Вода, фильтрация, электрика, слив и пространство — до приезда инженера. Зоны
                  ответственности BIO, дилера и сервисного партнёра описаны явно.
                </p>
                <a className="btn btn-block" style={{ marginTop: "auto" }} href="/service">Сервис и обслуживание</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10. Финальный CTA ───────────────────────────────────────── */}
        <section className="section bg-petrol">
          <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "clamp(24px,4vw,70px)", alignItems: "center" }}>
            <div>
              <p className="eyebrow">Следующий шаг</p>
              <h2>Соберём конфигурацию под вашу задачу</h2>
              <p className="lead" style={{ marginTop: 16 }}>
                Опишите формат, поток, меню, регион и срок запуска. Специалист BIO уточнит нагрузку,
                проверит наличие и соединит с дилером, который работает в вашем городе.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <a className="btn btn-solid" href="/choose">Пройти подбор</a>
                <a className="btn" href="tel:+78005006495">8 800 500-64-95</a>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photo/machine-showroom.webp" alt="Кофемашина Sanremo в шоуруме" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
