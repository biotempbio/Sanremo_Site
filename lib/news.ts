import records from "@/data/news.json";

export type NewsImage = { src: string; width: number; height: number; alt: string };
export type NewsPost = {
  slug: string;
  oldPath: string;
  title: string;
  description: string;
  publishedAt: string;
  paragraphs: string[];
  images: NewsImage[];
  sourceUrl: string;
};

export const newsPosts = records as NewsPost[];
export const newsBySlug = (slug: string) => newsPosts.find((post) => post.slug === slug);

export function newsDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export function relatedModel(post: NewsPost): { href: string; label: string } | null {
  if (post.slug === "zoe-2026") return { href: "/products/zoe/", label: "Линейка Zoe" };
  if (post.slug === "d8-pro-julius-meinl-barista-skills") return { href: "/products/d8/d8-pro/", label: "Sanremo D8 PRO" };
  if (post.slug === "d8-host-2023") return { href: "/products/d8/", label: "Линейка D8" };
  if (post.slug === "sanremo-pir-coffee-2025") return { href: "/products/cafe-racer/", label: "Линейка Café Racer" };
  return null;
}
