# Карта контента Sanremo Russia

- Главная: `app/page.tsx`; основное содержимое и интерактивная оболочка — `public/sanremo-russia.html`.
- Каталог: `app/products/page.tsx`, фильтры — `app/products/CatalogClient.tsx`.
- Семейство и модель: `app/products/[family]/page.tsx` и `app/products/[family]/[model]/page.tsx`.
- Подборщик: `app/choose/page.tsx`, логика — `app/choose/ChooserClient.tsx`.
- Дилеры: `app/dealers/page.tsx`, интерфейс — `app/dealers/DealersClient.tsx`, данные — `data/catalog.json`.
- Запчасти: `app/parts/page.tsx` и `app/parts/PartsClient.tsx`.
- О бренде, сервис, контакты и кейсы: соответствующие каталоги в `app/`.
- Меню и футер: `app/components/Chrome.tsx`; версия внутри интерактивной главной — `public/sanremo-russia.html`.
- Товарные данные, цены и остатки: `data/catalog.json`; вычисляемые представления — `lib/catalog.ts`.
- Общие title, description и Open Graph: `app/layout.tsx`; частные metadata находятся в `page.tsx` нужного раздела.

Чтобы изменить текст внутри интерактивной версии сайта, найдите видимую фразу в `public/sanremo-russia.html`. Чтобы изменить карточку или технические данные, сначала правьте `data/catalog.json`, затем проверяйте соответствующее представление в `lib/catalog.ts`.
