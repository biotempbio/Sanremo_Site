import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { models } from "@/lib/catalog";

export const metadata: Metadata = { title: "Документы Sanremo", description: "Инструкции, электрические схемы, взрыв-схемы и сертификаты для кофемашин Sanremo." };

export default function DocumentsPage() {
  const rows = Array.from(new Map(models.flatMap(m => m.docs.map(d => [d.ref, { ...d, model: m.name }])).filter(Boolean)).values());
  return <><Header /><Crumbs items={[{href:"/",label:"Главная"},{label:"Документы"}]}/><main>
    <section className="section wrap"><div className="sec-head"><div><p className="eyebrow">Техническая библиотека</p><h1 style={{fontSize:"clamp(34px,4vw,62px)"}}>Документы</h1></div><p className="lead">Инструкции, схемы и сертификаты собраны по моделям. Для получения актуального файла укажите название и модель в запросе.</p></div>
      <div className="table-scroll"><table className="data"><thead><tr><th>Модель</th><th>Документ</th><th>Тип</th><th></th></tr></thead><tbody>{rows.map(d=><tr id={d.ref} key={d.ref}><td>{d.model}</td><td><b>{d.name}</b></td><td>{d.type}</td><td><a className="link-arrow" href={`mailto:info@sanremomachines.ru?subject=${encodeURIComponent(`Документ Sanremo: ${d.name}`)}`}>Запросить файл</a></td></tr>)}</tbody></table></div>
    </section></main><Footer/></>;
}
