import type { Metadata } from "next";
import { Header, Footer } from "@/app/components/Chrome";
import { Crumbs } from "@/app/components/Bits";
import { worldPosts } from "@/lib/world-posts";
import WorldFeed from "./WorldFeed";

export const metadata: Metadata = {
  title: "Sanremo в мире — проекты и истории | Sanremo",
  description: "Кофейни, обжарки и шоурумы Sanremo в разных странах. Фото, видео и истории из открытого канала SanremoFamily со ссылками на оригинальные публикации.",
};

export default function WorldPage() {
  return <><Header active="/about" /><Crumbs items={[{href:"/",label:"Главная"},{href:"/about/",label:"О Sanremo"},{label:"Sanremo в мире"}]} />
    <main className="world-page wrap section-tight"><header className="world-intro"><p className="eyebrow">Проекты и истории</p><h1>Sanremo в мире</h1><p className="lead">Кофейни, обжарки и шоурумы, где работают машины Sanremo. Фотографии и видео из канала SanremoFamily.</p></header><WorldFeed posts={worldPosts} /></main><Footer /></>;
}
