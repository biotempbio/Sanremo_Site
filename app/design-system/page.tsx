import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дизайн-система — внутренний UI-kit",
  description:
    "Живая витрина токенов и компонентов сайта Sanremo Россия. Основана на Sanremo Brand Guidelines 2026.",
  robots: { index: false, follow: false },
};

/* ─────────────────────────────────────────────────────────── вспомогательное */

function Swatch({
  token,
  hex,
  note,
  dark,
}: {
  token: string;
  hex: string;
  note?: string;
  dark?: boolean;
}) {
  return (
    <div style={{ border: "1px solid var(--line)", background: "#fff" }}>
      <div style={{ background: hex, height: 92 }} />
      <div style={{ padding: "10px 12px 12px" }}>
        <div className="sku" style={{ fontSize: 12 }}>{token}</div>
        <div className="tiny" style={{ textTransform: "uppercase" }}>{hex}</div>
        {note ? <div className="tiny">{note}</div> : null}
        {dark ? <div className="tiny">текст на фоне — белый</div> : null}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 220px) minmax(0, 1fr)",
        gap: 24,
        padding: "18px 0",
        borderTop: "1px solid var(--line)",
        alignItems: "start",
      }}
    >
      <div className="tiny" style={{ paddingTop: 4 }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Block({ n, title, lead, children }: { n: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="section-tight" id={`b${n}`}>
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">{n}</p>
            <h2>{title}</h2>
          </div>
          {lead ? <p className="lead">{lead}</p> : <span />}
        </div>
        {children}
      </div>
    </section>
  );
}

const TINTS = ["forest", "petrol", "sage", "mocha", "amber", "cream"] as const;

/* ─────────────────────────────────────────────────────────────────── страница */

export default function DesignSystemPage() {
  return (
    <>
      <a className="skip-link" href="#main">К содержанию</a>

      <header className="header">
        <div className="wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand" src="/sanremo-logo.png" alt="Sanremo" style={{ width: 132 }} />
          <span className="plaque" style={{ marginLeft: 18 }}>Дизайн-система</span>
          <span className="hdr-trust" style={{ marginLeft: "auto" }}>
            Внутренний документ. Норматив — Sanremo Brand Guidelines 2026, v1.0
          </span>
        </div>
      </header>

      <main id="main">
        <section className="section bg-gray">
          <div className="wrap">
            <p className="eyebrow">Sanremo Россия · BIO</p>
            <h1>Дизайн-система сайта</h1>
            <hr className="rule-brand" />
            <p className="lead">
              Живая витрина: всё на этой странице отрисовано теми же классами и токенами, что и
              боевые страницы каталога. Правка в <span className="sku">app/globals.css</span> сразу
              видна здесь — расхождению документа и сайта взяться неоткуда.
            </p>
            <div className="cluster" style={{ marginTop: 26 }}>
              <a className="btn btn-sm" href="#b01">Цвет</a>
              <a className="btn btn-sm" href="#b02">Типографика</a>
              <a className="btn btn-sm" href="#b03">Ритм и сетка</a>
              <a className="btn btn-sm" href="#b04">Компоненты</a>
              <a className="btn btn-sm" href="#b05">Правила бренда</a>
            </div>
          </div>
        </section>

        {/* 01 ЦВЕТ */}
        <Block
          n="01"
          title="Цвет"
          lead="Ядро системы — чёрное и белое (§4.1 гайда). Вторичные цвета работают акцентом, подложкой и статусом, но не раскрашивают интерфейс: на странице каталога цветными остаются кнопка действия, плашка и одна фоновая секция."
        >
          <Row label="Ядро бренда">
            <div className="grid g4">
              <Swatch token="--black" hex="#111111" note="Pantone Black C" dark />
              <Swatch token="--white" hex="#ffffff" note="бумага интерфейса" />
            </div>
          </Row>

          <Row label="Вторичная палитра · §4.1">
            <div className="grid g3">
              <Swatch token="--forest" hex="#2d483f" note="Pantone 4203 C · опора, тёмные заливки" dark />
              <Swatch token="--petrol" hex="#003e51" note="Pantone 3035 C · технические блоки" dark />
              <Swatch token="--sage" hex="#7d9c91" note="Pantone 5565 C · спокойные подложки" />
              <Swatch token="--mocha" hex="#965044" note="Pantone 4100 C · редакционные материалы" dark />
              <Swatch token="--amber" hex="#c14e00" note="Pantone 718 C · действие и фокус" dark />
              <Swatch token="--cream" hex="#d7c4b7" note="Pantone 4755 C · тёплый фон, печать" />
            </div>
          </Row>

          <Row label="Тинты · §4.2">
            <div className="stack">
              {TINTS.map((c) => (
                <div key={c} style={{ display: "grid", gridTemplateColumns: "90px repeat(5, 1fr)", alignItems: "center", gap: 0 }}>
                  <div className="tiny" style={{ textTransform: "uppercase", letterSpacing: ".1em" }}>{c}</div>
                  {["", "-80", "-60", "-40", "-20"].map((t) => (
                    <div key={t} style={{ background: `var(--${c}${t})`, height: 46, display: "grid", placeItems: "center" }}>
                      <span className="tiny" style={{ color: t === "" || t === "-80" ? "rgba(255,255,255,.85)" : "var(--ink-2)" }}>
                        {t === "" ? "100%" : t.replace("-", "") + "%"}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="source-note" style={{ marginTop: 12 }}>
              Тинты — для плашек, заливок таблиц и графики. Логотип и ключевые марки тинтами не
              красятся: только полная насыщенность (§4.2).
            </p>
          </Row>

          <Row label="Подложки секций">
            <div className="grid g4">
              <Swatch token="--wash-forest" hex="#eaeeec" />
              <Swatch token="--wash-sage" hex="#f0f4f2" />
              <Swatch token="--wash-cream" hex="#f9f5f2" />
              <Swatch token="--wash-petrol" hex="#e6ecee" />
              <Swatch token="--wash-amber" hex="#fbeee5" />
              <Swatch token="--gray-bg" hex="#f3f2f0" note="нейтральная" />
            </div>
            <p className="source-note" style={{ marginTop: 12 }}>
              Светлее тинта 20 %: на полотне секции держат контраст основного текста ≥ 12:1 и не
              спорят с фотографией товара. Подряд не более одной цветной секции.
            </p>
          </Row>

          <Row label="Текст и линии">
            <div className="grid g4">
              <Swatch token="--ink" hex="#111111" note="основной · 21:1" dark />
              <Swatch token="--ink-2" hex="#3a3936" note="лид, вторичный · 11:1" dark />
              <Swatch token="--muted" hex="#6b6864" note="подписи · 5.4:1" dark />
              <Swatch token="--line" hex="#e2e0dc" note="разделители" />
              <Swatch token="--line-strong" hex="#c9c6c1" note="рамки полей" />
              <Swatch token="--gray-plaque" hex="#b9b6b1" note="серая плашка" />
            </div>
          </Row>

          <Row label="Статусы">
            <div className="cluster">
              <span className="badge badge-ok">В наличии</span>
              <span className="badge badge-warn">Мало · под заказ</span>
              <span className="badge badge-err">Снято с производства</span>
              <span className="badge badge-quiet">Зарезервировано</span>
              <span className="badge badge-brand">Официальная поставка</span>
            </div>
            <p className="source-note" style={{ marginTop: 12 }}>
              Цвет статуса всегда продублирован словом: цвет — не единственный носитель смысла.
            </p>
          </Row>
        </Block>

        {/* 02 ТИПОГРАФИКА */}
        <Block
          n="02"
          title="Типографика"
          lead="Иерархия гайда (§3.2) сохранена: редакционный serif в заголовке, интерфейсный sans в подзаголовке и тексте. Gotham и Blacker кириллицы не имеют, роли закрыты семейством PT."
        >
          <Row label="Роли">
            <div className="stack">
              <div>
                <h1 style={{ marginBottom: 6 }}>Кофемашина D8 Pro</h1>
                <p className="tiny">H1 · PT Serif Bold (роль Blacker) · --fs-display · межстрочный 1.02</p>
              </div>
              <div>
                <h2 style={{ marginBottom: 6 }}>Профессиональные рожковые</h2>
                <p className="tiny">H2 · PT Serif Bold · --fs-h2</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 6 }}>Две группы, мультибойлер, 220 В</h3>
                <p className="tiny">H3 · PT Root UI Bold (роль Gotham Med/Bold) · --fs-h3</p>
              </div>
              <div>
                <p className="lead" style={{ marginBottom: 6 }}>
                  Лид: короткий абзац перед основным текстом, до 62 знаков в строке.
                </p>
                <p className="tiny">.lead · --fs-lead · цвет --ink-2</p>
              </div>
              <div>
                <p style={{ marginBottom: 6 }}>
                  Основной текст страницы: 16 px, межстрочный 1.6, ширина строки ограничена
                  переменной --maxw-text, чтобы длинные описания оставались читаемыми.
                </p>
                <p className="tiny">body · PT Root UI Regular · --fs-body</p>
              </div>
            </div>
          </Row>

          <Row label="Служебные стили">
            <div className="stack">
              <p className="eyebrow" style={{ margin: 0 }}>Надзаголовок секции</p>
              <p className="small" style={{ margin: 0 }}>Малый текст: примечания под таблицей, источник цены.</p>
              <p className="tiny" style={{ margin: 0 }}>Микротекст: сноски и дисклеймеры.</p>
              <p style={{ margin: 0 }}>
                Артикул <span className="sku">SR-D8P-2GR-BLK</span> и число <span className="num">1 249 000 ₽</span> —
                моноширинный PT Mono и табличные цифры.
              </p>
            </div>
          </Row>

          <Row label="Плашка · §16.1">
            <div className="cluster">
              <span className="plaque">Официальный дистрибьютор</span>
              <span className="plaque plaque-gray">РРЦ 2026</span>
              <span className="plaque plaque-lg">Game changer</span>
            </div>
            <p className="source-note" style={{ marginTop: 12 }}>
              Прямоугольник по содержанию, без скругления и тени — приём из фирменных материалов
              Sanremo. Плашка не заменяет заголовок и не ставится на фотографию поверх лица машины.
            </p>
          </Row>
        </Block>

        {/* 03 РИТМ */}
        <Block
          n="03"
          title="Ритм, сетка, форма"
          lead="Шаг 4 px, поле страницы и предел полосы — переменные. Скруглений в системе нет: карточка, кнопка и плашка повторяют прямоугольную геометрию логотипа."
        >
          <Row label="Шкала отступов">
            <div className="cluster" style={{ alignItems: "flex-end" }}>
              {[["--s-1", 4], ["--s-2", 8], ["--s-3", 12], ["--s-4", 16], ["--s-6", 24], ["--s-8", 32], ["--s-10", 40], ["--s-14", 56], ["--s-18", 72], ["--s-24", 96]].map(([t, v]) => (
                <div key={t as string} style={{ textAlign: "center" }}>
                  <div style={{ width: 26, height: v as number, background: "var(--forest-40)" }} />
                  <div className="tiny" style={{ marginTop: 6 }}>{v as number}</div>
                </div>
              ))}
            </div>
          </Row>

          <Row label="Сетка карточек">
            <div className="grid g4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ background: "var(--gray-bg)", height: 74, display: "grid", placeItems: "center" }}>
                  <span className="tiny">колонка {i}</span>
                </div>
              ))}
            </div>
            <p className="source-note" style={{ marginTop: 12 }}>
              .grid .g4 → 4 колонки, на 1100 px 2 колонки, на 620 px одна. Шаг --gap.
              Каталог — .g3/.g4, сравнение — таблица, текст — .prose.
            </p>
          </Row>

          <Row label="Секции">
            <div className="stack">
              <div className="bg-forest" style={{ padding: "22px 20px" }}><span className="tiny">.bg-forest · подложка секции</span></div>
              <div className="bg-cream" style={{ padding: "22px 20px" }}><span className="tiny">.bg-cream</span></div>
              <div className="bg-gray" style={{ padding: "22px 20px" }}><span className="tiny">.bg-gray · нейтральная</span></div>
            </div>
          </Row>
        </Block>

        {/* 04 КОМПОНЕНТЫ */}
        <Block
          n="04"
          title="Компоненты"
          lead="Набор, который закрывает B2B-каталог: выбор модели, цена и наличие, характеристики, сравнение, заявка."
        >
          <Row label="Кнопки">
            <div className="cluster">
              <a className="btn btn-solid" href="#b04">Основное действие</a>
              <a className="btn" href="#b04">Вторичное</a>
              <a className="btn btn-ghost" href="#b04">Тихое</a>
              <a className="btn btn-amber" href="#b04">Заявка</a>
              <a className="btn btn-sm" href="#b04">Малая</a>
              <span className="btn" aria-disabled="true">Недоступно</span>
            </div>
            <p className="source-note" style={{ marginTop: 12 }}>
              Одна ambre-кнопка на экран: янтарный — цвет действия и фокуса, его ценность в редкости.
            </p>
          </Row>

          <Row label="Теги, чипы, ссылки">
            <div className="cluster">
              <span className="tag">Мультибойлер</span>
              <span className="tag tag-solid">Хит</span>
              <button className="chip" aria-pressed="true">2 группы</button>
              <button className="chip">3 группы</button>
              <a className="link-arrow" href="#b04">Смотреть характеристики →</a>
            </div>
          </Row>

          <Row label="Карточка модели">
            <div className="grid g3">
              {[
                { name: "D8 Pro", st: "in_stock", label: "В наличии", price: "1 249 000" },
                { name: "F18 MB", st: "limited", label: "Мало на складе", price: "986 000" },
                { name: "Cube", st: "on_order", label: "Под заказ", price: "742 000" },
              ].map((m) => (
                <article className="card" key={m.name}>
                  <div className="card-visual">
                    <div className="skeleton skeleton-visual" />
                  </div>
                  <div className="card-body">
                    <p className="eyebrow" style={{ margin: 0 }}>Sanremo</p>
                    <h3>{m.name}</h3>
                    <span className="stock-label"><i className={`dot st-${m.st}`} />{m.label}</span>
                    <div className="card-foot">
                      <div>
                        <span className="price-from">РРЦ от</span>
                        <span className="price num">{m.price} ₽</span>
                      </div>
                      <a className="btn btn-sm" href="#b04">Подробно</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Row>

          <Row label="Характеристики">
            <div className="spec-group">
              <h4>Гидравлика</h4>
              <dl style={{ margin: 0 }}>
                <div className="spec-row"><dt>Тип бойлера</dt><dd>Мультибойлер, независимые контуры</dd></div>
                <div className="spec-row"><dt>Объём парового бойлера</dt><dd className="num">7 л</dd></div>
                <div className="spec-row"><dt>Стабильность температуры</dt><dd>± 0,3 °C</dd></div>
              </dl>
            </div>
          </Row>

          <Row label="Таблица и сравнение">
            <div className="table-scroll">
              <table className="data compare">
                <thead>
                  <tr><th>Параметр</th><th>D8 Pro</th><th>F18 MB</th><th className="num">Разница</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Группы</th><td>2</td><td>2</td><td className="num">—</td></tr>
                  <tr><th scope="row">Мощность</th><td className="num">4 200 Вт</td><td className="num">3 800 Вт</td><td className="num">+400</td></tr>
                  <tr><th scope="row">РРЦ</th><td className="num">1 249 000 ₽</td><td className="num">986 000 ₽</td><td className="num">+263 000</td></tr>
                </tbody>
              </table>
            </div>
          </Row>

          <Row label="Вкладки и раскрытие">
            <div className="stack">
              <div className="tabs" role="tablist">
                <button className="tab" role="tab" aria-selected="true">Описание</button>
                <button className="tab" role="tab" aria-selected="false">Характеристики</button>
                <button className="tab" role="tab" aria-selected="false">Комплектация</button>
                <button className="tab" role="tab" aria-selected="false">Сервис</button>
              </div>
              <details className="accordion" open>
                <summary>Что входит в поставку</summary>
                <div className="accordion-body">Кофемашина, два холдера, темпер, комплект подключения, гарантийный талон.</div>
              </details>
              <details className="accordion">
                <summary>Условия гарантии</summary>
                <div className="accordion-body">12 месяцев при вводе в эксплуатацию авторизованным сервисом.</div>
              </details>
            </div>
          </Row>

          <Row label="Форма заявки">
            <div className="stack" style={{ maxWidth: 620 }}>
              <div className="field-row">
                <label className="field"><span>Компания</span><input placeholder="ООО «Кофейня»" /></label>
                <label className="field"><span>Город</span><input placeholder="Москва" /></label>
              </div>
              <label className="field is-error">
                <span>Телефон</span>
                <input defaultValue="+7 900" aria-invalid="true" />
                <span className="field-err">Укажите телефон полностью</span>
              </label>
              <label className="field">
                <span>Комментарий</span>
                <textarea placeholder="Сколько чашек в день, есть ли помещение под подключение" />
                <span className="field-hint">Поможет подобрать модель точнее</span>
              </label>
              <label className="check"><input type="checkbox" /><span>Согласен на обработку персональных данных</span></label>
              <div className="cluster"><button className="btn btn-solid">Отправить заявку</button><span className="tiny">Ответ в рабочий день</span></div>
            </div>
          </Row>

          <Row label="Сообщения">
            <div className="stack">
              <div className="notice"><b>Цены — рекомендованные.</b> Итоговая стоимость зависит от комплектации и условий поставки.</div>
              <div className="notice ok"><b>Есть на складе.</b> Отгрузка со склада в Москве в течение 2 рабочих дней.</div>
              <div className="notice calm">Позиция снята с производства, подберём аналог из текущей линейки.</div>
              <div className="notice err"><b>Не удалось отправить форму.</b> Проверьте телефон и попробуйте ещё раз.</div>
            </div>
          </Row>

          <Row label="Показатели и акцент">
            <div className="stack-lg">
              <div className="stats">
                <div className="stat"><b>1997</b><span>год основания Sanremo</span></div>
                <div className="stat"><b>70+</b><span>стран присутствия</span></div>
                <div className="stat"><b>9</b><span>линеек в каталоге РФ</span></div>
                <div className="stat"><b>2</b><span>дня до отгрузки со склада</span></div>
              </div>
              <figure className="callout" style={{ margin: 0 }}>
                <q>Мы никогда не стремились просто продавать машины — мы создавали то, чего ещё не было.</q>
                <figcaption>Brand Guidelines 2026, ценность «Innovation»</figcaption>
              </figure>
            </div>
          </Row>

          <Row label="Пагинация и панель списка">
            <div className="stack">
              <div className="toolbar">
                <span className="count">Найдено <b>24</b> модели</span>
                <div className="cluster"><span className="tiny">Сортировка:</span><button className="chip" aria-pressed="true">по цене</button><button className="chip">по наличию</button></div>
              </div>
              <nav className="pager" aria-label="Страницы">
                <span aria-current="page">1</span>
                <a href="#b04">2</a>
                <a href="#b04">3</a>
                <span className="gap">…</span>
                <a href="#b04">8</a>
                <a href="#b04">Далее</a>
              </nav>
            </div>
          </Row>
        </Block>

        {/* 05 ПРАВИЛА */}
        <Block
          n="05"
          title="Правила бренда в вебе"
          lead="Разделы 2.4–2.5 гайда действуют на сайте без послаблений."
        >
          <div className="grid g2">
            <div className="spec-group">
              <h4>Можно</h4>
              <dl style={{ margin: 0 }}>
                <div className="spec-row"><dt>Логотип</dt><dd>Только чёрный или белый, на чистом однородном фоне</dd></div>
                <div className="spec-row"><dt>Охранное поле</dt><dd>Не меньше высоты знака по всем сторонам</dd></div>
                <div className="spec-row"><dt>Минимальный размер</dt><dd>75 px по ширине для экрана</dd></div>
                <div className="spec-row"><dt>Логомарк (козерог)</dt><dd>Самостоятельно — фавиконка, аватар, мобильная шапка</dd></div>
                <div className="spec-row"><dt>Фото</dt><dd>Продукт в реальной кофейне, документальный кадр</dd></div>
              </dl>
            </div>
            <div className="spec-group">
              <h4>Нельзя</h4>
              <dl style={{ margin: 0 }}>
                <div className="spec-row"><dt>Пропорции</dt><dd>Менять масштаб знака относительно логотипа</dd></div>
                <div className="spec-row"><dt>Эффекты</dt><dd>Тени, обводки, градиенты на логотипе</dd></div>
                <div className="spec-row"><dt>Цвет</dt><dd>Красить логотип в фирменные цвета или тинты</dd></div>
                <div className="spec-row"><dt>Подложка</dt><dd>Ставить знак на узор, паттерн или пёстрое фото</dd></div>
                <div className="spec-row"><dt>Форма</dt><dd>Наклонять, вращать, помещать в плашку-овал</dd></div>
              </dl>
            </div>
          </div>

          <div className="notice calm" style={{ marginTop: 24 }}>
            <b>Фото и рендеры разделены.</b> Рендер не выдаётся за документальный кадр: схематичный
            визуал модели подписывается как схема, фотография кофейни публикуется с указанием
            автора (§7.1 гайда — credits).
          </div>
        </Block>

        <section className="section-tight rule">
          <div className="wrap">
            <p className="source-note">
              Норматив: Sanremo Brand Guidelines 2026, v1.0 FEB 2026 — разделы 2 (логотип),
              3 (типографика), 4 (палитра), 7 (соцсети), 8 (сайт). Реализация токенов —
              <span className="sku"> app/globals.css</span>, витрина — <span className="sku">/design-system</span>.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
