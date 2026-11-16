import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/app/components/Chrome";
import { Crumbs } from "@/app/components/Bits";
import { worldPosts, worldDate, worldPostHref } from "@/lib/world-posts";
import WorldGallery from "../WorldGallery";
import WorldVideo from "../WorldVideo";
import { SITE_URL } from "@/lib/seo";

const models: { pattern: RegExp; href: string }[] = [
  { pattern: /(Café Racer|Cafe Racer)/gi, href: "/products/cafe-racer/" },
  { pattern: /\bD8(?: PRO)?\b/gi, href: "/products/d8/" },
  { pattern: /\bZoe\b/gi, href: "/products/zoe/" },
  { pattern: /\bOpera(?: 2\.0)?\b/gi, href: "/products/opera/" },
  { pattern: /\bYOU\b/gi, href: "/products/you/" },
  { pattern: /\bX-One\b/gi, href: "/products/x-one/" },
];
function linkedText(text: string) {
  const segments: (string | { text: string; href: string })[] = [text];
  for (const model of models) {
    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i]; if (typeof segment !== "string") continue;
      const parts: typeof segments = []; let last = 0;
      for (const match of segment.matchAll(model.pattern)) {
        if (match.index > last) parts.push(segment.slice(last, match.index));
        parts.push({ text: match[0], href: model.href }); last = match.index + match[0].length;
      }
      if (!parts.length) continue;
      if (last < segment.length) parts.push(segment.slice(last));
      segments.splice(i, 1, ...parts);
    }
  }
  return segments.map((piece, index) => typeof piece === "string" ? piece : <a href={piece.href} key={index}>{piece.text}</a>);
}
export function generateStaticParams() { return worldPosts.map((post) => ({slug:post.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug}=await params; const post=worldPosts.find((entry)=>entry.slug===slug);
  return post ? {title:`${post.title} | Sanremo в мире`,description:`${post.title}. ${post.country ? `${post.country}. `:""}Фото и видео проекта Sanremo, источник — SanremoFamily.`} : {};
}
export default async function WorldPostPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const post=worldPosts.find((entry)=>entry.slug===slug); if(!post) notFound();
  const schema={"@context":"https://schema.org","@type":"BlogPosting",headline:post.title,datePublished:post.date,dateModified:post.date,author:{"@type":"Organization",name:"SanremoFamily"},publisher:{"@type":"Organization",name:"BIO"},mainEntityOfPage:`${SITE_URL}${worldPostHref(post)}`,image:post.images.length?post.images.map((src)=>`${SITE_URL}${src}`):post.poster?`${SITE_URL}${post.poster}`:undefined};
  return <><Header active="/about" /><Crumbs items={[{href:"/",label:"Главная"},{href:"/about/",label:"О Sanremo"},{href:"/about/world/",label:"Sanremo в мире"},{label:post.title}]} />
    <main className="world-article wrap section-tight"><header><p className="eyebrow">{worldDate(post.date)}{post.country?` · ${post.city?`${post.city}, `:""}${post.country}`:""}</p><h1>{post.title}</h1></header>
      {post.images.length ? <WorldGallery images={post.images} title={post.title} /> : post.poster ? <figure className="world-article-hero"><img src={post.poster} alt={post.title} /><figcaption>Видео доступно ниже</figcaption></figure> : null}
      <div className="world-article-body">{post.text.split("\n").filter(Boolean).map((paragraph,index)=><p key={index}>{linkedText(paragraph)}</p>)}</div>
      {post.video ? <WorldVideo id={post.id} poster={post.poster} title={post.title} src={post.videoSrc} /> : null}
      <div className="world-article-end"><a href={post.source} target="_blank" rel="noopener noreferrer">Пост в Telegram</a><a href="/about/world/">Все истории Sanremo в мире</a></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    </main><Footer /></>;
}
