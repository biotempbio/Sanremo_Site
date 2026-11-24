import { competitorPrice } from "@/lib/competitor-prices";
import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { CompetitorComparison } from "../CompetitorComparison";

export const metadata: Metadata = pageMetadata("/compare/sanremo-vs-fiamma/", {
  title: "Sanremo или Fiamma — Caravel, Compass, Zoe и D8 для кофейни",
  description: "Fiamma Caravel 2 CV и Compass 2 SE или Sanremo Zoe и D8: сравнение двухгруппных машин, PID и подключения. Различия Compass SE, Dualboiler и Multiboiler.",
});

export default function FiammaComparisonPage() {
  return <CompetitorComparison
    path="/compare/sanremo-vs-fiamma/"
    published="2026-11-24" modified="2026-11-24"
    title="Sanremo или Fiamma: Caravel и Compass для кофейни"
    lead="У Fiamma Caravel и Compass есть разные корпуса, управление и бойлерные системы. Начнём с двух полноразмерных двухгруппных версий — Caravel 2 CV и Compass 2 SE — рядом с Sanremo Zoe Competition и D8."
    sanremoSlugs={["zoe-competition", "d8"]}
    choice="Для бара с привычным меню сопоставьте Zoe Competition и Caravel 2 CV: управление дозой, работу с молоком и полную стоимость запуска. Если нужна регулировка через PID, сравните D8 и Compass 2 SE. Переход к Compass Dualboiler или Multiboiler — отдельное решение о температурной архитектуре, его стоит принимать по рецептам и работе смены."
    rivals={[
      { name: "Fiamma Caravel 2 CV TC Restyle", groups: "2", boiler: "Один бойлер, традиционная система", temperature: "Прессостат", steam: "11 л", control: "Программируемые порции напитка и горячей воды", height: "Высокая (TC)", electrical: "3,7 кВт; 220–240 В", dimensions: "665 × 530 × 563 мм (Ш × В × Г)", ...competitorPrice("caravel"), specUrl: "https://fiammaespresso.com/en/p/caravel-2-cv-2262563301" },
      { name: "Fiamma Compass 2 SE TC White", groups: "2", boiler: "Один бойлер, термосифонная система", temperature: "PID", steam: "11 л", control: "Контроль дозы, таймеры пролива", height: "Высокая (TC)", electrical: "3,7 кВт; 220–240 В", dimensions: "750 × 590 × 600 мм (Ш × В × Г)", ...competitorPrice("compass"), specUrl: "https://fiammaespresso.com/en/p/compass-2-se-1711524845" },
    ]}
  >
    <h2>Caravel 2 CV: дозы и место на стойке</h2>
    <p>У Caravel 2 CV программируются порции напитка и горячей воды, есть автоматическая промывка групп и статическая прединфузия. Управление нагревом — через прессостат. Для кофейни полезно проверить настройку порций на собственном рецепте, удобство паровых кранов и порядок вечерней очистки.</p>
    <p>В линейке есть отдельные версии Caravel 2 и Caravel 2 CV Compact. Цена или фотография одной из них не определяет оснащение Caravel 2 CV из таблицы. Если выбираете более узкий корпус, заново сверьте паспорт и рабочее пространство вокруг машины. Рядом с полноразмерной CV посмотрите <a href="/products/zoe/">двухгруппную Zoe Competition</a> и сравните готовую стойку с кофемолкой и водой.</p>
    <h2>Compass 2 SE и D8: когда нужен PID</h2>
    <p>Compass 2 SE сочетает один бойлер с термосифонной системой, PID и таймерами пролива. Указанная производителем мощность — 3,7 кВт. Это не та же машина, что Compass Dualboiler: буквы SE здесь определяют выбранную архитектуру.</p>
    <p>В <a href="/products/d8/">D8</a> тоже есть PID. Если сотрудники будут менять температурные настройки под рецепт, попросите показать эту процедуру на обеих машинах. Обсудите порядок запуска после простоя, настройку доз и работу в серии молочных напитков. Сравнение меню и действий бариста помогает понять пользу управления лучше, чем одно слово PID в перечне функций.</p>
    <h2>Compass SE, Dualboiler и Multiboiler: три разных выбора</h2>
    <p>У <a href="https://fiammaespresso.com/en/p/compass-2-dualboiler-1886977252" target="_blank" rel="noopener noreferrer">Compass 2 Dualboiler</a> заявлены отдельные бойлеры: 10,5 л для воды и пара и 1,2 л для кофе. Это отличается от одного бойлера SE. Для такой версии заново проверяют подключение и настройки; переносить в её предложение мощность 3,7 кВт из строки Compass 2 SE нельзя.</p>
    <p>В <a href="https://fiammaespresso.com/en/machines" target="_blank" rel="noopener noreferrer">каталоге Fiamma</a> Multiboiler указан отдельной моделью, как и Astrolab с вариантами MB и Pressure Profile. Перед переходом к этому классу определите, нужны ли разные температуры групп, несколько сортов и работа с профилями. Для Sanremo эту задачу разберите через <a href="/guide/multiboylernaya-kofemashina/">гайд по бойлерным системам</a>, затем выберите подходящее исполнение в <a href="/compare/">сравнении линеек</a>.</p>
    <h2>Молочное меню: что проверить на демонстрации</h2>
    <p>Возьмите обычные для вашей точки стаканы и питчеры. Приготовьте серию эспрессо, капучино и напитков большого объёма в том порядке, в котором они приходят в пиковый час. Оцените перемещения сотрудника, доступ к паровым трубкам и работу вдвоём. Ёмкость бойлера и число групп описывают конструкцию, но не обещают одинаковую скорость бара при любой команде.</p>
    <h2>Как сравнить цену Fiamma и Sanremo</h2>
    <ul>
      <li>Зафиксируйте полное название, две группы, управление и корпус.</li>
      <li>Включите водоподготовку, кофемолку, подключение и запуск.</li>
      <li>Отдельно согласуйте опции: например, Cool Touch для Compass SE указан как дополнительное оснащение.</li>
      <li>Проверьте сроки поставки и обслуживание в своём городе.</li>
    </ul>
    <p>По Sanremo таблица ведёт на конкретные исполнения с опубликованными РРЦ и наличием. Для выбора базовой машины среди других марок откройте также <a href="/compare/sanremo-vs-carimali/">сравнение с Carimali</a> и <a href="/compare/sanremo-vs-la-cimbali/">разбор La Cimbali M26</a>. Полный бюджет удобно собрать по <a href="/guide/oborudovanie-dlya-kofejni/">списку оборудования кофейни</a>.</p>
  </CompetitorComparison>;
}
