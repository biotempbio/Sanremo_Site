import generated from "@/data/image-variants.json";
export type ImageVariant = { src: string; width: number };
export type ImageVariants = { width: number; height: number; fallback: string; webp: ImageVariant[]; avif?: ImageVariant[] };
export const imageVariants = generated as Record<string, ImageVariants>;
export function optimizedImage(src: string) { return imageVariants[src]?.fallback ?? src; }

const byFallback = Object.fromEntries(Object.values(imageVariants).map((entry) => [entry.fallback, entry]));
export function variantsForImage(src: string) { return imageVariants[src] ?? byFallback[src]; }
