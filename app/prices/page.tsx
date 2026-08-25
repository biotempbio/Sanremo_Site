import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs, Price, Stock } from "../components/Bits";
import { models, modelPath, skusOfModel, PRICE_DATE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "РРЦ и наличие кофемашин Sanremo",
  description: "Актуальные рекомендованные розничные цены и складской статус кофемашин Sanremo в России.",
};

export default function PricesPage() {
  return <><Header /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "РРЦ и наличие" }]} />
    <main><section className="section wrap">
      <div className="sec-head"><div><p className="eyebrow">Коммерческие данные</p><h1 style={{fontSize:"clamp(34px,4vw,62px)"}}>РРЦ и наличие</h1></div>
        <p className="lead">Единая таблица российских конфигураций. Данные обновлены {PRICE_DATE}; окончательную комплектацию и срок поставки подтверждает дилер.</p></div>
      <div className="table-scroll"><table className="data"><thead><tr><th>Модель</th><th>Конфигурации</th><th>РРЦ от</th><th>Статус</th><th></th></tr></thead>
        <tbody>{models.map(m => { const rows=skusOfModel(m.slug); const first=rows.find(x=>x.free>0) ?? rows[0]; return <tr key={m.slug}><td><b>{m.name}</b></td><td>{m.skuCount}</td><td><Price value={m.priceFrom} note={false}/></td><td>{first ? <Stock status={first.availability} free={first.free}/> : "—"}</td><td><a className="link-arrow" href={modelPath(m)}>Карточка модели</a></td></tr>; })}</tbody>
      </table></div>
    </section></main><Footer /></>;
}
