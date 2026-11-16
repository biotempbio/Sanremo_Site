import type { Metadata } from "next";
import { CompetitorComparison } from "../CompetitorComparison";

export const metadata: Metadata = {
  title: "Sanremo или Nuova Simonelli Appia Life — сравнение для кофейни",
  description: "Сравните двухгруппные Sanremo Zoe и D8 с Nuova Simonelli Appia Life: бойлеры, управление, подключение, цены и наличие. Источники производителя и магазинов.",
};

export default function AppiaComparisonPage() {
  return <CompetitorComparison
    title="Sanremo или Nuova Simonelli Appia Life"
    lead="Zoe, D8 и Appia Life — варианты для двух рабочих мест на кофейной стойке. Ниже — характеристики конкретных двухгруппных исполнений и открытые цены."
    sanremoSlugs={["zoe-competition", "d8"]}
    choice="Zoe стоит рассмотреть, если нужен двухгруппный старт с теплообменной системой. D8 добавляет PID. Appia Life 2GR V — двухгруппная волюметрическая машина с бойлером 11 л; для неё приведены предложения трёх российских продавцов. Сравните итоговое исполнение и условия сервиса, а не только начальную цену."
    rivals={[{
      name: "Appia Life 2GR V", groups: "2", boiler: "Один бойлер", temperature: "Термокомпенсированные группы", steam: "11 л", control: "Волюметрика", height: "140 мм (высокая группа)", electrical: "3,35 кВт · 220 В", dimensions: "784 × 544 × 500 мм (продавец)", price: "402 819–410 875 ₽", specUrl: "https://nuovasimonelli.com/en/machine/appia-life-2/?avia_extended_shop_select=yes&product_order=title",
      priceSources: [
        { name: "LigaBarShop", url: "https://ligabarshop.ru/categories/kofemashiny-nuova-simonelli-2gr", price: "от 402 819 ₽" },
        { name: "Entero", url: "https://entero.ru/item/122375", price: "410 875 ₽" },
      ],
    }]}
  />;
}
