/* eslint-disable @next/next/no-img-element -- custom static-export picture pipeline */
import type { CSSProperties } from "react";
import { variantsForImage } from "@/lib/responsive-images";

export function ResponsiveImage({ src, alt, width, height, className, style, sizes = "(max-width: 720px) 100vw, 50vw", priority = false, eager = false }: { src: string; alt: string; width: number; height: number; className?: string; style?: CSSProperties; sizes?: string; priority?: boolean; eager?: boolean }) {
  const entry = variantsForImage(src);
  const img = <img src={entry?.fallback ?? src} alt={alt} width={entry?.width ?? width} height={entry?.height ?? height} className={className} style={style} loading={priority || eager ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"} />;
  const set = (variants: { src: string; width: number }[]) => variants.map((item) => `${item.src} ${item.width}w`).join(", ");
  return entry ? <picture>{entry.avif?.length ? <source type="image/avif" srcSet={set(entry.avif)} sizes={sizes} /> : null}<source type="image/webp" srcSet={set(entry.webp)} sizes={sizes} />{img}</picture> : img;
}
