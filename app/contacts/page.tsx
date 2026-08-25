import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { models, dealerCities } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Контакты BIO — официального дистрибьютора Sanremo в России",
  description:
    "Отдел продаж, сервис и запчасти Sanremo в России. Запрос конфигурации, коммерческое предложение для сети, сервисное обращение, заявка на дилерство.",
};

const FORMS = [
  { id: "quote", title: "Подбор и коммерческое предложение", who: "Отдел продаж BIO или дилер региона",
    fields: "результат подбора, модели, регион, формат, объём, срок запуска, контакты" },
  { id: "model", title: "Консультация по модели", who: "Продажи BIO или дилер",
    fields: "SKU и конфигурация, страница, регион, вопрос, контакты" },
  { id: "service", title: "Сервисное обращение", who: "Сервисная очередь",
    fields: "модель, серийный номер, город, симптом, фото или видео, дилер" },
  { id: "part", title: "Запрос запчасти", who: "Отдел запчастей BIO или дилер",
    fields: "артикул, модель, серийный номер, количество, доставка, контакты" },
  { id: "dealer", title: "Стать дилером", who: "Channel-менеджер",
    fields: "регион, компания, опыт, ресурсы, контакты" },
  { id: "event", title: "Регистрация на мероприятие", who: "Организатор",
    fields: "событие, участник, компания, город, согласия" },
];

export default function ContactsPage() {
  return (
    <>
      <Header />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "Контакты" }]} />
      <main>
        <section className="wrap" style={{ paddingBottom: 30 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Российский контур бренда</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>Контакты</h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Компания BIO — официальный дистрибьютор Sanremo в России. Отвечаем за ассортимент,
                рекомендованные цены, склад, дилерскую сеть, запчасти и сервисную маршрутизацию.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap section-tight">
          <div className="grid g2" style={{ alignItems: "start" }}>
            <div>
              <h2 style={{ marginBottom: 20 }}>Запрос конфигурации</h2>
              <form className="grid g2" style={{ alignItems: "start" }}>
                <label className="field"><span>Имя</span><input placeholder="Как к вам обращаться" /></label>
                <label className="field"><span>Телефон или e-mail</span><input placeholder="для ответа" /></label>
                <label className="field"><span>Город или регион</span><input placeholder="Москва" /></label>
                <label className="field"><span>Формат</span>
                  <select defaultValue="">
                    <option value="" disabled>Выберите формат</option>
                    <option>Кофейня</option><option>Сеть</option><option>Ресторан / пекарня</option>
                    <option>Отель / фуд-корнер</option><option>Specialty</option><option>Обжарщик / лаборатория</option>
                  </select>
                </label>
                <label className="field"><span>Интересующая модель</span>
                  <select defaultValue="">
                    <option value="">Ещё выбираю</option>
                    {models.map((m) => <option key={m.slug}>{m.name}</option>)}
                  </select>
                </label>
                <label className="field"><span>Срок запуска</span>
                  <select defaultValue="">
                    <option value="" disabled>Выберите срок</option>
                    <option>В течение месяца</option><option>1–3 месяца</option><option>Более 3 месяцев</option>
                  </select>
                </label>
                <label className="field" style={{ gridColumn: "1 / -1" }}>
                  <span>Задача</span>
                  <textarea placeholder="Поток, меню, число бариста, ограничения площадки" />
                </label>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="small" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <input type="checkbox" style={{ width: 18, minHeight: 18, marginTop: 3 }} required />
                    <span>Согласен на обработку персональных данных</span>
                  </label>
                  <label className="small" style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 8 }}>
                    <input type="checkbox" style={{ width: 18, minHeight: 18, marginTop: 3 }} />
                    <span>Хочу получать новости о продуктах и обучении (необязательно)</span>
                  </label>
                  <button className="btn btn-solid" type="button" style={{ marginTop: 14 }}>Отправить запрос</button>
                </div>
              </form>
            </div>

            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                  <span className="plaque" style={{ alignSelf: "flex-start" }}>Компания BIO</span>
                  <h3>Официальный дистрибьютор Sanremo в России</h3>
                  <p style={{ margin: 0 }}>
                    <b style={{ fontFamily: "var(--sans)", fontSize: 21 }}>
                      <a href="tel:+78006004300" style={{ textDecoration: "none" }}>8 (800) 600-43-00</a>
                    </b>
                  </p>
                  <p className="small" style={{ margin: 0 }}>
                    <a href="mailto:info@sanremomachines.ru">info@sanremomachines.ru</a>
                  </p>
                  <p className="small" style={{ margin: 0 }}>
                    117630, Москва,<br />
                    ул. Обручева, 23с1<br />
                    БЦ «Геолог», 4 этаж
                  </p>
                  <p className="tiny" style={{ margin: 0 }}>
                    Бесплатный звонок по России
                  </p>
                  <div className="chips">
                    {dealerCities().slice(0, 5).map((c) => (
                      <a className="tag" key={c.city} href={`/dealers?city=${encodeURIComponent(c.city)}`} style={{ textDecoration: "none" }}>
                        {c.city}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <h3 style={{ marginBottom: 14 }}>Куда идут заявки</h3>
              <div className="table-scroll">
                <table className="data" style={{ minWidth: 460 }}>
                  <thead>
                    <tr><th>Форма</th><th>Маршрут</th></tr>
                  </thead>
                  <tbody>
                    {FORMS.map((f) => (
                      <tr key={f.id}>
                        <td>
                          <b style={{ fontFamily: "var(--sans)" }}>{f.title}</b>
                          <div className="tiny">{f.fields}</div>
                        </td>
                        <td className="tiny">{f.who}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
