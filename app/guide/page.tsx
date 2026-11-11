import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { itemList, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Как выбрать кофемашину Sanremo — гид для бизнеса | BIO",
  description: "Гид BIO по выбору профессиональной кофемашины для кофейни и ресторана: поток, группы, бойлеры, питание, РРЦ и сервис. Сравните линейки Sanremo.",
};

const articles = [
  { name: "Кофемашина для кофейни", path: "/guide/kofemashina-dlya-kofejni/", summary: "Как связать поток, группы, бойлеры, меню и бюджет с конкретной конфигурацией." },
  { name: "Кофемашина для ресторана", path: "/guide/kofemashina-dlya-restorana/", summary: "На что смотреть при нерегулярном потоке и работе нескольких сотрудников." },
  { name: "Линейки Sanremo", path: "/guide/linejki-sanremo/", summary: "Сравнение семейств и версий по данным российского каталога BIO." },
];

export default function GuidePage() {
  return <><Header active="/guide/" /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Как выбрать" }]} />
    <main className="wrap section"><p className="eyebrow">Гид BIO</p><h1>Как выбрать кофемашину Sanremo</h1>
      <p className="lead" style={{ marginTop: 22 }}>Начните с задачи заведения, затем проверьте технические условия и сравните доступные в России конфигурации.</p>
      <div className="grid g3" style={{ marginTop: 42 }}>{articles.map((a) => <article className="card" key={a.path}><div className="card-body"><h2 style={{ fontSize: 29 }}><a href={a.path}>{a.name}</a></h2><p>{a.summary}</p><a className="link-arrow" href={a.path}>Читать →</a></div></article>)}</div>
      <p style={{ marginTop: 34 }}><a className="btn btn-solid" href="/choose/">Перейти к подбору</a></p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemList("Гайды по выбору Sanremo", articles)) }} />
    </main><Footer /></>;
}
