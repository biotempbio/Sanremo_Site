"use client";

import { useMemo, useState } from "react";
import SkuImage from "../../../components/SkuImage";

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
  image: string | null;
}

const LABEL: Record<PickerSku["availability"], string> = {
  in_stock: "На складе в Москве",
  limited: "Ограниченное количество",
  reserved: "Зарезервировано",
  on_order: "Под заказ",
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
            <span className="price-from">Рекомендованная розничная цена</span>
            <span className="price num" style={{ fontSize: 32 }}>
              {current.rrp.toLocaleString("ru-RU")} ₽
            </span>
            <p className="tiny" style={{ margin: "6px 0 0" }}>
              обновлено {priceDate} · не является предложением интернет-магазина
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
          <Row k="Высота групп" v={current.groupHeight} />
          <Row k="Мощность" v={current.power ? `${String(current.power).replace(".", ",")} кВт` : null} />
          <Row k="Напряжение" v={current.voltage ? `${current.voltage} В` : null} />
          <Row k="Опции" v={current.options.length ? current.options.join(", ") : null} />
        </dl>

        <div className="picker-actions">
          <a className="btn btn-amber" href="/dealers">Где купить</a>
          <a className="btn btn-solid" href="/choose">Получить консультацию</a>
          <a className="btn" href="/compare">Сравнить</a>
        </div>

        <p className="source-note">
          Официальная дистрибуция и данные по России — компания BIO.
        </p>
      </div>

      <style>{`
        .picker { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,1fr); gap: clamp(20px,3vw,54px); align-items: start; }
        .picker-visual { background: var(--gray-bg); aspect-ratio: 4/3; }
        .picker-panel { display: flex; flex-direction: column; gap: 22px; }
        .picker-commerce { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: end;
          padding: 20px 0; border-top: 2px solid var(--ink); border-bottom: 1px solid var(--line); }
        .picker-specs { margin: 0; display: grid; gap: 0; }
        .picker-actions { display: flex; gap: 10px; flex-wrap: wrap; }
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
