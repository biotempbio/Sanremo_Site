import type { ReactNode } from "react";
import { Header, Footer } from "@/app/components/Chrome";
import { Crumbs } from "@/app/components/Bits";
import { FaqBlock } from "@/app/components/GuideBlocks";
import { modelBySlug, money } from "@/lib/catalog";
import { editorialOffer } from "@/lib/editorial-offers";
import { stockSummary } from "@/lib/format";
import { articleSchema, jsonLd, type Question } from "@/lib/seo";
import { xOneHasPrice, xOnePriceFrom, xOneVariants, xOneStockLabel } from "@/lib/x-one";

export function GuideProductCard({ slug, groups = 2 }: { slug: string; groups?: number }) {
  if (slug === "x-one") {
    const stock = xOneVariants.reduce((sum, item) => sum + (item.stock ?? 0), 0);
    const status = xOneVariants.some((item) => item.stock === null)
      ? xOneStockLabel(xOneVariants[0]) : stockSummary(stock);
    return <a className="editorial-product-card" href="/products/x-one/">
      <img src="/photo/official/x-one.webp" alt="Кофемолка Sanremo X-One" loading="lazy" />
      <span className="editorial-product-copy"><small>Кофемолка Sanremo</small><strong>X-One</strong><span>{xOneHasPrice ? `от ${money(xOnePriceFrom)}` : "Цена по запросу"}</span><em>{status}</em><b>Открыть карточку →</b></span>
    </a>;
  }
  const offer = editorialOffer(slug, groups);
  if (!offer) return null;
  const { model, sku } = offer;
  return <a className="editorial-product-card" href={offer.href}>
    {offer.image && <img src={offer.image} alt={`Sanremo ${model.name} · ${groups} группы · ${sku.color ?? ""}`} loading="lazy" />}
    <span className="editorial-product-copy"><small>Кофемашина Sanremo</small><strong>{model.name}</strong><span>{groups === 1 ? "1 группа" : `${groups} группы`} · {sku.color}</span><span>{money(sku.rrp)}</span><em>{stockSummary(sku.free)}</em><b>Открыть карточку →</b></span>
  </a>;
}

export function GuideModelPrice({ slug, groups = 2 }: { slug: string; groups?: number }) {
  if (slug === "x-one") return <>{xOneHasPrice ? `от ${money(xOnePriceFrom)}` : "Цена по запросу"}</>;
  const offer = editorialOffer(slug, groups);
  return <>{offer ? `от ${money(offer.sku.rrp)}` : "Цена по запросу"}</>;
}

export function GuidePairPrice({ machineSlug }: { machineSlug: string }) {
  const offer = editorialOffer(machineSlug);
  return <>{offer && xOneHasPrice ? `от ${money(offer.sku.rrp + xOnePriceFrom)}` : "Цена по запросу"}</>;
}

export function EditorialGuide({ path, title, crumb, description, eyebrow, lead, quick, sections, aside, faq, related, children, modified, published }: {
  path: string; title: string; crumb: string; description: string; eyebrow: string; lead: ReactNode;
  quick: { lead: string; text: string }[]; sections: { id: string; label: string }[];
  aside: { slug: string; heading: string; text: string }; faq: Question[];
  related: { href: string; label: string }[]; children: ReactNode; modified?: string; published?: string;
}) {
  const featured = editorialOffer(aside.slug);
  return <><Header active="/guide/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/guide/", label: "Как выбрать" }, { label: crumb }]} />
    <main className="wrap editorial-guide"><header className="editorial-guide-head"><div className="editorial-guide-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lead">{lead}</p>
      <div className="editorial-quick"><h2>Коротко</h2><ul>{quick.map((item) => <li key={item.lead}><strong>{item.lead}</strong> — {item.text}</li>)}</ul></div></div>
      <div className="editorial-guide-photo">{(aside.slug === "x-one" || featured?.image) && <img src={aside.slug === "x-one" ? "/photo/official/x-one.webp" : featured!.image!} alt={aside.slug === "x-one" ? "Кофемолка Sanremo X-One" : `Кофемашина Sanremo ${modelBySlug(aside.slug)?.name ?? ""} · 2 группы`} />}</div>
    </header>
    <div className="editorial-guide-layout"><article className="editorial-guide-body prose"><nav className="editorial-toc" aria-label="Содержание статьи"><strong>В этой статье</strong><ol>{sections.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ol></nav>
      {children}
      <FaqBlock questions={faq} />
      <section className="editorial-related"><h2>Читайте также</h2><div>{related.map((item) => <a key={item.href} href={item.href}>{item.label} →</a>)}</div></section>
    </article><aside className="editorial-guide-aside"><p className="eyebrow">Связано с темой</p><h2>{aside.heading}</h2><p>{aside.text}</p><GuideProductCard slug={aside.slug} /><a className="btn" href="/choose/">Подобрать по задаче</a></aside></div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema(title, description, path, modified ? { modified, published } : undefined)) }} />
    </main><Footer /></>;
}
