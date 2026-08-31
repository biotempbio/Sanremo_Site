import type { MetadataRoute } from "next";
import { models } from "@/lib/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";
  const routes = ["", "/about", "/bio", "/cases", "/choose", "/compare", "/contacts", "/dealers", "/documents", "/news", "/parts", "/prices", "/products", "/service", "/solutions"];
  return [
    ...routes.map((route) => ({ url: `${siteUrl}${route}/`, lastModified: new Date() })),
    ...models.map((model) => ({ url: `${siteUrl}/products/${model.family}/${model.slug}/`, lastModified: new Date() })),
  ];
}
