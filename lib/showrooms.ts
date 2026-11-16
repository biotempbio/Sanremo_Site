export const OFFICIAL_SHOWROOMS = [
  { name: "Территория кофе", city: "Москва", address: "Москва, ул. Правды, 17/19" },
  { name: "Бобер Сервис", city: "Санкт-Петербург", address: "Санкт-Петербург, ул. Лабораторная, 14Г" },
] as const;

export function isOfficialShowroom(dealer: { name: string; city: string | null }) {
  return OFFICIAL_SHOWROOMS.some((showroom) => showroom.name === dealer.name && showroom.city === dealer.city);
}
