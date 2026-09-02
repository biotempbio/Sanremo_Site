import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";

export const metadata: Metadata = {
  title: "Sanremo за стойкой — истории кофейных проектов",
  description:
    "Истории кофеен и ресторанов с оборудованием Sanremo: выбор модели, организация рабочей зоны, меню и опыт ежедневной эксплуатации.",
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
              <p className="eyebrow">Sanremo в кофейных проектах</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>За стойкой</h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Здесь появятся истории заведений, в которых кофемашина стала частью вкуса,
                рабочего ритма и визуального характера пространства.
              </p>
            </div>
          </div>
        </section>

        <section className="section bg-gray">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <p className="eyebrow">Истории без постановки</p>
                <h2>Что покажем в каждом проекте</h2>
              </div>
              <p className="small" style={{ maxWidth: "54ch" }}>
                Не витринную фотографию, а контекст выбора и ежедневную работу оборудования.
              </p>
            </div>
            <div className="grid g4">
              {[
                ["Замысел", "Формат заведения, меню, интерьер и ожидания от кофейной зоны."],
                ["Выбор", "Почему команда остановилась на конкретной модели и конфигурации."],
                ["Рабочая смена", "Поток, молочное меню, число бариста и организация пространства."],
                ["Опыт команды", "Какие функции действительно помогают поддерживать вкус и темп работы."],
              ].map(([h, p]) => (
                <div key={h} style={{ borderTop: "2px solid var(--ink)", paddingTop: 14 }}>
                  <h3 style={{ marginBottom: 8 }}>{h}</h3>
                  <p className="small" style={{ margin: 0 }}>{p}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 26 }}>
              <a className="btn" href="/contacts">Рассказать о своём проекте</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
