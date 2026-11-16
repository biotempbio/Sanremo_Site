const priceFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export function formatPrice(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : `${priceFormatter.format(value).replace(/[\u00a0\u202f ]/g, "\u202f")}\u00a0₽`;
}

/** Склонение счётчиков: 1 цвет, 2 цвета, 5 цветов, 11 цветов, 21 цвет. */
export function pluralize(count: number, one: string, few: string, many: string) {
  const absolute = Math.abs(Math.trunc(count));
  const lastTwo = absolute % 100;
  const last = absolute % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

/** Артикул — идентификатор, поэтому пробелы между его цифрами не являются разрядами цены. */
export function plainArticle(value: string | null | undefined) {
  if (value == null) return null;
  const article = value.trim();
  return /^[0-9\s\u00a0\u202f]+$/.test(article) ? article.replace(/\s/g, "") : article;
}

export function stockSummary(units: number) {
  if (units >= 3) return `В наличии в Москве: ${units} ${pluralize(units, "машина", "машины", "машин")}`;
  return units > 0 ? "Мало на складе, уточните наличие" : "Под заказ · 6–8 недель";
}
