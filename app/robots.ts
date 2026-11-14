import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const aiCrawlers = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot",
  "Claude-User", "anthropic-ai", "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "YandexBot",
  "YandexAdditional", "CCBot", "Amazonbot", "DuckAssistBot", "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";
  const allowIndexing = siteUrl === "https://sanremomachines.ru" && process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allowIndexing
      ? [{ userAgent: "*", allow: "/" }, ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/" }))]
      : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
