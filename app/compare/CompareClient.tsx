"use client";

import { useState } from "react";
import Image from "next/image";
import { AVAILABILITY_LABEL, CATALOG_LINEUP, VOLUME_BANDS, familyBySlug, modelBySlug, modelPath, money, skusOfModel } from "@/lib/catalog";

const defaults = ["zoe-competition", "d8", "f18-sb"];

const volumeEdges = [0, 100, 200, 300, 500];
function flowRange(slug: string) {
  const indexes = VOLUME_BANDS.flatMap((band, index) => band.models.includes(slug) ? [index] : []);
  if (!indexes.length) return "—";
  const first = indexes[0];
  const last = indexes[indexes.length - 1];
  if (first === 0 && last === 0) return "до 100 чашек в день";
  if (first === 4) return "500+ чашек в день";
  const upper = last === 4 ? "500+" : volumeEdges[last + 1];
  return `${first === 0 ? `до ${upper}` : `${volumeEdges[first]}–${upper}`} чашек в день`;
}

function line(slug: string) {
  const entry = CATALOG_LINEUP.find((item) => item.slug === slug)!;
  const model = modelBySlug(slug)!;
  const family = familyBySlug(model.family)!;
  const skus = skusOfModel(slug);
  const stock = skus.reduce((sum, sku) => sum + sku.free, 0);
  const first = skus.find((sku) => sku.free > 0) ?? skus[0];
  const flow = flowRange(slug);
  const controls = [...new Set(skus.map((sku) => sku.control).filter(Boolean))].join("; ");
  return { entry, model, family, stock, first, flow, controls };
}

export default function CompareClient() {
  const [selected, setSelected] = useState<string[]>(defaults);
  const cols = selected.map(line);
  function toggle(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) return current.length > 2 ? current.filter((item) => item !== slug) : current;
      return current.length === 3 ? current : [...current, slug];
    });
  }
  const rows = [
    ["Поток", (c: ReturnType<typeof line>) => c.flow],
    ["Группы", (c: ReturnType<typeof line>) => c.model.groupsAvailable.join(" / ")],
    ["Бойлеры", (c: ReturnType<typeof line>) => c.family.architecture],
    ["Управление", (c: ReturnType<typeof line>) => c.controls || c.model.version || "—"],
    ["Возможности", (c: ReturnType<typeof line>) => c.model.optionsAvailable.join(" · ") || "Базовая комплектация"],
    ["Исполнения", (c: ReturnType<typeof line>) => `${c.model.skuCount} исполнений`],
    ["Наличие", (c: ReturnType<typeof line>) => c.first ? AVAILABILITY_LABEL[c.first.availability] : "—"],
  ] as const;

  return <>
    <div className="chips" style={{ marginTop: 28 }}>
      {CATALOG_LINEUP.map((item) => <button key={item.slug} type="button" aria-pressed={selected.includes(item.slug)} aria-disabled={selected.length === 3 && !selected.includes(item.slug)} className={selected.includes(item.slug) ? "btn btn-solid" : "btn"} onClick={() => toggle(item.slug)}>{item.label}</button>)}
    </div>
    <p className="tiny" style={{ marginTop: 12 }}>{selected.length === 3 ? "Выбрано три линейки — снимите одну, чтобы добавить другую" : "Можно добавить ещё одну линейку"}</p>
    <div className="table-scroll compare-desktop" style={{ marginTop: 30 }}><table className="data" style={{ minWidth: 860 }}>
      <thead><tr><th style={{ width: 190 }} />{cols.map((c) => <th key={c.model.slug} style={{ verticalAlign: "top", minWidth: 250 }}>
        <Image src={c.entry.image} alt={`Sanremo ${c.entry.label}`} width={520} height={340} style={{ width: "100%", height: 170, objectFit: "contain", background: "var(--gray)" }} />
        <p className="eyebrow" style={{ margin: "16px 0 7px" }}>{c.family.tagline}</p><h2 style={{ fontSize: 28 }}>{c.entry.label}</h2>
        <p style={{ margin: "10px 0 4px" }}><b>от {money(c.model.priceFrom)}</b></p><p className="tiny" style={{ margin: 0 }}>{c.stock > 0 ? `На складе в Москве: ${c.stock}` : "Под заказ"}</p>
        <a className="btn btn-solid" href={modelPath(c.model)} style={{ marginTop: 16 }}>Открыть линейку</a>
      </th>)}</tr></thead>
      <tbody>{rows.map(([label, value]) => <tr key={label}><td className="eyebrow">{label}</td>{cols.map((c) => <td key={c.model.slug}>{value(c)}</td>)}</tr>)}</tbody>
    </table></div>
    <div className="compare-mobile" aria-label="Сравнение выбранных линеек">
      {cols.map((c) => <article className="compare-mobile-card" key={c.model.slug}>
        <div className="compare-mobile-head">
          <Image src={c.entry.image} alt={`Sanremo ${c.entry.label}`} width={520} height={340} />
          <div><p className="eyebrow">{c.family.tagline}</p><h2>{c.entry.label}</h2><p className="compare-mobile-price">от {money(c.model.priceFrom)}</p>
            <p className="small">{c.stock > 0 ? "На складе в Москве" : "Под заказ"}</p></div>
        </div>
        <dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value(c)}</dd></div>)}</dl>
        <a className="btn btn-solid" href={modelPath(c.model)}>Открыть линейку</a>
      </article>)}
    </div>
    <div className="grid g2" style={{ marginTop: 40 }}>
      <div className="card"><div className="card-body"><p className="eyebrow">Как читать таблицу</p><p className="small" style={{ margin: 0 }}>Поток определяет группы и архитектуру бойлеров, а контроль температуры и профилирование — возможности кофейной программы.</p></div></div>
      <div className="card"><div className="card-body"><h3>Подбор под ваш формат</h3><p className="small">Ответьте на шесть вопросов — подбор предложит подходящие исполнения с ценами и наличием.</p><a className="btn btn-solid" href="/choose/">Перейти к подбору</a></div></div>
    </div>
  </>;
}
