import type { Metadata } from "next";
import { Header, Footer } from "./Chrome";
import { BaristaAccessories } from "./BaristaAccessories";
import { Crumbs } from "./Bits";
import { ARCHIVE_MODELS, type ArchiveModelSlug } from "@/lib/archive-models";
import { money } from "@/lib/catalog";
import { plainArticle } from "@/lib/format";
import { capriParts, capriAvailability } from "@/lib/capri-parts";
import CapriPartsTable from "../products/capri/CapriPartsTable";

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
  const matchingParts = slug === "capri" ? capriParts : [];
  return <>
    <Header active="/products" />
    <Crumbs items={[{ href: "/", label: "Главная" }, { href: "/products/", label: "Кофемашины" }, { label: model.name }]} />
    <main>
      <section className="wrap section archive-hero">
        <div className="archive-hero-copy"><p className="eyebrow">Архивная модель Sanremo</p><h1>Sanremo {model.name}</h1>
          <p className="lead">{slug === "capri" ? "Модель снята с производства. Поможем с сервисом и запчастями." : "Модель снята с поставки в Россию."}</p>
          <p>Sanremo {model.name} — профессиональная рожковая кофемашина. Новые поставки этой модели в Россию не ведутся.</p>
          <p>Для точного подбора совместимых деталей и обслуживания укажите серийный номер и исполнение машины.</p>
        </div>
        <aside className="archive-hero-panel"><span className="eyebrow">Для владельцев</span><strong>{model.name}</strong><p>Найдите запчасть или оставьте запрос на обслуживание машины.</p><a className="btn btn-solid" href={partsHref}>Сервис и запчасти →</a></aside>
      </section>

      {slug === "capri" ? <section className="wrap section-tight">
        <div className="sec-head"><div><p className="eyebrow">Каталог запчастей</p><h2>Детали для Capri · {matchingParts.length}</h2></div><p className="lead">Совместимость конкретной машины проверяем по серийному номеру.</p></div>
        <CapriPartsTable rows={matchingParts.map((part) => ({ code: part.code, name: part.name, article: plainArticle(part.article) ?? part.code, price: part.rrp > 0 ? money(part.rrp) : "Цена по запросу", stock: part.stock, availability: capriAvailability(part.stock) }))} />
        <a className="btn btn-solid" href={partsHref} style={{ marginTop: 24 }}>Заявка на сервис / запчасти</a>
      </section> : null}

      <section className="bg-gray"><div className="wrap section"><div className="grid g3">
        <div><p className="eyebrow">Владельцам</p><h2 style={{ fontSize: "clamp(23px,2.3vw,32px)" }}>Сервис</h2><p className="small">Диагностика, обслуживание и запрос работ по вашей машине.</p><a className="link-arrow" href="/service/">Перейти в сервис</a></div>
        <div><p className="eyebrow">Владельцам</p><h2 style={{ fontSize: "clamp(23px,2.3vw,32px)" }}>Запчасти</h2><p className="small">Найдите подходящую деталь по названию модели или отправьте запрос с серийным номером.</p><a className="link-arrow" href={partsHref}>Искать запчасти</a></div>
        <div><p className="eyebrow">Покупка и поддержка</p><h2 style={{ fontSize: "clamp(23px,2.3vw,32px)" }}>Официальные дилеры</h2><p className="small">Найдите партнёра в вашем регионе для консультации и дальнейшего обслуживания.</p><a className="link-arrow" href="/dealers/">Найти дилера</a></div>
      </div></div></section>

      <section className="wrap section"><div className="sec-head"><div><p className="eyebrow">Актуальная замена</p><h2>Подберём модель под ваш проект</h2></div><p className="lead">{slug === "capri" ? "Как и Verona, Capri осталась в архиве. Для новой кофейни сравните исполнения Zoe и подберите машину по потоку и меню." : "Подберём замену из текущих линеек Sanremo по вашему потоку и меню."}</p></div><a className="btn btn-solid" href="/choose/">Подобрать актуальную модель</a>{slug === "capri" ? <p className="small" style={{ marginTop: 16 }}><a href="/products/verona/">Сравнить с архивной Verona</a> · <a href="/products/zoe/">Посмотреть Zoe</a></p> : null}</section>
    </main>
    <BaristaAccessories />
    <Footer />
  </>;
}
