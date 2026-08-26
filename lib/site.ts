const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!configuredSiteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required");
}

export const siteUrl = new URL(configuredSiteUrl);
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
