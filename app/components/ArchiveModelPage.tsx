import type { Metadata } from "next";
import { Header, Footer } from "./Chrome";
import { Crumbs } from "./Bits";
import { ARCHIVE_MODELS, type ArchiveModelSlug } from "@/lib/archive-models";

export function archiveMetadata(slug: ArchiveModelSlug): Metadata {
  const { name } = ARCHIVE_MODELS[slug];
  return {
    title: `Sanremo ${name} — архив: сервис и запчасти`,
    description: `Sanremo ${name} снята с поставки в Россию. Для владельцев: сервис в России, поиск совместимых запчастей по модели и помощь в выборе актуальной машины Sanremo.`,
  };
}

export function ArchiveModelPage({ slug }: { slug: ArchiveModelSlug }) {
  const model = ARCHIVE_MODELS[slug];
  const partsHref = `/parts/?q=${encodeURIComponent(model.partsQuery)}`;
  return <>
    <Header active="/products" />
    <Crumbs items={[{ href: "/", label: "Главная" }, { href: "/products/", label: "Кофемашины" }, { label: model.name }]} />
    <main>
      <section className="wrap section">
        <div className="sec-head">
          <div><p className="eyebrow">Архивная модель Sanremo</p><h1>Sanremo {model.name}</h1></div>
          <p className="lead">Модель снята с поставки в Россию.</p>
        </div>
        <div className="prose" style={{ marginTop: 30 }}>
          <p>Sanremo {model.name} — профессиональная рожковая кофемашина. Новые поставки этой модели в Россию не ведутся.</p>
          <p>Для точного подбора обслуживания и совместимых комплектующих укажите серийный номер и исполнение машины.</p>
        </div>
      </section>

      <section className="bg-gray"><div className="wrap section"><div className="grid g3">
        <div><p className="eyebrow">Владельцам</p><h2 style={{ fontSize: "clamp(23px,2.3vw,32px)" }}>Сервис</h2><p className="small">Диагностика, обслуживание и запрос работ по вашей машине.</p><a className="link-arrow" href="/service/">Перейти в сервис</a></div>
        <div><p className="eyebrow">Владельцам</p><h2 style={{ fontSize: "clamp(23px,2.3vw,32px)" }}>Запчасти</h2><p className="small">Найдите подходящую деталь по названию модели или отправьте запрос с серийным номером.</p><a className="link-arrow" href={partsHref}>Искать запчасти</a></div>
        <div><p className="eyebrow">Покупка и поддержка</p><h2 style={{ fontSize: "clamp(23px,2.3vw,32px)" }}>Официальные дилеры</h2><p className="small">Найдите партнёра в вашем регионе для консультации и дальнейшего обслуживания.</p><a className="link-arrow" href="/dealers/">Найти дилера</a></div>
      </div></div></section>

      <section className="wrap section"><div className="sec-head"><div><p className="eyebrow">Актуальная замена</p><h2>Подберём модель под ваш проект</h2></div><p className="lead">Подберём замену из текущих линеек Sanremo по вашему потоку и меню.</p></div><a className="btn btn-solid" href="/choose/">Подобрать актуальную модель</a></section>
    </main>
    <Footer />
  </>;
}
