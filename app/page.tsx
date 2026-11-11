import type { Metadata } from "next";
import { Header, Footer } from "./components/Chrome";
import { ResponsiveImage } from "./components/ResponsiveImage";
import { CATALOG_LINEUP, catalogModels, familyBySlug, modelPath, money, VOLUME_BANDS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Кофемашины Sanremo — официальный дистрибьютор в России",
  description: "Официальный дистрибьютор Sanremo в России: профессиональные кофемашины, цены, наличие, точные характеристики, сервис и запчасти, дилерская сеть.",
};

const tasks = [
  { href: "/choose/", title: "Подобрать по задаче", text: "Формат, поток, меню и рабочая зона" },
  { href: "/products/", title: "Сравнить линейки", text: "Архитектура, группы, управление и цены" },
  { href: "/dealers/", title: "Найти дилера", text: "Поставка и запуск в вашем регионе" },
];

/** Краткие описания линеек для главной. Длинные тексты выгрузки BIO не выводим. */
const lineupDescriptions: Record<string, string> = {
  "zoe-competition": "Двухгруппная машина для ежедневной работы кофейни. В каталоге — доступные исполнения, цены и наличие.",
  d8: "D8 выпускается с одной, двумя или тремя группами и PID-контролем. В D8 PRO температуру групп можно настраивать раздельно.",
  "f18-sb": "Две группы и один бойлер объёмом 12 л. Для кофейни с постоянным потоком эспрессо и молочных напитков.",
  "f18-mb": "Две или три группы, мультибойлерная система и отдельная настройка температуры для работы с разными рецептами.",
  "cafe-racer": "Две или три группы, бойлеры объёмом 10 или 13 л и несколько вариантов оформления рабочей станции.",
  opera: "Две группы, бойлер объёмом 11,8 л и управление приготовлением для работы с рецептами.",
  you: "Одна группа и компактный корпус. YOU позволяет сохранять профили экстракции и управлять ими во время приготовления.",
};

function TrustIcon({ kind }: { kind: "warranty" | "warehouse" | "leasing" | "service" }) {
  const paths = {
    warranty: <><path d="M12 2.5 20 6v6c0 5-3.2 8-8 9.5C7.2 20 4 17 4 12V6z" /><path d="m8.5 12 2.4 2.4 4.8-4.8" /></>,
    warehouse: <><path d="M3 9 12 4l9 5v11H3z" /><path d="M8 20v-7h8v7M3 9h18" /></>,
    leasing: <><path d="M4 7h14a3 3 0 0 1 3 3v9H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" /><path d="M4 7V5a2 2 0 0 1 2-2h12M17 14h2" /></>,
    service: <><circle cx="7" cy="7" r="2" /><circle cx="17" cy="7" r="2" /><path d="M3 19v-3a4 4 0 0 1 8 0v3M13 19v-3a4 4 0 0 1 8 0v3" /></>,
  };
  return <svg className="home-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

export default function HomePage() {
  const lineup = CATALOG_LINEUP.map((line) => {
    const model = catalogModels.find((item) => item.slug === line.slug);
    return model ? { ...line, model, family: familyBySlug(model.family) } : null;
  }).filter((line): line is NonNullable<typeof line> => Boolean(line));

  return <>
    <Header />
    <main>
      <section className="wrap home-hero-native">
        <div className="home-hero-copy-native">
          <p className="eyebrow">Sanremo Coffee Machines · Россия</p>
          <h1>Профессиональные кофемашины Sanremo в России</h1>
          <p className="home-subtitle">Кофемашина для вашего проекта</p>
          <p className="lead">{lineup.length} профессиональных линеек для кофеен, ресторанов, сетей и лабораторий. В каталоге — исполнения, характеристики, цены и наличие; поставку и запуск обеспечивают официальные дилеры Sanremo в России.</p>
          <div className="home-actions"><a className="btn btn-solid" href="/choose/">Подобрать модель</a><a className="btn" href="/products/">Открыть каталог</a></div>
        </div>
        <figure className="home-hero-image">
          <ResponsiveImage src="/photo/home-hero-cafe-racer-v2.jpg" alt="Кофемашина Sanremo в кофейном пространстве" width={1600} height={1067} priority sizes="(max-width: 900px) 100vw, 50vw" />
        </figure>
      </section>

      <section className="home-trust" aria-label="Покупка и поддержка Sanremo"><div className="wrap">
        <div><TrustIcon kind="warranty" /><b>Гарантия 12 месяцев</b></div>
        <div><TrustIcon kind="warehouse" /><b>Склад в Москве<br />6–8 недель под заказ</b></div>
        <div><TrustIcon kind="leasing" /><b>Лизинг</b></div>
        <div><TrustIcon kind="service" /><b>Сервис и дилеры<br />по всей России</b></div>
      </div></section>

      <section className="wrap section">
        <div className="sec-head"><div><p className="eyebrow">Начните с задачи</p><h2>Выберите путь к подходящей машине</h2></div><p className="lead">Не нужно искать данные в PDF: ключевые параметры, исполнения и статусы собраны в каталоге.</p></div>
        <div className="home-tasks">{tasks.map((task, index) => <a className="home-task" href={task.href} key={task.href}><span>0{index + 1}</span><h3>{task.title}</h3><p>{task.text}</p><b>Перейти →</b></a>)}</div>
      </section>

      <section className="bg-gray"><div className="wrap section">
        <div className="sec-head"><div><p className="eyebrow">Линейки Sanremo</p><h2>Машины под разные сценарии работы</h2></div><p className="lead">Каждая карточка ведёт к точным характеристикам, исполнениям и актуальным данным по модели.</p></div>
        <div className="home-products">{lineup.map(({ label, image, model, family }) => <article className="card" key={model.slug}>
          <a className="home-product-image" href={modelPath(model)} aria-label={`Открыть ${label}`}><ResponsiveImage src={image} alt={`Sanremo ${label}`} width={960} height={640} sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw" /></a>
          <div className="card-body"><p className="eyebrow">{family?.tagline ?? "Профессиональная кофемашина"}</p><h3><a href={modelPath(model)}>{label}</a></h3><p className="small">{lineupDescriptions[model.slug]}</p><div className="card-foot"><span className="price">от {money(model.priceFrom)}</span><a className="link-arrow" href={modelPath(model)}>Открыть модель</a></div></div>
        </article>)}</div>
      </div></section>

      <section className="wrap section">
        <div className="sec-head"><div><p className="eyebrow">По числу чашек</p><h2>От первой чашки до высокого потока</h2></div><p className="lead">Подборщик учитывает формат точки, объём напитков и требования к рабочему месту.</p></div>
        <div className="home-volume" aria-label="Диапазоны нагрузки">{VOLUME_BANDS.map((band, index) => <a href={`/products/?flow=${band.id}`} key={band.id}><span>0{index + 1}</span><b>{band.label}</b></a>)}</div>
        <p style={{ marginTop: 20 }}><a href="/guide/">Как выбрать профессиональную кофемашину →</a></p>
      </section>

      <section className="home-service bg-forest"><div className="wrap section"><div><p className="eyebrow">После выбора машины</p><h2>Поставка, сервис и запчасти у официального дистрибьютора</h2></div><div><p className="lead">Компания BIO — официальный дистрибьютор Sanremo в России. Для покупки и запуска оборудования обратитесь к официальному дилеру.</p><div className="home-actions"><a className="btn" href="/dealers/">Найти дилера</a><a className="btn" href="/service/">Сервис и запчасти</a></div></div></div></section>
    </main>
    <Footer />
  </>;
}
