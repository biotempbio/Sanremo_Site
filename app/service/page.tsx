import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import MailtoForm from "../components/MailtoForm";
import { Crumbs } from "../components/Bits";
import { parts, dealerCities, models } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Сервис Sanremo в России — монтаж, обслуживание, гарантия",
  description:
    "Сервисная инфраструктура Sanremo в России: зоны ответственности BIO, дилера и сервисного партнёра, подготовка к монтажу, регламенты обслуживания, гарантийное обращение и каталог запчастей.",
};

export default function ServicePage() {
  const cities = dealerCities();
  return (
    <>
      <Header active="/service" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "Сервис и запчасти" }]} />
      <main>
        <section>
          <div className="module a">
            <div className="module-photo" style={{ minHeight: 380 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photo/steam-wands.webp" alt="Сервисное обслуживание кофемашины" />
            </div>
            <div className="module-copy">
              <p className="eyebrow">Инфраструктура владения</p>
              <h1>Оборудование должно работать</h1>
              <span className="plaque plaque-lg">Склад, совместимость, города, сроки</span>
              <p className="lead">
                Мы показываем сервис проверяемыми данными: {parts.length} артикулов в каталоге ЗИП,
                подтверждённая совместимость с конфигурациями, {cities.length} городов дилерской
                сети и понятный порядок обращения.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btn btn-amber" href="/parts">Найти запчасть</a>
                <a className="btn" href="#request">Сервисное обращение</a>
              </div>
            </div>
          </div>
        </section>

        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Кто за что отвечает</p>
              <h2>Зоны ответственности</h2>
            </div>
            <p className="small" style={{ maxWidth: "54ch" }}>
              Разделение зон снимает главный источник конфликтов: клиент понимает, к кому идти с
              вопросом о поставке, монтаже и гарантии.
            </p>
          </div>
          <div className="grid g3">
            {[
              ["Компания BIO", "Дистрибьютор", "Ассортимент и РРЦ, склад в России, каталог запчастей, обучение, авторизация дилеров и сервисных партнёров, эскалация сложных случаев."],
              ["Авторизованный дилер", "Продажа и монтаж", "Продажа, подбор конфигурации, демонстрация, доставка, монтаж и пусконаладка, первичное обучение персонала, приём гарантийных обращений."],
              ["Сервисный партнёр", "Обслуживание", "Плановое обслуживание по регламенту модели, диагностика и ремонт, замена узлов, работа с расходными материалами и водоподготовкой."],
            ].map(([who, role, what]) => (
              <div className="card" key={who}>
                <div className="card-body">
                  <span className="plaque plaque-gray" style={{ alignSelf: "flex-start" }}>{role}</span>
                  <h3>{who}</h3>
                  <p className="small" style={{ margin: 0 }}>{what}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="notice" style={{ marginTop: 24 }}>
            <b>О сроках.</b> Публичные обещания по времени реакции и восстановления появятся на этой
            странице только после утверждения SLA компанией BIO. До этого сроки согласовываются
            индивидуально при обращении (ТЗ §12.1).
          </div>
        </section>

        <section className="section bg-cream">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">До приезда инженера</p>
                <h2>Подготовка к монтажу</h2>
              </div>
              <p className="small" style={{ maxWidth: "54ch" }}>
                Большинство ранних отказов связано не с машиной, а с площадкой. Чек-лист проходят до
                поставки — это дешевле, чем переделывать.
              </p>
            </div>
            <div className="grid g4">
              {[
                ["Вода", "Анализ исходной воды, требуемая жёсткость, выбор системы фильтрации и график замены картриджей."],
                ["Электрика", "Выделенная линия, номинал автомата, напряжение и фазность под конкретную конфигурацию, заземление."],
                ["Слив и подвод", "Подвод холодной воды с запорной арматурой, слив с уклоном, доступ для обслуживания."],
                ["Пространство", "Ширина и глубина рабочей зоны, высота над машиной, вентиляция, место под кофемолки и рабочую поверхность."],
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
              <p className="eyebrow">Регламенты</p>
              <h2>Обслуживание по моделям</h2>
            </div>
            <p className="small" style={{ maxWidth: "54ch" }}>
              Периодичность и перечень работ формируются из эксплуатационной документации Sanremo и
              публикуются в карточке каждой модели вместе с электросхемами и взрыв-схемами.
            </p>
          </div>
          <div className="table-scroll">
            <table className="data">
              <thead>
                <tr>
                  <th>Модель</th>
                  <th>Документация</th>
                  <th className="num">Связано артикулов ЗИП</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.slug}>
                    <td><b style={{ fontFamily: "var(--sans)" }}>{m.name}</b></td>
                    <td className="tiny">
                      {[...new Set(m.docs.map((d) => d.type))].join(", ") || "загружается"}
                    </td>
                    <td className="num">{m.docs.length ? m.docs.length : "—"}</td>
                    <td><a className="link-arrow" href={`/parts?model=${m.slug}`}>Запчасти модели</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section bg-gray" id="request" style={{ scrollMarginTop: 90 }}>
          <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", gap: "clamp(24px,4vw,64px)" }}>
            <div>
              <p className="eyebrow">Обращение</p>
              <h2>Сервисная заявка</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                Чем точнее описан симптом, тем выше шанс решить вопрос без повторного выезда.
                Серийный номер находится на шильдике под поддоном или на задней панели.
              </p>
              <ul className="small" style={{ paddingLeft: 18 }}>
                <li>Заявка маршрутизируется в сервисную очередь BIO или дилеру региона.</li>
                <li>Вложения: фото шильдика, фото или видео проблемы, показания манометра.</li>
                <li>Гарантийные обращения принимаются через дилера, продавшего оборудование.</li>
              </ul>
            </div>
            <MailtoForm subject="Сервисное обращение Sanremo" className="grid g2" style={{ alignItems: "start" }}>
              <label className="field"><span>Модель</span>
                <select name="Модель" defaultValue="">
                  <option value="" disabled>Выберите модель</option>
                  {models.map((m) => <option key={m.slug}>{m.name}</option>)}
                </select>
              </label>
              <label className="field"><span>Серийный номер</span><input name="Серийный номер" placeholder="например 24-08-13-N34C" /></label>
              <label className="field"><span>Город</span><input name="Город" placeholder="Москва" /></label>
              <label className="field"><span>Контакт</span><input name="Контакт" placeholder="телефон или e-mail" required /></label>
              <label className="field" style={{ gridColumn: "1 / -1" }}>
                <span>Симптом</span>
                <textarea name="Симптом" placeholder="Что происходит, когда началось, что уже проверяли" />
              </label>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="small" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <input type="checkbox" style={{ width: 18, minHeight: 18, marginTop: 3 }} required />
                  <span>Согласен на обработку персональных данных для рассмотрения обращения</span>
                </label>
                <button className="btn btn-solid" type="submit" style={{ marginTop: 14 }}>Отправить обращение</button>
                <p className="source-note" style={{ marginTop: 10 }}>
                  Обращение откроется в вашей почтовой программе и будет направлено в сервисную очередь BIO.
                </p>
              </div>
            </MailtoForm>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
