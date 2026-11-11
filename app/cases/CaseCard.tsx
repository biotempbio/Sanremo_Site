import { caseHref, type SanremoCase } from "@/lib/cases";

export function CaseCard({ entry, compact = false }: { entry: SanremoCase; compact?: boolean }) {
  const href = caseHref(entry);
  const image = /* eslint-disable-next-line @next/next/no-img-element */
    <img src={entry.photos[0].value} alt={`${entry.name.value} — кофейное пространство`} loading="lazy" />;
  return <article className={`case-card${compact ? " case-card-compact" : ""}`} id={entry.slug}>
    {entry.page || compact ? <a className="case-card-photo" href={href} aria-label={`Смотреть ${entry.name.value}`}>{image}</a> : <div className="case-card-photo">{image}</div>}
    <div className="case-card-copy">
      <p className="eyebrow">{entry.city.value} · {entry.format.value}</p>
      <h3>{entry.page || compact ? <a href={href}>{entry.name.value}</a> : entry.name.value}</h3>
      {!compact && entry.address && <p className="case-card-location">{entry.address.value}</p>}
      {!compact && <p className="small">{entry.summary.value}</p>}
      {(entry.model || entry.page || compact) && <div className="case-card-foot">
        {entry.model && <a href={`/products/${entry.model.family}/`}>Sanremo {entry.model.value}{entry.groups ? ` · ${entry.groups.value} гр.` : ""}</a>}
        {(entry.page || compact) && <a className="link-arrow" href={href}>{entry.page ? "Смотреть историю" : "Все проекты"}</a>}
      </div>}
    </div>
  </article>;
}
