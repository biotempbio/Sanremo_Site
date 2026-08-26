import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: allowIndexing
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("sitemap.xml", siteUrl).toString(),
    host: siteUrl.origin,
  };
}
