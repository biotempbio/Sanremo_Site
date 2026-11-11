"use client";

import { useEffect, useMemo, useState } from "react";
import { CaseCard } from "./CaseCard";
import { sanremoCases } from "@/lib/cases";

export function CasesClient() {
  const [city, setCity] = useState("");
  const [model, setModel] = useState("");
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setCity(query.get("city") ?? "");
    setModel(query.get("model") ?? "");
  }, []);
  const cities = useMemo(() => [...new Set(sanremoCases.map((entry) => entry.city.value))].sort((a, b) => a.localeCompare(b, "ru")), []);
  const models = useMemo(() => [...new Set(sanremoCases.map((entry) => entry.model?.family).filter((value): value is string => Boolean(value)))], []);
  const labels: Record<string, string> = { zoe: "Zoe", d8: "D8", f18: "F18", "cafe-racer": "Café Racer" };
  const shown = sanremoCases.filter((entry) => (!city || entry.city.value === city) && (!model || entry.model?.family === model))
    .sort((a, b) => Number(b.slug === "coffee-combo") - Number(a.slug === "coffee-combo"));

  function update(nextCity: string, nextModel: string) {
    setCity(nextCity); setModel(nextModel);
    const query = new URLSearchParams();
    if (nextCity) query.set("city", nextCity);
    if (nextModel) query.set("model", nextModel);
    window.history.replaceState(null, "", `/cases/${query.size ? `?${query}` : ""}`);
  }

  return <>
    <div className="case-filters" role="group" aria-label="Фильтры проектов">
      <label>Город<select value={city} onChange={(event) => update(event.target.value, model)}><option value="">Все города</option>{cities.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Модель<select value={model} onChange={(event) => update(city, event.target.value)}><option value="">Все модели</option>{models.map((value) => <option key={value} value={value}>{labels[value] ?? value}</option>)}</select></label>
      {(city || model) && <button className="btn" type="button" onClick={() => update("", "")}>Сбросить</button>}
    </div>
    <p className="small case-count" role="status">Проектов: {shown.length}</p>
    {shown.length ? <div className="cases-grid">{shown.map((entry) => <CaseCard key={entry.slug} entry={entry} />)}</div>
      : <div className="empty"><p>По этим условиям проектов пока нет.</p><button className="btn" onClick={() => update("", "")}>Показать все проекты</button></div>}
  </>;
}
