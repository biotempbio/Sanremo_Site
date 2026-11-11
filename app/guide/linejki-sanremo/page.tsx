import type { Metadata } from "next";
import Image from "next/image";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs } from "../../components/Bits";
import { RelatedReading } from "../../components/GuideBlocks";
import { familyBySlug, familyPriceFrom, modelBySlug, modelsOfFamily, money, officialImageForModel, PRICE_DATE, skusOfModel, VOLUME_BANDS } from "@/lib/catalog";
import { articleSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Линейки Sanremo: группы, бойлеры и цены",
  description: "Сравните семь линеек Sanremo по группам, бойлерам, управлению, потоку и цене. Откройте подходящую модель и её конфигурации.",
};

const lineups = [
  { key: "zoe", name: "Zoe", family: "zoe", models: ["zoe-compact", "zoe-sap", "zoe-sed", "zoe-competition"], image: "zoe-competition", fit: ["Первая кофейня", "Пекарня"], headline: "Теплообменная отправная точка", description: "В линейке Zoe есть компактная версия, полуавтоматическая SAP, автоматическая SED и Competition. Их объединяет теплообменная архитектура; управление, цена и исполнение различаются. Откройте модель, если нужен понятный стартовый ассортимент, и отдельно сравните версии по способу дозирования." },
  { key: "d8", name: "D8 / D8 PRO", family: "d8", models: ["d8", "d8-pro"], image: "d8-pro", fit: ["Растущая кофейня", "Сеть"], headline: "Гибридная платформа с выбором числа групп", description: "D8 представлена исполнениями с одной, двумя и тремя группами; D8 PRO — с двумя или тремя. В линейке используются гибридная группа и PID. По сравнению с Zoe здесь шире выбор рабочих мест, а различие между D8 и PRO состоит в раздельной настройке температуры групп у PRO." },
  { key: "f18-sb", name: "F18 Single Boiler", family: "f18", models: ["f18-sb"], image: "f18-sb", fit: ["Молочное меню", "Поток"], headline: "Однобойлерное исполнение F18", description: "F18 SB — отдельная двухгруппная версия с однобойлерной архитектурой. В сравнении с F18 MB она отличается устройством бойлерной системы и цене. Подходит для сравнения при плотном меню; если нужен независимый контроль контуров, смотрите также F18 MB." },
  { key: "f18-mb", name: "F18 MB", family: "f18", models: ["f18-mb"], image: "f18-mb", fit: ["Высокий поток", "Specialty"], headline: "Мультибойлерная версия F18", description: "F18 MB выпускается в российском каталоге с двумя и тремя группами. Мультибойлерная схема отличает её от F18 SB и позволяет отдельно управлять температурными контурами. Мощность и подключение зависят от исполнения." },
  { key: "cafe-racer", name: "Café Racer", family: "cafe-racer", models: ["cafe-racer"], image: "cafe-racer", fit: ["Флагманская точка", "Specialty"], headline: "Мультибойлер и выразительный корпус", description: "Café Racer — мультибойлерная линейка с PID и вариантами на две или три группы. Её стоит сопоставить с F18 MB, когда техническая платформа и внешний вид машины одинаково важны для проекта. Если машина будет стоять вне поля зрения гостей, сравните функции и цену обеих линеек до выбора корпуса." },
  { key: "opera", name: "Opera", family: "opera", models: ["opera"], image: "opera", fit: ["Обжарщик", "Лаборатория"], headline: "Работа с несколькими рецептами", description: "Opera представлена двухгруппными версиями. Для линейки указаны мультибойлерная архитектура и помпа в группе. Opera подходит для обжарщика, лаборатории и флагманской точки. Если расширенное управление рецептом не требуется, сравните также Café Racer и F18 MB." },
  { key: "you", name: "YOU", family: "you", models: ["you"], image: "you", fit: ["Компактный бар", "Рецепты"], headline: "Одна группа и профилирование", description: "YOU — одногруппная мультибойлерная модель с профилированием. Она отличается форматом рабочего места: подходит для компактного бара или работы с рецептами, а для параллельной работы нескольких бариста подойдут двухгруппные исполнения." },
] as const;

const bandEdges = [0, 100, 200, 300, 500];
function flowFor(modelSlugs: readonly string[]) {
  const indices = VOLUME_BANDS.flatMap((band, index) => band.models.some((slug) => modelSlugs.includes(slug)) ? [index] : []);
  if (!indices.length) return "Уточните по модели";
  const first = Math.min(...indices);
  const last = Math.max(...indices);
  if (first === 0) return "до " + (bandEdges[last + 1] ?? "500+") + " чашек в день";
  return bandEdges[first] + "–" + (last === 4 ? "500+" : bandEdges[last + 1]) + " чашек в день";
}

export default function LinejkiPage() {
  const rows = lineups.map((line) => {
    const selectedModels = line.key === "zoe" || line.key === "d8" ? modelsOfFamily(line.family) : line.models.map((slug) => modelBySlug(slug)).filter((model) => model !== undefined);
    const skus = selectedModels.flatMap((model) => skusOfModel(model.slug));
    const groups = [...new Set(skus.map((sku) => sku.groups).filter((value): value is number => value !== null))].sort();
    const controls = [...new Set(skus.map((sku) => sku.control).filter((value): value is string => Boolean(value)))];
    const price = line.key === "zoe" || line.key === "d8" ? familyPriceFrom(line.family) : modelBySlug(line.models[0])?.priceFrom;
    return { ...line, groups, controls, price, architecture: familyBySlug(line.family)?.architecture ?? "", flow: flowFor(line.models) };
  });
  return <><Header active="/guide/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/guide/", label: "Как выбрать" }, { label: "Линейки Sanremo" }]} />
    <main className="wrap section guide-page guide-comparison"><article>
      <header className="guide-intro"><p className="eyebrow">Сравнение внутри бренда</p><h1>Линейки Sanremo:{" "}<br />что меняется от модели к модели</h1>
        <p className="lead">Семь линеек Sanremo: чем отличаются, сколько чашек в день тянут и с какой цены начинаются.</p>
      </header>
      <div className="guide-reading"><h2>Сначала определите задачу</h2>
        <p>Число групп показывает, сколько рабочих мест у машины. Для выбора проверьте ещё меню, долю молочных напитков и нагрузку в пиковый час. Бойлерная система и управление определяют, какие параметры бариста сможет настраивать в течение смены.</p></div>
      <p className="guide-table-hint">Прокрутите таблицу вправо →</p>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- таблица прокручивается с клавиатуры */}
      <div className="table-scroll guide-lineup-table" role="region" aria-label="Сравнение линеек Sanremo" tabIndex={0}>
        <table className="data"><thead><tr><th>Линейка</th><th>Группы</th><th>Бойлеры</th><th>Управление</th><th>Чашек в день</th><th>Цена от</th><th>Кому подходит</th></tr></thead>
          <tbody>{rows.map((line) => <tr key={line.key}>
            <td><a className="lineup-name" href={"/products/" + line.family + "/"}><Image src={officialImageForModel(line.image) ?? ""} alt="" width={82} height={62} unoptimized /><span><strong>{line.name}</strong><small>Смотреть линейку</small></span></a></td>
            <td className="lineup-nowrap">{line.groups.join(" / ")}</td>
            <td>{line.key === "f18-sb" ? "Один бойлер" : line.key === "f18-mb" ? "Мультибойлер" : line.architecture}</td>
            <td>{line.controls.join(" / ") || "Смотрите карточку"}</td><td>{line.flow}</td>
            <td className="lineup-nowrap">от {money(line.price)}</td><td><span className="lineup-tags">{line.fit.map((tag) => <span key={tag}>{tag}</span>)}</span></td>
          </tr>)}</tbody></table>
      </div>
      <p className="guide-note">Цены и наличие на {PRICE_DATE}.</p>
      <section className="guide-lineup-notes" aria-labelledby="lineup-details"><h2 id="lineup-details">Чем различаются линейки</h2>
        <div>{rows.map((line, index) => <section className="guide-lineup-note" key={line.key}><span className="guide-lineup-index">{String(index + 1).padStart(2, "0")}</span><div><h3>{line.name}</h3><p className="guide-lineup-kicker">{line.headline}</p><p>{line.description}</p><a href={"/products/" + line.family + "/"}>Смотреть версии {line.name} →</a></div></section>)}</div>
      </section>
      <div className="guide-reading"><h2>Что проверить перед покупкой</h2>
        <p>Внутри одной линейки исполнения отличаются числом групп, управлением, опциями, ценой и складским статусом. Например, F18 SB и F18 MB имеют разные бойлерные системы, поэтому их лучше сравнивать как отдельные версии. Цвет и высота группы зависят от исполнения.</p>
        <p>Сохраните две или три подходящие версии и сопоставьте их в <a href="/compare/">сравнении линеек</a>. Затем проверьте мощность, напряжение и место на стойке по карточке версии. Если точка только проектируется, <a href="/choose/">подборщик</a> поможет сократить список по формату и меню.</p></div>
      <RelatedReading />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema("Линейки Sanremo: что меняется от модели к модели", metadata.description as string, "/guide/linejki-sanremo/")) }} />
    </article></main><Footer /></>;
}
