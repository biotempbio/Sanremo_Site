import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { CompetitorComparison } from "../CompetitorComparison";

export const metadata: Metadata = pageMetadata("/compare/sanremo-vs-nuova-simonelli-appia/", {
  title: "Sanremo или Nuova Simonelli Appia Life — сравнение для кофейни",
  description: "Sanremo Zoe, D8 или Nuova Simonelli Appia Life: как выбрать для кофейни. Отличия Standard, Timer и XT, таблица двухгруппных исполнений, цены Sanremo и подключение.",
});

export default function AppiaComparisonPage() {
  return <CompetitorComparison
    path="/compare/sanremo-vs-nuova-simonelli-appia/"
    published="2026-11-16"
    title="Sanremo или Nuova Simonelli Appia Life"
    lead="Если вы выбираете Appia Life для кофейни, сопоставьте её с двухгруппными Sanremo Zoe и D8. Сначала определите нужное управление и исполнение, затем сравните цену, подключение и обслуживание."
    sanremoSlugs={["zoe-competition", "d8"]}
    choice="Zoe стоит рассмотреть для двухгруппной стойки с теплообменной системой. D8 — если важен PID. В семействе Appia Life есть разные версии: Standard, Timer и XT. Для числовой таблицы ниже выбрана Appia Life XT 2 Groups Volumetric с TFT-дисплеем: именно это исполнение описано в текущем техническом листе производителя. Его характеристики нельзя автоматически переносить на Standard 2GR V или Compact."
    rivals={[{
      name: "Appia Life XT 2 Groups Volumetric", groups: "2", boiler: "Бойлер по техническому листу XT", temperature: "Настройки — по паспорту исполнения XT", steam: "11 л", control: "Волюметрика, TFT-дисплей", height: "Уточнить исполнение группы", electrical: "3,35 кВт; питание — по паспорту поставки", dimensions: "784 × 498 × 545 мм (Ш × В × Г)", price: "Уточнить для XT у продавца", specUrl: "https://nuovasimonelli.com/en/machine/appia-life-2/", priceSources: [],
    }]}
  >
    <h2>Appia Life Standard, Timer и XT: что сравнивать</h2>
    <p>Название Appia Life без полного обозначения не определяет комплектацию. Standard включает разные группы и размеры; у Timer есть отображение времени пролива, у XT — TFT-интерфейс. Спросите продавца о версии, управлении дозой и высоте группы. Нельзя сравнить цену компактной машины с паспортом полноразмерной.</p>
    <h2>Когда рассмотреть Zoe, а когда D8</h2>
    <p>Для постоянного меню выпишите ежедневные действия бариста: запуск и остановка дозы, работа с паром, промывка. Затем сравните подходящую <a href="/products/zoe/">версию Zoe</a> с выбранной Appia. Если команда будет пользоваться регулировкой температуры, добавьте к выбору <a href="/products/d8/">D8</a>. Цена дополнительной функции имеет смысл, когда она решает задачу меню.</p>
    <h2>Что запросить перед покупкой двухгруппной машины</h2>
    <ul><li>Полное обозначение версии, число групп и управление проливом.</li><li>Питание, выделенную мощность, воду, слив и размеры с доступом для обслуживания.</li><li>Что входит в цену: поставка, установка, запуск и обучение.</li><li>Кто обслуживает машину в вашем городе и как заказывать расходники.</li></ul>
    <p>Appia Life стоит оставить в выборе, если её конкретное исполнение и местный сервис подходят вашему проекту. Чтобы проверить альтернативу Sanremo, откройте карточки Zoe и D8 из таблицы: там можно сменить исполнение и оформить заказ по опубликованной цене. Для более подробного расчёта используйте <a href="/guide/oborudovanie-dlya-kofejni/">список оборудования для кофейни</a>.</p>
  </CompetitorComparison>;
}
