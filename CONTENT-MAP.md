# Карта контента Sanremo Russia

Все страницы находятся в папке `app`. Общие данные каталога, цены, наличие, дилеры и связи моделей собраны в `data/catalog.json` и преобразуются для страниц в `lib/catalog.ts`.

## Главная страница — `/`

Откройте `app/page.tsx`. Здесь находятся главный заголовок, вводный текст, блоки подбора, технологий, новостей и кейсов. SEO-заголовок и описание всего сайта заданы в `app/layout.tsx`.

## Каталог — `/products/`

Откройте `app/products/page.tsx`, чтобы изменить вводный текст и подписи разделов. Сами модели, цены и наличие берутся из `data/catalog.json`. Карточка семейства формируется файлом `app/products/[family]/page.tsx`, карточка конкретной модели — `app/products/[family]/[model]/page.tsx`. Выбор исполнения внутри карточки находится в соседнем файле `ConfigPicker.tsx`.

## Подбор и сравнение

- `/choose/` — основной текст в `app/choose/page.tsx`, интерактивный подбор в `app/choose/ChooserClient.tsx`.
- `/compare/` — текст и таблица в `app/compare/page.tsx`.
- `/solutions/` — сценарии выбора и пояснения в `app/solutions/page.tsx`; исходные модели и диапазоны берутся из `lib/catalog.ts`.

## Дилеры и сервис

- `/dealers/` — вводный текст в `app/dealers/page.tsx`, фильтр в `app/dealers/DealersClient.tsx`, список дилеров в `data/catalog.json`.
- `/service/` — `app/service/page.tsx`.
- `/parts/` — вводный текст в `app/parts/page.tsx`, поиск в `app/parts/PartsClient.tsx`, запчасти в `data/catalog.json`.
- `/documents/` — `app/documents/page.tsx`; PDF-файлы лежат в `public/documents/brochures/`.

## Контентные страницы

- `/cases/` — кофейни и кейсы в `app/cases/page.tsx`, фотографии в `public/photo/cases-ru/`.
- `/news/` — `app/news/page.tsx`.
- `/about/` — `app/about/page.tsx`.
- `/bio/` — `app/bio/page.tsx`.
- `/contacts/` — `app/contacts/page.tsx`.
- `/prices/` — `app/prices/page.tsx`.
- `/design-system/` — служебная страница элементов интерфейса в `app/design-system/page.tsx`.

## Меню, подвал, контакты и формы

Чтобы изменить меню, телефон, адрес или текст подвала, откройте `app/components/Chrome.tsx`. Почтовая отправка заявок настраивается в `app/components/MailtoForm.tsx`; запрос документов отдельно находится в `app/documents/page.tsx`.

## Общие SEO-настройки

Общие `title`, `description`, Open Graph и Twitter-настройки находятся в `app/layout.tsx`. SEO отдельных страниц задаётся в начале соответствующего `page.tsx`. Адрес сайта читается только из `NEXT_PUBLIC_SITE_URL` через `lib/site.ts`. Карта сайта формируется в `app/sitemap.ts`, правила индексации — в `app/robots.ts` и переменной `NEXT_PUBLIC_ALLOW_INDEXING`.

## Изображения и шрифты

Фотографии находятся в `public/photo/`, логотипы — в `public/brand/`, локальные шрифты — в `public/fonts/`. Чтобы заменить изображение без правки кода, сохраните новый файл под тем же именем и с тем же расширением.
