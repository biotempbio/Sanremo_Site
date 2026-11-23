import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import Image from "next/image";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { CardAction } from "../components/ActionArrow";
import { itemList, jsonLd } from "@/lib/seo";
import { officialImageForModel } from "@/lib/catalog";

export const metadata: Metadata = pageMetadata("/guide/", {
  title: "Как выбрать кофемашину Sanremo — гид для бизнеса",
  description: "Гид по выбору кофемашины Sanremo для кофейни и ресторана: поток, группы, бойлеры, питание, цены и сервис. Сравните семь линеек.",
});

const articles = [
  { name: "Кофемолка для кофейни", path: "/guide/kofemolka-dlya-kofejni/", summary: "Жернова, доза по весу и число сортов: как выбрать кофемолку под свою стойку.", image: "/photo/official/x-one.webp", alt: "Кофемолка Sanremo X-One", time: "≈ 6 мин", number: "01" },
  { name: "Купить, лизинг или аренда", path: "/guide/kupit-lizing-ili-arenda-kofemashiny/", summary: "Сравнение способов покупки и текущие цены моделей Sanremo из каталога.", image: officialImageForModel("f18-sb"), alt: "Кофемашина Sanremo F18", time: "≈ 5 мин", number: "02" },
  { name: "Оборудование для кофейни", path: "/guide/oborudovanie-dlya-kofejni/", summary: "Что поставить на стойку сразу, что добавить позже и как оценить бюджет.", image: officialImageForModel("d8"), alt: "Кофемашина Sanremo D8", time: "≈ 6 мин", number: "03" },
  { name: "Как выбрать для кофейни", path: "/guide/kofemashina-dlya-kofejni/", summary: "Поток, группы, бойлеры, молочное меню и бюджет — от задачи до подходящей версии.", image: officialImageForModel("zoe-competition"), alt: "Кофемашина Sanremo Zoe Competition", time: "≈ 8 мин", number: "04" },
  { name: "Как выбрать для ресторана", path: "/guide/kofemashina-dlya-restorana/", summary: "Как учесть пики заказов, работу нескольких сотрудников и подготовку бара.", image: officialImageForModel("f18-sb"), alt: "Кофемашина Sanremo F18 Single Boiler", time: "≈ 4 мин", number: "05" },
  { name: "Линейки Sanremo", path: "/guide/linejki-sanremo/", summary: "Семь линеек в одной таблице: бойлеры, группы, управление, поток и цены.", image: officialImageForModel("cafe-racer"), alt: "Кофемашина Sanremo Café Racer", time: "≈ 4 мин", number: "06" },
  { name: "Двухгруппная кофемашина", path: "/guide/dvuhgruppnaya-kofemashina/", summary: "Когда нужны две группы и чем отличаются двухгруппные версии Sanremo.", image: officialImageForModel("d8"), alt: "Двухгруппная кофемашина Sanremo D8", time: "≈ 5 мин", number: "07" },
  { name: "Мультибойлерная кофемашина", path: "/guide/multiboylernaya-kofemashina/", summary: "Раздельная температура групп, пар и выбор между гибридом и мультибойлером.", image: officialImageForModel("f18-mb"), alt: "Мультибойлерная кофемашина Sanremo F18 MB", time: "≈ 4 мин", number: "08" },
  { name: "Рожковая или суперавтомат", path: "/guide/rozhkovaya-kofemashina-ili-superavtomat/", summary: "Когда работа бариста помогает продавать кофе дороже и как проверить экономику точки.", image: officialImageForModel("zoe-competition"), alt: "Рожковая кофемашина Sanremo Zoe Competition", time: "≈ 9 мин", number: "09" },
];
const comparisons = [
  { name: "Sanremo и Victoria Arduino Eagle One", path: "/compare/sanremo-vs-victoria-arduino-eagle-one/", summary: "F18 MB, Café Racer и Eagle One: нагрев, рабочая стойка и выбор исполнения." },
  { name: "Сравнить линейки Sanremo", path: "/compare/", summary: "Группы, бойлеры, управление, цена и наличие в одной таблице." },
  { name: "Sanremo и La Marzocco Linea", path: "/compare/sanremo-vs-la-marzocco-linea/", summary: "Сопоставление бойлеров, управления и цен по открытым данным." },
  { name: "Sanremo и Nuova Simonelli Appia Life", path: "/compare/sanremo-vs-nuova-simonelli-appia/", summary: "Двухгруппные машины для кофейни: оснащение и стоимость." },
];

export default function GuidePage() {
  return <><Header active="/guide/" /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Как выбрать" }]} />
    <main className="wrap section guide-page guide-index"><header className="guide-intro"><p className="eyebrow">Как выбрать</p><h1>Как выбрать кофемашину Sanremo</h1>
      <p className="lead">Начните с формата заведения, числа групп или бойлерной системы. В каждой статье — ссылки на модели и доступные версии.</p></header>
      <a className="guide-choose-panel" href="/choose/"><span><small>Начните с вашей задачи</small><strong>Подобрать по задаче</strong><em>Ответьте на несколько вопросов о потоке, меню и рабочей зоне.</em></span><CardAction className="guide-choose-button">Начать подбор</CardAction></a>
      <section className="guide-comparisons"><div className="sec-head"><div><p className="eyebrow">Выбор между моделями</p><h2>Сравнения моделей</h2></div></div><div className="guide-comparison-grid">{comparisons.map((item) => <a href={item.path} key={item.path}><strong>{item.name}</strong><span>{item.summary}</span><CardAction>Сравнить</CardAction></a>)}</div></section>
      <section className="guide-articles"><div className="sec-head"><div><p className="eyebrow">Разобраться в деталях</p><h2>Статьи и гайды</h2></div></div><div className="guide-index-grid">{articles.map((a) => <a className="guide-index-card" href={a.path} key={a.path}>
        <span className="guide-index-visual"><Image src={a.image ?? ""} alt={a.alt} width={600} height={400} unoptimized /></span>
        <div className="guide-index-meta"><span>{a.number} / ГИД</span><span>{a.time} чтения</span></div>
        <h2>{a.name}</h2><p>{a.summary}</p><CardAction>Читать</CardAction>
      </a>)}</div></section>
      <div className="guide-index-next"><p>Уже знаете поток и меню?</p><a className="btn btn-solid" href="/choose/">Перейти к подбору</a></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemList("Гайды по выбору Sanremo", articles)) }} />
    </main><Footer /></>;
}
