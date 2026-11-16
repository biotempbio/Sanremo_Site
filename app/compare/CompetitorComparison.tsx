import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { architectureForModel, modelBySlug, money, skusOfModel } from "@/lib/catalog";

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
  const model = modelBySlug(slug);
  if (!model) throw new Error(`Missing catalog model ${slug}`);
  const versions = skusOfModel(slug).filter((sku) => sku.groups === 2 && sku.rrp > 0);
  const sku = [...versions].sort((a, b) => a.rrp - b.rrp)[0];
  if (!sku) throw new Error(`Missing 2-group version ${slug}`);
  const stock = versions.reduce((sum, current) => sum + current.free, 0);
  const control = sku.control ?? versions.find((version) => version.control)?.control;
  const temperature = slug === "d8-pro" ? "Раздельная настройка групп"
    : slug === "d8" ? "PID"
    : slug === "f18-mb" ? "Индивидуальная настройка температуры групп"
    : slug === "zoe-competition" ? "Теплообменная система (HX)"
    : null;
  return {
    name: model.name,
    href: `/products/${model.family}/${model.slug}/`,
    rows: ["2", slug === "d8-pro" ? "Гибридная платформа" : architectureForModel(model), temperature, sku.boilerTotal ? `${sku.boilerTotal} л` : null, control ? control.charAt(0).toLocaleUpperCase("ru-RU") + control.slice(1) : null, sku.groupHeight ?? null, [sku.power ? `${String(sku.power).replace(".", ",")} кВт` : null, sku.voltage ? `${sku.voltage} В` : null].filter(Boolean).join(" · ") || null, sku.sizeNet ? `${sku.sizeNet.w} × ${sku.sizeNet.h} × ${sku.sizeNet.d} мм` : null, `от ${money(sku.rrp)}`, stock >= 3 ? `${stock} шт. в Москве` : stock > 0 ? "Мало на складе" : "Под заказ"],
  };
}

const labels = ["Группы", "Система бойлеров", "Контроль температуры", "Бойлер", "Управление", "Высота группы", "Мощность и питание", "Габариты", "Цена", "Наличие"];
const rivalRows = (rival: Rival) => [rival.groups, rival.boiler, rival.temperature, rival.steam, rival.control, rival.height, rival.electrical, rival.dimensions, rival.price, "Уточните у продавца"];

export function CompetitorComparison({ title, lead, sanremoSlugs, rivals, choice }: { title: string; lead: string; sanremoSlugs: string[]; rivals: Rival[]; choice: string }) {
  const ours = sanremoSlugs.map(sanremoColumn);
  const columns = [...ours.map((item) => ({ name: item.name, href: item.href, rows: item.rows })), ...rivals.map((item) => ({ name: item.name, href: item.specUrl, rows: rivalRows(item) }))];
  return <><Header active="/compare" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/compare/", label: "Сравнение" }, { label: title }]} />
    <main className="wrap section guide-page competitor-page"><header className="competitor-intro"><p className="eyebrow">Сравнение по открытым данным</p><h1>{title}</h1><p className="lead">{lead}</p><p>Сравниваем двухгруппные исполнения для профессиональной стойки. Цены Sanremo берём из каталога; цены других марок — из открытых предложений магазинов, проверенных 16.11.2026. Комплектации продавцов могут отличаться.</p></header>
      <section className="competitor-wide"><div className="competitor-scroll" role="region" aria-label="Таблица сравнения моделей" tabIndex={0}><table className="data competitor-table"><thead><tr><th>Параметр</th>{columns.map((item) => <th key={item.name}><a href={item.href}>{item.name} ↗</a></th>)}</tr></thead><tbody>{labels.map((label, index) => <tr key={label}><th>{label}</th>{columns.map((item) => <td key={item.name}>{item.rows[index] ?? "Нет данных"}</td>)}</tr>)}</tbody></table></div><div className="competitor-mobile">{columns.map((item) => <article key={item.name}><h2><a href={item.href}>{item.name} ↗</a></h2><dl>{labels.map((label, index) => item.rows[index] ? <div key={label}><dt>{label}</dt><dd>{item.rows[index]}</dd></div> : null)}</dl></article>)}</div></section>
      <section className="competitor-reading"><h2>Как выбрать по задаче</h2><p>{choice}</p><p>Для проекта с несколькими сортами сравните управление температурой, для потока с молочным меню — бойлерную систему и работу пара. До заказа проверьте питание, место под оборудование и сервис в вашем городе.</p><h2>Источники характеристик и цен</h2><p>Характеристики конкурентов взяты из материалов производителей. Цены зафиксированы по открытым страницам российских магазинов 16.11.2026; они не являются нашей офертой.</p><ul>{rivals.map((rival) => <li key={rival.name}><a href={rival.specUrl} rel="noopener noreferrer" target="_blank">{rival.name}: характеристики производителя ↗</a>{rival.priceSources.map((source) => <span key={source.url}> · <a href={source.url} rel="noopener noreferrer" target="_blank">{source.name}: {source.price} ↗</a></span>)}</li>)}</ul><p>Характеристики Sanremo и цены доступны в карточках моделей в таблице. Для них используется текущий каталог сайта.</p></section>
      <div className="competitor-actions"><a className="btn btn-solid" href="/solutions/kofejnya/">Подобрать Sanremo</a><a className="btn" href="/leasing/">Купить в лизинг</a><a className="btn" href="/dealers/">Найти дилера</a></div>
      <nav className="competitor-back"><a href="/compare/">← Все сравнения</a></nav>
    </main><Footer /></>;
}
