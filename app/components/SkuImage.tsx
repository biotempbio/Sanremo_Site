"use client";

import { useState } from "react";
import { ResponsiveImage } from "./ResponsiveImage";

/**
 * Крупное изображение из локальной медиабиблиотеки.
 * Без подтверждённого фото не подменяем цвет другой машиной.
 */
export default function SkuImage({
  src,
  alt,
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
    return <figure className="sku-photo sku-photo-placeholder" style={{ margin: 0 }} role="img" aria-label={`${alt}. Фото этого исполнения скоро добавим`}>
      <div className="sku-photo-placeholder-inner">
        <span className="sku-photo-placeholder-swatch" style={{ background: color || "#dedbd5" }} aria-hidden="true" />
        <span>Фото этого исполнения<br />скоро добавим</span>
      </div>
      <style>{`.sku-photo-placeholder { display: grid; place-items: center; min-height: 320px; background: #f3f1ed; }
        .sku-photo-placeholder-inner { display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; color: #575550; font-size: clamp(18px, 2vw, 24px); line-height: 1.3; }
        .sku-photo-placeholder-swatch { display: block; width: 64px; height: 64px; border: 1px solid #b9b5ae; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,.08); }`}</style>
    </figure>;
  }

  return (
    <figure className="sku-photo" style={{ margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src.startsWith("/") ? <ResponsiveImage src={src} alt={alt} width={width} height={height} style={{ objectFit: fit }} eager={eager} /> : <img src={src} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} style={{ objectFit: fit }} />}
      {label ? <figcaption>{label}</figcaption> : null}
    </figure>
  );
}
