import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs } from "../../components/Bits";
import { detailedCases } from "@/lib/cases";
import { absoluteUrl, articleSchema, jsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return detailedCases.map((entry) => ({ slug: entry.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = detailedCases.find((item) => item.slug === slug);
  if (!entry) return {};
  return { title: `${entry.name.value} — ${entry.city.value}: Sanremo за стойкой`, description: entry.summary.value, openGraph: { images: [entry.photos[0].value] } };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const entry = detailedCases.find((item) => item.slug === slug);
  if (!entry) notFound();
  const title = `${entry.name.value} — ${entry.city.value}`;
  const schema = { ...articleSchema(title, entry.summary.value, `/cases/${slug}/`), image: entry.photos.map((photo) => absoluteUrl(photo.value)), about: entry.model ? { "@type": "Product", name: `Sanremo ${entry.model.value}` } : undefined };
  return <><Header active="/cases" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/cases/", label: "Кейсы" }, { label: entry.name.value }]} />
    <main>
      <article className="wrap case-story">
        <header className="case-story-head"><div><p className="eyebrow">{entry.format.value} · {entry.city.value}</p><h1>{title}</h1><p className="lead">{entry.summary.value}</p></div>
          <div className="case-story-facts"><div><span>Адрес</span><b>{entry.address?.value ?? entry.city.value}</b></div>{entry.model && <div><span>Кофемашина</span><b><a href={`/products/${entry.model.family}/`}>Sanremo {entry.model.value}</a></b></div>}{entry.groups && <div><span>Группы</span><b>{entry.groups.value}</b></div>}{entry.baristas && <div><span>Бариста за стойкой</span><b>{entry.baristas.value}</b></div>}{entry.networkSize && <div><span>Сеть</span><b>{entry.networkSize.value}</b></div>}</div>
        </header>
        <figure className="case-story-hero">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={entry.photos[0].value} alt={`${entry.name.value} — общий вид кофейной стойки`} /></figure>
        <div className="case-story-body">{entry.story?.map((paragraph, index) => <p key={index}>{paragraph.value}</p>)}
          {entry.quote && <blockquote>«{entry.quote.value}»</blockquote>}
          {entry.model && <p>Характеристики и доступные версии — на странице <a href={`/products/${entry.model.family}/`}>Sanremo {entry.model.value}</a>.</p>}
        </div>
        <div className="case-gallery" aria-label="Фотографии проекта">{entry.photos.slice(1).map((photo, index) => <figure key={photo.value}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={photo.value} alt={`${entry.name.value} — фото ${index + 2}`} loading="lazy" /></figure>)}</div>
        <p className="case-back"><a className="btn" href="/cases/">Все проекты</a></p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </main><Footer /></>;
}
