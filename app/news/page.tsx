import type { Metadata } from "next";
import Image from "next/image";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { newsDate, newsPosts } from "@/lib/news";

export const metadata: Metadata = {
  title: "Новости Sanremo: модели, события и люди кофе",
  description: "Новости Sanremo в России: выход моделей Zoe и D8, выставки, кофейные чемпионаты и люди профессиональной кофейной индустрии.",
};

export default function NewsPage() {
  const [first, ...rest] = newsPosts;
  return <><Header /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Новости" }]} />
    <main className="wrap section news-index">
      <header className="news-index-head"><p className="eyebrow">Sanremo / события и люди</p><h1>Новости Sanremo</h1><p>Модели, кофейные чемпионаты, встречи и события бренда.</p></header>
      <a className="news-feature" href={`/news/${first.slug}/`}>
        <span className="news-feature-visual"><Image src={first.images[0].src} width={first.images[0].width} height={first.images[0].height} alt={first.images[0].alt} unoptimized /></span>
        <span className="news-feature-copy"><time dateTime={first.publishedAt}>{newsDate(first.publishedAt)}</time><strong>{first.title}</strong><span>{first.description || first.paragraphs[0]}</span><span className="news-read">Читать материал →</span></span>
      </a>
      <div className="news-index-list">{rest.map((post) => <a className="news-list-item" key={post.slug} href={`/news/${post.slug}/`}>
        <span className="news-list-image"><Image src={post.images[0].src} width={post.images[0].width} height={post.images[0].height} alt={post.images[0].alt} unoptimized /></span>
        <span className="news-list-copy"><time dateTime={post.publishedAt}>{newsDate(post.publishedAt)}</time><strong>{post.title}</strong><span>{post.description || post.paragraphs[0]}</span><span className="news-read">Читать материал →</span></span>
      </a>)}</div>
    </main><Footer /></>;
}
