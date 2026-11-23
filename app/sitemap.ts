import type { MetadataRoute } from "next";
import { execFileSync } from "node:child_process";
import { families, models } from "@/lib/catalog";
import { SITE_URL } from "@/lib/seo";
import { detailedCases } from "@/lib/cases";
import { newsPosts } from "@/lib/news";
import { worldPosts } from "@/lib/world-posts";
import { solutionLandings } from "@/lib/solution-landings";

export const dynamic = "force-static";

const modifiedCache = new Map<string, string | undefined>();
function lastModified(paths: string[]): Date | undefined {
  const dates = paths.map((path) => {
    if (!modifiedCache.has(path)) {
      let date: string | undefined;
      try {
        const recorded = execFileSync("git", ["log", "-1", "--format=%cs", "--", path], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
        if (recorded) date = recorded;
      } catch { /* Без истории Git достоверная дата изменения неизвестна. */ }
      modifiedCache.set(path, date);
    }
    return modifiedCache.get(path);
  });
  const latest = dates.filter((date): date is string => Boolean(date)).sort().at(-1);
  return latest ? new Date(`${latest}T00:00:00Z`) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/about/world", "/bio", "/cases", "/choose", "/compare", "/compare/sanremo-vs-nuova-simonelli-appia", "/compare/sanremo-vs-la-marzocco-linea", "/contacts", "/dealers", "/documents", "/faq", "/guide", "/guide/kofemolka-dlya-kofejni", "/guide/kupit-lizing-ili-arenda-kofemashiny", "/guide/oborudovanie-dlya-kofejni", "/guide/kofemashina-dlya-kofejni", "/guide/kofemashina-dlya-restorana", "/guide/linejki-sanremo", "/guide/dvuhgruppnaya-kofemashina", "/guide/multiboylernaya-kofemashina", "/leasing", "/news", "/parts", "/prices", "/order-terms", "/delivery", "/privacy", "/products", "/products/grinders", "/products/x-one", "/products/napoli", "/products/cube", "/products/verona", "/products/verona-rs", "/products/torino", "/products/capri", "/service", "/solutions"];
  return [
    ...routes.map((route) => ({ url: `${SITE_URL}${route}/`, lastModified: lastModified([`app${route || ""}/page.tsx`]) })),
    ...solutionLandings.map((entry) => ({ url: `${SITE_URL}/solutions/${entry.slug}/`, lastModified: lastModified(["app/solutions/[slug]/page.tsx", "lib/solution-landings.ts"]) })),
    ...["moskva", "sankt-peterburg"].map((city) => ({ url: `${SITE_URL}/dealers/${city}/`, lastModified: lastModified(["app/dealers/[city]/page.tsx", "data/catalog.json"]) })),
    ...families.map((family) => ({ url: `${SITE_URL}/products/${family.slug}/`, lastModified: lastModified(["app/products/[family]/page.tsx", "lib/product-search.ts", "data/catalog.json", "data/bio-catalog.snapshot.json"]) })),
    ...models.map((model) => ({ url: `${SITE_URL}/products/${model.family}/${model.slug}/`, lastModified: lastModified(["app/products/[family]/[model]/page.tsx", "lib/product-search.ts", "data/catalog.json", "data/bio-catalog.snapshot.json"]) })),
    ...detailedCases.map((entry) => ({ url: `${SITE_URL}/cases/${entry.slug}/`, lastModified: lastModified(["app/cases/[slug]/page.tsx", "data/cases.json"]) })),
    ...worldPosts.map((post) => ({ url: `${SITE_URL}/about/world/${post.slug}/`, lastModified: lastModified(["data/world-posts.json", "app/about/world/[slug]/page.tsx"]) })),
    ...newsPosts.map((post) => ({ url: `${SITE_URL}/news/${post.slug}/`, lastModified: lastModified(["data/news.json", "app/news/[slug]/page.tsx"]) })),
  ];
}
