import { AVAILABILITY_LABEL, Availability, money, PRICE_DATE } from "@/lib/catalog";

export function Stock({ status, free }: { status: Availability; free?: number }) {
  return (
    <span className="stock-label">
      <i className={`dot st-${status}`} />
      {AVAILABILITY_LABEL[status]}
      {status === "in_stock" && free && free >= 3 ? ` · ${free} шт.` : ""}
    </span>
  );
}

export function Price({ value, from, note = true }: { value: number | null; from?: boolean; note?: boolean }) {
  return (
    <div>
      {from ? <span className="price-from">РРЦ от</span> : <span className="price-from">РРЦ</span>}
      <span className="price num">{money(value)}</span>
      {note ? <span className="tiny" style={{ display: "block", marginTop: 4 }}>обновлено {PRICE_DATE}</span> : null}
    </div>
  );
}

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="crumbs wrap" aria-label="Хлебные крошки">
      {items.map((i, n) => (
        <span key={n}>
          {n > 0 ? <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span> : null}
          {i.href ? <a href={i.href}>{i.label}</a> : <span>{i.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/**
 * Схематичный визуал кофемашины.
 * Осознанно НЕ фотография: фотобанк по каждому SKU подключается из медиабиблиотеки
 * Sanremo/BIO (ТЗ §16.5 — запрещено выдавать рендер за документальное фото).
 */
export function MachineVisual({
  groups = 2,
  color = "#1a1a1a",
  label,
}: {
  groups?: number | null;
  color?: string | null;
  label?: string;
}) {
  const g = Math.min(Math.max(groups ?? 2, 1), 3);
  const body = color || "#1a1a1a";
  const light = isLight(body);
  const stroke = light ? "#8c8a86" : "rgba(255,255,255,.35)";
  const metal = "#b9bcbe";
  const width = 120 + g * 66;
  const first = width / 2 - ((g - 1) * 66) / 2;
  const positions = Array.from({ length: g }, (_, i) => first + i * 66);

  return (
    <figure className="machine-vis" style={{ margin: 0 }}>
      <svg
        className="mv-body"
        viewBox={`0 0 ${width} 190`}
        role="img"
        aria-label={label ?? "Схема кофемашины"}
        style={{ maxHeight: "82%" }}
      >
        {/* ножки */}
        <rect x="26" y="170" width="12" height="10" fill="#9a9894" />
        <rect x={width - 38} y="170" width="12" height="10" fill="#9a9894" />
        {/* поддон */}
        <rect x="18" y="150" width={width - 36} height="20" fill={body} stroke={stroke} />
        <rect x="26" y="154" width={width - 52} height="7" fill={metal} opacity=".9" />
        {/* корпус */}
        <rect x="10" y="42" width={width - 20} height="82" fill={body} stroke={stroke} />
        {/* верхний рабочий стол */}
        <rect x="4" y="28" width={width - 8} height="16" fill={body} stroke={stroke} />
        <rect x="14" y="20" width={width - 28} height="8" rx="1" fill={metal} opacity=".55" />
        {/* группы */}
        {positions.map((x) => (
          <g key={x}>
            <rect x={x - 20} y="112" width="40" height="16" fill={metal} />
            <rect x={x - 13} y="128" width="26" height="9" fill="#8e9194" />
            <rect x={x - 24} y="137" width="48" height="5" fill="#6f7275" />
            <circle cx={x} cy="86" r="15" fill="#22262a" stroke={metal} strokeWidth="2.5" />
            <circle cx={x} cy="86" r="7" fill="#2f6f9a" opacity=".9" />
          </g>
        ))}
        {/* паровые краны */}
        <path d={`M26 96 v34 h6`} stroke={metal} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d={`M${width - 26} 96 v34 h-6`} stroke={metal} strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="26" cy="92" r="5" fill={metal} />
        <circle cx={width - 26} cy="92" r="5" fill={metal} />
        {/* манометр */}
        <circle cx={width / 2} cy="56" r="8" fill={light ? "#fff" : "#e9e7e3"} stroke={stroke} />
      </svg>
      {label ? <figcaption>{label}</figcaption> : null}
    </figure>
  );
}

function isLight(hex: string) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16),
    g = parseInt(h.slice(2, 4), 16),
    b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function SourceNote({ children }: { children: React.ReactNode }) {
  return <p className="source-note">{children}</p>;
}
