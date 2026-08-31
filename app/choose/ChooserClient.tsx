"use client";

import { useMemo, useState } from "react";

export interface ChooserModel {
  slug: string;
  name: string;
  family: string;
  familyName: string;
  tagline: string;
  architecture: string;
  scenarios: string[];
  groups: number[];
  priceFrom: number | null;
  inStockCount: number;
  options: string[];
  volumeBands: string[];
  minWidth: number | null;
  maxPower: number | null;
}

const FORMATS = [
  { id: "cafe", label: "Кофейня", scen: ["Первая кофейня", "Растущая кофейня"] },
  { id: "chain", label: "Сеть", scen: ["Сеть"] },
  { id: "resto", label: "Ресторан / пекарня", scen: ["Пекарня и ресторан", "Пекарня", "Столовая и фуд-корнер"] },
  { id: "hotel", label: "Отель / фуд-корнер", scen: ["Столовая и фуд-корнер", "Фуд-корнер"] },
  { id: "specialty", label: "Specialty", scen: ["Независимая specialty", "Specialty", "Specialty с потоком"] },
  { id: "flagship", label: "Флагманская точка", scen: ["Флагманская дизайн-кофейня"] },
  { id: "roaster", label: "Обжарщик / лаборатория", scen: ["Обжарщик и лаборатория", "Лаборатория рецептов"] },
];

const VOLUMES = [
  { id: "u100", label: "до 100" },
  { id: "100-200", label: "100–200" },
  { id: "200-300", label: "200–300" },
  { id: "300-500", label: "300–500" },
  { id: "500+", label: "500+" },
];

const MILK = [
  { id: "low", label: "Мало молочных" },
  { id: "mid", label: "Половина меню" },
  { id: "high", label: "Преимущественно молочное" },
];

const BUDGETS = [
  { id: "any", label: "Не ограничен", max: Infinity },
  { id: "b1", label: "до 450 000 ₽", max: 450_000 },
  { id: "b2", label: "до 700 000 ₽", max: 700_000 },
  { id: "b3", label: "до 1 000 000 ₽", max: 1_000_000 },
  { id: "b4", label: "до 1 500 000 ₽", max: 1_500_000 },
];

export default function ChooserClient({ models, initialVolume }: { models: ChooserModel[]; initialVolume?: string }) {
  const [format, setFormat] = useState<string>("");
  const [volume, setVolume] = useState<string>(initialVolume ?? "");
  const [milk, setMilk] = useState<string>("");
  const [groups, setGroups] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [profiling, setProfiling] = useState(false);
  const selection = useMemo(() => {
    const fmt = FORMATS.find((f) => f.id === format);
    const maxBudget = BUDGETS.find((b) => b.id === budget)?.max ?? Infinity;
    const w = width ? parseInt(width, 10) : null;

    const narrow = (rows: ChooserModel[], test: (m: ChooserModel) => boolean) => {
      const next = rows.filter(test);
      return next.length ? next : rows;
    };

    let candidates = [...models];
    if (fmt) candidates = narrow(candidates, (m) => m.scenarios.some((s) => fmt.scen.includes(s)));
    if (volume) candidates = narrow(candidates, (m) => m.volumeBands.includes(volume));
    if (milk === "high") candidates = narrow(candidates, (m) => /мультибойлер|Multiboiler/i.test(m.architecture) || m.options.includes("AutoSteam"));
    if (groups) candidates = narrow(candidates, (m) => m.groups.includes(Number(groups)));
    if (profiling) candidates = narrow(candidates, (m) => /мультибойлер|Multiboiler|профилирован/i.test(m.architecture));
    if (budget) candidates = narrow(candidates, (m) => (m.priceFrom ?? 0) <= maxBudget);
    if (w) candidates = narrow(candidates, (m) => !m.minWidth || m.minWidth <= w);

    const ranked = candidates
      .map((m) => {
        let score = 0;
        const why: string[] = [];
        if (fmt && m.scenarios.some((s) => fmt.scen.includes(s))) { score += 4; why.push(`подходит формату «${fmt.label}»`); }
        if (volume && m.volumeBands.includes(volume)) { score += 4; why.push(`рассчитана на ${VOLUMES.find((v) => v.id === volume)?.label} чашек/день`); }
        if (milk === "high" && /мультибойлер|Multiboiler/i.test(m.architecture)) { score += 3; why.push("независимая паровая часть при молочном меню"); }
        if (milk === "high" && m.options.includes("AutoSteam")) { score += 1; why.push("AutoSteam"); }
        if (groups && m.groups.includes(Number(groups))) { score += 2; why.push(`есть исполнение на ${groups} группы`); }
        if (profiling && /мультибойлер|Multiboiler|профилирован/i.test(m.architecture)) { score += 3; why.push("контроль температуры и профилирование"); }
        if (m.inStockCount > 0) { score += 1; why.push(`${m.inStockCount} конфигураций на складе в Москве`); }
        return { m, score, why };
      })
      .sort((a, b) => b.score - a.score || (a.m.priceFrom ?? 0) - (b.m.priceFrom ?? 0));

    const main = ranked[0];
    const byPrice = [...ranked].sort((a, b) => (a.m.priceFrom ?? Infinity) - (b.m.priceFrom ?? Infinity));
    const cheaper = main && byPrice.find((r) => r.m.slug !== main.m.slug);
    const upgrade = main && [...byPrice].reverse().find((r) => r.m.slug !== main.m.slug && r.m.slug !== cheaper?.m.slug);
    const recommendations = [main, cheaper, upgrade].filter(Boolean) as typeof ranked;
    const recommended = new Set(recommendations.map((r) => r.m.slug));
    return { ranked, recommendations, other: ranked.filter((r) => !recommended.has(r.m.slug)) };
  }, [models, format, volume, milk, groups, budget, width, profiling]);

  const answered = [format, volume, milk, groups || (profiling ? "profiling" : ""), budget, width].filter(Boolean).length;
  const complete = answered === 6;

  return (
    <div className="chooser">
      <form className="chooser-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="eyebrow">1. Формат бизнеса</legend>
          <div className="chips">
            {FORMATS.map((f) => (
              <button type="button" key={f.id} className="chip" aria-pressed={format === f.id}
                      onClick={() => setFormat(format === f.id ? "" : f.id)}>{f.label}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow">2. Чашек в день</legend>
          <div className="chips">
            {VOLUMES.map((v) => (
              <button type="button" key={v.id} className="chip" aria-pressed={volume === v.id}
                      onClick={() => setVolume(volume === v.id ? "" : v.id)}>{v.label}</button>
            ))}
          </div>
          <p className="tiny" style={{ marginTop: 8 }}>
            Диапазон — ориентир BIO. Отдельно уточним пиковый час: он определяет число групп сильнее,
            чем дневной итог.
          </p>
        </fieldset>

        <fieldset>
          <legend className="eyebrow">3. Доля молочных напитков</legend>
          <div className="chips">
            {MILK.map((v) => (
              <button type="button" key={v.id} className="chip" aria-pressed={milk === v.id}
                      onClick={() => setMilk(milk === v.id ? "" : v.id)}>{v.label}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow">4. Рабочее место и рецепты</legend>
          <div className="chips">
            {[1, 2, 3].map((g) => (
              <button type="button" key={g} className="chip" aria-pressed={groups === String(g)}
                      onClick={() => setGroups(groups === String(g) ? "" : String(g))}>{g} группы</button>
            ))}
            <button type="button" className="chip" aria-pressed={profiling} onClick={() => setProfiling(!profiling)}>
              Нужен независимый контроль / профилирование
            </button>
          </div>
        </fieldset>

        <fieldset className="chooser-two">
          <label className="field">
            <span>5. Бюджет (РРЦ)</span>
            <select value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="" disabled>Выберите бюджет</option>
              {BUDGETS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </label>
          <label className="field">
            <span>6. Ограничение по ширине, мм</span>
            <input inputMode="numeric" placeholder="например 800" value={width}
                   onChange={(e) => setWidth(e.target.value.replace(/\D/g, ""))} />
          </label>
        </fieldset>

        <p className="small" style={{ margin: 0 }}>
          Отвечено пунктов: <b>{answered}</b> из 6. Результат доступен без передачи контактов.
        </p>
      </form>

      <div className="chooser-result">
        {!complete ? (
          <>
            <div className="candidate-head">
              <div>
                <p className="eyebrow">Выбор сужается по вашим ответам</p>
                <h2>Подходящие модели</h2>
              </div>
              <p className="candidate-count"><b>{selection.ranked.length}</b> из {models.length}</p>
            </div>
            <p className="small candidate-help">Ответьте на все шесть вопросов. На каждом шаге здесь остаются модели, которые соответствуют уже выбранным условиям.</p>
            <div className="candidate-list">
              {selection.ranked.map((r) => <CandidateRow key={r.m.slug} m={r.m} />)}
            </div>
          </>
        ) : (
          <>
            <div className="sec-head" style={{ marginBottom: 22 }}>
              <div>
                <p className="eyebrow">Результат подбора</p>
                <h2>Две-три обоснованные конфигурации</h2>
              </div>
              <p className="small" style={{ maxWidth: "50ch" }}>
                Подходящих моделей в матрице: {selection.ranked.length}. Ниже — основная рекомендация,
                экономичная альтернатива и апгрейд с объяснением, за что доплата.
              </p>
            </div>
            <div className="grid g3">
              {selection.recommendations.map((r, index) => (
                <ResultCard key={r.m.slug} tone={index === 0 ? "main" : index === 1 ? "alt" : "up"}
                  title={index === 0 ? "Основная рекомендация" : index === 1 ? "Экономичная альтернатива" : "Апгрейд"} r={r} />
              ))}
            </div>

            {selection.other.length > 0 && <div className="other-results">
              <div className="candidate-head"><h3>Другие подходящие модели</h3><span className="tiny">Можно выбрать самостоятельно</span></div>
              <div className="candidate-list">{selection.other.map((r) => <CandidateRow key={r.m.slug} m={r.m} />)}</div>
            </div>}

            <div className="notice" style={{ marginTop: 24 }}>
              <b>Как читать результат.</b> Это редакционная рекомендация BIO по вашим ответам, а не
              паспортная производительность. Итоговая конфигурация зависит ещё от кофемолок,
              подготовки воды, организации рабочего места и числа бариста в смене.
            </div>

            <div className="chooser-cta">
              <div>
                <h3>Отправить подбор специалисту</h3>
                <p className="small" style={{ margin: "8px 0 0" }}>
                  Запрос уйдёт с уже выбранными параметрами и моделями. Маршрутизация — в BIO или
                  дилеру вашего региона.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btn btn-amber" href="/contacts">Запросить предложение</a>
                <a className="btn" href="/dealers">Найти дилера</a>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .chooser { display: grid; grid-template-columns: minmax(0,380px) minmax(0,1fr); gap: clamp(24px,3.5vw,64px); align-items: start; }
        .chooser-form { display: flex; flex-direction: column; gap: 26px; border-right: 1px solid var(--line); padding-right: clamp(0px,2vw,32px); }
        .chooser-form fieldset { border: 0; margin: 0; padding: 0; }
        .chooser-form legend { padding: 0; margin-bottom: 10px; }
        .chooser-two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .candidate-head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 16px; }
        .candidate-count { margin: 0; white-space: nowrap; color: var(--muted); }
        .candidate-count b { color: var(--ink); font-size: 28px; }
        .candidate-help { max-width: 64ch; margin: 0 0 24px; }
        .candidate-list { border-top: 1px solid var(--ink); }
        .candidate-row { display: grid; grid-template-columns: minmax(0,1fr) auto auto; gap: 24px; align-items: center; padding: 18px 0; border-bottom: 1px solid var(--line); }
        .candidate-row h3 { margin: 2px 0 0; }
        .candidate-row .price { font-size: 18px; white-space: nowrap; }
        .candidate-row .stock-label { min-width: 150px; }
        .other-results { margin-top: 34px; }
        .chooser-cta { margin-top: 28px; padding: 26px; background: var(--ink); color: #fff;
          display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 20px; align-items: center; }
        .chooser-cta h3 { color: #fff; }
        .chooser-cta .small { color: #b9b6b1; }
        .chooser-cta .btn { border-color: #fff; color: #fff; }
        .chooser-cta .btn:hover { background: #fff; color: var(--ink); }
        .chooser-cta .btn-amber { border-color: var(--amber); }
        @media (max-width: 980px) {
          .chooser { grid-template-columns: 1fr; }
          .chooser-form { border-right: 0; border-bottom: 1px solid var(--line); padding: 0 0 26px; }
          .chooser-cta { grid-template-columns: 1fr; }
        }
        @media (max-width: 620px) {
          .chooser-two { grid-template-columns: 1fr; }
          .candidate-row { grid-template-columns: 1fr auto; gap: 10px 16px; }
          .candidate-row .stock-label { grid-column: 1 / -1; }
        }
      `}</style>
    </div>
  );
}

function ResultCard({
  tone, title, r,
}: { tone: "main" | "alt" | "up"; title: string; r: { m: ChooserModel; why: string[] } }) {
  const { m, why } = r;
  return (
    <article className="card" style={tone === "main" ? { borderColor: "var(--ink)", borderWidth: 2 } : undefined}>
      <div className="card-body">
        <span className={tone === "main" ? "plaque" : "plaque plaque-gray"} style={{ alignSelf: "flex-start" }}>
          {title}
        </span>
        <p className="eyebrow" style={{ margin: "4px 0 0" }}>{m.familyName}</p>
        <h3><a href={`/products/${m.family}/${m.slug}`}>{m.name}</a></h3>
        <p className="small" style={{ margin: 0 }}>{m.tagline}</p>
        <ul className="small" style={{ margin: "4px 0 0", paddingLeft: 18 }}>
          {why.slice(0, 4).map((w) => <li key={w}>{w}</li>)}
        </ul>
        <div className="card-foot">
          <div>
            <span className="price-from">РРЦ от</span>
            <span className="price num" style={{ fontSize: 21 }}>
              {m.priceFrom?.toLocaleString("ru-RU")} ₽
            </span>
          </div>
          <span className="stock-label">
            <i className={`dot ${m.inStockCount ? "st-in_stock" : "st-on_order"}`} />
            {m.inStockCount ? "На складе в Москве" : "Под заказ"}
          </span>
        </div>
      </div>
    </article>
  );
}

function CandidateRow({ m }: { m: ChooserModel }) {
  return (
    <article className="candidate-row">
      <div>
        <p className="eyebrow" style={{ margin: 0 }}>{m.familyName}</p>
        <h3><a href={`/products/${m.family}/${m.slug}`}>{m.name}</a></h3>
      </div>
      <span className="price num">{m.priceFrom ? `от ${m.priceFrom.toLocaleString("ru-RU")} ₽` : "Цена по запросу"}</span>
      <span className="stock-label"><i className={`dot ${m.inStockCount ? "st-in_stock" : "st-on_order"}`} />{m.inStockCount ? "На складе в Москве" : "Под заказ"}</span>
    </article>
  );
}
