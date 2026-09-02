import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Сравнение линеек кофемашин Sanremo",
  description: "Сравните линейки Sanremo по потоку, группам, бойлерной архитектуре, управлению, РРЦ и наличию.",
};

export default function ComparePage() {
  return <><Header active="/compare" /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Сравнение линеек" }]} />
    <main className="section wrap">
      <h1 style={{ fontSize: "clamp(36px,4vw,62px)" }}>Сравнение линеек</h1>
      <p className="lead" style={{ maxWidth: "74ch", marginTop: 14 }}>Выберите две или три линейки: поток, группы, архитектура бойлеров, управление, РРЦ и наличие — в одной таблице.</p>
      <CompareClient />
    </main><Footer /></>;
}
