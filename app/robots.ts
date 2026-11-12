import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";
  const allowIndexing = siteUrl === "https://sanremomachines.ru" && process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allowIndexing
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
