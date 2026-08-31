import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { models } from "@/lib/catalog";

const BROCHURES = [
  { model: "ZOE Competition", name: "Брошюра ZOE 2026", href: "/documents/brochures/zoe-2026-ru.pdf" },
  { model: "F18 Single Boiler", name: "Брошюра F18 Single Boiler", href: "/documents/brochures/f18-single-boiler.pdf" },
  { model: "F18", name: "Брошюра F18", href: "/documents/brochures/f18.pdf" },
  { model: "Cafe Racer", name: "Брошюра Cafe Racer", href: "/documents/brochures/cafe-racer.pdf" },
  { model: "Opera", name: "Брошюра Opera 2.0", href: "/documents/brochures/opera.pdf" },
  { model: "You", name: "Брошюра You", href: "/documents/brochures/you.pdf" },
];

export const metadata: Metadata = { title: "Документы Sanremo", description: "Инструкции, электрические схемы, взрыв-схемы и сертификаты для кофемашин Sanremo." };

export default function DocumentsPage() {
  const rows = Array.from(
    new Map(
      models.flatMap((model) =>
        model.docs.map((document) => [document.ref, { ...document, model: model.name }] as const),
      ),
    ).values(),
  );
  return <><Header /><Crumbs items={[{href:"/",label:"Главная"},{label:"Документы"}]}/><main>
    <section className="section wrap"><div className="sec-head"><div><p className="eyebrow">Техническая библиотека</p><h1 style={{fontSize:"clamp(34px,4vw,62px)"}}>Документы</h1></div><p className="lead">Инструкции, схемы и сертификаты собраны по моделям. Для получения актуального файла укажите название и модель в запросе.</p></div>
      <div className="table-scroll"><table className="data"><thead><tr><th>Модель</th><th>Документ</th><th>Тип</th><th></th></tr></thead><tbody>
        {BROCHURES.map(d=><tr key={d.href}><td>{d.model}</td><td><b>{d.name}</b></td><td>Официальная брошюра</td><td><a className="link-arrow" href={d.href} target="_blank" rel="noreferrer">Открыть PDF</a></td></tr>)}
        {rows.map(d=><tr id={d.ref} key={d.ref}><td>{d.model}</td><td><b>{d.name}</b></td><td>{d.type}</td><td><a className="link-arrow" href={`mailto:info@sanremomachines.ru?subject=${encodeURIComponent(`Документ Sanremo: ${d.name}`)}`}>Запросить файл</a></td></tr>)}
      </tbody></table></div>
    </section></main><Footer/></>;
}
