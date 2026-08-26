import type { MetadataRoute } from "next";
import { families, models } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const staticRoutes = [
  "",
  "about",
  "bio",
  "cases",
  "choose",
  "compare",
  "contacts",
  "dealers",
  "design-system",
  "documents",
  "news",
  "parts",
  "prices",
  "products",
  "service",
  "solutions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...staticRoutes,
    ...families.map((family) => `products/${family.slug}`),
    ...models.map((model) => `products/${model.family}/${model.slug}`),
  ];

  return routes.map((route) => ({
    url: new URL(route ? `${route}/` : "", siteUrl).toString(),
    changeFrequency: route.startsWith("products") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("products") ? 0.8 : 0.6,
  }));
}
