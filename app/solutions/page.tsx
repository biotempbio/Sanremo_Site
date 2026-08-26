import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { SCENARIOS, VOLUME_BANDS, modelBySlug, familyBySlug, money, modelPath } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Решения по формату бизнеса — какая Sanremo нужна вашей точке",
  description:
    "Первая кофейня, пекарня и ресторан, независимая specialty, высокий поток, флагманская точка, компактный формат, лаборатория обжарщика: рекомендация, альтернатива и апгрейд с объяснением логики.",
};

export default function SolutionsPage() {
  return (
    <>
      <Header active="/solutions" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "Решения" }]} />
      <main>
        <section className="wrap" style={{ paddingBottom: 24 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Выбор по задаче</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>Решения для реальной смены</h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Семь сценариев, которые закрывают почти все запросы российского рынка. В каждом —
                основная рекомендация, экономичная альтернатива и апгрейд.
              </p>
              <p className="source-note">
                Рекомендации по сценариям — редакционная позиция BIO, отделённая от заявленной
                производителем производительности (ТЗ Приложение C).
              </p>
            </div>
          </div>
          <div className="chips">
            {SCENARIOS.map((s) => (
              <a className="tag" key={s.id} href={`#${s.id}`} style={{ textDecoration: "none" }}>{s.title}</a>
            ))}
          </div>
        </section>

        {SCENARIOS.map((s, i) => {
          const main = modelBySlug(s.main);
          const alt = s.alt ? modelBySlug(s.alt) : undefined;
          const up = s.upgrade ? modelBySlug(s.upgrade) : undefined;
          const bands = VOLUME_BANDS.filter((b) => b.models.includes(s.main));
          const flip = i % 2 === 1;
          return (
            <section key={s.id} id={s.id} className={i % 2 ? "bg-cream" : ""} style={{ scrollMarginTop: 90 }}>
              <div className={`module ${flip ? "b" : "a"}`}>
                {flip ? null : (
                  <div className="module-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.photo} alt="" />
                  </div>
                )}
                <div className="module-copy">
                  <p className="eyebrow">Сценарий {String(i + 1).padStart(2, "0")}</p>
                  <h2>{s.title}</h2>
                  <span className="plaque">{s.question}</span>
                  <p className="lead" style={{ marginTop: 18 }}>{s.logic}</p>
                  {bands.length > 0 && (
                    <p className="small" style={{ margin: "0 0 16px" }}>
                      Ориентир по потоку: {bands.map((b) => b.label).join(", ")}.
                    </p>
                  )}
                  <div className="grid g3" style={{ gap: 12, marginBottom: 20 }}>
                    <Pick label="Рекомендация" m={main} />
                    <Pick label="Альтернатива" m={alt} />
                    <Pick label="Апгрейд" m={up} />
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a className="btn btn-solid" href="/choose">Уточнить подбор</a>
                    {main && <a className="btn" href={modelPath(main)}>Карточка {main.name}</a>}
                  </div>
                </div>
                {flip ? (
                  <div className="module-photo flip">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.photo} alt="" />
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}

        <section className="section wrap">
          <div className="sec-head">
            <div>
              <p className="eyebrow">Методика</p>
              <h2>Как мы считаем нагрузку</h2>
            </div>
          </div>
          <div className="grid g3">
            {[
              ["Дневной объём — не главный параметр", "Число групп определяет пиковый час, а не дневной итог. Двести чашек ровным потоком и двести за два утренних часа — разные машины."],
              ["Молочное меню меняет требования к пару", "Чем выше доля напитков с молоком, тем важнее независимость кофейной и паровой систем и мощность парового бойлера."],
              ["Машина работает в связке", "Кофемолки, подготовка воды, организация рабочего места и число бариста влияют на результат не меньше, чем сама кофемашина."],
            ].map(([h, p]) => (
              <div key={h} style={{ borderTop: "2px solid var(--ink)", paddingTop: 16 }}>
                <h3 style={{ marginBottom: 10 }}>{h}</h3>
                <p className="small" style={{ margin: 0 }}>{p}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Pick({ label, m }: { label: string; m: ReturnType<typeof modelBySlug> }) {
  if (!m) return <div />;
  const f = familyBySlug(m.family)!;
  return (
    <a href={modelPath(m)} style={{ textDecoration: "none", borderLeft: "2px solid var(--ink)", paddingLeft: 12, display: "block" }}>
      <span className="tiny" style={{ textTransform: "uppercase", letterSpacing: ".1em" }}>{label}</span>
      <b style={{ display: "block", fontFamily: "var(--sans)", fontSize: 16 }}>{m.name}</b>
      <span className="tiny">{f.name} · от {money(m.priceFrom)}</span>
    </a>
  );
}
