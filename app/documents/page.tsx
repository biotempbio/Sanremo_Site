import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { DocumentLibrary } from "./DocumentLibrary";
import { documents } from "@/lib/documents";
import { models } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Документы Sanremo — инструкции, схемы и декларации",
  description: "Документы Sanremo в России: инструкции, схемы, каталоги запчастей и декларации по моделям. Выберите модель и тип документа, скачайте PDF прямо с сайта.",
};

export default function DocumentsPage() {
  const options = models.map((model) => ({ slug: model.slug, name: model.name, family: model.family }));
  return <><Header /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Документы" }]} /><main>
    <section className="section wrap"><div className="sec-head"><div><p className="eyebrow">Техническая библиотека</p><h1 style={{ fontSize: "clamp(34px,4vw,62px)" }}>Документы Sanremo</h1></div><p className="lead">Брошюры, инструкции, схемы и сертификаты собраны по моделям. Файлы открываются сразу в PDF. Если нужного документа нет — напишите, пришлём.</p></div>
      <DocumentLibrary models={options} />
    </section>
  </main><Footer /></>;
}
