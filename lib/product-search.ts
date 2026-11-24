import {
  architectureForModel, familyBySlug, modelBySlug, money,
  officialImageForFamily, officialImageForModel, skuHeroMedia, skusOfModel,
  type Family, type Model, type Sku,
} from "./catalog";
import { absoluteUrl } from "./seo";
import { isStainlessZoe } from "./verified-product-facts.mjs";

const familyCopy: Record<string, { intro: string; selection: string }> = {
  zoe: {
    intro: "Sanremo Zoe — профессиональная рожковая кофемашина для первой кофейни, пекарни или ресторана. В линейке можно сравнить Competition, Compact, SED и SAP: размеры, управление проливом и оснащение зависят от версии.",
    selection: "Для небольшой стойки начните со сравнения габаритов Zoe Compact и других версий Zoe. Затем выберите управление проливом, высоту групп и подключение по характеристикам конкретного исполнения.",
  },
  d8: {
    intro: "Sanremo D8 и D8 PRO — платформа для растущей кофейни и сети. D8 PRO позволяет независимо настраивать температуру групп для разных рецептов; число групп, оснащение и подключение выбирают под рабочую зону.",
    selection: "Сравните D8 и D8 PRO по управлению температурой, числу групп и оснащению. AutoSteam, Cold Touch и подсветку проверяйте в выбранном исполнении: набор опций различается.",
  },
  f18: {
    intro: "Sanremo F18 — профессиональная кофемашина для интенсивной смены и молочного меню. В линейке представлены F18 Single Boiler с одним бойлером и мультибойлерная F18 MB: сравните их по устройству, числу групп и подключению.",
    selection: "Начните с архитектуры: F18 Single Boiler и F18 MB — разные модели. Затем сопоставьте число групп, мощность и напряжение конкретных исполнений с условиями вашей кофейни.",
  },
  "cafe-racer": {
    intro: "Sanremo Café Racer — мультибойлерная кофемашина с PID для specialty-кофейни и проектов с высоким потоком. Выберите две или три группы и оформление корпуса под рабочую зону и интерьер кофейни.",
    selection: "Сравните двух- и трёхгрупповые Café Racer по габаритам и подключению. Затем выберите оформление корпуса: Naked, Racing и другие исполнения представлены отдельными артикулами с собственной ценой и наличием.",
  },
  you: {
    intro: "Sanremo YOU — компактная мультибойлерная кофемашина с профилированием экстракции. Подходит для работы с рецептами в specialty-кофейне, лаборатории обжарщика и домашней кофейной зоне.",
    selection: "YOU выбирают для компактной рабочей зоны и настройки рецептов. Для одновременной работы нескольких бариста сравните её с многогрупповыми линейками Sanremo; габариты и подключение проверьте в карточке YOU.",
  },
  opera: {
    intro: "Sanremo Opera — мультибойлерная кофемашина с помпой в группе и профилированием для обжарщиков, лабораторий и флагманских кофеен. Она позволяет работать с разными сортами и повторять выбранные рецепты экстракции.",
    selection: "При выборе Opera сопоставьте число групп и возможности профилирования с вашей работой с зерном. Для установки проверьте габариты, мощность и напряжение выбранного артикула.",
  },
};

const modelCopy: Record<string, string> = {
  "zoe-competition": "Профессиональная рожковая кофемашина для кофейни, пекарни или ресторана; электронное дозирование и таймер пролива помогают повторять рецепт.",
  "zoe-compact": "Компактная версия Zoe для небольшой кофейной стойки. Сравните размеры и подключение с другими версиями линейки.",
  "zoe-sed": "Автоматическая версия Zoe с электронной системой дозирования для приготовления эспрессо в кафе, ресторане или баре.",
  "zoe-sap": "Полуавтоматическая версия Zoe для кафе, ресторанов и баров с ручным управлением продолжительностью пролива.",
  d8: "Профессиональная рожковая кофемашина для растущей кофейни. Число групп и оснащение выбирают под поток и рабочую зону.",
  "d8-pro": "Кофемашина с независимой настройкой температуры групп для работы с разными рецептами в одной смене.",
  "f18-sb": "F18 Single Boiler — профессиональная кофемашина с одним бойлером для кофейни, ресторана или бара.",
  "f18-mb": "Мультибойлерная F18 для интенсивной смены и молочного меню с независимым контролем кофе и пара.",
  "cafe-racer": "Мультибойлерная кофемашина с PID, двумя или тремя группами и разными вариантами оформления корпуса для specialty-кофейни.",
  you: "Компактная мультибойлерная кофемашина с профилированием экстракции для specialty-кофейни, лаборатории и дома.",
  opera: "Мультибойлерная кофемашина с помпой в группе и профилированием для работы обжарщика и бариста с разными рецептами.",
};

export function familySearchCopy(family: Family) {
  return familyCopy[family.slug] ?? { intro: `Sanremo ${family.name}: ${family.territory}`, selection: "Сравните характеристики и оснащение доступных исполнений." };
}

export function modelSearchDescription(model: Model) {
  return modelCopy[model.slug] ?? `${architectureForModel(model)}. ${familyBySlug(model.family)?.territory ?? "Профессиональная кофемашина Sanremo."}`;
}

export function modelSearchImage(model: Model) {
  const entries = skusOfModel(model.slug);
  const pictured = entries.filter((sku) => skuHeroMedia(sku).exact && skuHeroMedia(sku).image);
  const hero = pictured.find((sku) => sku.code === model.heroSku) ?? pictured[0];
  if (hero) return skuHeroMedia(hero).image;
  // The Competition illustration must not stand in for Compact, SED or SAP.
  return ["zoe-compact", "zoe-sed", "zoe-sap"].includes(model.slug) ? null : officialImageForModel(model.slug);
}

/** The picker understands these query parameters; a #sku fragment does not select an execution. */
export function skuProductPath(sku: Sku) {
  const query = new URLSearchParams({ sku: sku.code });
  if (sku.groups) query.set("groups", String(sku.groups));
  return `/products/${sku.family}/${sku.model}/?${query}`;
}

export function skuAvailability(sku: Pick<Sku, "availability" | "free">) {
  return sku.availability === "reserved" ? "https://schema.org/OutOfStock"
    : sku.free > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder";
}

export function skuSearchDescription(sku: Sku) {
  const model = modelBySlug(sku.model);
  const facts = [sku.groups ? `Групп: ${sku.groups}` : null, sku.color, sku.edition && sku.edition !== "Base" ? sku.edition : null, isStainlessZoe(sku) ? `бойлер ${sku.boilerTotal} л из нержавеющей стали AISI 316L` : null].filter(Boolean).join("; ");
  return `Sanremo ${sku.modelName}. ${facts ? `${facts}. ` : ""}${model ? modelSearchDescription(model) : "Профессиональная рожковая кофемашина."}`;
}

/** A family is a catalog of distinct products, not one Product with an aggregated price. */
export function machineOfferCatalog(name: string, entries: Sku[], family?: Family) {
  const image = family ? officialImageForFamily(family.slug) : officialImageForFamily("zoe");
  return {
    "@context": "https://schema.org", "@type": "OfferCatalog", name,
    description: family ? familySearchCopy(family).intro : "Актуальные кофемашины Sanremo: исполнения, цены и наличие в России.",
    ...(image ? { image: absoluteUrl(image) } : {}),
    itemListElement: entries.filter((sku) => sku.rrp > 0).map((sku) => {
      const media = skuHeroMedia(sku);
      return {
        "@type": "Offer", name: `Sanremo ${sku.modelName} — ${sku.title}`,
        description: skuSearchDescription(sku), url: absoluteUrl(skuProductPath(sku)),
        ...(media.image && media.exact ? { image: absoluteUrl(media.image) } : {}),
        sku: sku.vendorCode ?? sku.code, price: sku.rrp, priceCurrency: "RUB",
        availability: skuAvailability(sku),
      };
    }),
  };
}

export function familyPriceDescription(family: Family, entries: Sku[]) {
  const prices = entries.map((sku) => sku.rrp).filter((price) => price > 0);
  const price = prices.length ? `Цена от ${money(Math.min(...prices))}.` : "Цена по запросу.";
  const purpose: Record<string, string> = {
    zoe: "для первой кофейни, пекарни и ресторана. Competition, Compact, SED и SAP",
    d8: "и D8 PRO для растущей кофейни: число групп, оснащение и управление температурой",
    f18: "для интенсивной смены: сравните Single Boiler и мультибойлерную F18 MB",
    "cafe-racer": "(Cafe Racer): мультибойлерная кофемашина с PID, две или три группы и выбор оформления",
    you: "с профилированием экстракции для кофейни, лаборатории и дома",
    opera: "с профилированием и помпой в группе для обжарщиков и флагманских кофеен",
  };
  return `Sanremo ${family.name} ${purpose[family.slug] ?? family.tagline}. ${price} Характеристики, наличие и дилеры в России.`;
}
