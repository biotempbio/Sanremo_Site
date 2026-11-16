import type { Metadata } from "next";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs } from "../../components/Bits";
import { FaqBlock } from "../../components/GuideBlocks";
import { VOLUME_BANDS, architectureForModel, modelBySlug, skusOfModel, money, officialImageForModel } from "@/lib/catalog";
import { articleSchema, jsonLd } from "@/lib/seo";

const path = "/guide/dvuhgruppnaya-kofemashina/";
const title = "Двухгруппная кофемашина для кофейни — как выбрать, модели Sanremo";
const description = "Как выбрать двухгруппную кофемашину Sanremo: поток, тип бойлера, пар, питание и управление. Сравнение доступных моделей, цен и наличия в Москве.";
export const metadata: Metadata = { title, description };

const modelSlugs = ["zoe-competition", "zoe-compact", "zoe-sed", "zoe-sap", "d8", "d8-pro", "f18-sb", "f18-mb", "cafe-racer", "opera"];
const rows = modelSlugs.flatMap((slug) => {
  const model = modelBySlug(slug);
  if (!model) return [];
  const versions = skusOfModel(slug).filter((sku) => sku.groups === 2 && sku.rrp > 0);
  if (!versions.length) return [];
  const price = Math.min(...versions.map((sku) => sku.rrp));
  const stocked = versions.reduce((sum, sku) => sum + sku.free, 0);
  return [{ model, price, stocked }];
});
const minPrice = Math.min(...rows.map((row) => row.price));
const maxPrice = Math.max(...rows.map((row) => row.price));
const faq = [
  { question: "Сколько стоит двухгруппная кофемашина Sanremo?", answer: `В текущем каталоге двухгруппные исполнения стоят от ${money(minPrice)} до ${money(maxPrice)}. Цена зависит от модели и исполнения; в таблице показана начальная цена каждой модели.` },
  { question: "Нужно ли для двух групп питание 380 В?", answer: "У двухгруппных исполнений отличаются мощность и схема подключения. В каталоге есть версии на 220 В; проверьте напряжение и мощность выбранной машины до подготовки линии." },
  { question: "Можно ли купить двухгруппную машину в лизинг?", answer: "Да. Выберите модель и оставьте заявку на странице лизинга; условия рассчитают для вашей компании.", actionHref: "/leasing/", actionLabel: "Условия лизинга" },
];

export default function TwoGroupGuide() {
  return <><Header active="/guide/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/guide/", label: "Как выбрать" }, { label: "Две группы" }]} />
    <main className="wrap section guide-page guide-long"><article className="prose">
      <p className="eyebrow">Гид по выбору · рабочие места</p>
      <h1>Двухгруппная кофемашина: кому подходит и как выбрать</h1>
      <p className="lead">Две группы позволяют готовить напитки параллельно. Сравните нагрузку в пиковый час, место для двух бариста, бойлерную систему и требования к подключению.</p>
      <p className="guide-primary-link"><a href="/solutions/kofejnya/">Подобрать кофемашину для кофейни →</a></p>
      <h2>Что означает «две группы»</h2>
      <p>Группа — узел, в который бариста устанавливает рожок для приготовления эспрессо. Две группы дают два рабочих места у машины. Это удобно, когда на стойке одновременно работают два сотрудника или один бариста чередует несколько заказов. На скорость выдачи влияют и соседние процессы: помол, работа с молоком, выдача и очистка. Если второй сотрудник не помещается у стойки, сама по себе вторая группа не уберёт очередь.</p>
      <p>Для небольшого кафе с одним сотрудником сравните также <a href="/products/?groups=1">одногруппные исполнения</a>. При большой команде и постоянном пике откройте <a href="/products/?groups=3">трёхгруппные версии</a>. Выбирайте число групп вместе с планом бара и количеством кофемолок.</p>
      <h2>Сколько чашек в день готовить</h2>
      <p>Начните с фактических заказов за день и самого загруженного часа. В подборщике используются диапазоны: {VOLUME_BANDS.map((band) => band.label).join(", ")}. Это помогает сократить список моделей, а окончательный выбор определяется пиком, молочным меню и числом бариста. Для двухгруппных машин в каталоге представлены Zoe, D8, D8 PRO, F18 SB, F18 MB, Café Racer и Opera; их рабочие сценарии различаются.</p>
      <p>Если утром напитки идут один за другим, заранее определите, сколько заказов нужно готовить одновременно. Отдельно посчитайте капучино и латте: паровая система работает в тот же момент, что и группы. Для смены с несколькими сотрудниками важны доступ к кранам и место перед машиной, а не только её паспортная ширина.</p>
      <h2>Как сравнить бойлеры и температуру</h2>
      <p>Zoe использует теплообменную схему: вода для эспрессо проходит собственным контуром, пар формируется в бойлере. D8 относится к гибридной платформе и использует PID; в D8 PRO температуру групп можно настраивать раздельно. F18 SB — версия с одним бойлером, F18 MB — мультибойлерная. Café Racer и Opera также представлены в мультибойлерном сегменте. Если вы работаете с несколькими сортами и рецептами, сравните возможность отдельной температурной настройки каждой группы.</p>
      <p>Объём бойлера и мощность различаются между исполнениями. Число в таблице конкретной машины относится именно к выбранной версии. Сравнивайте паровой кран и расположение рабочих зон вместе с бойлерной схемой: для молочного меню это ежедневная часть работы.</p>
      <h2>Управление, высота групп и питание</h2>
      <p>Волюметрика останавливает пролив после заданного объёма воды и помогает повторять базовые напитки в смене. Полуавтомат оставляет момент остановки за бариста. В линейке Zoe есть оба подхода — SAP и SED. Решение зависит от того, как команда ведёт рецепты и обучает новых сотрудников.</p>
      <p>Высокая группа оставляет место под стакан; проверьте высоту именно у нужной версии. До заказа сопоставьте мощность, напряжение и габариты с проектом стойки. Подготовьте линию питания, водоподвод, слив и место для фильтрации. На одной стойке рядом с кофемашиной должны разместиться кофемолка, питчеры и зона выдачи.</p>
      <h2>Двухгруппные модели Sanremo</h2>
      <p>Ниже показана минимальная цена среди двухгруппных исполнений каждой модели. Наличие взято из того же каталога, что и карточки машин.</p>
      <div className="table-scroll" role="region" aria-label="Двухгруппные модели Sanremo" tabIndex={0}><table className="data guide-model-table"><thead><tr><th>Модель</th><th>Система</th><th>Цена от</th><th>Наличие в Москве</th></tr></thead><tbody>{rows.map(({ model, price, stocked }) => <tr key={model.slug}><th><a href={`/products/${model.family}/${model.slug}/`}>{model.name}</a></th><td>{architectureForModel(model)}</td><td>{money(price)}</td><td>{stocked >= 3 ? `${stocked} шт.` : stocked > 0 ? "Мало на складе" : "Под заказ"}</td></tr>)}</tbody></table></div>
      <p className="guide-note">Цены и остатки обновляются из каталога. Для выбора питания и высоты группы откройте конкретное исполнение.</p>
      <div className="guide-model-cards">{rows.slice(0, 4).map(({model, price}) => <a className="guide-model-card" href={`/products/${model.family}/${model.slug}/`} key={model.slug}><img src={officialImageForModel(model.slug) ?? ""} alt={`Sanremo ${model.name}`} loading="lazy" /><span>{model.name}</span><small>от {money(price)} →</small></a>)}</div>
      <div className="guide-actions"><a className="btn btn-solid" href="/choose/">Подобрать машину</a><a className="btn" href="/dealers/">Найти дилера</a></div>
      <FaqBlock questions={faq} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema("Двухгруппная кофемашина: кому подходит и как выбрать", description, path)) }} />
    </article></main><Footer /></>;
}
