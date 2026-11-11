import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs, Price, Stock } from "../components/Bits";
import { models, modelPath, skusOfModel, PRICE_DATE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Цены и наличие кофемашин Sanremo",
  description: "Цены на кофемашины Sanremo в России: сравните конфигурации, проверьте наличие по артикулу и откройте карточку модели Sanremo.",
};

export default function PricesPage() {
  return <><Header /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Цены и наличие" }]} />
    <main><section className="section wrap">
      <div className="sec-head"><div><p className="eyebrow">Каталог Sanremo</p><h1 style={{fontSize:"clamp(34px,4vw,62px)"}}>Цены и наличие</h1></div>
        <div><p className="lead">Сравните версии, цены и наличие.</p><p className="tiny">Цены и наличие на {PRICE_DATE}.</p></div></div>
      <div className="table-scroll"><table className="data"><thead><tr><th>Модель</th><th>Конфигурации</th><th>Цена от</th><th>Статус</th><th></th></tr></thead>
        <tbody>{models.map(m => { const rows=skusOfModel(m.slug); const first=rows.find(x=>x.free>0) ?? rows[0]; return <tr key={m.slug}><td><b>{m.name}</b></td><td>{m.skuCount}</td><td><Price value={m.priceFrom} from note={false}/></td><td>{first ? <Stock status={first.availability} free={first.free}/> : "—"}</td><td><a className="link-arrow" href={modelPath(m)}>Карточка модели</a></td></tr>; })}</tbody>
      </table></div>
    </section></main><Footer /></>;
}
