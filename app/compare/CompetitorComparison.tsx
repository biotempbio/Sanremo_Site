import type { ReactNode } from "react";
import { Header, Footer } from "../components/Chrome";
import { BaristaAccessories } from "../components/BaristaAccessories";
import { Crumbs } from "../components/Bits";
import { ActionArrow } from "../components/ActionArrow";
import { architectureForModel, money } from "@/lib/catalog";
import { editorialOffer } from "@/lib/editorial-offers";
import { comparisonSpecifications } from "@/lib/comparison-specifications";
import { stockSummary } from "@/lib/format";
import { articleSchema, jsonLd } from "@/lib/seo";

type Rival = {
  name: string;
  groups: string;
  boiler: string;
  temperature: string;
  steam: string;
  control: string;
  height: string;
  electrical: string;
  dimensions: string;
  price: string;
  specUrl: string;
  priceSources: { name: string; url: string; price: string }[];
};

function sanremoColumn(slug: string) {
  const offer = editorialOffer(slug);
  if (!offer) throw new Error(`Missing 2-group version ${slug}`);
  const { model, sku } = offer;
  const verified = comparisonSpecifications[slug];
  const control = sku.control ?? verified?.control;
  const temperature = slug === "d8-pro" ? "Раздельная настройка групп"
    : slug === "d8" ? "PID"
    : slug === "f18-mb" ? "Индивидуальная настройка температуры групп"
    : slug === "zoe-competition" ? "Теплообменная система (HX)"
    : null;
  return {
    name: model.name,
    href: offer.href,
    source: verified?.source,
    rows: ["2", slug === "d8-pro" ? "Гибридная платформа" : architectureForModel(model), verified?.temperature ?? temperature, verified?.boiler ?? (sku.boilerTotal ? `${sku.boilerTotal} л суммарно` : null), control ? control.charAt(0).toLocaleUpperCase("ru-RU") + control.slice(1) : null, sku.groupHeight ?? null, verified?.electrical ?? ([sku.power ? `${String(sku.power).replace(".", ",")} кВт` : null, sku.voltage ? `${sku.voltage} В` : null].filter(Boolean).join(" · ") || null), verified?.dimensions ?? "Монтажные размеры — по чертежу исполнения", money(sku.rrp), stockSummary(sku.free)],
  };
}

const labels = ["Группы", "Система бойлеров", "Контроль температуры", "Бойлер", "Управление", "Высота группы", "Мощность и питание", "Габариты", "Цена", "Наличие"];
const rivalRows = (rival: Rival) => [rival.groups, rival.boiler, rival.temperature, rival.steam, rival.control, rival.height, rival.electrical, rival.dimensions, rival.price, "Уточните у продавца"];

export function CompetitorComparison({ title, lead, sanremoSlugs, rivals, choice, path, children, published, modified = "2026-11-23" }: { title: string; lead: string; sanremoSlugs: string[]; rivals: Rival[]; choice: string; path: string; children?: ReactNode; published?: string; modified?: string }) {
  const ours = sanremoSlugs.map(sanremoColumn);
  const columns = [...ours.map((item) => ({ name: item.name, href: item.href, rows: item.rows })), ...rivals.map((item) => ({ name: item.name, href: item.specUrl, rows: rivalRows(item) }))];
  return <><Header active="/compare" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/compare/", label: "Сравнение" }, { label: title }]} />
    <main className="wrap section guide-page competitor-page"><header className="competitor-intro"><p className="eyebrow">Сравнение для кофейни</p><h1>{title}</h1><p className="lead">{lead}</p><p>Сравниваем двухгруппные исполнения. Откройте карточку, чтобы выбрать комплектацию.</p></header>
      <section className="competitor-wide"><div className="competitor-scroll" role="region" aria-label="Таблица сравнения моделей" tabIndex={0}><table className="data competitor-table"><thead><tr><th>Параметр</th>{columns.map((item) => <th key={item.name}><a href={item.href}>{item.name} <ActionArrow /></a></th>)}</tr></thead><tbody>{labels.map((label, index) => <tr key={label}><th>{label}</th>{columns.map((item) => <td key={item.name}>{item.rows[index] ?? "Нет данных"}</td>)}</tr>)}</tbody></table></div><div className="competitor-mobile">{columns.map((item) => <article key={item.name}><h2><a href={item.href}>{item.name} <ActionArrow /></a></h2><dl>{labels.map((label, index) => item.rows[index] ? <div key={label}><dt>{label}</dt><dd>{item.rows[index]}</dd></div> : null)}</dl></article>)}</div></section>
      <section className="competitor-reading"><h2>Как выбрать по задаче</h2><p>{choice}</p><p>Для проекта с несколькими сортами сравните управление температурой, для молочного меню — пар и работу бариста в пиковый час. До заказа проверьте питание, место на стойке и сервис в вашем городе. Для планировки используйте <a href="/documents/">монтажный чертёж нужной версии</a>; суммарный объём бойлеров не равен объёму парового бойлера.</p>{children}<h2>Источники характеристик и цен</h2><ul>{ours.filter((item) => item.source).map((item) => <li key={item.name}><a href={item.source}>Sanremo {item.name}: документация</a></li>)}{rivals.map((rival) => <li key={rival.name}><a href={rival.specUrl} rel="noopener noreferrer" target="_blank">{rival.name}: документ производителя <ActionArrow /></a>{rival.priceSources.map((source) => <span key={source.url}> · <a href={source.url} rel="noopener noreferrer" target="_blank">{source.name}: {source.price} <ActionArrow /></a></span>)}</li>)}</ul><p>Данные Sanremo и цены — из действующего каталога сайта. Итоговую комплектацию, стоимость поставки и запуска согласуйте до заказа.</p></section>
      <div className="competitor-actions"><a className="btn btn-solid" href="/solutions/kofejnya/">Подобрать Sanremo</a><a className="btn" href="/leasing/">Купить в лизинг</a><a className="btn" href="/dealers/">Найти дилера</a></div>
      <nav className="competitor-back"><a href="/compare/">← Все сравнения</a></nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema(title, lead, path, { published, modified })) }} />
    </main><BaristaAccessories /><Footer /></>;
}
