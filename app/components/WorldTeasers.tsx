import { worldPosts, worldCover, worldDate, worldPostHref } from "@/lib/world-posts";

export function WorldTeasers() {
  return <section className="wrap section world-teasers"><div className="sec-head"><div><p className="eyebrow">Истории из разных стран</p><h2>Sanremo в мире</h2></div><p className="lead">Кофейни, обжарки и шоурумы с машинами Sanremo: фото и видео из канала SanremoFamily.</p></div>
    <div className="world-teasers-grid">{worldPosts.slice(0,3).map((post)=><article key={post.id}><a className="world-teaser-image" href={worldPostHref(post)}>{worldCover(post)?<img src={worldCover(post)!} alt="" loading="lazy"/>:<span>Sanremo</span>}</a><time dateTime={post.date}>{worldDate(post.date)}</time><h3><a href={worldPostHref(post)}>{post.title}</a></h3></article>)}</div>
    <div className="world-teasers-actions"><a className="btn" href="/about/world/">Все истории</a><a href="https://t.me/sanremofamily" target="_blank" rel="noopener noreferrer">Подписаться на SanremoFamily</a></div>
  </section>;
}
