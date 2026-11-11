const priceFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export function formatPrice(value: number | null | undefined) {
  return value === null || value === undefined ? "—" : `${priceFormatter.format(value)}\u00a0₽`;
}
