# Sanremo — пакет 2, стенд, 16.11.2026

Граница выпуска: сначала технический стенд Timeweb. Боевой домен, Tilda и DNS без изменений; публикация в production только после приёмки Сергея.

## Страницы

- Обновлены title, description и заданные H1 главной, каталога, D8, Zoe, Café Racer, страниц решений и гидов.
- `/solutions/kofejnya/` объединяет коммерческий спрос «для кофейни/кафе»; статьи `/guide/kofemashina-dlya-kofejni/` и `/guide/kofemashina-dlya-restorana/` стали инструкциями с самостоятельным canonical и ссылкой на страницу подбора.
- Добавлены `/guide/dvuhgruppnaya-kofemashina/` и `/guide/multiboylernaya-kofemashina/`: таблицы и карточки моделей берут цены и наличие из каталога; FAQ размечен FAQPage.
- Добавлены `/compare/sanremo-vs-nuova-simonelli-appia/` и `/compare/sanremo-vs-la-marzocco-linea/`; на телефоне данные представлены карточками, на десктопе — таблицей. Ссылки из `/compare/`; все четыре новых URL в sitemap.

## Источники сравнений

| Данные | Источник | Проверено |
| --- | --- | --- |
| Appia Life: линейка и технические варианты | [Nuova Simonelli](https://nuovasimonelli.com/en/machine/appia-life-2/?avia_extended_shop_select=yes&product_order=title) | 16.11.2026 |
| Appia Life 2GR V: конкретные размеры, питание, бойлер | [Entero](https://entero.ru/item/122375) | 16.11.2026 |
| Appia Life 2GR V: цена | [LigaBarShop](https://ligabarshop.ru/categories/kofemashiny-nuova-simonelli-2gr), [Entero](https://entero.ru/item/122375) | 16.11.2026 |
| Linea Classic S 2 группы | [Официальная брошюра La Marzocco](https://www.lamarzocco.com/uk/en/wp-content/uploads/2025/05/product_brochure_linea_classic_s_eng.pdf), [цена магазина](https://la-marzocco.ru/espresso-machines/tproduct/991132895322-kofemashina-la-marzocco-linea-classic-s) | 16.11.2026 |
| Linea PB 2 группы | [La Marzocco](https://www.lamarzocco.com/uk/en/commercial-products/espresso-machines/linea-pb/), [цена магазина](https://trust-holod.ru/category/kofemashiny/la-marzocco/pb/) | 16.11.2026 |
| Sanremo | `data/catalog.json` и сборочный BIO snapshot; ссылки на карточки | Сборка пакета |

Цены других марок показываются как открытые предложения конкретных продавцов, не как единая рекомендованная цена. Историческое КП Complex Trade с действием цены один день сознательно не использовано как актуальная цена.

## Документы

В библиотеке 43 уникальных PDF; у всех проверены наличие файла и заголовок `%PDF-`. По модели: Zoe Competition 9 (инструкция RU), Zoe Compact 3 (инструкция), Zoe SED 5 (инструкция RU/EN), Zoe SAP 3 (инструкция RU/EN), D8 4 (инструкция RU/EN), D8 PRO 5 (инструкция RU/EN), F18 MB 5 (инструкция RU), F18 SB 5 (**инструкция отсутствует**), Café Racer 9 (инструкция), Opera 5 (инструкция), YOU 6 (инструкция EN; русская не найдена). Один PDF может относиться к нескольким моделям; количества по моделям не суммируются.

## Проверка

`npm run build` — успешная статическая сборка 75 маршрутов с четырьмя новыми страницами. Визуальная приёмка и реальные скриншоты стенда 390/1280 входят в выпуск пакета; без них считать страницу сданной нельзя.
