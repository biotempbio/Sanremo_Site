import type { Metadata } from "next";
import { absoluteUrl } from "./seo";
import { optimizedImage } from "./responsive-images";

const covers: Record<string, string> = {
  "/": "/photo/home-hero-cafe-racer-v2.jpg",
  "/products/x-one/": "/photo/official/x-one.webp",
  "/guide/kofemolka-dlya-kofejni/": "/photo/official/x-one.webp",
};

/** Each route owns social metadata as well as its title and description. */
export function pageMetadata(path: string, metadata: Metadata, image?: string): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : metadata.title && "absolute" in metadata.title ? metadata.title.absolute : undefined;
  const old = metadata.openGraph;
  const source = image ?? covers[path];
  const images = source ? [absoluteUrl(optimizedImage(source))] : old?.images ?? [absoluteUrl("/og.png")];
  return {
    ...metadata,
    openGraph: { type: "website", ...old, title: old?.title ?? title, description: old?.description ?? metadata.description ?? undefined, url: absoluteUrl(path), siteName: "Sanremo Machines", locale: "ru_RU", images },
    twitter: { card: "summary_large_image", title, description: metadata.description ?? undefined, images, ...metadata.twitter },
  };
}
