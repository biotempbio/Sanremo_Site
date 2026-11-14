# Sanremo — карта миграции URL

Статус: решения Сергея от 11 ноября 2026 года внесены. Staging развёрнут как
статический экспорт Next.js; 11 ноября 2026 года подтверждено, что `redirects()`
и middleware в этой схеме не могут отдать HTTP 301.

## Источник и правила

- Источник старых URL: `https://sanremomachines.ru/sitemap.xml`, снят 11 ноября 2026 года.
- Цели проверены на staging и отвечают `200`.
- Постоянные редиректы должны настраиваться в веб-сервере или на уровне хостинга.
  В текущей сборке `output: "export"` Next.js создаёт только статические файлы:
  `redirects()` и middleware не исполняются на запросе и не заменяют HTTP 301.
  Для сохранения веса используется только `301`; цепочки и массовый перенос на
  главную запрещены.
- Адреса со статусом «решение требуется» не включать в конфигурацию до утверждения целевой
  страницы или решения отдать `410 Gone`.

## Подтверждённые соответствия

| Старый URL | Новый URL | Основание |
| --- | --- | --- |
| `/` | `/` | Главная страница |
| `/about` | `/about/` | О бренде Sanremo |
| `/products` | `/products/` | Каталог |
| `/moments` | `/cases/` | Кейсы и кофейные пространства |
| `/news` | `/news/` | Новости |
| `/contacts` | `/contacts/` | Контакты |
| `/buy` | `/dealers/` | Где купить / дилерская сеть |
| `/parts/` | `/parts/` | Запчасти; страница есть в меню старого сайта, хотя отсутствует в его sitemap |
| `/products/d8/` | `/products/d8/` | Страница семейства D8 со всеми конфигурациями |
| `/products/you/` | `/products/you/` | Страница семейства YOU со всеми конфигурациями |
| `/products/cafe-racer/` | `/products/cafe-racer/` | Страница семейства Café Racer со всеми конфигурациями |
| `/products/opera/` | `/products/opera/` | Страница семейства Opera со всеми конфигурациями |
| `/products/f18/` | `/products/f18/` | Страница семейства F18; F18 без SB в карточках называется F18 MB |
| `/products/f18sb/` | `/products/f18/f18-sb/` | Модель F18 SB |
| `/products/zoe/` | `/products/zoe/` | Семейство Zoe |
| `/products/zoe-new/` | `/products/zoe/` | Актуальное семейство Zoe |
| `/products/grinders/` | `/products/grinders/` | Новый раздел кофемолок; X-One публикуется с характеристиками, РРЦ и статусом из BIO |
| `/products/x-one/` | `/products/x-one/` | Сохранённый URL действующей карточки X-One; редирект не нужен |
| `/products/napoli/` | `/products/napoli/` | Архивная страница: сервис, поиск ЗИП и подбор актуальной замены |
| `/products/cube/` | `/products/cube/` | Архивная страница: сервис, поиск ЗИП и подбор актуальной замены |
| `/products/verona/` | `/products/verona/` | Архивная страница: сервис, поиск ЗИП и подбор актуальной замены |
| `/products/verona-rs/` | `/products/verona-rs/` | Архивная страница: сервис, поиск ЗИП и подбор актуальной замены |
| `/products/torino/` | `/products/torino/` | Архивная страница: сервис, поиск ЗИП и подбор актуальной замены |

## Новости Tilda — 14 ноября 2026 года

Тексты, даты и фотографии сохранены в `data/news.json` и `public/photo/news/`. Новые страницы доступны по чистым адресам. Старым адресам нужен один HTTP 301 на соответствующую новость; это пока отдельный инфраструктурный пункт, поскольку у статического приложения Timeweb заняты 5 из 10 правил редиректа.

| Старый URL | Новый URL |
| --- | --- |
| `/tpost/h16ppjnd31-no-drama-just-coffee` | `/news/zoe-2026/` |
| `/tpost/fzpb79apg1-sanremo-tsentr-prityazheniya` | `/news/sanremo-pir-coffee-2025/` |
| `/tpost/hngoulmxr1-poisk-sinergii-vkusov-na-dalnem-vostoke` | `/news/coffee-pairing-dalnii-vostok/` |
| `/tpost/vz3l6i6rj1-rossiiskii-duet-raskrivaet-potentsial-ba` | `/news/d8-pro-julius-meinl-barista-skills/` |
| `/tpost/9ejdiik9o1-360-sanremo-3` | `/news/360-sanremo-3/` |
| `/tpost/3oa0z0r951-vstrechaite-novuyu-platformu-d8-na-vista` | `/news/d8-host-2023/` |
| `/tpost/ou8np6rss1-360-sanremo-2` | `/news/360-sanremo-2/` |
| `/tpost/2oe6krp6j1-vo-ves-opor` | `/news/vo-ves-opor/` |
| `/tpost/akxi35jl41-komandnaya-rabota-kak-sposob-dostizheniy` | `/news/komandnaya-rabota/` |
| `/tpost/g105rcvzb1-nash-novii-ambassador-martin-shabaya` | `/news/martin-shabaya/` |

## URL, которые должны оставаться ошибкой

| Старый URL | Решение |
| --- | --- |
| `/page126418006.html` | Отдаёт настоящую `404`; редирект не нужен. |

## До запуска

1. Дополнить список URL из Яндекс Вебмастера, Google Search Console, Метрики и новостей `/tpost/`.
2. Отметить в таблице URL с кликами, позициями и внешними ссылками — они получают приоритетную
   ручную проверку.
3. Реализовать утверждённую карту на уровне сервера или хостинга и прогнать автоматическую проверку: каждый старый URL
   возвращает один `301`, а его конечная страница — `200`.
4. После смены доменной точки входа проверить те же ответы на `https://sanremomachines.ru`, а не
   только на staging.
