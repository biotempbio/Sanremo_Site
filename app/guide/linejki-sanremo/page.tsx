import type { Metadata } from "next";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs } from "../../components/Bits";
import { RelatedReading } from "../../components/GuideBlocks";
import { families, familyPriceFrom, modelsOfFamily, money, skusOfModel, VOLUME_BANDS } from "@/lib/catalog";
import { articleSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Линейки Sanremo: группы, бойлеры, РРЦ | BIO",
  description: "Сравните линейки профессиональных кофемашин Sanremo по группам, архитектуре бойлеров, управлению, рабочему потоку и РРЦ из каталога BIO в России.",
};

export default function LinejkiPage() {
  const rows = families.map((family) => ({
    family,
    bands: VOLUME_BANDS.filter((band) => band.models.some((slug) => slug === family.slug || slug.startsWith(`${family.slug}-`))),
    controls: [...new Set(modelsOfFamily(family.slug).flatMap((model) => skusOfModel(model.slug).map((sku) => sku.control).filter((control): control is string => Boolean(control))))],
  }));
  const path = "/guide/linejki-sanremo/";
  return <><Header active="/guide/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/guide/", label: "Как выбрать" }, { label: "Линейки Sanremo" }]} />
    <main className="wrap section guide-article"><article>
      <p className="eyebrow">Сравнение внутри бренда</p><h1>Линейки Sanremo: что меняется от модели к модели</h1>
      <p className="lead" style={{ marginTop: 22 }}>Ниже — семейства из российского каталога BIO. РРЦ «от» вычислена из доступных конфигураций; поток — ориентир подбора BIO, а не паспортная производительность машины.</p>
      <h2>Сначала определите задачу</h2>
      <p>Количество групп задаёт число рабочих мест, но само по себе не гарантирует нужный темп в пиковую смену. Важны рецепты, доля молочных напитков, организация бара и подготовка персонала. Архитектура бойлеров определяет, насколько отдельно бариста может управлять температурой приготовления и паром.</p>
      <div className="table-scroll" role="region" aria-label="Сравнение линеек Sanremo" tabIndex={0}>
        <table className="data" style={{ minWidth: 920 }}><thead><tr><th>Линейка</th><th>Группы</th><th>Архитектура</th><th>Управление</th><th>Ориентир потока BIO</th><th>РРЦ от</th><th>Кому подходит</th></tr></thead>
          <tbody>{rows.map(({ family, bands, controls }) => <tr key={family.slug}>
            <td><a href={`/products/${family.slug}/`}>Sanremo {family.name}</a></td>
            <td>{[...new Set(modelsOfFamily(family.slug).flatMap((model) => model.groupsAvailable))].sort().join(" / ")}</td>
            <td>{family.architecture}</td><td>{controls.join(" / ") || "Смотрите карточки"}</td><td>{bands.map((b) => b.label).join("; ") || "Смотрите конфигурации"}</td>
            <td>{money(familyPriceFrom(family.slug))}</td><td>{family.scenarios.slice(0, 2).join("; ")}</td>
          </tr>)}</tbody></table>
      </div>
      <h2>Как читать сравнение</h2>
      <p>Строка семейства объединяет несколько версий и исполнений. Например, внутри F18 есть F18 Single Boiler и F18 MB. Их цены и характеристики надо сравнивать на уровне конкретной модели и артикула. Цвет, высота группы, опции и складской статус также зависят от конфигурации.</p>
      <p>Если важны разные температурные настройки для нескольких сортов, откройте карточки с независимым управлением группами. Если меню в основном состоит из стандартных напитков, сравните также более простые исполнения. Окончательный выбор делайте по карточке SKU и техническим условиям вашей площадки.</p>
      <p><a href="/compare/">Открыть интерактивное сравнение линеек →</a></p>
      <RelatedReading />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema("Линейки Sanremo: что меняется от модели к модели", metadata.description as string, path)) }} />
    </article></main><Footer /></>;
}
