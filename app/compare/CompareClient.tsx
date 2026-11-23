"use client";

import { useState } from "react";
import Image from "next/image";
import { AVAILABILITY_LABEL, CATALOG_LINEUP, VOLUME_BANDS, architectureForModel, familyBySlug, modelBySlug, modelPath, money, skusOfModel } from "@/lib/catalog";
import { editorialOffer } from "@/lib/editorial-offers";
import { pluralize } from "@/lib/format";

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
  const groups = model.groupsAvailable.includes(2) ? 2 : 1;
  const offer = editorialOffer(slug, groups);
  const first = offer?.sku;
  const skus = skusOfModel(slug).filter((sku) => sku.groups === groups);
  const stock = first?.free ?? 0;
  const flow = flowRange(slug);
  const controls = first?.control ? first.control.charAt(0).toLocaleUpperCase("ru-RU") + first.control.slice(1) : "";
  return { entry, model, family, stock, first, flow, controls, image: offer?.image, href: offer?.href ?? modelPath(model), versions: skus.length };

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
    ["Группы", (c: ReturnType<typeof line>) => c.first?.groups === 1 ? "1 · отдельная задача" : String(c.first?.groups ?? "—")],
    ["Бойлеры", (c: ReturnType<typeof line>) => architectureForModel(c.model)],
    ["Управление", (c: ReturnType<typeof line>) => c.controls || c.model.version || "—"],
    ["Возможности", (c: ReturnType<typeof line>) => c.first?.options.join(" · ") || "Базовая комплектация"],
    ["Исполнения", (c: ReturnType<typeof line>) => `${c.versions} ${pluralize(c.versions, "исполнение", "исполнения", "исполнений")}`],
    ["Наличие", (c: ReturnType<typeof line>) => c.first ? AVAILABILITY_LABEL[c.first.availability] : "—"],
  ] as const;

  return <>
    <div className="chips" style={{ marginTop: 28 }}>
      {CATALOG_LINEUP.map((item) => <button key={item.slug} type="button" aria-pressed={selected.includes(item.slug)} aria-disabled={selected.length === 3 && !selected.includes(item.slug)} className={selected.includes(item.slug) ? "btn btn-solid" : "btn"} onClick={() => toggle(item.slug)}>{item.label}</button>)}
    </div>
    <p className="tiny" style={{ marginTop: 12 }}>{selected.length === 3 ? "Выбрано три линейки — снимите одну, чтобы добавить другую" : "Можно добавить ещё одну линейку"}</p>
    <div className="table-scroll compare-desktop" style={{ marginTop: 30 }}><table className="data" style={{ minWidth: 860 }}>
      <thead><tr><th style={{ width: 190 }} />{cols.map((c) => <th key={c.model.slug} style={{ verticalAlign: "top", minWidth: 250 }}>
        {c.image && <Image src={c.image} alt={`Sanremo ${c.entry.label}`} width={520} height={340} style={{ width: "100%", height: 170, objectFit: "contain", background: "var(--gray)" }} />}
        <p className="eyebrow" style={{ margin: "16px 0 7px" }}>{c.family.tagline}</p><h2 style={{ fontSize: 28 }}>{c.model.name}</h2>
        <p style={{ margin: "10px 0 4px" }}><b>{c.first ? money(c.first.rrp) : "Цена по запросу"}</b></p><p className="tiny" style={{ margin: 0 }}>{c.stock > 0 ? `На складе в Москве: ${c.stock}` : "Под заказ · 6–8 недель"}</p>
        <a className="btn btn-solid" href={c.href} style={{ marginTop: 16 }}>Открыть исполнение</a>
      </th>)}</tr></thead>
      <tbody>{rows.map(([label, value]) => <tr key={label}><td className="eyebrow">{label}</td>{cols.map((c) => <td key={c.model.slug}>{value(c)}</td>)}</tr>)}</tbody>
    </table></div>
    <div className="compare-mobile" aria-label="Сравнение выбранных линеек">
      {cols.map((c) => <article className="compare-mobile-card" key={c.model.slug}>
        <div className="compare-mobile-head">
          {c.image && <Image src={c.image} alt={`Sanremo ${c.entry.label}`} width={520} height={340} />}
          <div><p className="eyebrow">{c.family.tagline}</p><h2>{c.model.name}</h2><p className="compare-mobile-price">{c.first ? money(c.first.rrp) : "Цена по запросу"}</p>
            <p className="small">{c.stock > 0 ? "На складе в Москве" : "Под заказ · 6–8 недель"}</p></div>
        </div>
        <dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value(c)}</dd></div>)}</dl>
        <a className="btn btn-solid" href={c.href}>Открыть исполнение</a>
      </article>)}
    </div>
    <div className="grid g2" style={{ marginTop: 40 }}>
      <div className="card"><div className="card-body"><p className="eyebrow">Как читать таблицу</p><p className="small" style={{ margin: 0 }}>Поток определяет группы и архитектуру бойлеров, а контроль температуры и профилирование — возможности кофейной программы.</p></div></div>
      <div className="card"><div className="card-body"><h3>Подбор под ваш формат</h3><p className="small">Ответьте на шесть вопросов — подбор предложит подходящие исполнения с ценами и наличием.</p><a className="btn btn-solid" href="/choose/">Перейти к подбору</a></div></div>
    </div>
  </>;
}
