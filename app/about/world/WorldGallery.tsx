"use client";

import { useEffect, useRef, useState } from "react";

export default function WorldGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const start = useRef<{x:number;y:number}|null>(null);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const el=dialog.current; const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden"; el.showModal();
    const key=(event:KeyboardEvent)=>{if(event.key==="ArrowRight")setIndex((value)=>(value+1)%images.length);if(event.key==="ArrowLeft")setIndex((value)=>(value-1+images.length)%images.length);};
    window.addEventListener("keydown",key);
    return ()=>{el.close();document.body.style.overflow=overflow;window.removeEventListener("keydown",key);};
  },[open,images.length]);
  if (!images.length) return null;
  const move=(direction:number)=>setIndex((value)=>(value+direction+images.length)%images.length);
  return <>
    <figure className="world-article-hero"><button type="button" onClick={()=>{setIndex(0);setOpen(true);}} aria-label={`Открыть галерею: ${title}`}><img src={images[0]} alt={title} /></button><figcaption>{images.length} фото · нажмите, чтобы листать</figcaption></figure>
    {images.length>1?<div className="world-article-gallery">{images.slice(1).map((src,i)=><button type="button" key={src} onClick={()=>{setIndex(i+1);setOpen(true);}} aria-label={`Открыть фото ${i+2}`}><img src={src} alt="" loading="lazy" /></button>)}</div>:null}
    {open?<dialog ref={dialog} className="case-lightbox" aria-label={`Фотографии: ${title}`} onCancel={()=>setOpen(false)}>
      <div className="case-lightbox-backdrop" aria-hidden="true" onClick={()=>setOpen(false)} style={{backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)"}} />
      <div className="case-lightbox-panel"><button className="case-lightbox-close" onClick={()=>setOpen(false)} aria-label="Закрыть галерею">×</button>
        <div className="case-lightbox-stage" onTouchStart={e=>{const p=e.touches[0];start.current=p?{x:p.clientX,y:p.clientY}:null;}} onTouchEnd={e=>{const p=e.changedTouches[0];if(!p||!start.current)return;const dx=p.clientX-start.current.x,dy=p.clientY-start.current.y;if(dy>85&&dy>Math.abs(dx)*1.25)setOpen(false);else if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);start.current=null;}}>
          <button className="case-lightbox-side case-lightbox-prev" onClick={()=>move(-1)} aria-label="Предыдущее фото">←</button><img className="case-lightbox-image" src={images[index]} alt={`${title} — фото ${index+1} из ${images.length}`} /><button className="case-lightbox-side case-lightbox-next" onClick={()=>move(1)} aria-label="Следующее фото">→</button>
        </div>
        <div className="case-lightbox-caption"><b>{title}</b><span aria-live="polite">{index+1} из {images.length}</span></div>
        <div className="case-lightbox-bottom"><div className="case-lightbox-actions"><button onClick={()=>move(-1)} aria-label="Предыдущее фото">←</button><button onClick={()=>move(1)} aria-label="Следующее фото">→</button></div><div className="case-lightbox-thumbs">{images.map((src,i)=><button key={src} onClick={()=>setIndex(i)} aria-label={`Показать фото ${i+1}`} aria-pressed={i===index} className={i===index?"is-active":""}><img src={src} alt="" /></button>)}</div></div>
      </div>
    </dialog>:null}
  </>;
}
