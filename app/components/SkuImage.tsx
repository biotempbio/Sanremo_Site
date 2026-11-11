"use client";

import { useState } from "react";
import { MachineVisual } from "./Bits";
import { ResponsiveImage } from "./ResponsiveImage";

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
      {src.startsWith("/") ? <ResponsiveImage src={src} alt={alt} width={1536} height={864} style={{ objectFit: fit }} /> : <img src={src} alt={alt} width="1536" height="864" loading="lazy" decoding="async" onError={() => setFailed(true)} style={{ objectFit: fit }} />}
      {label ? <figcaption>{label}</figcaption> : null}
    </figure>
  );
}
