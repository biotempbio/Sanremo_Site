# Публикация Sanremo

- Установить `NEXT_PUBLIC_SITE_URL=https://sanremomachines.ru` и пересобрать сайт.
- В `robots.txt` разрешить обход, указать боевой адрес `sitemap.xml`.
- Настроить 301 с `www` на основной домен и с HTTP на HTTPS.
- Проверить перенаправления со старых URL.
- Указать `NEXT_PUBLIC_METRIKA_ID`.
- Добавить сайт в Яндекс Вебмастер и Google Search Console, отправить карту сайта.
- Проверить обе формы живой заявкой и сохранение заявки серверным сервисом.
- После проверки HTTPS включить HSTS.

## Caddy

```caddy
root * /srv/sanremo/out
encode gzip zstd

@api path /api/lead
reverse_proxy @api 127.0.0.1:8788

header {
  X-Content-Type-Options "nosniff"
  X-Frame-Options "SAMEORIGIN"
  Referrer-Policy "strict-origin-when-cross-origin"
}
header /_next/static/* Cache-Control "public, max-age=31536000, immutable"
@html path_regexp html ^(?:.*/)?(?:index|404)?\.html$
header @html Cache-Control "public, max-age=0, must-revalidate"

try_files {path} {path}/index.html {path}.html
file_server
handle_errors {
  rewrite * /404.html
  file_server
}
```

HSTS (`Strict-Transport-Security "max-age=31536000; includeSubDomains"`) добавляется только после проверки боевого HTTPS и редиректов.
