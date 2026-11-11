import type { Metadata } from "next";
import { Header, Footer } from "./components/Chrome";
import { ResponsiveImage } from "./components/ResponsiveImage";
import { CATALOG_LINEUP, catalogModels, familyBySlug, modelPath, money, VOLUME_BANDS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Кофемашины Sanremo — официальный дистрибьютор в России | BIO",
  description: "Официальный дистрибьютор Sanremo в России: профессиональные кофемашины, РРЦ, наличие, точные характеристики, сервис и запчасти, дилерская сеть.",
};

const tasks = [
  { href: "/choose/", title: "Подобрать по задаче", text: "Формат, поток, меню и рабочая зона" },
  { href: "/products/", title: "Сравнить линейки", text: "Архитектура, группы, управление и РРЦ" },
  { href: "/dealers/", title: "Найти дилера", text: "Поставка и запуск в вашем регионе" },
];

/** Краткие описания линеек для главной. Длинные тексты выгрузки BIO не выводим. */
const lineupDescriptions: Record<string, string> = {
  "zoe-competition": "Двухгруппная машина для ежедневной работы кофейни. В каталоге — доступные исполнения, РРЦ и наличие.",
  d8: "Платформа с одной, двумя или тремя группами. D8 PRO добавляет расширенное управление приготовлением; объём бойлера зависит от конфигурации.",
  "f18-sb": "Двухгруппная машина с одним бойлером. В карточке — параметры, исполнения и доступность F18 Single Boiler.",
  "f18-mb": "F18 MB с двумя или тремя группами. Сравните конфигурации по мощности, объёму бойлеров и оснащению.",
  "cafe-racer": "Две или три группы, несколько вариантов оформления. Для каждой конфигурации указаны характеристики и РРЦ.",
  opera: "Двухгруппная модель для работы с рецептом. Исполнения и технические параметры собраны в карточке.",
  you: "Компактная одногруппная машина. В карточке — варианты оформления, технические данные и наличие.",
};

export default function HomePage() {
  const firstPrice = Math.min(...catalogModels.map((model) => model.priceFrom).filter((price): price is number => price !== null));
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
          <p className="lead">{lineup.length} профессиональных линеек для кофеен, ресторанов, сетей и лабораторий. В каталоге — конфигурации, характеристики, РРЦ и складской статус; поставку и запуск обеспечивают официальные дилеры Sanremo в России.</p>
          <div className="home-actions"><a className="btn btn-solid" href="/choose/">Подобрать модель</a><a className="btn" href="/products/">Открыть каталог</a></div>
        </div>
        <figure className="home-hero-image">
          <ResponsiveImage src="/photo/home-hero-cafe-racer-v2.jpg" alt="Кофемашина Sanremo в кофейном пространстве" width={1600} height={1067} priority sizes="(max-width: 900px) 100vw, 50vw" />
        </figure>
      </section>

      <section className="home-trust" aria-label="Sanremo в России"><div className="wrap">
        <div><b>{lineup.length} линеек Sanremo</b><span>в актуальном российском каталоге</span></div>
        <div><b>от {money(firstPrice)}</b><span>рекомендованная розничная цена</span></div>
        <div><b>Точные характеристики</b><span>в карточке каждой конфигурации</span></div>
        <div><b>Сервис и запчасти</b><span>для поддержки оборудования</span></div>
        <div><b>Дилерская сеть</b><span>по всей России</span></div>
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
        <div className="sec-head"><div><p className="eyebrow">Ориентир по нагрузке</p><h2>От первой чашки до высокого потока</h2></div><p className="lead">Подборщик учитывает формат точки, объём напитков и требования к рабочему месту.</p></div>
        <div className="home-volume" aria-label="Диапазоны нагрузки">{VOLUME_BANDS.map((band, index) => <a href={`/products/?flow=${band.id}`} key={band.id}><span>0{index + 1}</span><b>{band.label}</b></a>)}</div>
        <p style={{ marginTop: 20 }}><a href="/guide/">Как выбрать профессиональную кофемашину →</a></p>
      </section>

      <section className="home-service bg-forest"><div className="wrap section"><div><p className="eyebrow">После выбора машины</p><h2>Поставка, сервис и запчасти у официального дистрибьютора</h2></div><div><p className="lead">Компания BIO — официальный дистрибьютор Sanremo в России. Для покупки и запуска оборудования обратитесь к официальному дилеру.</p><div className="home-actions"><a className="btn" href="/dealers/">Найти дилера</a><a className="btn" href="/service/">Сервис и запчасти</a></div></div></div></section>
    </main>
    <Footer />
  </>;
}
