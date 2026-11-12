import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { Crumbs } from "../components/Bits";
import { models, liveSkus, parts, families } from "@/lib/catalog";
import { SITE_EMAIL, SITE_MAILTO } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "О бренде Sanremo Coffee Machines",
  description: "О бренде Sanremo Coffee Machines: профессиональные кофемашины из Италии, инженерные решения и дизайн. В России модели, сервис и дилеров представляет BIO.",
};

export default function AboutPage() {
  return (
    <>
      <Header active="/about" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "О Sanremo" }]} />
      <main>
        <section className="about-hero wrap">
          <div className="about-hero-copy">
            <p className="eyebrow">Производство в Тревизо, Италия</p>
            <h1>О Sanremo</h1>
            <p className="about-manifesto">Профессиональные кофемашины для разных форматов кофейни.</p>
            <div className="about-story">
              <p>Sanremo разрабатывает и производит профессиональные кофемашины в Тревизо, Италия.</p>
              <p>В линейке есть машины для первой кофейни, сети, компактного бара и работы с несколькими сортами.</p>
              <p>Zoe использует теплообменную схему, D8 — гибридную платформу с PID. F18, Café Racer, Opera и YOU предлагают другие варианты бойлеров и управления.</p>
              <p>В России официальные дилеры помогают с поставкой и запуском. Склад в Москве, запчасти, гарантия 12 месяцев и сервисные партнёры доступны для владельцев машин; покупку можно оформить через лизинговую компанию.</p>
            </div>
            <div className="about-hero-facts">
              <span><b>{families.length}</b> линеек</span>
              <span><b>Италия</b> разработка и производство</span>
              <span><b>HoReCa</b> профессиональный класс</span>
            </div>
          </div>
          <figure className="about-hero-visual">
            <ResponsiveImage src="/photo/sanremo-house-3.webp" alt="Пространство Sanremo с профессиональными кофемашинами" width={1029} height={1646} priority sizes="(max-width: 900px) 100vw, 52vw" />
            <figcaption>Sanremo Coffee Machines · Италия</figcaption>
          </figure>
        </section>

        <section className="about-duet">
          <div className="wrap about-duet-inner">
            <div className="about-duet-intro">
              <p className="eyebrow">Разработка и производство</p>
              <h2>Машина для работы за стойкой.</h2>
            </div>
            <div className="about-role">
              <span className="about-role-no">01</span>
              <div>
                <p className="eyebrow">Инженерия</p>
                <h3>Управление температурой и рецептом</h3>
                <p>D8 PRO позволяет отдельно настраивать температуру групп. У Opera помпа в группе, а YOU поддерживает профилирование рецепта.</p>
                <p className="about-role-meta">Выбор бойлерной схемы зависит от меню и темпа работы</p>
              </div>
            </div>
            <div className="about-role">
              <span className="about-role-no">02</span>
              <div>
                <p className="eyebrow">Дизайн</p>
                <h3>Корпус и рабочая зона</h3>
                <p>Café Racer доступна в двух- и трёхгруппных версиях с несколькими вариантами оформления. Место машины на стойке определяет доступ к группам и паровым кранам.</p>
                <p className="about-role-meta">Исполнения для открытой стойки и компактного бара</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section bg-sage">
          <div className="wrap">
            <div className="sec-head">
              <div>
              <p className="eyebrow">Уверенность в выборе</p>
              <h2>Всё для выбора в одной карточке</h2>
              </div>
              <p className="small" style={{ maxWidth: "54ch" }}>
                Сравните характеристики, цену и наличие выбранной версии, затем найдите
                дилера и условия сервиса в своём регионе.
              </p>
            </div>
            <div className="grid g4">
              {[
                ["Характеристики", "Параметры каждой модели сверены с официальной документацией Sanremo."],
                ["Цены и наличие", "У каждой версии указаны цена и наличие."],
                ["Подбор по проекту", "Рекомендация учитывает поток, меню, рабочую зону и инженерные условия."],
                ["Поддержка", "Дилеры принимают гарантийные обращения; сервисные партнёры выполняют монтаж и обслуживание."],
              ].map(([h, p]) => (
                <div key={h} style={{ borderTop: "2px solid var(--ink)", paddingTop: 14 }}>
                  <h3 style={{ marginBottom: 8 }}>{h}</h3>
                  <p className="small" style={{ margin: 0 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Sanremo в России</p>
              <h2>Всё необходимое для запуска и владения</h2>
            </div>
          </div>
          <div className="grid g4">
            <Stat k={String(families.length)} v="линеек" />
            <Stat k={String(models.length)} v="моделей и версий" />
            <Stat k={String(liveSkus.length)} v="исполнений с ценами" />
            <Stat k={String(parts.length)} v="артикулов запчастей" />
          </div>
        </section>

        <section className="section bg-petrol">
          <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "clamp(24px,4vw,64px)", alignItems: "center" }}>
            <div>
              <p className="eyebrow">Контакты</p>
              <h2>Отдел продаж и поддержка BIO</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                Подбор версии, проверка наличия, коммерческое предложение для сети или проекта,
                сервисные вопросы и запчасти.
              </p>
            </div>
            <div>
              <p style={{ margin: 0 }}>
                <b style={{ fontFamily: "var(--sans)", fontSize: 22 }}>
                  <a href="tel:+74953633801" style={{ textDecoration: "none" }}>8 (495) 363-38-01</a>
                </b>
              </p>
              <p className="small" style={{ margin: "6px 0 18px" }}>
                <a href={SITE_MAILTO}>{SITE_EMAIL}</a>
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btn btn-solid" href="/choose/">Подобрать машину</a>
                <a className="btn" href="/dealers/">Найти дилера</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 14 }}>
      <b className="num" style={{ display: "block", fontFamily: "var(--sans)", fontSize: "clamp(30px,3vw,46px)", lineHeight: 1 }}>{k}</b>
      <span className="small">{v}</span>
    </div>
  );
}
