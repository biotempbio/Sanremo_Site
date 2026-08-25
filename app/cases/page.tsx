import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { chains } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Кофейни выбирают Sanremo — российские установки",
  description:
    "Российские кейсы установки профессиональных кофемашин Sanremo: сети и заведения, модели и конфигурации, задачи по потоку и меню. Публикуется после подтверждения и согласия клиента.",
};

export default function CasesPage() {
  return (
    <>
      <Header active="/cases" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "Кейсы" }]} />
      <main>
        <section className="wrap" style={{ paddingBottom: 30 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Российское социальное доказательство</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>Кофейни выбирают Sanremo</h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Раздел строится на подтверждённых установках: клиент и точка, город, формат, модель и
                конфигурация, задача, значимые функции и фотографии рабочей зоны.
              </p>
              <p className="source-note">
                Названия и логотипы публикуются только после документального подтверждения установки
                и письменного разрешения клиента. Отдельные точки не подаются как федеральный
                контракт (ТЗ §13).
              </p>
            </div>
          </div>
        </section>

        <section className="wrap section-tight">
          <h2 style={{ marginBottom: 18 }}>На подтверждении</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
            {chains.map((c) => (
              <div className="card" key={c}>
                <div className="card-body" style={{ alignItems: "flex-start" }}>
                  <b style={{ fontFamily: "var(--sans)", fontSize: 18 }}>{c}</b>
                  <span className="tag">Ожидает согласия на публикацию</span>
                  <p className="tiny" style={{ margin: 0 }}>
                    Требуются: подтверждение установки, модель и конфигурация, город, дата,
                    фотографии и разрешение на использование названия и логотипа.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section bg-gray">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Структура кейса</p>
                <h2>Что публикуется в карточке</h2>
              </div>
              <p className="small" style={{ maxWidth: "54ch" }}>
                Фактический сценарий эксплуатации без неподтверждённых лабораторных выводов и без
                обещаний, которые нельзя проверить.
              </p>
            </div>
            <div className="grid g4">
              {[
                ["Клиент и точка", "Название, город, формат заведения и дата установки."],
                ["Оборудование", "Модель, конфигурация, количество машин, связанные кофемолки."],
                ["Задача", "Поток, меню, площадь, дизайн, стандартизация сети."],
                ["Почему этот вариант", "Какие функции оказались значимыми и как машина работает в реальной смене."],
              ].map(([h, p]) => (
                <div key={h} style={{ borderTop: "2px solid var(--ink)", paddingTop: 14 }}>
                  <h3 style={{ marginBottom: 8 }}>{h}</h3>
                  <p className="small" style={{ margin: 0 }}>{p}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 26 }}>
              <a className="btn" href="/contacts">Предложить свой кейс</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
