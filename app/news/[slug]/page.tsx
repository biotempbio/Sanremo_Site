import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs } from "../../components/Bits";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { newsBySlug, newsDate, newsPosts, relatedModel } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return newsPosts.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = newsBySlug((await params).slug);
  if (!post) return {};
  return { title: `${post.title} — новости Sanremo`, description: post.description || post.paragraphs[0]?.slice(0, 155), openGraph: { images: [post.images[0].src], type: "article", publishedTime: post.publishedAt } };
}

export default async function NewsArticlePage({ params }: Props) {
  const post = newsBySlug((await params).slug);
  if (!post) notFound();
  const model = relatedModel(post);
  const path = `/news/${post.slug}/`;
  const schema = {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.description || post.paragraphs[0],
    image: post.images.map((image) => absoluteUrl(image.src)),
    datePublished: post.publishedAt, dateModified: post.publishedAt,
    mainEntityOfPage: absoluteUrl(path), inLanguage: "ru-RU",
    author: { "@type": "Organization", name: "Sanremo Coffee Machines" },
    publisher: { "@type": "Organization", name: "BIO", url: absoluteUrl("/"), logo: absoluteUrl("/favicon-120.png") },
  };
  return <><Header /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/news/", label: "Новости" }, { label: post.title }]} />
    <main className="wrap section news-article">
      <header className="news-article-head"><p className="eyebrow">Sanremo / новости</p><time dateTime={post.publishedAt}>{newsDate(post.publishedAt)}</time><h1>{post.title}</h1></header>
      <figure className="news-article-hero"><Image src={post.images[0].src} width={post.images[0].width} height={post.images[0].height} alt={post.images[0].alt} unoptimized /></figure>
      <article className="news-article-copy">{post.paragraphs.map((paragraph, index) => {
        const sectionHeading = paragraph === paragraph.toUpperCase() && paragraph.length < 75 && index > 0 && /[А-ЯЁ]/.test(paragraph);
        return sectionHeading ? <h2 key={index}>{paragraph}</h2> : <p key={index} className={index === 0 ? "news-article-lead" : undefined}>{paragraph}</p>;
      })}
      {model && <p className="news-article-model">Модель в каталоге: <a href={model.href}>{model.label}</a></p>}
      <a className="news-all-link" href="/news/">Все новости Sanremo</a>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </main><Footer /></>;
}
