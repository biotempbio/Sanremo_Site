import { competitorPrice } from "@/lib/competitor-prices";
import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { CompetitorComparison } from "../CompetitorComparison";

export const metadata: Metadata = pageMetadata("/compare/sanremo-vs-la-cimbali/", {
  title: "Sanremo или La Cimbali M26 — сравнение для кофейни",
  description: "La Cimbali M26 SE DT2, Sanremo Zoe и D8: сравнение двухгруппных машин. Чем отличаются BE, SE и Compact, как проверить подключение, комплектацию и бюджет.",
});

export default function CimbaliComparisonPage() {
  return <CompetitorComparison
    path="/compare/sanremo-vs-la-cimbali/"
    published="2026-11-24" modified="2026-11-24"
    title="Sanremo или La Cimbali M26: какую выбрать для кофейни"
    lead="В предложениях на La Cimbali M26 встречаются BE, SE и Compact. Сравним полноразмерную двухгруппную M26 SE DT2 Tall Cup с Sanremo Zoe Competition и D8, а различия версий разберём отдельно."
    sanremoSlugs={["zoe-competition", "d8"]}
    choice="Zoe Competition включите в выбор для двухгруппного бара с теплообменной системой. D8 — если оператору нужна настройка температуры через PID. Для M26 сначала зафиксируйте обозначение SE DT2 и полноразмерный корпус: у Compact другие размеры и бойлер, а оснащение BE отличается от SE. Таблица относится к M26 SE DT2 Tall Cup."
    rivals={[
      { name: "La Cimbali M26 SE DT2 Tall Cup · full size", groups: "2", boiler: "Тепловая система LaCimbali, общий бойлер", temperature: "Smart Boiler в исполнении SE", steam: "10 л", control: "Кнопочная панель, дисплей SE", height: "Tall Cup", electrical: "4,2–4,9 кВт; 220–240 В, 50/60 Гц", dimensions: "794 × 548 × 528 мм (Ш × В × Г)", ...competitorPrice("cimbali"), specUrl: "https://www.cimbali.com/sites/default/files/dati_tecnici_m26.pdf" },
    ]}
  >
    <h2>M26 BE и SE: за что сравнивать комплектацию</h2>
    <p>В <a href="https://www.cimbali.com/sites/default/files/documenti/6l_lc_m26-final.pdf" target="_blank" rel="noopener noreferrer">брошюре La Cimbali M26</a> у BE указана базовая электроника без дисплея и подсветки рабочей зоны. У полноразмерной SE перечислены дисплей, подсветка, Smart Boiler и режим Energy Saving Light. Wi-Fi вынесен в отдельный комплект. Нельзя переносить весь набор функций SE в предложение на BE только потому, что на корпусе написано M26.</p>
    <p>Составьте список операций своей смены: настройка дозы, чтение показаний, промывка, работа с паром и горячей водой. Затем попросите продемонстрировать их на предлагаемой версии. Так становится понятно, за какое оснащение вы платите и кто будет им пользоваться.</p>
    <h2>Почему M26 Compact нужно считать отдельно</h2>
    <p>Две группы не делают Compact и полноразмерную M26 одинаковыми. По техническому листу у Compact ширина 594 мм и бойлер 5 л, у полноразмерной двухгруппной версии — 794 мм и 10 л. Compact стоит рассматривать, когда место на стойке определяет проект. Для базового сравнения здесь взята полноразмерная машина.</p>
    <p>Проверьте место не только под корпус: бариста нужны кофемолка, зона темперовки, нок-бокс и доступ к воде и сливу. Разницу в литрах бойлера нельзя напрямую переводить в чашки в час. Для приёмки воспроизведите свою пиковую серию заказов с обычной посудой и молочным меню.</p>
    <h2>Zoe или D8 рядом с M26</h2>
    <p><a href="/products/zoe/">Zoe Competition</a> — отправная точка для сравнения базовой двухгруппной стойки Sanremo. Сверьте не только цену машины, но и высоту групп, управление выбранного артикула, подключение и состав запуска. В таблице показано исполнение Zoe в наличии, если такая двухгруппная версия есть в каталоге.</p>
    <p><a href="/products/d8/">D8</a> добавляет в выбор PID. Это повод обсудить настройку рецепта на вашем кофе и работу сотрудников с температурой. Smart Boiler у M26 SE и PID у D8 обозначают разные решения; сравнивайте нужные действия оператора на демонстрации. Для нескольких температурных режимов групп посмотрите также <a href="/guide/multiboylernaya-kofemashina/">руководство по мультибойлерным машинам</a>.</p>
    <h2>Если вам предлагают La Cimbali M23UP</h2>
    <p>У <a href="https://www.cimbali.com/products/traditional-machines/m23" target="_blank" rel="noopener noreferrer">M23UP</a> тоже нужно различать управление: DT имеет четыре кнопки доз и непрерывную подачу, C — непрерывную подачу с одной кнопкой. Эти обозначения помогают сравнить работу смены, но не заменяют паспорт M26. Попросите отдельное предложение на M23UP с указанием групп и высоты, если рассматриваете её вместо M26.</p>
    <h2>Что должно войти в предложение на кофейню</h2>
    <ul>
      <li>Полное обозначение машины, управление и высота групп.</li>
      <li>Схема питания и выделенная мощность именно поставляемого исполнения.</li>
      <li>Подготовка воды, установка, запуск на выбранном зерне и обучение.</li>
      <li>Местный сервис, расходники и порядок обращения при остановке бара.</li>
    </ul>
    <p>Собрать полный комплект поможет <a href="/guide/oborudovanie-dlya-kofejni/">гайд по оборудованию для кофейни</a>. Если выбираете базовую машину среди нескольких марок, сопоставьте также <a href="/compare/sanremo-vs-carimali/">Cento и Bubble</a> или <a href="/compare/sanremo-vs-fiamma/">Caravel и Compass</a>.</p>
  </CompetitorComparison>;
}
