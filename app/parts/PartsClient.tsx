"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { ARCHIVE_MODELS } from "@/lib/archive-models";
import { LeadForm } from "@/app/components/LeadForm";
import { normalizeCatalogSearch } from "@/lib/search-normalization.mjs";

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
  limited: "В наличии",
  reserved: "Зарезервировано",
  on_order: "Под заказ · 6–8 недель",
};

const PAGE = 40;
const SEARCH_ALIASES: Record<string, string[]> = {
  помпа: ["насос"], насос: ["помпа"],
  тэн: ["нагреватель", "нагревательный элемент"],
  нагреватель: ["тэн", "нагревательный элемент"],
  нагревательный: ["тэн"],
  прокладка: ["уплотнение", "уплотнитель", "уплотнительное"],
  уплотнение: ["прокладка", "уплотнитель", "уплотнительное"], уплотнитель: ["прокладка", "уплотнение"],
  клапан: ["электроклапан", "электромагнитный клапан"],
  электроклапан: ["клапан", "электромагнитный клапан"],
  манометр: ["датчик давления"],
};
const normalized = normalizeCatalogSearch;
const normalizedAliases = new Map(Object.entries(SEARCH_ALIASES).map(([key, values]) => [normalized(key), values.map(normalized)]));
function matchesPart(part: PartRow, query: string) {
  const source = normalized([part.name, part.article, part.code, ...part.models].filter(Boolean).join(" "));
  const phrase = normalized(query.trim());
  if (source.includes(phrase)) return true;
  return phrase.split(/\s+/).every((word) => [word, ...(normalizedAliases.get(word) ?? [])].some((term) => source.includes(term)));
}

export default function PartsClient({
  parts, nodes, models,
}: {
  parts: PartRow[];
  nodes: { node: string; count: number }[];
  models: { slug: string; name: string }[];
}) {
  const [q, setQ] = useState("");
  const [node, setNode] = useState("");
  const [model, setModel] = useState("");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedModel = params.get("model");
    const requestedQuery = params.get("q");
    if (requestedModel && models.some((item) => item.slug === requestedModel)) setModel(requestedModel);
    if (requestedQuery) setQ(requestedQuery);
  }, [models]);

  const filtered = useMemo(() => {
    const needle = q.trim();
    return parts.filter((p) => {
      if (node && p.node !== node) return false;
      if (model && !p.modelSlugs.includes(model)) return false;
      if (!needle) return true;
      return matchesPart(p, needle);
    });
  }, [parts, q, node, model]);

  const shown = filtered.slice(0, limit);
  const archive = Object.values(ARCHIVE_MODELS).find((item) => normalized(item.name) === normalized(q.trim()));

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

      </aside>

      <div>
        <p className="small" style={{ marginBottom: 16 }}>
          Найдено артикулов: <b>{filtered.length}</b> из {parts.length}
        </p>

        {filtered.length === 0 && !archive ? (
          <div className="empty">
            <h3>По этому запросу артикул не найден</h3>
            <p className="small" style={{ maxWidth: "48ch", margin: "10px auto 18px" }}>
              Попробуйте часть артикула или название узла. Если детали нет в каталоге — пришлите
              модель, серийный номер и фото узла, специалист подберёт замену.
            </p>
            <a className="btn btn-solid" href="/service/">Запросить деталь</a>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="table-scroll">
              <table className="data">
                <thead>
                  <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Узел</th>
                    <th>Совместимость</th>
                    <th className="num">Цена</th>
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
                        {p.rrp ? formatPrice(p.rrp) : "по запросу"}
                      </td>
                      <td>
                        <span className="stock-label">
                          <i className={`dot st-${p.availability}`} />
                          {LABEL[p.availability]}
                        </span>
                      </td>
                      <td><a className="link-arrow" href="/service/">Запросить →</a></td>
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
        ) : null}

        {archive && <div className="archive-part-request" style={{ marginTop: filtered.length ? 28 : 0 }}>
          <p className="eyebrow">Архивная модель</p>
          <h2>Запчасти для {archive.name}</h2>
          <p>Деталь подберём по серийному номеру машины. Укажите город и опишите нужный узел — запрос получит сервисная команда.</p>
          <LeadForm form="service" className="archive-part-form" submitLabel="Запросить запчасть">
            <input type="hidden" name="task" value={`Запрос запчасти для ${archive.name}`} />
            <label className="field"><span>Модель</span><input name="model" value={archive.name} readOnly /></label>
            <label className="field"><span>Серийный номер</span><input name="serial" placeholder="С шильдика машины" required /></label>
            <label className="field"><span>Город</span><input name="city" placeholder="Ваш город" required /></label>
            <label className="field"><span>Телефон или e-mail</span><input name="contact" placeholder="Для ответа" required /></label>
            <label className="field archive-part-wide"><span>Какая деталь нужна</span><textarea name="symptom" placeholder="Опишите узел или укажите артикул" required /></label>
            <label className="small archive-part-wide archive-part-consent"><input name="consent" value="yes" type="checkbox" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label>
          </LeadForm>
        </div>}
      </div>

      <style>{`
        .parts { display: grid; grid-template-columns: minmax(0,300px) minmax(0,1fr); gap: clamp(20px,3vw,52px); align-items: start; }
        .archive-part-request { padding: clamp(22px,3vw,38px); background: var(--gray-bg); border-top: 3px solid var(--ink); }
        .archive-part-request h2 { margin: 8px 0 10px; }
        .archive-part-request>p:not(.eyebrow) { max-width: 56ch; }
        .archive-part-form { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; margin-top: 24px; }
        .archive-part-form .archive-part-wide { grid-column: 1/-1; }
        .archive-part-consent { display: flex; align-items: flex-start; gap: 10px; }
        .archive-part-consent input { width: 18px; min-height: 18px; margin-top: 3px; }
        @media (max-width: 980px) { .parts { grid-template-columns: 1fr; } }
        @media (max-width: 580px) { .archive-part-form { grid-template-columns: minmax(0,1fr); } }
      `}</style>
    </div>
  );
}
