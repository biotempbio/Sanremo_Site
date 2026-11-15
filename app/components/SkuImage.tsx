"use client";

import { useState } from "react";
import { MachineVisual } from "./Bits";
import { ResponsiveImage } from "./ResponsiveImage";

/**
 * Крупное изображение из локальной медиабиблиотеки.
 * Если файла нет — показываем схему машины в цвете исполнения.
 */
export default function SkuImage({
  src,
  alt,
  groups,
  color,
  label,
  width = 1536,
  height = 864,
  fit = "contain",
  eager = false,
}: {
  src: string | null;
  alt: string;
  groups?: number | null;
  color?: string | null;
  label?: string;
  width?: number;
  height?: number;
  fit?: "cover" | "contain";
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <MachineVisual groups={groups} color={color} label={label} />;
  }

  return (
    <figure className="sku-photo" style={{ margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src.startsWith("/") ? <ResponsiveImage src={src} alt={alt} width={width} height={height} style={{ objectFit: fit }} eager={eager} /> : <img src={src} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} style={{ objectFit: fit }} />}
      {label ? <figcaption>{label}</figcaption> : null}
    </figure>
  );
}
