import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs } from "../../components/Bits";
import { LeadForm } from "../../components/LeadForm";
import { FaqBlock } from "../../components/GuideBlocks";
import { dealers } from "@/lib/catalog";
import { caseHref, sanremoCases } from "@/lib/cases";
import { faqSchema, jsonLd, type Question } from "@/lib/seo";

const cities = [
  { slug: "moskva", name: "Москве", city: "Москва", title: "Кофемашины Sanremo в Москве — официальные дилеры", intro: "Посмотрите адреса дилеров Sanremo в Москве. Сравните машины и наличие на сайте, затем обратитесь к дилеру для покупки и запуска." },
  { slug: "sankt-peterburg", name: "Санкт-Петербурге", city: "Санкт-Петербург", title: "Кофемашины Sanremo в Санкт-Петербурге — дилеры", intro: "Найдите дилера Sanremo в Санкт-Петербурге. На сайте доступны модели, исполнения, цены и документы; дилер поможет с заказом и запуском." },
] as const;
export function generateStaticParams() { return cities.map(({ slug }) => ({ city: slug })); }
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const config = cities.find((item) => item.slug === city);
  return config ? { title: config.title, description: `Официальные дилеры Sanremo в ${config.name}: адреса, сайты и покупка профессиональной кофемашины. Сравните модели, цены и наличие на сайте.` } : {};
}

export default async function DealerCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const config = cities.find((item) => item.slug === city);
  if (!config) notFound();
  const local = dealers.filter((item) => item.city === config.city && item.verified && item.address && item.site);
  if (!local.length) notFound();
  const cases = sanremoCases.filter((item) => item.city.value === config.city).slice(0, 3);
  const featuredCase = config.slug === "moskva"
    ? sanremoCases.find((item) => item.slug === "st-riders")
    : cases[0];
  const questions: Question[] = [
    { question: `Где купить Sanremo в ${config.name}?`, answer: `Обратитесь к одному из дилеров, перечисленных на этой странице. Адреса и сайты взяты из действующего справочника дилерской сети.` },
    { question: "Можно увидеть цены до обращения к дилеру?", answer: "Да. На страницах моделей указаны цены и наличие для доступных исполнений." },
    { question: "Кто выполняет монтаж?", answer: "Монтаж и запуск выполняют дилеры и сервисные партнёры. Уточните условия у выбранного дилера." },
    { question: "Какой срок для машины под заказ?", answer: "Поставка из Италии обычно занимает 6–8 недель. Складские машины отгружаются со склада в Москве." },
    { question: "Можно купить кофемашину в лизинг?", answer: "Да. Выберите исполнение на сайте и отправьте заявку на странице лизинга. Условия определит партнёр после рассмотрения." },
  ];
  return <><Header active="/dealers/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/dealers/", label: "Где купить" }, { label: config.city }]} />
    <main className="dealer-city-page wrap section-tight"><div className="dealer-city-hero"><header className="dealer-city-intro"><p className="eyebrow">Где купить / {config.city}</p><h1>Sanremo в {config.name}</h1><p className="lead">{config.intro}</p><div className="solution-actions"><a className="btn btn-solid" href="#dealer-list">Смотреть дилеров</a><a className="btn" href="/products/">Открыть каталог</a></div></header>{featuredCase && <a className="dealer-city-feature" href={caseHref(featuredCase)}><img src={featuredCase.cover} alt={`${featuredCase.name.value}, ${featuredCase.city.value}`} /><span>{featuredCase.name.value} · {featuredCase.city.value}</span></a>}</div>
      <section className="section-tight" id="dealer-list"><div className="solution-heading"><p className="eyebrow">Дилерская сеть</p><h2>Адреса и сайты</h2><p>Свяжитесь с дилером для заказа выбранной версии, согласования поставки и монтажа.</p></div><div className="dealer-city-list">{local.map((item) => <article key={`${item.name}-${item.address}`}><h3>{item.name}</h3><p>{item.address}</p><div><a href={item.site!} target="_blank" rel="noopener noreferrer">Сайт дилера</a><a href={`https://yandex.ru/maps/?text=${encodeURIComponent(item.address!)}`} target="_blank" rel="noopener noreferrer">На карте</a></div></article>)}</div></section>
      <section className="section-tight solution-next"><div><p className="eyebrow">Перед визитом</p><h2>Выберите исполнение</h2><p>Карточки моделей показывают число групп, размер, цену и складской статус. Если машина нужна под конкретную стойку, проверьте питание и воду с монтажным партнёром.</p></div><div><a href="/choose/">Подбор по задаче</a><a href="/compare/">Сравнение линеек</a><a href="/leasing/">Лизинг Sanremo</a></div></section>
      {cases.length > 0 && <section className="section-tight"><div className="solution-heading"><p className="eyebrow">В городе</p><h2>Кофейные проекты</h2></div><div className="solution-cases">{cases.map((item) => <a href={caseHref(item)} key={item.slug}><img src={item.cover} alt={`${item.name.value}, ${item.city.value}`} /><strong>{item.name.value}</strong><span>{item.model?.value ?? "Оборудование Sanremo"}</span></a>)}</div></section>}
      <section className="section-tight"><div className="solution-heading"><p className="eyebrow">Покупка и сервис</p><h2>Частые вопросы</h2></div><FaqBlock questions={questions} title="" schema={false} /></section>
      <section className="section-tight solution-request"><div><p className="eyebrow">Ваш вопрос</p><h2>Связаться по Sanremo</h2><p>Напишите, какая модель интересует и где будет работать машина. Ответим в рабочее время.</p></div><LeadForm form="contacts" className="solution-form" submitLabel="Отправить вопрос"><input type="hidden" name="task" value={`Дилеры Sanremo: ${config.city}`} /><label className="field"><span>Имя</span><input name="name" required /></label><label className="field"><span>Телефон или e-mail</span><input name="contact" required /></label><label className="field"><span>Город</span><input name="city" defaultValue={config.city} /></label><label className="field"><span>Вопрос</span><textarea name="message" rows={4} /></label><label className="leasing-consent"><input type="checkbox" name="consent" value="yes" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label></LeadForm></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(questions)) }} />
    </main><Footer /></>;
}
