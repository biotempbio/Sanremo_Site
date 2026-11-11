import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { DocumentLibrary } from "./DocumentLibrary";
import { documents } from "@/lib/documents";
import { models } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Документы Sanremo — инструкции, схемы и декларации | BIO",
  description: "Документы Sanremo в России: инструкции, схемы, каталоги запчастей и декларации по моделям. Выберите модель и тип документа, скачайте PDF прямо с сайта BIO.",
};

export default function DocumentsPage() {
  const options = models.map((model) => ({ slug: model.slug, name: model.name }));
  return <><Header /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Документы" }]} /><main>
    <section className="section wrap"><div className="sec-head"><div><p className="eyebrow">Техническая библиотека</p><h1 style={{ fontSize: "clamp(34px,4vw,62px)" }}>Документы Sanremo</h1></div><p className="lead">{documents.length} PDF по моделям: инструкции, схемы, каталоги запчастей, брошюры и декларации. Выберите модель и тип файла, чтобы сразу скачать нужный документ.</p></div>
      <DocumentLibrary models={options} />
    </section>
  </main><Footer /></>;
}
