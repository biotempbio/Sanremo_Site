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
      <div className="dealer-main">
        <label className="field">
          <span className="sr-only">Город, регион или адрес</span>
          <input value={q} onChange={(e) => { setQ(e.target.value); setCity(""); }} placeholder="Город, регион или адрес" />
        </label>
        <p className="small dealer-count">
          Найдено дилеров: <b>{filtered.length}</b>
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
          <div className="dealer-list">
            {filtered.map((d, i) => (
              <article className="dealer-row" key={`${d.name}-${i}`}>
                <div>
                  <h3>{d.name}</h3>
                  <p>{d.address ?? d.city ?? "Регион уточняется"}</p>
                  <span className="dealer-service">Продажа</span>
                </div>
                <div className="dealer-actions">
                  {d.site ? (
                    <a className="btn btn-solid" href={d.site} target="_blank" rel="noopener noreferrer">
                      Сайт дилера
                    </a>
                  ) : (
                    <a className="btn btn-solid" href="/contacts">Запросить контакт</a>
                  )}
                  {d.address ? (
                    <a className="btn" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`} target="_blank" rel="noopener noreferrer">
                      Построить маршрут
                    </a>
                  ) : null}
                  </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="dealer-side">
        <div className="dealer-geo">
          <p className="eyebrow">География дилеров</p>
          <h2>{cities.length} городов · {dealers.length} компаний</h2>
          <div className="dealer-cities">
            {cities.map((c) => (
              <button key={c.city} aria-pressed={city === c.city}
                      onClick={() => { const next = city === c.city ? "" : c.city; setCity(next); setQ(next); }}>
                <span>{c.city}</span><b>{c.count}</b>
              </button>
            ))}
          </div>
          <p>Введите город или адрес в поиске слева. Если вашего города нет, отдел продаж BIO подберёт ближайшего партнёра.</p>
        </div>
        <div className="dealer-bio">
          <strong>Отдел продаж BIO</strong>
          <p>117630, Москва, ул. Обручева, 23с1, БЦ «Геолог», 4 этаж</p>
          <a href="tel:+78006004300">8 (800) 600-43-00 — бесплатный звонок по России</a>
        </div>
      </aside>

      <style>{`
        .dealers { display: grid; grid-template-columns: minmax(0,1.9fr) minmax(300px,1fr); gap: 42px; align-items: start; }
        .dealer-main .field input { min-height: 58px; font-size: 16px; }
        .dealer-count { margin: 16px 0 20px; }
        .dealer-list { display: grid; gap: 16px; }
        .dealer-row { border: 1px solid var(--line); padding: 28px 30px; display: grid; grid-template-columns: 1fr 260px; gap: 30px; align-items: center; background: #fff; }
        .dealer-row h3 { margin: 0 0 8px; font-size: 20px; }
        .dealer-row p { margin: 0 0 16px; color: var(--muted); }
        .dealer-service { display: inline-block; padding: 8px 12px; background: var(--gray-bg); color: var(--forest); font-size: 12px; }
        .dealer-actions { display: grid; gap: 10px; }
        .dealer-actions .btn { width: 100%; justify-content: center; }
        .dealer-side { border: 1px solid var(--line); }
        .dealer-geo { padding: 32px; background: var(--forest); color: #fff; }
        .dealer-geo .eyebrow { color: #b8cec6; }
        .dealer-geo h2 { margin: 14px 0 26px; color: #fff; font-family: var(--serif); font-size: 30px; }
        .dealer-cities { border-top: 1px solid rgba(255,255,255,.2); max-height: 440px; overflow: auto; }
        .dealer-cities button { width: 100%; display: flex; justify-content: space-between; gap: 20px; padding: 14px 0; border: 0; border-bottom: 1px solid rgba(255,255,255,.2); background: transparent; color: #fff; text-align: left; }
        .dealer-cities button[aria-pressed="true"] { color: #fff; font-weight: 700; }
        .dealer-geo > p:last-child { margin: 24px 0 0; color: #d7e2de; line-height: 1.6; }
        .dealer-bio { padding: 28px 32px; background: #fff; }
        .dealer-bio strong { color: var(--forest); text-transform: uppercase; letter-spacing: .08em; }
        .dealer-bio p { margin: 18px 0 8px; }
        .dealer-bio a { color: inherit; }
        @media (max-width: 980px) { .dealers { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .dealer-row { grid-template-columns: 1fr; padding: 22px; } }
      `}</style>
    </div>
  );
}
