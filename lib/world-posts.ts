import source from "@/data/world-posts.json";

export type WorldPost = {
  id: number;
  slug: string;
  title: string;
  date: string;
  text: string;
  country: string | null;
  city: string | null;
  images: string[];
  poster: string | null;
  video: boolean;
  source: string;
};

const secondaryPosts = new Set([128, 984, 1006, 1011]);
export const worldPosts = [...(source as WorldPost[])].sort((a, b) =>
  Number(secondaryPosts.has(a.id)) - Number(secondaryPosts.has(b.id)) ||
  b.date.localeCompare(a.date) || b.id - a.id
);
export const worldPostHref = (post: WorldPost) => `/about/world/${post.slug}/`;
export const worldCover = (post: WorldPost) => post.images[0] ?? post.poster;
export const worldDate = (date: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Moscow" }).format(new Date(`${date}T12:00:00Z`));
