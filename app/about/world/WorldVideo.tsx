"use client";

import { useState } from "react";

export default function WorldVideo({ id, poster, title, src }: { id: number; poster: string | null; title: string; src?: string | null }) {
  const [open, setOpen] = useState(false);
  const [portrait, setPortrait] = useState(false);
  return <section className="world-article-video"><h2>Видео из публикации</h2>
    {src ? <video className={`world-local-video${portrait ? " world-local-video-portrait" : ""}`} controls preload="metadata" playsInline poster={poster ?? undefined} aria-label={`Видео: ${title}`} src={src} onLoadedMetadata={(event) => setPortrait(event.currentTarget.videoHeight > event.currentTarget.videoWidth)} /> : open ? <div className="world-telegram-player"><iframe title={`Видео: ${title}`} src={`https://t.me/sanremofamily/${id}?embed=1`} loading="lazy" allow="fullscreen" referrerPolicy="no-referrer" /></div>
      : <button className="world-video-preview" type="button" onClick={() => setOpen(true)} aria-label={`Открыть видео: ${title}`}>{poster ? <img src={poster} alt={title} /> : null}<span>Смотреть видео</span></button>}
    <p className="small">{src ? "Если видео не воспроизводится, " : "Если плеер Telegram не откроется, "}<a href={`https://t.me/sanremofamily/${id}`} target="_blank" rel="noopener noreferrer">посмотрите оригинальный пост</a>.</p>
  </section>;
}
