import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { BaristaAccessories } from "../components/BaristaAccessories";
import { Crumbs } from "../components/Bits";
import CompareClient from "./CompareClient";

export const metadata: Metadata = pageMetadata("/compare/", {
  title: "Сравнение линеек кофемашин Sanremo",
  description: "Сравните линейки Sanremo между собой: рабочий поток, число групп, архитектура бойлеров, управление, цены и наличие. Откройте карточки моделей Sanremo.",
});

export default function ComparePage() {
  return <><Header active="/compare" /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Сравнение линеек" }]} />
    <main className="section wrap">
      <h1 style={{ fontSize: "clamp(36px,4vw,62px)" }}>Сравнение линеек</h1>
      <p className="lead" style={{ maxWidth: "74ch", marginTop: 14 }}>Выберите две или три линейки: поток, группы, архитектура бойлеров, управление, цены и наличие — в одной таблице.</p>
      <CompareClient />
      <section className="competitor-links"><p className="eyebrow">Другие марки</p><h2>Сравнения с другими брендами</h2><div className="grid g2"><a href="/compare/sanremo-vs-nuova-simonelli-appia/"><strong>Sanremo и Nuova Simonelli Appia Life</strong><span>Двухгруппные машины для кофейни →</span></a><a href="/compare/sanremo-vs-la-marzocco-linea/"><strong>Sanremo и La Marzocco Linea</strong><span>Бойлеры, управление и цены →</span></a><a href="/compare/sanremo-vs-victoria-arduino-eagle-one/"><strong>Sanremo и Victoria Arduino Eagle One</strong><span>F18 MB, Café Racer и двухгруппная Eagle One →</span></a><a href="/compare/sanremo-vs-carimali/"><strong>Sanremo и Carimali</strong><span>Cento, Bubble, Zoe и D8 →</span></a><a href="/compare/sanremo-vs-la-cimbali/"><strong>Sanremo и La Cimbali</strong><span>M26: комплектации BE, SE и Compact →</span></a><a href="/compare/sanremo-vs-fiamma/"><strong>Sanremo и Fiamma</strong><span>Caravel, Compass и выбор бойлерной системы →</span></a></div></section>
    </main><BaristaAccessories /><Footer /></>;
}
