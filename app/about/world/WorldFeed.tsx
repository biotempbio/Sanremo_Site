"use client";

import { useEffect, useMemo, useState } from "react";
import type { WorldPost } from "@/lib/world-posts";
import { worldCover, worldDate, worldPostHref } from "@/lib/world-posts";
import { CardAction } from "@/app/components/ActionArrow";

export default function WorldFeed({ posts }: { posts: WorldPost[] }) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCountry(params.get("country") ?? "");
    setCity(params.get("city") ?? "");
  }, []);
  const countries = useMemo(() => [...new Set(posts.map((p) => p.country).filter((s): s is string => Boolean(s)))].sort((a, b) => a.localeCompare(b, "ru")), [posts]);
  const cities = useMemo(() => [...new Set(posts.filter((p) => !country || p.country === country).map((p) => p.city).filter((s): s is string => Boolean(s)))].sort((a, b) => a.localeCompare(b, "ru")), [posts, country]);
  const filtered = posts.filter((post) => (!country || post.country === country) && (!city || post.city === city));
  const choose = (next: string) => {
    setCountry(next);
    setCity("");
    const params = new URLSearchParams(window.location.search);
    if (next) params.set("country", next); else params.delete("country");
    params.delete("city");
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
  };
  const chooseCity = (next: string) => {
    setCity(next);
    const params = new URLSearchParams(window.location.search);
    if (next) params.set("city", next); else params.delete("city");
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
  };
  return <>
    <div className="world-filters" role="group" aria-label="Фильтры публикаций"><button type="button" aria-pressed={!country} onClick={() => choose("")}>Все страны</button>{countries.map((name) => <button type="button" key={name} aria-pressed={country === name} onClick={() => choose(name)}>{name}</button>)}{cities.length > 0 ? <label>Город<select value={city} onChange={(event) => chooseCity(event.target.value)}><option value="">Все города</option>{cities.map((name) => <option key={name} value={name}>{name}</option>)}</select></label> : null}</div>
    <div className="world-grid">{filtered.map((post) => <a className="world-card" href={worldPostHref(post)} key={post.id}>
      <span className="world-card-image">{worldCover(post) ? <img src={worldCover(post)!} alt="" loading="lazy" /> : <span>Sanremo</span>}{post.video ? <span className="world-video-mark">Видео</span> : null}</span>
      <span className="world-card-copy"><span className="world-card-date">{worldDate(post.date)}{post.country ? ` · ${post.city ? `${post.city}, ` : ""}${post.country}` : ""}</span><strong className="world-card-title">{post.title}</strong><CardAction>Читать</CardAction></span>
    </a>)}</div>
    {!filtered.length ? <p className="world-empty">Для этой страны публикаций пока нет. <button type="button" onClick={() => choose("")}>Показать все</button></p> : null}
  </>;
}
