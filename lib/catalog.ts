import raw from "@/data/catalog.json";

/* ── Модель данных (ТЗ §6). Единый источник для всех страниц. ─────────────── */

export type Availability = "in_stock" | "limited" | "reserved" | "on_order";

export interface Sku {
  code: string;
  vendorCode: string | null;
  family: string;
  model: string;
  modelName: string;
  version: string | null;
  edition: string | null;
  title: string;
  groups: number | null;
  groupHeight: string | null;
  color: string | null;
  colorHex: string | null;
  options: string[];
  rrp: number;
  rrpIsRecommended: boolean;
  availability: Availability;
  free: number;
  markdown: boolean;
  power: number | null;
  voltage: string | null;
  boilerTotal: string | null;
  seat: string | null;
  lighting: string | null;
  economizer: string | null;
  control: string | null;
  sizeNet: { w: number; h: number; d: number } | null;
  weightNet: number | null;
  image: string | null;
  description: string;
  docs: { name: string; ref: string; type: string }[];
  spareParts: string[];
}

export interface Model {
  slug: string;
  name: string;
  family: string;
  version: string | null;
  skus: string[];
  groupsAvailable: number[];
  colorsAvailable: { name: string; hex: string }[];
  editions: { name: string; count: number }[];
  optionsAvailable: string[];
  docs: { name: string; ref: string; type: string }[];
  priceFrom: number | null;
  priceTo: number | null;
  inStockCount: number;
  skuCount: number;
  description: string;
  heroSku: string | null;
}

export interface Family {
  slug: string;
  name: string;
  order: number;
  tagline: string;
  territory: string;
  architecture: string;
  scenarios: string[];
  rivals: string[];
  photo: string;
}

export interface Part {
  code: string;
  article: string | null;
  name: string;
  node: string;
  category: string;
  rrp: number;
  stock: number;
  availability: Availability;
  image: string | null;
  fits: string[];
  fitsCount: number;
}

export interface Analog {
  sanremo: string;
  groups: number | null;
  priceSanremo: number | null;
  brand: string;
  model: string;
  matchType: string;
  segment: string;
  boiler: string;
  priceRival: number | null;
  note: string | null;
}

export interface Dealer { name: string; city: string | null; raw: string }

interface Catalog {
  generatedFrom: string;
  families: Family[];
  models: Model[];
  skus: Sku[];
  grinders: { code: string; name: string; rrp: number; availability: Availability; image: string | null; markdown: boolean; description: string }[];
  parts: Part[];
  dealers: Dealer[];
  chains: string[];
  analogs: Analog[];
}

const catalog = raw as unknown as Catalog;

/* ── Актуальность коммерческих данных ─────────────────────────────────────
   Дата берётся из выгрузки BIO. В продакшене её проставляет импорт (ТЗ §18). */
export const PRICE_DATE = "25 августа 2026";
/** Медиабиблиотека BIO: в выгрузке лежат относительные пути вида /api/img/{uuid}.jpg. */
export const IMG_BASE =
  process.env.NEXT_PUBLIC_SANREMO_IMG_BASE ?? "https://portal.holdingbio.ru";
export const imgUrl = (path: string | null | undefined) =>
  path ? (path.startsWith("http") ? path : IMG_BASE + path) : null;
export const DATA_OWNER = "Компания BIO — официальный дистрибьютор Sanremo в России";

export const families = [...catalog.families].sort((a, b) => a.order - b.order);
export const models = catalog.models;
export const skus = catalog.skus;
export const grinders = catalog.grinders;
export const parts = catalog.parts;
export const dealers = catalog.dealers;
export const chains = catalog.chains;
export const analogs = catalog.analogs;

/** Продаваемые сейчас позиции: без уценённых/б-у единиц. */
export const liveSkus = skus.filter((s) => !s.markdown);

export const familyBySlug = (slug: string) => families.find((f) => f.slug === slug);
export const modelBySlug = (slug: string) => models.find((m) => m.slug === slug);
export const modelsOfFamily = (slug: string) => models.filter((m) => m.family === slug);
export const skusOfModel = (slug: string) => liveSkus.filter((s) => s.model === slug);
export const skuByCode = (code: string) => skus.find((s) => s.code === code);
export const partsForSku = (code: string) => parts.filter((p) => p.fits.includes(code));
/** Названия в мастер-каталоге рынка отличаются от карточек BIO — сопоставляем явно. */
const ANALOG_ALIASES: Record<string, string[]> = {
  "zoe competition": ["zoe competition", "zoe"],
  "zoe sed": ["zoe"],
  "zoe sap": ["zoe"],
  "zoe compact": ["zoe"],
  d8: ["d8", "d8 one"],
  "d8 pro": ["d8 pro"],
  "f18 mb": ["f18"],
  f18: ["f18"],
  "f18 sb": ["f18 sb"],
  "café racer": ["café racer"],
  opera: ["opera 2.0", "opera"],
};

export const analogsFor = (name: string) => {
  const key = name.toLowerCase();
  const targets = ANALOG_ALIASES[key] ?? [key];
  return analogs.filter((a) => targets.includes(a.sanremo.toLowerCase()));
};

export function familyPriceFrom(slug: string): number | null {
  const p = modelsOfFamily(slug).map((m) => m.priceFrom).filter((x): x is number => !!x);
  return p.length ? Math.min(...p) : null;
}

export function familyStockCount(slug: string): number {
  return modelsOfFamily(slug).reduce((a, m) => a + m.inStockCount, 0);
}

/* ── Форматирование ───────────────────────────────────────────────────────── */
const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
export const money = (v: number | null | undefined) =>
  v === null || v === undefined ? "—" : `${nf.format(Math.round(v))} ₽`;
export const kw = (v: number) => String(v).replace(".", ",");
export const moneyPrecise = (v: number) =>
  `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(v)} ₽`;

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  in_stock: "На складе",
  limited: "Ограниченное количество",
  reserved: "Зарезервировано",
  on_order: "Под заказ",
};

/* ── Редакционная матрица нагрузки (ТЗ §9: ориентир, не паспортные данные) ── */
export interface VolumeBand { id: string; label: string; models: string[] }

export const VOLUME_BANDS: VolumeBand[] = [
  { id: "u100", label: "до 100 чашек/день", models: ["zoe-sap", "zoe-sed", "zoe-compact", "you"] },
  { id: "100-200", label: "100–200 чашек/день", models: ["zoe-sed", "zoe-competition", "zoe-compact", "d8", "you"] },
  { id: "200-300", label: "200–300 чашек/день", models: ["zoe-competition", "d8", "d8-pro", "f18-sb"] },
  { id: "300-500", label: "300–500 чашек/день", models: ["d8-pro", "f18-sb", "f18-mb", "cafe-racer"] },
  { id: "500+", label: "500+ чашек/день", models: ["f18-mb", "cafe-racer", "opera", "d8-pro"] },
];

export interface Scenario {
  id: string; title: string; question: string;
  main: string; alt: string | null; upgrade: string | null; logic: string;
  photo: string;
}

/** Сценарные рекомендации — таблица ТЗ §9.2. Ориентир BIO, не паспортные данные. */
export const SCENARIOS: Scenario[] = [
  { id: "first-cafe", title: "Первая кофейня", question: "Ограниченный CAPEX, нужен предсказуемый старт",
    main: "zoe-competition", alt: "zoe-sed", upgrade: "d8",
    logic: "Zoe — рациональная база с понятной волюметрикой. D8 даёт больше контроля и запас на рост потока.",
    photo: "/photo/machine-red-lifestyle.webp" },
  { id: "bakery", title: "Пекарня и ресторан", question: "Меню без сложного обучения персонала",
    main: "zoe-competition", alt: "zoe-sed", upgrade: "d8",
    logic: "Простота обучения и предсказуемая volumetric-работа важнее расширенного контроля рецепта.",
    photo: "/photo/bar-crowd.webp" },
  { id: "specialty", title: "Независимая specialty", question: "Контроль рецепта и несколько сортов",
    main: "d8-pro", alt: "d8", upgrade: "f18-mb",
    logic: "D8 PRO — value-доступ к premium-функциям. F18 в мультибойлерном исполнении — независимость систем.",
    photo: "/photo/cafe-racer-green-detail.webp" },
  { id: "flow", title: "Высокий поток и молочное меню", question: "Пики, две-три смены бариста",
    main: "f18-sb", alt: "d8-pro", upgrade: "f18-mb",
    logic: "SB — рациональный поток. Мультибойлер и Café Racer — поток плюс контроль температуры.",
    photo: "/photo/bar-action.webp" },
  { id: "flagship", title: "Флагманская дизайн-кофейня", question: "Машина формирует образ точки",
    main: "cafe-racer", alt: "f18-mb", upgrade: "opera",
    logic: "Café Racer — первый образ бренда и одновременно рабочий инструмент. Opera — шаг к R&D.",
    photo: "/photo/machine-pink-wall.webp" },
  { id: "compact", title: "Компактный specialty и bar", question: "Дефицит места, но нужен профессиональный контроль",
    main: "you", alt: null, upgrade: "d8",
    logic: "YOU — compact professional с профилированием фаз экстракции, а не бытовая машина.",
    photo: "/photo/display-detail.webp" },
  { id: "roaster", title: "Обжарщик и лаборатория", question: "Профилирование и повторяемость",
    main: "opera", alt: "cafe-racer", upgrade: null,
    logic: "Флагман R&D: инструмент профилирования и дифференциации меню.",
    photo: "/photo/studio-dark.webp" },
];

export const modelPath = (m: Pick<Model, "slug" | "family">) => `/products/${m.family}/${m.slug}`;

/** Города дилерской сети с числом партнёров. */
export function dealerCities(): { city: string; count: number }[] {
  const map = new Map<string, number>();
  for (const d of dealers) {
    const c = d.city ?? "Уточняется";
    map.set(c, (map.get(c) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, "ru"));
}

/** Узлы каталога запчастей с числом позиций. */
export function partNodes(): { node: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of parts) map.set(p.node, (map.get(p.node) ?? 0) + 1);
  return [...map.entries()]
    .map(([node, count]) => ({ node, count }))
    .sort((a, b) => b.count - a.count);
}
