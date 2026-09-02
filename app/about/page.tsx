import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { models, liveSkus, parts, families } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "О бренде Sanremo Coffee Machines",
  description: "Sanremo Coffee Machines — итальянский бренд профессиональных кофемашин, в котором инженерная точность соединяется с выразительным дизайном.",
};

export default function AboutPage() {
  return (
    <>
      <Header active="/about" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "О Sanremo" }]} />
      <main>
        <section className="about-hero wrap">
          <div className="about-hero-copy">
            <p className="eyebrow">Итальянский характер. Профессиональная точность.</p>
            <h1>О Sanremo</h1>
            <p className="about-manifesto">Машины, которые задают характер кофейного пространства.</p>
            <div className="about-story">
              <p>Sanremo создаёт профессиональные кофемашины в Италии — там, где промышленная культура неотделима от внимания к форме, материалу и человеческому жесту.</p>
              <p>Для Sanremo кофемашина — не нейтральное оборудование за стойкой. Это центр рабочего пространства, инструмент бариста и видимая часть характера заведения.</p>
              <p>Каждая платформа строится вокруг трёх принципов: точного управления экстракцией, уверенной работы в интенсивной смене и эргономики, которая помогает команде сохранять темп.</p>
              <p>От лаконичной ZOE до экспериментальной Opera линейки Sanremo отвечают разным задачам, сохраняя узнаваемый итальянский подход: технология должна быть функциональной, выразительной и приятной в ежедневной работе.</p>
            </div>
            <div className="about-hero-facts">
              <span><b>{families.length}</b> линеек</span>
              <span><b>Италия</b> разработка и производство</span>
              <span><b>HoReCa</b> профессиональный класс</span>
            </div>
          </div>
          <figure className="about-hero-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photo/sanremo-house-3.webp" alt="Пространство Sanremo с профессиональными кофемашинами" />
            <figcaption>Sanremo Coffee Machines · Италия</figcaption>
          </figure>
        </section>

        <section className="about-duet">
          <div className="wrap about-duet-inner">
            <div className="about-duet-intro">
              <p className="eyebrow">Философия Sanremo</p>
              <h2>Технология становится частью пространства.</h2>
            </div>
            <div className="about-role">
              <span className="about-role-no">01</span>
              <div>
                <p className="eyebrow">Инженерия</p>
                <h3>Контроль, который чувствует бариста</h3>
                <p>Архитектура бойлеров, температурная стабильность и управление рецептом превращены в понятный рабочий инструмент — от первой настройки до сотой чашки.</p>
                <p className="about-role-meta">От надёжных однобойлерных платформ до независимого управления группами</p>
              </div>
            </div>
            <div className="about-role">
              <span className="about-role-no">02</span>
              <div>
                <p className="eyebrow">Дизайн</p>
                <h3>Объект, который работает на образ места</h3>
                <p>Силуэт, цвет, свет и открытая механика формируют присутствие машины в интерьере. Sanremo проектирует оборудование, которое хочется поставить в центр кофейной сцены.</p>
                <p className="about-role-meta">Выразительные корпуса и исполнения для разных форматов пространства</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section bg-sage">
          <div className="wrap">
            <div className="sec-head">
              <div>
              <p className="eyebrow">Уверенность в выборе</p>
              <h2>Данные, на которые можно опереться</h2>
              </div>
              <p className="small" style={{ maxWidth: "54ch" }}>
                Характеристики сверяются с документацией Sanremo, а цены и наличие — с актуальными
                данными официального дистрибьютора.
              </p>
            </div>
            <div className="grid g4">
              {[
                ["Характеристики", "Параметры каждой модели сверены с официальной документацией Sanremo."],
                ["Цены и наличие", "Для каждой конфигурации указана актуальная РРЦ и дата обновления данных."],
                ["Подбор по проекту", "Рекомендация учитывает поток, меню, рабочую зону и инженерные условия."],
                ["Поддержка", "Дилерская сеть, обучение, сервис и запчасти сопровождают оборудование после запуска."],
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
            <Stat k={String(families.length)} v="семейств" />
            <Stat k={String(models.length)} v="моделей и версий" />
            <Stat k={String(liveSkus.length)} v="конфигураций с РРЦ" />
            <Stat k={String(parts.length)} v="артикулов запчастей" />
          </div>
        </section>

        <section className="section bg-petrol">
          <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "clamp(24px,4vw,64px)", alignItems: "center" }}>
            <div>
              <p className="eyebrow">Контакты</p>
              <h2>Отдел продаж и поддержка BIO</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                Подбор конфигурации, проверка наличия, коммерческое предложение для сети или проекта,
                сервисные вопросы и запчасти.
              </p>
            </div>
            <div>
              <p style={{ margin: 0 }}>
                <b style={{ fontFamily: "var(--sans)", fontSize: 22 }}>
                  <a href="tel:+78006004300" style={{ textDecoration: "none" }}>8 (800) 600-43-00</a>
                </b>
              </p>
              <p className="small" style={{ margin: "6px 0 18px" }}>
                <a href="mailto:info@sanremomachines.ru">info@sanremomachines.ru</a>
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btn btn-solid" href="/choose">Подобрать машину</a>
                <a className="btn" href="/dealers">Найти дилера</a>
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
