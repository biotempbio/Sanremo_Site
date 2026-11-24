import { money } from "./catalog";

// Public seller quotes checked against the exact execution, not a brand minimum.
// Evidence and check dates: docs/seo-plan/PRICE-AUDIT-2026-11-24.md.
export const competitorPrices = {
  cento: { rub: 446725, seller: "VKUS", execution: "Cento · 2 высокие группы", url: "https://coffee-tea.ru/catalog/equipment/cento-2-gruppnaya-klassicheskaya-kofemashina/" },
  bubble: { rub: 470990, seller: "Кофепровод", execution: "Bubble 2 Gr White", url: "https://kofeprovod.ru/product/carimali-bubble-2-gr-white" },
  caravel: { rub: 293821, seller: "Торговый Дизайн", execution: "Caravel 2 CV TC Restyle", url: "https://t-d.ru/item/kofemashina-professionalnaya-fiamma-caravel-2-cv-tc-restyle/" },
  compass: { rub: 279867, seller: "Redgastro", execution: "Compass 2 SE TC White", url: "https://fiamma.redgastro.ru/catalog/detail/kofemashina_avtomat_2_gruppy_fiamma_compass_2_se_tc_white/" },
  appia: { rub: 481185, seller: "CoffeeState", execution: "Appia Life XT 2Gr V · белая", url: "https://coffeestate.ru/catalog/kofemashiny/coffeemachines_espresso_rogkovie/nuova_simonelli/699/" },
  eagle: { rub: 1289010, seller: "CoffeeState", execution: "Eagle One · 2 группы · белая", url: "https://coffeestate.ru/catalog/kofemashiny/coffeemachines_espresso_rogkovie/victoria_arduino/1761/" },
  cimbali: { rub: 516140, seller: "Арт-Вендинг", execution: "M26 SE DT2 TC", url: "https://art-vending.ru/catalog/kofemashiny/rozhkovyie/lacimbali-m26-se-dt2-ts/" },
  classic: { rub: 1175226, seller: "La Marzocco Россия", execution: "Linea Classic S · 2GR AV", url: "https://la-marzocco.ru/espresso-machines/tproduct/991132895322-kofemashina-la-marzocco-linea-classic-s" },
  pb: { rub: 1750000, seller: "Траст Холод", execution: "Linea PB · 2GR AV Tall Cup HW 220V+HL", url: "https://trust-holod.ru/product/kofemashina-la-marzocco-linea-pb-2gr-av-tall-cup-hw-220vplushl/" },
} as const;

export function competitorPrice(key: keyof typeof competitorPrices) {
  const quote = competitorPrices[key];
  const price = money(quote.rub);
  return { price, priceSources: [{ name: `${quote.seller} · ${quote.execution}`, url: quote.url, price }] };
}
