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

type Props = { searchParams: Promise<{ city?: string }> };

export default async function DealersPage({ searchParams }: Props) {
  const { city } = await searchParams;
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
          <div className="sec-head">
            <div>
              <p className="eyebrow">Дилерская сеть · {dealers.length} партнёров в {cities.length} городах</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>Где купить Sanremo</h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Сайт не продаёт оборудование. Здесь вы выбираете подходящего продавца или шоурум:
                кто рядом, кто показывает машину вживую, кто монтирует и обслуживает.
              </p>
              <p className="source-note">
                Источник: справочник дилеров компании BIO. Публикуются только активные партнёры;
                у каждой записи хранится служебный статус и дата проверки.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap section-tight">
          <DealersClient
            dealers={dealers.map((d) => ({ name: d.name, city: d.city, address: d.address, site: d.site, note: d.note, verified: d.verified }))}
            cities={cities}
            initialCity={city}
          />
        </section>

        <section className="section bg-gray">
          <div className="wrap">
            <div className="grid g3">
              <div>
                <p className="eyebrow">Карта</p>
                <h3>Карта партнёров</h3>
                <p className="small">Выберите город в списке выше, чтобы найти ближайшего партнёра.</p>
              </div>
              <div>
                <p className="eyebrow">Аналитика</p>
                <h3>Измеряемые переходы</h3>
                <p className="small">
                  Исходящие переходы на сайты дилеров и клики по телефону размечаются UTM и
                  событиями, чтобы BIO видела отдачу от переданных лидов.
                </p>
              </div>
              <div>
                <p className="eyebrow">Стать партнёром</p>
                <h3>Дилерам</h3>
                <p className="small">
                  Регион, компания, опыт и ресурсы — заявка уходит channel-менеджеру BIO. Партнёры
                  получают карточки, характеристики, РРЦ и медиаматериалы в едином виде.
                </p>
                <a className="btn btn-sm" href="/contacts" style={{ marginTop: 8 }}>Стать дилером</a>
              </div>
            </div>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </main>
      <Footer />
    </>
  );
}
