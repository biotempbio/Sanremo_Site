import type { MetadataRoute } from "next";
import { execFileSync } from "node:child_process";
import { families, models } from "@/lib/catalog";
import { CONTENT_DATE, SITE_URL } from "@/lib/seo";
import { detailedCases } from "@/lib/cases";
import { newsPosts } from "@/lib/news";

export const dynamic = "force-static";

const modifiedCache = new Map<string, string>();
function lastModified(paths: string[]): Date {
  const dates = paths.map((path) => {
    if (!modifiedCache.has(path)) {
      let date = CONTENT_DATE;
      try {
        const recorded = execFileSync("git", ["log", "-1", "--format=%cs", "--", path], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
        if (recorded) date = recorded;
      } catch { /* Источник без .git: дата содержимого зафиксирована в CONTENT_DATE. */ }
      modifiedCache.set(path, date);
    }
    return modifiedCache.get(path)!;
  });
  return new Date(`${dates.sort().at(-1) ?? CONTENT_DATE}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/bio", "/cases", "/choose", "/compare", "/contacts", "/dealers", "/documents", "/faq", "/guide", "/guide/kofemashina-dlya-kofejni", "/guide/kofemashina-dlya-restorana", "/guide/linejki-sanremo", "/news", "/parts", "/prices", "/privacy", "/products", "/products/grinders", "/products/x-one", "/products/napoli", "/products/cube", "/products/verona", "/products/verona-rs", "/products/torino", "/service", "/solutions"];
  return [
    ...routes.map((route) => ({ url: `${SITE_URL}${route}/`, lastModified: lastModified([`app${route || ""}/page.tsx`]) })),
    ...families.map((family) => ({ url: `${SITE_URL}/products/${family.slug}/`, lastModified: lastModified(["app/products/[family]/page.tsx", "data/catalog.json"]) })),
    ...models.map((model) => ({ url: `${SITE_URL}/products/${model.family}/${model.slug}/`, lastModified: lastModified(["app/products/[family]/[model]/page.tsx", "data/catalog.json"]) })),
    ...detailedCases.map((entry) => ({ url: `${SITE_URL}/cases/${entry.slug}/`, lastModified: lastModified(["app/cases/[slug]/page.tsx", "data/cases.json"]) })),
    ...newsPosts.map((post) => ({ url: `${SITE_URL}/news/${post.slug}/`, lastModified: new Date(`${post.publishedAt}T00:00:00Z`) })),
  ];
}
