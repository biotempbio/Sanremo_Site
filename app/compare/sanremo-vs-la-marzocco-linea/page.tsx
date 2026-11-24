import { competitorPrice } from "@/lib/competitor-prices";
import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { CompetitorComparison } from "../CompetitorComparison";

export const metadata: Metadata = pageMetadata("/compare/sanremo-vs-la-marzocco-linea/", {
  title: "Sanremo или La Marzocco Linea — сравнение для кофейни",
  description: "Сравните двухгруппные Sanremo D8 PRO и F18 MB с La Marzocco Linea Classic S и Linea PB: бойлеры, питание, управление и открытые цены в России.",
});

export default function LineaComparisonPage() {
  return <CompetitorComparison
    path="/compare/sanremo-vs-la-marzocco-linea/"
    published="2026-11-16" modified="2026-11-24"
    title="Sanremo или La Marzocco Linea"
    lead="D8 PRO, F18 MB, Linea Classic S и Linea PB — двухгруппные машины с разным устройством и оснащением. Сопоставьте бойлеры, управление, питание и бюджет конкретного исполнения."
    sanremoSlugs={["d8-pro", "f18-mb"]}
    choice="D8 PRO подойдёт команде, которой нужна раздельная настройка групп в гибридной платформе. F18 MB — мультибойлерная версия Sanremo. Linea Classic S и Linea PB используют отдельные кофейный и паровой бойлеры; выбор между ними зависит от исполнения и работы команды. Сопоставляйте предложения с одинаковым числом групп и набором опций."
    rivals={[
      { name: "Linea Classic S AV", groups: "2", boiler: "Кофейный и паровой бойлеры", temperature: "Два PID: кофе и пар", steam: "Паровой 7 л; кофейный 3,4 л", control: "Волюметрика (AV)", height: "Зависит от исполнения", electrical: "3,35–5,67 кВт; 220/380 В", dimensions: "690 × 585 × 444 мм", ...competitorPrice("classic"), specUrl: "https://www.lamarzocco.com/uk/en/wp-content/uploads/2025/05/product_brochure_linea_classic_s_eng.pdf" },
      { name: "Linea PB AV · 2GR Tall Cup HW 220V+HL", groups: "2", boiler: "Кофейный и паровой бойлеры", temperature: "PID кофе и пара", steam: "Паровой 7 л; кофейный 3,4 л", control: "Волюметрика (AV)", height: "Зависит от исполнения", electrical: "4,6 кВт · 220/380 В", dimensions: "710 × 590 × 533 мм", ...competitorPrice("pb"), specUrl: "https://www.lamarzocco.com/uk/en/commercial-products/espresso-machines/linea-pb/" },
    ]}
  >
    <h2>Classic S, PB и Linea Mini решают разные задачи</h2>
    <p>Таблица относится к двухгруппным Classic S AV и PB AV для профессиональной стойки. Linea Mini — другое исполнение: не переносите на неё мощность, размеры и бойлеры из этой таблицы. Если нужна одногруппная Sanremo для личной работы с рецептом, отдельно посмотрите <a href="/products/you/you/">YOU</a>.</p>
    <h2>Как оценить альтернативу для кофейни</h2>
    <p>Начните с рецептов и работы команды. Раздельная настройка групп имеет смысл, если бариста действительно готовят разные сорта или меняют параметры. Сопоставьте её с паровой нагрузкой, местом на стойке и возможностями электропитания. Проверьте выбранные <a href="/products/f18/f18-mb/">F18 MB</a> и <a href="/products/d8/d8-pro/">D8 PRO</a> по конкретным артикулам.</p>
    <p>Сравнивайте также монтаж, гарантийные условия и доступность сервиса: они влияют на стоимость владения.</p>
    <p>Если выбранная Linea лучше соответствует привычному процессу команды и условиям обслуживания, это основание сохранить её в коротком списке. Выбор Sanremo стоит проверять на тех же задачах — через <a href="/choose/">подбор</a>, документы и обсуждение запуска с дилером.</p>
  </CompetitorComparison>;
}
