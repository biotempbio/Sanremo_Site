import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { CasesClient } from "./CasesClient";

export const metadata: Metadata = {
  title: "Sanremo в кофейнях России — проекты и фотографии",
  description: "Посмотрите кофейни и рестораны России, где работают машины Sanremo: фотографии стоек, города, адреса и модели. Выберите город или линейку.",
};

export default function CasesPage() {
  return <><Header active="/cases" /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Кейсы" }]} />
    <main><section className="wrap case-index">
      <div className="sec-head"><div><p className="eyebrow">Sanremo в России</p><h1>Где варят на Sanremo</h1></div><p className="lead">Реальные кофейные пространства: как машина вписана в стойку, какие модели стоят в заведениях и где их можно увидеть.</p></div>
      <CasesClient />
    </section></main><Footer /></>;
}
