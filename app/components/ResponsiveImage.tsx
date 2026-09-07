/* eslint-disable @next/next/no-img-element -- custom static-export picture pipeline */
import type { CSSProperties } from "react";

function variant(src: string, width: number, extension: "webp" | "jpg") {
  const dot = src.lastIndexOf(".");
  return `${src.slice(0, dot)}-w${width}.${extension}`;
}

export function ResponsiveImage({ src, alt, width, height, className, style, sizes = "(max-width: 720px) 100vw, 50vw", priority = false }: { src: string; alt: string; width: number; height: number; className?: string; style?: CSSProperties; sizes?: string; priority?: boolean }) {
  const localRaster = src.startsWith("/") && /\.(?:jpe?g|png|webp)$/i.test(src);
  if (!localRaster) return <img src={src} alt={alt} width={width} height={height} className={className} style={style} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"} />;
  const available = [480, 960, 1440].filter((value) => value <= width);
  const webp = available.map((value) => `${variant(src, value, "webp")} ${value}w`).join(", ");
  const jpg = available.map((value) => `${variant(src, value, "jpg")} ${value}w`).join(", ");
  return <picture>{webp && <source type="image/webp" srcSet={webp} sizes={sizes} />}{jpg && <source type="image/jpeg" srcSet={jpg} sizes={sizes} />}<img src={src} alt={alt} width={width} height={height} className={className} style={style} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"} /></picture>;
}
