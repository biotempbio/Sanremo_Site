import { readFileSync } from 'node:fs';

const target = process.env.SANREMO_BUILD_TARGET || 'local';
const site = process.env.NEXT_PUBLIC_SITE_URL;
const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING;
const robots = readFileSync(new URL('../out/robots.txt', import.meta.url), 'utf8');
const production = target === 'production';

if (!['local', 'staging', 'production'].includes(target)) {
  throw new Error(`Unknown SANREMO_BUILD_TARGET: ${target}`);
}
if (production) {
  if (site !== 'https://sanremomachines.ru' || allow !== 'true') {
    throw new Error('Production build requires the production SITE_URL and ALLOW_INDEXING=true');
  }
  if (/\bDisallow\s*:/i.test(robots) || !robots.includes('User-Agent: *\nAllow: /') ||
      !robots.includes('Sitemap: https://sanremomachines.ru/sitemap.xml')) {
    throw new Error('Production robots.txt would block indexing or has an incorrect sitemap');
  }
  for (const crawler of [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot',
    'Claude-User', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User',
    'Google-Extended', 'Applebot-Extended', 'Bingbot', 'YandexBot',
    'YandexAdditional', 'CCBot', 'Amazonbot', 'DuckAssistBot', 'meta-externalagent',
  ]) {
    if (!robots.includes(`User-Agent: ${crawler}\nAllow: /`)) {
      throw new Error(`Missing production crawler rule: ${crawler}`);
    }
  }
} else if (target === 'staging' && !/\bDisallow:\s*\//.test(robots)) {
  throw new Error('Staging robots.txt must remain closed');
}
console.log(`robots.txt verified for ${target}`);
