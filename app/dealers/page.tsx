import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import DealersClient from "./DealersClient";
import { dealers, dealerCities } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Где купить Sanremo — дилеры, шоурумы и сервис по России",
  description:
    "Авторизованные дилеры Sanremo в России: продажа, шоурум, демонстрация, обучение, монтаж и сервис. Поиск по городу и региону. Если партнёра рядом нет — заявку принимает дистрибьютор BIO.",
};

export default function DealersPage() {
  const cities = dealerCities();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Дилерская сеть Sanremo в России",
    numberOfItems: dealers.length,
    itemListElement: dealers.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: d.name,
        address: d.address ?? d.city ?? undefined,
        url: d.site ?? undefined,
      },
    })),
  };

  return (
    <>
      <Header active="/dealers" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "Где купить" }]} />
      <main>
        <section className="wrap" style={{ paddingBottom: 30 }}>
          <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>Где купить</h1>
          <p className="lead" style={{ maxWidth: "74ch" }}>
            Сайт не продаёт машины. Выберите дилера или шоурум: продажа, демонстрация, обучение,
            монтаж, гарантийный и постгарантийный сервис, запчасти. Регион определяется подсказкой,
            но выбирается вручную.
          </p>
        </section>

        <section className="wrap section-tight">
          <DealersClient
            dealers={dealers.map((d) => ({ name: d.name, city: d.city, address: d.address, site: d.site, note: d.note, verified: d.verified }))}
            cities={cities}
          />
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </main>
      <Footer />
    </>
  );
}
