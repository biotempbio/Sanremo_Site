"use client";

import { useMemo, useState } from "react";
import SkuImage from "../../../components/SkuImage";
import { formatPrice } from "@/lib/format";
import type { DescriptionBlock } from "@/lib/catalog";

export interface PickerSku {
  code: string;
  vendorCode: string | null;
  title: string;
  groups: number | null;
  groupHeight: string | null;
  color: string | null;
  colorHex: string | null;
  edition: string | null;
  options: string[];
  rrp: number;
  availability: "in_stock" | "limited" | "reserved" | "on_order";
  free: number;
  power: number | null;
  voltage: string | null;
  boilerTotal: string | null;
  sizeNet: { w: number; h: number; d: number } | null;
  weightNet: number | null;
  secondaryProps: { name: string; value: string }[];
  descriptionBlocks: DescriptionBlock[];
  image: string | null;
}

const LABEL: Record<PickerSku["availability"], string> = {
  in_stock: "На складе в Москве",
  limited: "В наличии",
  reserved: "Зарезервировано",
  on_order: "Под заказ · 6–8 недель",
};

export default function ConfigPicker({
  skus,
  modelName,
  priceDate,
}: {
  skus: PickerSku[];
  modelName: string;
  priceDate: string;
}) {
  const groupOptions = useMemo(
    () => [...new Set(skus.map((s) => s.groups).filter((g): g is number => !!g))].sort(),
    [skus]
  );
  const [groups, setGroups] = useState<number | null>(groupOptions[0] ?? null);

  const byGroups = useMemo(
    () => skus.filter((s) => (groups ? s.groups === groups : true)),
    [skus, groups]
  );
  const [code, setCode] = useState<string>(
    (byGroups.find((s) => s.availability === "in_stock") ?? byGroups[0])?.code ?? ""
  );

  const current = byGroups.find((s) => s.code === code) ?? byGroups[0];

  /** Цвет + исполнение, если один и тот же цвет встречается в нескольких версиях. */
  const baseLabel = (s: PickerSku) => {
    const base = s.color ?? s.edition ?? s.code;
    const dup = byGroups.filter((x) => (x.color ?? x.edition ?? x.code) === base).length > 1;
    return dup && s.edition && s.edition !== "Base" ? `${base} · ${s.edition}` : base;
  };
  const labelOf = (s: PickerSku) => {
    const l = baseLabel(s);
    return byGroups.filter((x) => baseLabel(x) === l).length > 1
      ? `${l} · ${s.vendorCode ?? s.code}`
      : l;
  };

  const pickGroups = (g: number) => {
    setGroups(g);
    const pool = skus.filter((s) => s.groups === g);
    setCode((pool.find((s) => s.availability === "in_stock") ?? pool[0])?.code ?? "");
  };

  if (!current) return null;
  const keySpecs = [
    ["Группы", current.groups ? String(current.groups) : null],
    ["Высота групп", current.groupHeight],
    ["Мощность", current.power ? `${String(current.power).replace(".", ",")}\u00a0кВт` : null],
    ["Напряжение", current.voltage ? `${current.voltage}\u00a0В` : null],
    ["Объём бойлеров", current.boilerTotal ? `${current.boilerTotal}\u00a0л` : null],
    ["Габариты", current.sizeNet ? `${current.sizeNet.w} × ${current.sizeNet.h} × ${current.sizeNet.d}\u00a0мм` : null],
    ["Масса", current.weightNet ? `${String(current.weightNet).replace(".", ",")}\u00a0кг` : null],
    ...current.secondaryProps.map((item) => [item.name, item.value]),
  ].filter((item): item is string[] => Boolean(item[0] && item[1])).slice(0, 6);

  return (
    <div className="picker">
      <div className="picker-visual">
        <SkuImage
          src={current.image}
          alt={`Sanremo ${modelName}, ${current.groups ?? ""} гр., ${current.color ?? ""}`}
          groups={current.groups}
          color={current.colorHex}
          label={`${modelName} · ${current.groups ?? "?"} гр. · ${current.color ?? "исполнение"}`}
        />
      </div>

      <div className="picker-panel">
        {groupOptions.length > 1 && (
          <div className="filter-group">
            <h4>Количество групп</h4>
            <div className="chips">
              {groupOptions.map((g) => (
                <button key={g} className="chip" aria-pressed={groups === g} onClick={() => pickGroups(g)}>
                  {g} гр.
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="filter-group">
          <h4>Исполнение и цвет · {byGroups.length}</h4>
          <div className="chips">
            {byGroups.map((s) => (
              <button
                key={s.code}
                className="chip"
                aria-pressed={s.code === current.code}
                onClick={() => setCode(s.code)}
                title={s.title}
                style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
              >
                {s.colorHex ? <i className="swatch" style={{ background: s.colorHex, width: 13, height: 13 }} /> : null}
                {labelOf(s)}
              </button>
            ))}
          </div>
          <p className="tiny" style={{ marginTop: 8 }}>
            Показаны только сочетания, реально поддерживаемые в российском ассортименте.
          </p>
        </div>

        <div className="picker-commerce">
          <div>
            <span className="price-from">Цена</span>
            <span className="price num" style={{ fontSize: 32 }}>
              {current.rrp > 0 ? formatPrice(current.rrp) : "Цена по запросу"}
            </span>
            <p className="tiny" style={{ margin: "6px 0 0" }}>
              Цены и наличие на {priceDate}
            </p>
          </div>
          <div>
            <span className="stock-label">
              <i className={`dot st-${current.availability}`} />
              {LABEL[current.availability]}
              {current.availability === "in_stock" && current.free >= 3 ? ` · ${current.free} шт.` : ""}
            </span>
            <p className="tiny" style={{ margin: "6px 0 0" }}>
              Артикул {current.vendorCode ?? current.code}
            </p>
          </div>
        </div>

        <dl className="picker-specs">
          {keySpecs.map(([name, value]) => <Row key={`${name}:${value}`} k={name} v={value} />)}
        </dl>

        <div className="picker-actions">
          <a className="btn btn-amber" href="/dealers/">Где купить</a>
          <a className="btn btn-solid" href={`/contacts/?model=${encodeURIComponent(modelName)}&sku=${encodeURIComponent(current.vendorCode ?? current.code)}`}>Запросить конфигурацию</a>
          <a className="btn" href="/compare/">Сравнить</a>
        </div>

      </div>

      {current.descriptionBlocks.length > 0 || current.secondaryProps.length > 0 ? <div className="picker-details">
        {current.descriptionBlocks.length > 0 ? <section className="picker-description">
          <p className="eyebrow">Описание исполнения</p>
          <h2>О Sanremo {modelName}</h2>
          <div className="picker-description-copy">{current.descriptionBlocks.map((block, index) => block.type === "heading"
            ? <h3 key={index}>{block.text}</h3>
            : block.type === "list" ? <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
            : <p key={index}>{block.text}</p>)}</div>
        </section> : null}
        {current.secondaryProps.length > 0 ? <details className="picker-all-specs">
          <summary>Все характеристики исполнения · {current.secondaryProps.length}</summary>
          <dl>{current.secondaryProps.map((item) => <Row key={`${item.name}:${item.value}`} k={item.name} v={item.value} />)}</dl>
        </details> : null}
      </div> : null}

      <style>{`
        .picker { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,1fr); gap: clamp(20px,3vw,54px); align-items: start; }
        .picker-visual { background: var(--gray-bg); aspect-ratio: 4/3; }
        .picker-panel { display: flex; flex-direction: column; gap: 22px; }
        .picker-commerce { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: end;
          padding: 20px 0; border-top: 2px solid var(--ink); border-bottom: 1px solid var(--line); }
        .picker-specs { margin: 0; display: grid; gap: 0; }
        .picker-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .picker-details { grid-column: 1 / -1; display: grid; gap: 28px; padding-top: clamp(26px,4vw,48px); border-top: 1px solid var(--line); }
        .picker-description { max-width: 720px; }
        .picker-description h2 { font-size: clamp(28px,3vw,40px); margin-bottom: 18px; }
        .picker-description-copy { line-height: 1.65; overflow-wrap: anywhere; }
        .picker-description-copy p, .picker-description-copy ul { margin: 0 0 16px; }
        .picker-description-copy h3 { font-size: clamp(20px,2vw,26px); margin: 32px 0 12px; }
        .picker-description-copy li { margin-bottom: 7px; }
        .picker-all-specs { max-width: 900px; border-top: 1px solid var(--line); padding-top: 16px; }
        .picker-all-specs summary { cursor: pointer; font-weight: 600; }
        .picker-all-specs dl { margin: 16px 0 0; }
        @media (max-width: 900px) { .picker { grid-template-columns: 1fr; } .picker-commerce { grid-template-columns: 1fr; align-items: start; } }
      `}</style>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | null }) {
  if (!v) return null;
  return (
    <div className="spec-row" style={{ padding: "9px 0" }}>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
