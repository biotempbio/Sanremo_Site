"use client";

import { useState } from "react";

export default function WorldVideo({ id, poster, title }: { id: number; poster: string | null; title: string }) {
  const [open, setOpen] = useState(false);
  return <section className="world-article-video"><h2>Видео из публикации</h2>
    {open ? <div className="world-telegram-player"><iframe title={`Видео: ${title}`} src={`https://t.me/sanremofamily/${id}?embed=1`} loading="lazy" allow="fullscreen" referrerPolicy="no-referrer" /></div>
      : <button className="world-video-preview" type="button" onClick={() => setOpen(true)} aria-label={`Открыть видео: ${title}`}>{poster ? <img src={poster} alt="" /> : null}<span>Смотреть видео</span></button>}
    <p className="small">Если плеер Telegram не откроется, <a href={`https://t.me/sanremofamily/${id}`} target="_blank" rel="noopener noreferrer">посмотрите оригинальный пост</a>.</p>
  </section>;
}
