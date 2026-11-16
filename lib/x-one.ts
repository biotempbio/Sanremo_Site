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
export const xOneStockLabel = (variant: XOneVariant) => {
  if (variant.stock !== null) {
    if (variant.stock >= 3) return `На складе в Москве: ${variant.stock} шт.`;
    return variant.stock > 0 ? "Мало на складе, уточните наличие" : "Под заказ";
  }
  return variant.availability === "on_order" ? "Под заказ" : "В наличии, уточните количество";
};
