"use client";

import { useState } from "react";
import Image from "next/image";
import { AVAILABILITY_LABEL, CATALOG_LINEUP, VOLUME_BANDS, familyBySlug, modelBySlug, modelPath, money, skusOfModel } from "@/lib/catalog";

const defaults = ["zoe-competition", "d8", "f18-sb"];

function line(slug: string) {
  const entry = CATALOG_LINEUP.find((item) => item.slug === slug)!;
  const model = modelBySlug(slug)!;
  const family = familyBySlug(model.family)!;
  const skus = skusOfModel(slug);
  const stock = skus.reduce((sum, sku) => sum + sku.free, 0);
  const first = skus.find((sku) => sku.free > 0) ?? skus[0];
  const flow = VOLUME_BANDS.filter((band) => band.models.includes(slug)).map((band) => band.label);
  const controls = [...new Set(skus.map((sku) => sku.control).filter(Boolean))].join("; ");
  return { entry, model, family, stock, first, flow, controls };
}

export default function CompareClient() {
  const [selected, setSelected] = useState<string[]>(defaults);
  const cols = selected.map(line);
  function toggle(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) return current.length > 2 ? current.filter((item) => item !== slug) : current;
      return current.length === 3 ? [...current.slice(1), slug] : [...current, slug];
    });
  }
  const rows = [
    ["Поток", (c: ReturnType<typeof line>) => c.flow.join(" · ") || "—"],
    ["Группы", (c: ReturnType<typeof line>) => c.model.groupsAvailable.join(" / ")],
    ["Бойлеры", (c: ReturnType<typeof line>) => c.family.architecture],
    ["Управление", (c: ReturnType<typeof line>) => c.controls || c.model.version || "—"],
    ["Возможности", (c: ReturnType<typeof line>) => c.model.optionsAvailable.join(" · ") || "Базовая комплектация"],
    ["Исполнения", (c: ReturnType<typeof line>) => `${c.model.skuCount} конфигураций`],
    ["Наличие", (c: ReturnType<typeof line>) => c.first ? AVAILABILITY_LABEL[c.first.availability] : "—"],
  ] as const;

  return <>
    <div className="chips" style={{ marginTop: 28 }}>
      {CATALOG_LINEUP.map((item) => <button key={item.slug} type="button" className={selected.includes(item.slug) ? "btn btn-solid" : "btn"} onClick={() => toggle(item.slug)}>{item.label}</button>)}
    </div>
    <p className="tiny" style={{ marginTop: 12 }}>{selected.length === 3 ? "Выбрано три линейки — снимите одну, чтобы добавить другую" : "Можно добавить ещё одну линейку"}</p>
    <div className="table-scroll" style={{ marginTop: 30 }}><table className="data" style={{ minWidth: 860 }}>
      <thead><tr><th style={{ width: 190 }} />{cols.map((c) => <th key={c.model.slug} style={{ verticalAlign: "top", minWidth: 250 }}>
        <Image src={c.entry.image} alt={`Sanremo ${c.entry.label}`} width={520} height={340} style={{ width: "100%", height: 170, objectFit: "contain", background: "var(--gray)" }} />
        <p className="eyebrow" style={{ margin: "16px 0 7px" }}>{c.family.tagline}</p><h2 style={{ fontSize: 28 }}>{c.entry.label}</h2>
        <p style={{ margin: "10px 0 4px" }}><b>от {money(c.model.priceFrom)}</b></p><p className="tiny" style={{ margin: 0 }}>{c.stock > 0 ? `На складе в Москве: ${c.stock}` : "Под заказ"}</p>
        <a className="btn btn-solid" href={modelPath(c.model)} style={{ marginTop: 16 }}>Открыть линейку</a>
      </th>)}</tr></thead>
      <tbody>{rows.map(([label, value]) => <tr key={label}><td className="eyebrow">{label}</td>{cols.map((c) => <td key={c.model.slug}>{value(c)}</td>)}</tr>)}</tbody>
    </table></div>
    <div className="grid g2" style={{ marginTop: 40 }}>
      <div className="card"><div className="card-body"><p className="eyebrow">Как читать таблицу</p><p className="small" style={{ margin: 0 }}>Поток определяет группы и архитектуру бойлеров, а контроль температуры и профилирование — возможности кофейной программы.</p></div></div>
      <div className="card"><div className="card-body"><h3>Подбор под ваш формат</h3><p className="small">Ответьте на шесть вопросов — подбор предложит подходящие конфигурации с РРЦ и наличием.</p><a className="btn btn-solid" href="/choose/">Перейти к подбору</a></div></div>
    </div>
  </>;
}
