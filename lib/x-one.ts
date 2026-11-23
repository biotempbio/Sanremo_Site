import { grinders, type Availability } from "@/lib/catalog";

export type XOneColor = "Nero" | "White";
export type XOneVariant = {
  color: XOneColor;
  price: number | null;
  stock: number | null;
  availability: Availability;
  codes: string[];
};

const colors: XOneColor[] = ["Nero", "White"];
export const xOneEntries = grinders.filter((item) =>
  /x[\s-]?one/i.test(item.name) && !item.markdown && !/^[УВ]/i.test(item.code.trim())
);
export type XOneEntry = (typeof xOneEntries)[number];
export const xOneEntryColor = (entry: XOneEntry): XOneColor => /white/i.test(entry.name) ? "White" : "Nero";
export const xOneProductPath = (entry: XOneEntry) => `/products/x-one/?color=${xOneEntryColor(entry).toLowerCase()}`;
export const xOneProductImage = (entry: XOneEntry) => xOneEntryColor(entry) === "Nero" ? "/photo/official/x-one.webp" : null;

export const xOneVariants: XOneVariant[] = colors.map((color) => {
  const matches = xOneEntries.filter((item) => item.name.toLocaleLowerCase("en-US").includes(color.toLocaleLowerCase("en-US")));
  const prices = matches.map((item) => item.rrp).filter((price) => price > 0);
  const quantities = matches.map((item) => "inStock" in item && typeof item.inStock === "number" ? item.inStock : null);
  const stock = quantities.length && quantities.every((value) => value !== null)
    ? quantities.reduce<number>((sum, value) => sum + (value ?? 0), 0)
    : null;
  const availability: Availability = stock !== null
    ? stock >= 3 ? "in_stock" : stock > 0 ? "limited" : "on_order"
    : matches.find((item) => item.availability === "in_stock")?.availability
      ?? matches.find((item) => item.availability === "limited")?.availability
      ?? "on_order";
  return { color, price: prices.length ? Math.min(...prices) : null, stock, availability, codes: matches.map((item) => item.code) };
});

export const xOnePriceFrom = Math.min(...xOneVariants.map((item) => item.price ?? Infinity));
export const xOneHasPrice = Number.isFinite(xOnePriceFrom);
export const X_ONE_META_DESCRIPTION = "Sanremo X-One — профессиональная кофемолка с тремя бункерами: два по 1,2 кг и фронтальный для третьего сорта. Взвешивание зерна, 98 мм жернова. Официальный дистрибьютор в России.";
export const X_ONE_SHORT_DESCRIPTION = "Три бункера в одной кофемолке: два основных по 1,2 кг для двух сортов эспрессо и фронтальный для третьего зерна — декафа, сезонного лота или фильтра.";
export const X_ONE_SEARCH_DESCRIPTION = "X-One: три бункера для трёх сортов зерна, взвешивание до помола, жернова 98 мм и 12 рецептов.";
export const X_ONE_SPEC_GROUPS = [
  { title: "Помол", rows: [["Жернова", "Вертикальные плоские, 98\u00a0мм, DLC-покрытие"], ["Скорость", "800–1\u00a0400\u00a0об/мин; пресеты 1\u00a0000 / 1\u00a0200 / 1\u00a0400\u00a0об/мин"]] },
  { title: "Бункеры и дозирование", rows: [["Основные бункеры", "2 × 1,2\u00a0кг"], ["Фронтальный бункер", "До 250\u00a0г; для разовых доз или третьего сорта"], ["Доза", "5–30\u00a0г"], ["Взвешивание", "Зерно взвешивается до помола"]] },
  { title: "Управление", rows: [["Рецепты", "До 12 сохранённых рецептов"], ["Экран", "Сенсорный, 4,3\u00a0дюйма"]] },
  { title: "Электрика", rows: [["Питание", "200–240\u00a0В, 50/60\u00a0Гц"], ["Мощность", "1\u00a0650\u00a0Вт"]] },
  { title: "Габариты и вес", rows: [["Ширина × высота × глубина", "230 × 580 × 510\u00a0мм"], ["Вес", "36\u00a0кг"]] },
] as const;
export const xOneStockLabel = (variant: XOneVariant) => {
  if (variant.stock !== null) {
    if (variant.stock >= 3) return `В наличии · на складе ${variant.stock} шт`;
    return variant.stock > 0 ? "В наличии" : "Под заказ";
  }
  return variant.availability === "on_order" ? "Под заказ" : "В наличии";
};
