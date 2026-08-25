"use client";

import { useState } from "react";
import { MachineVisual } from "./Bits";

/**
 * Фотография конкретной конфигурации из медиабиблиотеки BIO.
 * Если файла нет или портал недоступен — показываем схему машины в цвете
 * исполнения, а не битую картинку и не чужой рендер (ТЗ §16.5).
 */
export default function SkuImage({
  src,
  alt,
  groups,
  color,
  label,
  fit = "contain",
}: {
  src: string | null;
  alt: string;
  groups?: number | null;
  color?: string | null;
  label?: string;
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <MachineVisual groups={groups} color={color} label={label} />;
  }

  return (
    <figure className="sku-photo" style={{ margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} style={{ objectFit: fit }} />
      {label ? <figcaption>{label}</figcaption> : null}
      <style>{`
        .sku-photo { position: relative; width: 100%; height: 100%; background: #fff; }
        .sku-photo img { width: 100%; height: 100%; }
        .sku-photo figcaption { position: absolute; left: 12px; bottom: 10px;
          font-family: var(--sans); font-size: 10px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--muted); }
      `}</style>
    </figure>
  );
}
