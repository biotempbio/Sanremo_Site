import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { models, liveSkus, parts, dealerCities, families } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sanremo и BIO в России — официальная дистрибуция",
  description:
    "Sanremo — итальянский производитель профессиональных кофемашин. Компания BIO — официальный дистрибьютор в России: ассортимент, РРЦ, склад, дилерская сеть, запчасти, обучение и сервисная маршрутизация.",
};

export default function AboutPage() {
  const cities = dealerCities();
  return (
    <>
      <Header active="/about" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "О компании" }]} />
      <main>
        <section>
          <div className="module a">
            <div className="module-photo" style={{ minHeight: 400, background: "#111", display: "grid", placeItems: "center", padding: 48 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/sanremo-official-white-v4.svg" alt="Sanremo Coffee Machines" style={{ width: "min(72%,520px)", objectFit: "contain" }} />
            </div>
            <div className="module-copy">
              <p className="eyebrow">Бренд и российский контур</p>
              <h1>Sanremo и BIO</h1>
              <span className="plaque plaque-lg">Итальянский продукт, российская инфраструктура</span>
              <p className="lead">
                Sanremo — производитель и продуктовый бренд. Компания BIO — официальный дистрибьютор
                и оператор российского рынка. Сайт объединяет итальянскую идентичность продукта с
                инфраструктурой владения в России.
              </p>
            </div>
          </div>
        </section>

        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Разделение ролей</p>
              <h2>Кто за что отвечает</h2>
            </div>
            <p className="small" style={{ maxWidth: "54ch" }}>
              Юридические лица не смешиваются: производитель отвечает за продукт и документацию,
              дистрибьютор — за российский ассортимент, цены, склад и сервисную сеть.
            </p>
          </div>
          <div className="grid g2">
            <div className="card">
              <div className="card-body">
                <span className="plaque" style={{ alignSelf: "flex-start" }}>Производитель</span>
                <h3>Sanremo Coffee Machines</h3>
                <p className="small" style={{ margin: 0 }}>
                  Разработка и производство профессиональных рожковых кофемашин в Италии.
                  Технологические платформы, конструктив, эксплуатационная документация,
                  электрические и взрыв-схемы, фирменный стиль и медиабанк.
                </p>
                <ul className="small" style={{ paddingLeft: 18, margin: "6px 0 0" }}>
                  <li>{families.length} семейств в актуальной линейке для России</li>
                  <li>Заявления производителя публикуются со ссылкой на документ</li>
                </ul>
              </div>
            </div>
            <div className="card" style={{ borderColor: "var(--ink)", borderWidth: 2 }}>
              <div className="card-body">
                <span className="plaque" style={{ alignSelf: "flex-start" }}>Дистрибьютор в России</span>
                <h3>Компания BIO</h3>
                <p className="small" style={{ margin: 0 }}>
                  Ассортимент и рекомендованные розничные цены, склад в России, дилерская сеть,
                  каталог запчастей, обучение, коммерческая и сервисная маршрутизация.
                </p>
                <ul className="small" style={{ paddingLeft: 18, margin: "6px 0 0" }}>
                  <li>{liveSkus.length} конфигураций с РРЦ и складским статусом</li>
                  <li>{parts.length} артикулов ЗИП с подтверждённой совместимостью</li>
                  <li>{cities.length} городов дилерской сети</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section bg-sage">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Принцип публикации</p>
                <h2>Почему данным на сайте можно верить</h2>
              </div>
              <p className="small" style={{ maxWidth: "54ch" }}>
                Каждая значимая цифра имеет источник, дату проверки и владельца данных. Расхождения
                между источниками фиксируются и отправляются на подтверждение в BIO.
              </p>
            </div>
            <div className="grid g4">
              {[
                ["Данные производителя", "Характеристики и заявления Sanremo — со ссылкой на официальную документацию и указанием версии файла."],
                ["РРЦ BIO", "Рекомендованная цена с датой начала действия и конфигурацией, к которой она относится."],
                ["Рекомендация по сценарию", "Редакционный ориентир дистрибьютора, явно отделённый от паспортной производительности."],
                ["Кейсы и клиенты", "Названия, логотипы и фотографии — только после документального подтверждения и согласия клиента."],
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
              <p className="eyebrow">Что публикует сайт</p>
              <h2>Российская матрица в цифрах</h2>
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
