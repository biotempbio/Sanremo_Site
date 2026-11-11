"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CaseCard } from "./CaseCard";
import { sanremoCases } from "@/lib/cases";

export function CasesClient() {
  const [city, setCity] = useState("");
  const [model, setModel] = useState("");
  const [gallery, setGallery] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setCity(query.get("city") ?? "");
    setModel(query.get("model") ?? "");
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (sanremoCases.some((entry) => entry.slug === slug)) setGallery(slug);
  }, []);
  const selectedCase = sanremoCases.find((entry) => entry.slug === gallery);
  useEffect(() => {
    if (!selectedCase) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setGallery(null);
      if (event.key === "ArrowRight") setPhotoIndex((index) => (index + 1) % selectedCase!.photos.length);
      if (event.key === "ArrowLeft") setPhotoIndex((index) => (index - 1 + selectedCase!.photos.length) % selectedCase!.photos.length);
      if (event.key === "Tab") {
        const controls = closeButton.current?.closest('[role="dialog"]')?.querySelectorAll<HTMLButtonElement>("button");
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); returnFocus.current?.focus(); };
  }, [selectedCase]);
  function openGallery(entry: typeof sanremoCases[number]) {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPhotoIndex(0);
    setGallery(entry.slug);
  }
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
    {shown.length ? <div className="cases-grid">{shown.map((entry) => <CaseCard key={entry.slug} entry={entry} onOpenGallery={openGallery} />)}</div>
      : <div className="empty"><p>По этим условиям проектов пока нет.</p><button className="btn" onClick={() => update("", "")}>Показать все проекты</button></div>}
    {selectedCase && <div className="case-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setGallery(null); }}>
      <div className="case-lightbox-panel" role="dialog" aria-modal="true" aria-label={`Фотографии ${selectedCase.name.value}`}>
        <div className="case-lightbox-top"><div><b>{selectedCase.name.value}</b><span>{selectedCase.city.value} · {photoIndex + 1} из {selectedCase.photos.length}</span></div><button ref={closeButton} type="button" onClick={() => setGallery(null)} aria-label="Закрыть галерею">×</button></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="case-lightbox-image" src={selectedCase.photos[photoIndex].value} alt={`${selectedCase.name.value} — фотография ${photoIndex + 1} из ${selectedCase.photos.length}`} />
        <div className="case-lightbox-actions"><button type="button" onClick={() => setPhotoIndex((index) => (index - 1 + selectedCase.photos.length) % selectedCase.photos.length)} aria-label="Предыдущее фото">← Предыдущее</button><button type="button" onClick={() => setPhotoIndex((index) => (index + 1) % selectedCase.photos.length)} aria-label="Следующее фото">Следующее →</button></div>
      </div>
    </div>}
  </>;
}
