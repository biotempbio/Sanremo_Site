import type { Metadata } from "next";
import { CompetitorComparison } from "../CompetitorComparison";

export const metadata: Metadata = {
  title: "Sanremo или La Marzocco Linea — сравнение для кофейни",
  description: "Сравните двухгруппные Sanremo D8 PRO и F18 MB с La Marzocco Linea Classic S и Linea PB: бойлеры, питание, управление и открытые цены в России.",
};

export default function LineaComparisonPage() {
  return <CompetitorComparison
    title="Sanremo или La Marzocco Linea"
    lead="D8 PRO, F18 MB, Linea Classic S и Linea PB — двухгруппные машины с разным устройством и оснащением. Сопоставьте бойлеры, управление, питание и бюджет конкретного исполнения."
    sanremoSlugs={["d8-pro", "f18-mb"]}
    choice="D8 PRO подойдёт команде, которой нужна раздельная настройка групп в гибридной платформе. F18 MB — мультибойлерная версия Sanremo. Linea Classic S и Linea PB используют отдельные кофейный и паровой бойлеры; выбор между ними зависит от исполнения и работы команды. Сопоставляйте предложения с одинаковым числом групп и набором опций."
    rivals={[
      { name: "Linea Classic S AV", groups: "2", boiler: "Кофейный и паровой бойлеры", temperature: "Два PID: кофе и пар", steam: "Паровой 7 л; кофейный 3,4 л", control: "Волюметрика (AV)", height: "Зависит от исполнения", electrical: "3,35–5,67 кВт; 220/380 В", dimensions: "690 × 585 × 444 мм", price: "1 175 226 ₽", specUrl: "https://www.lamarzocco.com/uk/en/wp-content/uploads/2025/05/product_brochure_linea_classic_s_eng.pdf", priceSources: [{ name: "La Marzocco Россия", url: "https://la-marzocco.ru/espresso-machines/tproduct/991132895322-kofemashina-la-marzocco-linea-classic-s", price: "1 175 226 ₽" }] },
      { name: "Linea PB AV", groups: "2", boiler: "Кофейный и паровой бойлеры", temperature: "PID кофе и пара", steam: "Паровой 7 л; кофейный 3,4 л", control: "Волюметрика (AV)", height: "Зависит от исполнения", electrical: "4,6 кВт · 220/380 В", dimensions: "710 × 590 × 533 мм", price: "1 750 000 ₽", specUrl: "https://www.lamarzocco.com/uk/en/commercial-products/espresso-machines/linea-pb/", priceSources: [
        { name: "Траст Холод", url: "https://trust-holod.ru/category/kofemashiny/la-marzocco/pb/", price: "1 750 000 ₽" },
      ] },
    ]}
  />;
}
