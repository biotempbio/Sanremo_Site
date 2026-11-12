"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CaseCard } from "./CaseCard";
import { sanremoCases } from "@/lib/cases";

export function CasesClient() {
  const [city, setCity] = useState("");
  const [model, setModel] = useState("");
  const [gallery, setGallery] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setCity(query.get("city") ?? "");
    setModel(query.get("model") ?? "");
    const slug = decodeURIComponent(window.location.hash.slice(1));
    const entry = sanremoCases.find((item) => item.slug === slug);
    if (entry) {
      setPhotoIndex(Math.max(0, entry.photos.findIndex((photo) => photo.value === entry.cover)));
      setGallery(slug);
    }
  }, []);
  const selectedCase = sanremoCases.find((entry) => entry.slug === gallery);
  useEffect(() => {
    if (!selectedCase) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") { event.preventDefault(); setPhotoIndex((index) => (index + 1) % selectedCase!.photos.length); }
      if (event.key === "ArrowLeft") { event.preventDefault(); setPhotoIndex((index) => (index - 1 + selectedCase!.photos.length) % selectedCase!.photos.length); }
    }
    window.addEventListener("keydown", onKey);
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); returnFocus.current?.focus(); };
  }, [selectedCase]);
  function openGallery(entry: typeof sanremoCases[number]) {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPhotoIndex(Math.max(0, entry.photos.findIndex((photo) => photo.value === entry.cover)));
    setGallery(entry.slug);
  }
  function changePhoto(direction: number) {
    if (selectedCase) setPhotoIndex((index) => (index + direction + selectedCase.photos.length) % selectedCase.photos.length);
  }
  function endSwipe(clientX: number, clientY: number) {
    if (!touchStart.current) return;
    const dx = clientX - touchStart.current.x;
    const dy = clientY - touchStart.current.y;
    if (dy > 85 && dy > Math.abs(dx) * 1.25) setGallery(null);
    else if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) changePhoto(dx < 0 ? 1 : -1);
    touchStart.current = null;
  }
  const cities = useMemo(() => [...new Set(sanremoCases.map((entry) => entry.city.value))].sort((a, b) => a.localeCompare(b, "ru")), []);
  const models = useMemo(() => [...new Set(sanremoCases.map((entry) => entry.model?.family).filter((value): value is string => Boolean(value)))], []);
  const labels: Record<string, string> = { zoe: "Zoe", d8: "D8", f18: "F18", "cafe-racer": "Café Racer" };
  const shown = sanremoCases.filter((entry) => (!city || entry.city.value === city) && (!model || entry.model?.family === model));

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
    {selectedCase && <dialog ref={dialogRef} className="case-lightbox" aria-label={`Фотографии ${selectedCase.name.value}`} onCancel={() => setGallery(null)} onMouseDown={(event) => { if (event.target === event.currentTarget) setGallery(null); }}>
      <div className="case-lightbox-panel">
        <button className="case-lightbox-close" type="button" onClick={() => setGallery(null)} aria-label="Закрыть галерею">×</button>
        <div className="case-lightbox-stage" onTouchStart={(event) => { const point = event.touches[0]; touchStart.current = point ? { x: point.clientX, y: point.clientY } : null; }} onTouchEnd={(event) => endSwipe(event.changedTouches[0]?.clientX ?? 0, event.changedTouches[0]?.clientY ?? 0)}>
          <button className="case-lightbox-side case-lightbox-prev" type="button" onClick={() => changePhoto(-1)} aria-label="Предыдущее фото">←</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="case-lightbox-image" src={selectedCase.photos[photoIndex].value} alt={`${selectedCase.name.value} — фотография ${photoIndex + 1} из ${selectedCase.photos.length}`} />
          <button className="case-lightbox-side case-lightbox-next" type="button" onClick={() => changePhoto(1)} aria-label="Следующее фото">→</button>
        </div>
        <div className="case-lightbox-caption"><div><b>{selectedCase.name.value}</b><span>{selectedCase.city.value} · {selectedCase.model ? `Sanremo ${selectedCase.model.value}` : "Оборудование Sanremo"}</span></div><div className="case-lightbox-caption-side"><span aria-live="polite">{photoIndex + 1} из {selectedCase.photos.length}</span>{selectedCase.page && <a href={`/cases/${selectedCase.slug}/`}>Подробнее о проекте</a>}</div></div>
        <div className="case-lightbox-bottom"><div className="case-lightbox-actions"><button type="button" onClick={() => changePhoto(-1)} aria-label="Предыдущее фото">←</button><button type="button" onClick={() => changePhoto(1)} aria-label="Следующее фото">→</button></div><div className="case-lightbox-thumbs" role="group" aria-label="Фотографии проекта">{selectedCase.photos.map((photo, index) => <button key={photo.value} type="button" className={index === photoIndex ? "is-active" : ""} onClick={() => setPhotoIndex(index)} aria-label={`Показать фото ${index + 1}`} aria-pressed={index === photoIndex}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={photo.value} alt="" loading="lazy" /></button>)}</div></div>
      </div>
    </dialog>}
  </>;
}
