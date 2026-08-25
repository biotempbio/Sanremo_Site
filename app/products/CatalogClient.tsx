"use client";

import { useMemo, useState } from "react";
import SkuImage from "../components/SkuImage";

export interface CatalogRow {
  slug: string;
  name: string;
  family: string;
  familyName: string;
  familyTagline: string;
  architecture: string;
  scenarios: string[];
  version: string | null;
  groups: number[];
  heights: string[];
  options: string[];
  colors: { name: string; hex: string }[];
  priceFrom: number | null;
  priceTo: number | null;
  inStockCount: number;
  skuCount: number;
  heroColor: string | null;
  heroImage: string | null;
  volumeBands: string[];
}

const PRICE_BANDS = [
  { id: "p1", label: "до 450 000 ₽", min: 0, max: 450_000 },
  { id: "p2", label: "450 000 – 700 000 ₽", min: 450_000, max: 700_000 },
  { id: "p3", label: "700 000 – 1 000 000 ₽", min: 700_000, max: 1_000_000 },
  { id: "p4", label: "от 1 000 000 ₽", min: 1_000_000, max: Infinity },
];

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function CatalogClient({
  rows,
  bands,
}: {
  rows: CatalogRow[];
  bands: { id: string; label: string }[];
}) {
  const [groups, setGroups] = useState<string[]>([]);
  const [families, setFamilies] = useState<string[]>([]);
  const [arch, setArch] = useState<string[]>([]);
  const [scen, setScen] = useState<string[]>([]);
  const [opts, setOpts] = useState<string[]>([]);
  const [vol, setVol] = useState<string[]>([]);
  const [price, setPrice] = useState<string[]>([]);
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("lineup");

  const allFamilies = useMemo(
    () => [...new Map(rows.map((r) => [r.family, r.familyName])).entries()],
    [rows]
  );
  const allArch = useMemo(() => [...new Set(rows.map((r) => r.architecture))], [rows]);
  const allScen = useMemo(() => [...new Set(rows.flatMap((r) => r.scenarios))], [rows]);
  const allOpts = useMemo(() => [...new Set(rows.flatMap((r) => r.options))].sort(), [rows]);
  const allGroups = useMemo(
    () => [...new Set(rows.flatMap((r) => r.groups))].sort((a, b) => a - b),
    [rows]
  );

  const filtered = useMemo(() => {
    const out = rows.filter((r) => {
      if (families.length && !families.includes(r.family)) return false;
      if (groups.length && !r.groups.some((g) => groups.includes(String(g)))) return false;
      if (arch.length && !arch.includes(r.architecture)) return false;
      if (scen.length && !r.scenarios.some((s) => scen.includes(s))) return false;
      if (opts.length && !opts.every((o) => r.options.includes(o))) return false;
      if (vol.length && !r.volumeBands.some((v) => vol.includes(v))) return false;
      if (stockOnly && r.inStockCount === 0) return false;
      if (price.length) {
        const ok = price.some((id) => {
          const b = PRICE_BANDS.find((x) => x.id === id)!;
          return r.priceFrom !== null && r.priceFrom >= b.min && r.priceFrom < b.max;
        });
        if (!ok) return false;
      }
      return true;
    });
    const cmp: Record<string, (a: CatalogRow, b: CatalogRow) => number> = {
      lineup: () => 0,
      "price-asc": (a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0),
      "price-desc": (a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0),
      stock: (a, b) => b.inStockCount - a.inStockCount,
      name: (a, b) => a.name.localeCompare(b.name, "ru"),
    };
    return [...out].sort(cmp[sort]);
  }, [rows, families, groups, arch, scen, opts, vol, price, stockOnly, sort]);

  const active =
    families.length + groups.length + arch.length + scen.length + opts.length + vol.length +
    price.length + (stockOnly ? 1 : 0);

  const reset = () => {
    setFamilies([]); setGroups([]); setArch([]); setScen([]);
    setOpts([]); setVol([]); setPrice([]); setStockOnly(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,265px) minmax(0,1fr)", gap: "clamp(20px,3vw,52px)", alignItems: "start" }}
         className="catalog-layout">
      <aside className="filters">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
          <h3 style={{ fontSize: 16 }}>Фильтры</h3>
          {active > 0 && (
            <button className="chip" onClick={reset}>Сбросить · {active}</button>
          )}
        </div>

        <Group title="Семейство">
          {allFamilies.map(([slug, name]) => (
            <Chip key={slug} on={families.includes(slug)} onClick={() => setFamilies(toggle(families, slug))}>{name}</Chip>
          ))}
        </Group>

        <Group title="Количество групп">
          {allGroups.map((g) => (
            <Chip key={g} on={groups.includes(String(g))} onClick={() => setGroups(toggle(groups, String(g)))}>{g} гр.</Chip>
          ))}
        </Group>

        <Group title="Ориентир по потоку">
          {bands.map((b) => (
            <Chip key={b.id} on={vol.includes(b.id)} onClick={() => setVol(toggle(vol, b.id))}>{b.label}</Chip>
          ))}
        </Group>

        <Group title="Архитектура">
          {allArch.map((a) => (
            <Chip key={a} on={arch.includes(a)} onClick={() => setArch(toggle(arch, a))}>{a}</Chip>
          ))}
        </Group>

        <Group title="Сценарий">
          {allScen.map((s) => (
            <Chip key={s} on={scen.includes(s)} onClick={() => setScen(toggle(scen, s))}>{s}</Chip>
          ))}
        </Group>

        <Group title="Опции и исполнение">
          {allOpts.map((o) => (
            <Chip key={o} on={opts.includes(o)} onClick={() => setOpts(toggle(opts, o))}>{o}</Chip>
          ))}
        </Group>

        <Group title="Диапазон РРЦ">
          {PRICE_BANDS.map((b) => (
            <Chip key={b.id} on={price.includes(b.id)} onClick={() => setPrice(toggle(price, b.id))}>{b.label}</Chip>
          ))}
        </Group>

        <Group title="Наличие">
          <Chip on={stockOnly} onClick={() => setStockOnly(!stockOnly)}>Только со склада</Chip>
        </Group>

      </aside>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          <p className="small" style={{ margin: 0 }}>
            Найдено моделей: <b>{filtered.length}</b> из {rows.length}
          </p>
          <label className="field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ margin: 0 }}>Сортировка</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ minWidth: 210, minHeight: 42 }}>
              <option value="price-asc">РРЦ: по возрастанию</option>
              <option value="lineup">Порядок линейки</option>
              <option value="price-desc">РРЦ: по убыванию</option>
              <option value="stock">Сначала со склада</option>
              <option value="name">По названию</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <h3>Под эти условия в российской матрице моделей нет</h3>
            <p className="small" style={{ maxWidth: "48ch", margin: "10px auto 18px" }}>
              Снимите часть фильтров или опишите задачу — специалист BIO подберёт конфигурацию.
            </p>
            <button className="btn" onClick={reset}>Сбросить фильтры</button>
          </div>
        ) : (
          <div className="grid g3">
            {filtered.map((r) => (
              <article className="card" key={r.slug}>
                <div className="card-visual">
                  <SkuImage src={r.heroImage} alt={`Sanremo ${r.name}`} groups={r.groups[0]} color={r.heroColor} label={r.name} />
                </div>
                <div className="card-body">
                  <p className="eyebrow" style={{ margin: 0 }}>{r.familyName}</p>
                  <h3><a href={`/products/${r.family}/${r.slug}`}>{r.name}</a></h3>
                  <p className="small" style={{ margin: 0 }}>{r.familyTagline}</p>
                  <div className="chips">
                    <span className="tag">{r.groups.join("/")} гр.</span>
                    <span className="tag">{r.architecture}</span>
                    {r.options.slice(0, 2).map((o) => <span className="tag" key={o}>{o}</span>)}
                  </div>
                  {r.colors.length > 0 && (
                    <div className="swatches">
                      {r.colors.slice(0, 8).map((c) => (
                        <i className="swatch" key={c.name} style={{ background: c.hex }} title={c.name} />
                      ))}
                      <span className="tiny">{r.colors.length} исполн.</span>
                    </div>
                  )}
                  <div className="card-foot">
                    <div>
                      <span className="price-from">РРЦ от</span>
                      <span className="price num">{r.priceFrom?.toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <span className="stock-label">
                      <i className={`dot ${r.inStockCount ? "st-in_stock" : "st-reserved"}`} />
                      {r.inStockCount ? `${r.inStockCount} со склада` : "Уточнить наличие"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 980px) {
          .catalog-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="filter-group">
      <h4>{title}</h4>
      <div className="chips">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="chip" aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}
