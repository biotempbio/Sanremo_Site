const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";

export const siteUrl = new URL(configuredSiteUrl);
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
