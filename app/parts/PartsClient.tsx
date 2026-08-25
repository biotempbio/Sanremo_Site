"use client";

import { useMemo, useState } from "react";

export interface PartRow {
  code: string;
  article: string | null;
  name: string;
  node: string;
  rrp: number;
  stock: number;
  availability: "in_stock" | "limited" | "reserved" | "on_order";
  models: string[];      // названия моделей, к которым подходит
  modelSlugs: string[];
}

const LABEL: Record<PartRow["availability"], string> = {
  in_stock: "В наличии",
  limited: "Мало",
  reserved: "Зарезервировано",
  on_order: "Под заказ",
};

const PAGE = 40;

export default function PartsClient({
  parts, nodes, models, initialModel,
}: {
  parts: PartRow[];
  nodes: { node: string; count: number }[];
  models: { slug: string; name: string }[];
  initialModel?: string;
}) {
  const [q, setQ] = useState("");
  const [node, setNode] = useState("");
  const [model, setModel] = useState(initialModel ?? "");
  const [stockOnly, setStockOnly] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return parts.filter((p) => {
      if (node && p.node !== node) return false;
      if (model && !p.modelSlugs.includes(model)) return false;
      if (stockOnly && p.stock <= 0) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        (p.article ?? "").toLowerCase().includes(needle) ||
        p.code.toLowerCase().includes(needle) ||
        p.models.some((m) => m.toLowerCase().includes(needle))
      );
    });
  }, [parts, q, node, model, stockOnly]);

  const shown = filtered.slice(0, limit);

  return (
    <div className="parts">
      <aside className="filters">
        <label className="field">
          <span>Артикул, название или модель</span>
          <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }}
                 placeholder="10402082, прокладка, Café Racer…" />
        </label>

        <div className="filter-group">
          <h4>Модель</h4>
          <div className="chips">
            {models.map((m) => (
              <button key={m.slug} className="chip" aria-pressed={model === m.slug}
                      onClick={() => { setModel(model === m.slug ? "" : m.slug); setLimit(PAGE); }}>
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Узел</h4>
          <div className="chips">
            {nodes.map((n) => (
              <button key={n.node} className="chip" aria-pressed={node === n.node}
                      onClick={() => { setNode(node === n.node ? "" : n.node); setLimit(PAGE); }}>
                {n.node} · {n.count}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Наличие</h4>
          <div className="chips">
            <button className="chip" aria-pressed={stockOnly} onClick={() => setStockOnly(!stockOnly)}>
              Только в наличии
            </button>
          </div>
        </div>

        <p className="source-note">
          Поиск открыт без авторизации. Публикуется рекомендованная цена и складской статус;
          дилерские условия — по политике BIO, в закрытом контуре.
        </p>
      </aside>

      <div>
        <p className="small" style={{ marginBottom: 16 }}>
          Найдено артикулов: <b>{filtered.length}</b> из {parts.length}
        </p>

        {filtered.length === 0 ? (
          <div className="empty">
            <h3>По этому запросу артикул не найден</h3>
            <p className="small" style={{ maxWidth: "48ch", margin: "10px auto 18px" }}>
              Попробуйте часть артикула или название узла. Если детали нет в каталоге — пришлите
              модель, серийный номер и фото узла, специалист подберёт замену.
            </p>
            <a className="btn btn-solid" href="/service">Запросить деталь</a>
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Узел</th>
                    <th>Совместимость</th>
                    <th className="num">РРЦ</th>
                    <th>Статус</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((p) => (
                    <tr key={p.code}>
                      <td className="sku" style={{ fontWeight: 700 }}>
                        {p.article ?? p.code}
                      </td>
                      <td>{p.name}</td>
                      <td className="tiny">{p.node}</td>
                      <td className="tiny">
                        {p.models.length ? p.models.slice(0, 4).join(", ") : "уточняется"}
                        {p.models.length > 4 ? ` +${p.models.length - 4}` : ""}
                      </td>
                      <td className="num">
                        {p.rrp ? `${p.rrp.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₽` : "по запросу"}
                      </td>
                      <td>
                        <span className="stock-label">
                          <i className={`dot st-${p.availability}`} />
                          {LABEL[p.availability]}
                        </span>
                      </td>
                      <td><a className="link-arrow" href="/service">Запросить</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {shown.length < filtered.length && (
              <p style={{ marginTop: 18 }}>
                <button className="btn" onClick={() => setLimit(limit + PAGE)}>
                  Показать ещё {Math.min(PAGE, filtered.length - shown.length)}
                </button>
              </p>
            )}
          </>
        )}
      </div>

      <style>{`
        .parts { display: grid; grid-template-columns: minmax(0,300px) minmax(0,1fr); gap: clamp(20px,3vw,52px); align-items: start; }
        @media (max-width: 980px) { .parts { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
