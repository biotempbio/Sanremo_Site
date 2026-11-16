import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs } from "../../components/Bits";
import { FaqBlock } from "../../components/GuideBlocks";
import { LeadForm } from "../../components/LeadForm";
import { AVAILABILITY_LABEL, catalogModels, familyBySlug, grinders, modelBySlug, modelPath, money, officialImageForModel, skusOfModel, VOLUME_BANDS, type Model } from "@/lib/catalog";
import { caseHref, sanremoCases } from "@/lib/cases";
import { faqSchema, jsonLd } from "@/lib/seo";
import { solutionBySlug, solutionLandings } from "@/lib/solution-landings";

export function generateStaticParams() { return solutionLandings.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = solutionBySlug((await params).slug);
  return entry ? { title: entry.title, description: entry.description } : {};
}

const coffeeSets = [
  { title: "Старт", slug: "zoe-compact", text: "Компактная теплообменная машина для одной стойки." },
  { title: "Поток", slug: "d8", text: "Выбор числа групп и PID для растущей кофейни." },
  { title: "Флагман", slug: "cafe-racer", text: "Мультибойлерная машина с двумя или тремя группами." },
];

export default async function SolutionLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const entry = solutionBySlug((await params).slug);
  if (!entry) notFound();
  const photo = officialImageForModel(entry.photoModel);
  const selected = entry.models.map((item) => ({ ...item, model: modelBySlug(item.slug) })).filter((item): item is { slug: string; reason: string; model: Model } => item.model !== undefined);
  const cases = sanremoCases.filter((item) => entry.caseFormats.some((format) => item.format.value.includes(format))).slice(0, 3);
  const grinder = grinders.filter((item) => /x.one/i.test(item.name) && item.rrp > 0).sort((a, b) => a.rrp - b.rrp)[0];
  return <><Header active="/solutions/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/solutions/", label: "Решения" }, { label: entry.label }]} />
    <main className="solution-landing">
      <section className="wrap solution-hero"><div><p className="eyebrow">Решения / {entry.label}</p><h1>{entry.h1}</h1><p className="lead">{entry.intro}</p><div className="solution-actions"><a className="btn btn-solid" href="#models">Смотреть модели</a><a className="btn" href="/choose/">Подобрать по задаче</a></div></div><div className="solution-hero-image">{photo && <img src={photo} alt={`Профессиональная кофемашина Sanremo ${modelBySlug(entry.photoModel)?.name ?? ""}`} />}</div></section>
      <section className="wrap section-tight solution-section"><div className="solution-heading"><p className="eyebrow">Что проверить</p><h2>{entry.focus}</h2></div><div className="solution-priorities">{entry.priorities.map((point, index) => <article key={point.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{point.title}</h3><p>{point.text}</p></article>)}</div></section>
      {entry.slug === "kofejnya" && <section className="wrap section-tight solution-section"><div className="solution-heading"><p className="eyebrow">Поток</p><h2>От чашек в день к моделям</h2><p>Это отправная точка. Пиковый час, молочное меню и число бариста уточнят выбор.</p></div><div className="solution-flow">{VOLUME_BANDS.map((band) => <div key={band.id}><b>{band.label}</b><span>{band.models.map((slug) => modelBySlug(slug)?.name).filter(Boolean).slice(0, 4).join(" · ")}</span></div>)}</div></section>}
      {entry.slug === "kofejnya" && grinder && <section className="wrap section-tight solution-section"><div className="solution-heading"><p className="eyebrow">Машина и кофемолка</p><h2>Три комплекта для сравнения</h2><p>В каждом комплекте — минимальная цена модели и кофемолки X-One из текущего каталога. Варианты исполнения и наличие смотрите в карточках.</p></div><div className="solution-sets">{coffeeSets.map((set) => { const model = modelBySlug(set.slug); if (!model) return null; return <article key={set.slug}><p className="eyebrow">{set.title}</p><h3>{model.name} + X-One</h3><p>{set.text}</p><strong>от {money((model.priceFrom ?? 0) + grinder.rrp)}</strong><div><a href={modelPath(model)}>Кофемашина</a><a href="/products/x-one/">Кофемолка</a></div></article>; })}</div></section>}
      <section className="wrap section-tight solution-section" id="models"><div className="solution-heading"><p className="eyebrow">Линейки Sanremo</p><h2>{entry.slug === "professionalnye-kofemashiny" ? "Семь линеек в одном обзоре" : "Модели для этой задачи"}</h2></div>
        {entry.slug === "professionalnye-kofemashiny" ? <><div className="solution-table-scroll"><table className="data solution-table"><thead><tr><th>Линейка</th><th>Бойлер</th><th>Группы</th><th>Цена от</th><th>Наличие</th></tr></thead><tbody>{catalogModels.map((model) => { const sku = skusOfModel(model.slug); const groups = model.groupsAvailable.length ? model.groupsAvailable.join(", ") : "—"; return <tr key={model.slug}><td><a href={modelPath(model)}>{model.name}</a></td><td>{familyBySlug(model.family)?.architecture ?? "—"}</td><td>{groups}</td><td>{model.priceFrom ? `от ${money(model.priceFrom)}` : "По запросу"}</td><td>{sku.some((item) => item.free > 0) ? "Есть на складе" : AVAILABILITY_LABEL.on_order}</td></tr>; })}</tbody></table></div><p className="tiny">Доступные группы и размеры указаны в карточках исполнений.</p><nav className="solution-anchors"><a href="#multiboiler">Мультибойлерные</a><a href="#two-groups">Двухгруппные</a><a href="/compare/">Сравнить линейки</a></nav></> : <div className="solution-models">{selected.map(({ model, reason }) => <article key={model.slug}><a href={modelPath(model)}><img src={officialImageForModel(model.slug) ?? ""} alt={`Sanremo ${model.name}`} /></a><div><h3><a href={modelPath(model)}>{model.name}</a></h3><p>{reason}</p><p className="solution-model-price">{model.priceFrom ? `от ${money(model.priceFrom)}` : "Цена по запросу"}</p><a href={modelPath(model)}>Исполнения и наличие</a></div></article>)}</div>}
      </section>
      {entry.slug === "professionalnye-kofemashiny" && <section className="wrap section-tight solution-section solution-explain-pair"><article id="multiboiler"><p className="eyebrow">Бойлерная система</p><h2>Мультибойлерные кофемашины</h2><p>Отдельные температурные контуры дают бариста возможность настраивать приготовление под разные рецепты. Сравните F18 MB, Café Racer, Opera и YOU; число групп и мощность отличаются по исполнению.</p><a href="/guide/linejki-sanremo/">Сравнить бойлеры и управление</a></article><article id="two-groups"><p className="eyebrow">Рабочие места</p><h2>Двухгруппные кофемашины</h2><p>Две группы позволяют работать на одной стойке двум сотрудникам. Двухгруппные версии есть в Zoe, D8, F18, Café Racer и Opera. Габариты, питание и стоимость сверяйте по выбранной машине.</p><a href="/products/?groups=2">Посмотреть двухгруппные версии</a></article></section>}
      {cases.length > 0 && <section className="wrap section-tight solution-section"><div className="solution-heading"><p className="eyebrow">На практике</p><h2>Где работают Sanremo</h2></div><div className="solution-cases">{cases.map((item) => <a href={caseHref(item)} key={item.slug}><img src={item.cover} alt={`${item.name.value}, ${item.city.value}`} /><strong>{item.name.value}</strong><span>{item.city.value}{item.model ? ` · ${item.model.value}` : ""}</span></a>)}</div><a href="/cases/">Все проекты</a></section>}
      <section className="wrap section-tight solution-section solution-next"><div><p className="eyebrow">Следующий шаг</p><h2>Сравните исполнение и условия покупки</h2><p>Проверьте размеры, питание, цену и наличие выбранной машины. Дилер поможет организовать установку на вашей площадке.</p></div><div><a href="/choose/">Подобрать кофемашину</a><a href="/leasing/">Кофемашина в лизинг</a><a href="/dealers/">Найти дилера</a></div></section>
      <section className="wrap section-tight solution-section"><div className="solution-heading"><p className="eyebrow">Ответы</p><h2>Частые вопросы</h2></div><FaqBlock questions={entry.questions} title="" schema={false} /></section>
      <section className="wrap section-tight solution-section solution-request"><div><p className="eyebrow">Ваш проект</p><h2>Задать вопрос о модели</h2><p>Укажите город, формат и способ связи. Поможем найти нужное исполнение и ближайшего дилера.</p></div><LeadForm form="contacts" className="solution-form" submitLabel="Отправить запрос"><input type="hidden" name="task" value={`Вопрос о кофемашине: ${entry.label}`} /><label className="field"><span>Имя</span><input name="name" required /></label><label className="field"><span>Телефон или e-mail</span><input name="contact" required /></label><label className="field"><span>Город</span><input name="city" /></label><label className="field"><span>Вопрос</span><textarea name="message" rows={4} /></label><label className="leasing-consent"><input type="checkbox" name="consent" value="yes" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label></LeadForm></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(entry.questions)) }} />
    </main><Footer /></>;
}
