const priceFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export function formatPrice(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : `${priceFormatter.format(value).replace(/[\u00a0\u202f ]/g, "\u202f")}\u00a0₽`;
}
