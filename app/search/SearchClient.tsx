"use client";

import { useEffect, useMemo, useState } from "react";

type SearchItem = { title: string; kind: string; href: string; image: string | null; terms: string; summary: string };
const normalize = (value: string) => value.toLocaleLowerCase("ru-RU").replace(/[‐‑‒–—-]/g, "").replace(/\s+/g, " ").trim();
export default function SearchClient({ items }: { items: SearchItem[] }) {
  const [query,setQuery]=useState("");
  useEffect(()=>{setQuery(new URLSearchParams(window.location.search).get("q")??"");},[]);
  const found=useMemo(()=>{
    const needle=normalize(query); if(!needle)return [];
    return items.filter((item)=>normalize(item.terms).includes(needle)||normalize(item.title).includes(needle));
  },[items,query]);
  const update=(value:string)=>{setQuery(value);const params=new URLSearchParams(window.location.search);if(value.trim())params.set("q",value);else params.delete("q");window.history.replaceState(null,"",`${window.location.pathname}${params.size?`?${params}`:""}`);};
  return <><label className="field site-search-input"><span>Поиск по сайту</span><input type="search" value={query} onChange={(event)=>update(event.target.value)} placeholder="X-One, D8, кофемолка…" autoComplete="off" /></label>
    {query.trim() ? <p className="small" role="status">Найдено: {found.length}</p> : <p className="small">Попробуйте: <button type="button" onClick={()=>update("X-One")}>X-One</button>, <button type="button" onClick={()=>update("кофемолка")}>кофемолка</button>, <button type="button" onClick={()=>update("D8")}>D8</button>.</p>}
    {found.length ? <div className="site-search-results">{found.map((item)=><a href={item.href} key={item.href}>{item.image?<img src={item.image} alt="" />:null}<span><small>{item.kind}</small><strong>{item.title}</strong><em>{item.summary}</em></span></a>)}</div> : query.trim() ? <div className="empty"><h2>Совпадений нет</h2><p>Попробуйте другое название или откройте каталог.</p><a className="btn" href="/products/">Каталог Sanremo</a></div> : null}
  </>;
}
