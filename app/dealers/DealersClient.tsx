"use client";

import { useMemo, useState } from "react";

export interface DealerRow {
  name: string;
  city: string | null;
  address: string | null;
  site: string | null;
  note: string | null;
  verified: boolean;
}

const SERVICES = ["Продажа", "Шоурум", "Демонстрация", "Обучение", "Монтаж", "Гарантийный сервис", "Запчасти"];

export default function DealersClient({
  dealers, cities, initialCity,
}: { dealers: DealerRow[]; cities: { city: string; count: number }[]; initialCity?: string }) {
  const [q, setQ] = useState(initialCity ?? "");
  const [city, setCity] = useState<string>(initialCity ?? "");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return dealers.filter((d) => {
      if (city && d.city !== city) return false;
      if (!needle) return true;
      return (
        d.name.toLowerCase().includes(needle) ||
        (d.city ?? "").toLowerCase().includes(needle) ||
        (d.address ?? "").toLowerCase().includes(needle)
      );
    });
  }, [dealers, q, city]);

  return (
    <div className="dealers">
      <aside className="filters">
        <label className="field">
          <span>Поиск по городу или названию</span>
          <input value={q} onChange={(e) => { setQ(e.target.value); setCity(""); }} placeholder="Москва, Казань, Торговый Дизайн…" />
        </label>

        <div className="filter-group">
          <h4>Города · {cities.length}</h4>
          <div className="chips">
            {cities.map((c) => (
              <button key={c.city} className="chip" aria-pressed={city === c.city}
                      onClick={() => { const next = city === c.city ? "" : c.city; setCity(next); setQ(next); }}>
                {c.city} · {c.count}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Услуги</h4>
          <div className="chips">
            {SERVICES.map((s) => <span className="tag" key={s}>{s}</span>)}
          </div>
        </div>

        <p className="source-note">
          Автоопределение региона используется только как подсказка — ручной выбор города остаётся
          обязательным. Снятые дилеры удаляются из публичного списка и не остаются в индексе.
        </p>
      </aside>

      <div>
        <p className="small" style={{ marginBottom: 16 }}>
          Найдено партнёров: <b>{filtered.length}</b> из {dealers.length}
          {city ? <> · город: <b>{city}</b></> : null}
        </p>

        {filtered.length === 0 ? (
          <div className="empty">
            <h3>В этом городе авторизованного партнёра пока нет</h3>
            <p className="small" style={{ maxWidth: "46ch", margin: "10px auto 18px" }}>
              Оставьте заявку с указанием региона и задачи — её примет отдел продаж BIO и предложит
              ближайший вариант поставки, монтажа и обслуживания.
            </p>
            <a className="btn btn-solid" href="/contacts">Оставить заявку в BIO</a>
          </div>
        ) : (
          <div className="grid g3">
            {filtered.map((d, i) => (
              <article className="card" key={`${d.name}-${i}`}>
                <div className="card-body">
                  <p className="eyebrow" style={{ margin: 0 }}>{d.city ?? "Регион уточняется"}</p>
                  <h3>{d.name}</h3>
                  {d.address ? (
                    <p className="small" style={{ margin: 0 }}>{d.address}</p>
                  ) : (
                    <p className="tiny" style={{ margin: 0 }}>
                      Адрес и контакты подставляются из справочника дилеров BIO.
                    </p>
                  )}
                  {d.note ? <p className="tiny" style={{ margin: 0 }}>{d.note}</p> : null}
                  <div className="chips">
                    <span className="tag">Продажа</span>
                    <span className="tag">Консультация</span>
                  </div>
                  <div className="card-foot">
                    <span className="tiny">
                      {d.verified ? "Адрес и сайт подтверждены" : "На проверке"}
                    </span>
                    {d.site ? (
                      <a className="link-arrow" href={d.site} target="_blank" rel="noopener noreferrer">
                        Сайт дилера →
                      </a>
                    ) : (
                      <a className="link-arrow" href="/contacts">Запросить контакт →</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .dealers { display: grid; grid-template-columns: minmax(0,300px) minmax(0,1fr); gap: clamp(20px,3vw,52px); align-items: start; }
        @media (max-width: 980px) { .dealers { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
