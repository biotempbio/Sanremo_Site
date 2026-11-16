import archive from "@/data/capri-parts.json";
import { bioCatalogActive, parts, type Part } from "@/lib/catalog";

const capriPattern = /capri|капри/i;
const knownCodes = new Set(archive.items.map((part) => part.code));

const archivedParts: Part[] = archive.items.map((part) => ({
  code: part.code,
  article: part.article,
  name: part.name,
  model: part.model,
  node: "Запчасти Capri",
  category: "Запчасти Sanremo",
  rrp: part.rrp,
  stock: part.stock,
  availability: part.stock >= 3 ? "in_stock" : part.stock > 0 ? "limited" : "on_order",
  image: null,
  fits: [],
  fitsCount: 0,
}));

const currentParts = parts.filter((part) =>
  knownCodes.has(part.code) || capriPattern.test(part.name) || capriPattern.test(part.model ?? "")
);

export const capriParts = (bioCatalogActive ? currentParts : archivedParts)
  .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || b.stock - a.stock || a.name.localeCompare(b.name, "ru"));

export function capriAvailability(stock: number) {
  if (stock >= 3) return `В наличии · на складе ${stock} шт`;
  return stock > 0 ? "В наличии" : "Под заказ";
}
