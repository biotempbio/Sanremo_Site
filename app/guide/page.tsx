import type { Metadata } from "next";
import Image from "next/image";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { itemList, jsonLd } from "@/lib/seo";
import { officialImageForModel } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Как выбрать кофемашину Sanremo — гид для бизнеса | BIO",
  description: "Гид BIO по выбору профессиональной кофемашины для кофейни и ресторана: поток, группы, бойлеры, питание, РРЦ и сервис. Сравните линейки Sanremo.",
};

const articles = [
  { name: "Кофемашина для кофейни", path: "/guide/kofemashina-dlya-kofejni/", summary: "Поток, группы, бойлеры, молочное меню и бюджет — от задачи до конкретного артикула.", image: officialImageForModel("zoe-competition"), alt: "Кофемашина Sanremo Zoe Competition", time: "≈ 8 мин", number: "01" },
  { name: "Кофемашина для ресторана", path: "/guide/kofemashina-dlya-restorana/", summary: "Как учесть пики заказов, работу нескольких сотрудников и подготовку бара.", image: officialImageForModel("f18-sb"), alt: "Кофемашина Sanremo F18 Single Boiler", time: "≈ 4 мин", number: "02" },
  { name: "Линейки Sanremo", path: "/guide/linejki-sanremo/", summary: "Семь линеек в одной таблице: бойлеры, группы, управление, ориентир потока и РРЦ.", image: officialImageForModel("cafe-racer"), alt: "Кофемашина Sanremo Café Racer", time: "≈ 4 мин", number: "03" },
];

export default function GuidePage() {
  return <><Header active="/guide/" /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Как выбрать" }]} />
    <main className="wrap section guide-page guide-index"><header className="guide-intro"><p className="eyebrow">Гид BIO</p><h1>Как выбрать кофемашину Sanremo</h1>
      <p className="lead">Три маршрута к выбору: начните с формата заведения или сразу сравните линейки. В каждом гиде — ссылки на конфигурации из российского каталога BIO.</p></header>
      <div className="guide-index-grid">{articles.map((a) => <article className="guide-index-card" key={a.path}>
        <a href={a.path} className="guide-index-visual"><Image src={a.image ?? ""} alt={a.alt} width={600} height={400} unoptimized /></a>
        <div className="guide-index-meta"><span>{a.number} / ГИД</span><span>{a.time} чтения</span></div>
        <h2><a href={a.path}>{a.name}</a></h2><p>{a.summary}</p><a className="guide-index-link" href={a.path}>Читать гид →</a>
      </article>)}</div>
      <div className="guide-index-next"><p>Уже знаете поток и меню?</p><a className="btn btn-solid" href="/choose/">Перейти к подбору</a></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemList("Гайды по выбору Sanremo", articles)) }} />
    </main><Footer /></>;
}
