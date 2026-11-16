"use client";

import { useState } from "react";

export type CapriPartRow = {
  code: string;
  name: string;
  article: string;
  price: string;
  stock: number;
  availability: string;
};

export default function CapriPartsTable({ rows }: { rows: CapriPartRow[] }) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const needle = query.trim().toLocaleLowerCase("ru-RU");
  const filtered = rows.filter((row) =>
    !needle || `${row.name} ${row.article} ${row.code}`.toLocaleLowerCase("ru-RU").includes(needle)
  );
  const shown = needle || showAll ? filtered : filtered.slice(0, 15);

  return <div className="capri-parts">
    {rows.length > 15 ? <div className="capri-parts-filter">
      <label className="field"><span>Поиск по названию или артикулу</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setShowAll(false); }} placeholder="Например, клапан или 10652058B" /></label>
      <p className="small" role="status">Показано {shown.length} из {filtered.length} {filtered.length === 1 ? "детали" : "деталей"}</p>
    </div> : null}
    {filtered.length ? <>
      <div className="table-scroll capri-parts-desktop"><table className="data"><thead><tr><th>Деталь</th><th>Артикул</th><th>Цена</th><th>Наличие</th></tr></thead><tbody>{shown.map((part) => <tr key={part.code}><td>{part.name}</td><td>{part.article}</td><td>{part.price}</td><td>{part.availability}</td></tr>)}</tbody></table></div>
      <div className="capri-parts-mobile">{shown.map((part) => <article key={part.code}><h3>{part.name}</h3><p>Артикул: {part.article}</p><p>{part.price}</p><strong>{part.availability}</strong></article>)}</div>
      {!needle && !showAll && rows.length > 15 ? <button className="btn" type="button" onClick={() => setShowAll(true)}>Показать все {rows.length} деталей</button> : null}
    </> : <p>По этому запросу деталей нет. Укажите другое название или отправьте запрос по серийному номеру.</p>}
  </div>;
}
