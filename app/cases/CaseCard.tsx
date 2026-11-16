import { caseHref, type SanremoCase } from "@/lib/cases";
import { CardAction } from "@/app/components/ActionArrow";

export function CaseCard({ entry, compact = false, onOpenGallery }: { entry: SanremoCase; compact?: boolean; onOpenGallery?: (entry: SanremoCase) => void }) {
  const href = caseHref(entry);
  const telegramPost = /^telegram-(\d+)$/.exec(entry.summary.source)?.[1];
  const image = /* eslint-disable-next-line @next/next/no-img-element */
    <img src={entry.cover} alt={`${entry.name.value} — кофейное пространство`} loading="lazy" />;
  return <article className={`case-card${compact ? " case-card-compact" : ""}`} id={entry.slug}>
    {onOpenGallery ? <button type="button" className="case-card-photo case-card-photo-button" onClick={() => onOpenGallery(entry)} aria-label={`Смотреть фотографии ${entry.name.value}, ${entry.photos.length}`}>{image}</button>
      : entry.page || compact ? <a className="case-card-photo" href={href} aria-label={`Смотреть ${entry.name.value}`}>{image}</a> : <div className="case-card-photo">{image}</div>}
    <div className="case-card-copy">
      <p className="eyebrow">{entry.city.value} · {entry.format.value}</p>
      <h3>{entry.page || compact ? <a href={href}>{entry.name.value}</a> : entry.name.value}</h3>
      {!compact && entry.address && <p className="case-card-location">{entry.address.value}</p>}
      {!compact && <p className="small">{entry.summary.value}</p>}
      {(entry.model || entry.page || compact || onOpenGallery) && <div className="case-card-foot">
        {entry.model && <a href={`/products/${entry.model.family}/`}>Sanremo {entry.model.value}{entry.groups ? ` · ${entry.groups.value} гр.` : ""}</a>}
        {onOpenGallery && <button type="button" className="case-card-gallery-link" onClick={() => onOpenGallery(entry)}>Смотреть фото · {entry.photos.length}</button>}
        {!compact && telegramPost && <a href={`https://t.me/sanremofamily/${telegramPost}`} target="_blank" rel="noopener noreferrer"><CardAction>Пост в Telegram</CardAction></a>}
        {(entry.page || compact) && <a className="link-arrow" href={href}><CardAction>{entry.page ? "Смотреть историю" : "Все проекты"}</CardAction></a>}
      </div>}
    </div>
  </article>;
}
