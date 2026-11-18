import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { Header, Footer } from "@/app/components/Chrome";
import { Crumbs } from "@/app/components/Bits";
import { CATALOG_LINEUP, catalogModels, modelPath } from "@/lib/catalog";
import SearchClient from "./SearchClient";

export const metadata: Metadata = pageMetadata("/search/", {title:"Поиск по сайту Sanremo",description:"Найдите кофемашину, кофемолку или раздел сайта Sanremo по названию и характеристикам.",robots:{index:false,follow:true}});
const rows = [
  {title:"Кофемолка Sanremo X-One",kind:"Кофемолка",href:"/products/x-one/",image:"/photo/official/x-one.webp",terms:"x1 x-one xone x one кофемолка кофемолки nero white белая чёрная санремо sanremo три бункера взвешивание зерна",summary:"Три бункера для трёх сортов зерна; Nero и White, цена и наличие."},
  ...CATALOG_LINEUP.flatMap((line)=>{const model=catalogModels.find((m)=>m.slug===line.slug);return model?[{title:`Sanremo ${line.label}`,kind:"Кофемашина",href:modelPath(model),image:line.image,terms:`${line.label} ${model.name} кофемашина sanremo санремо`,summary:"Исполнения, характеристики, цена и наличие."}]:[];}),
  {title:"Кофемолки Sanremo",kind:"Раздел",href:"/products/grinders/",image:"/photo/official/x-one.webp",terms:"кофемолка кофемолки xone x-one x1 grinder",summary:"Раздел кофемолок Sanremo."},
];
export default function SearchPage(){return <><Header/><Crumbs items={[{href:"/",label:"Главная"},{label:"Поиск"}]}/><main className="wrap section-tight"><header className="site-search-header"><p className="eyebrow">Каталог и разделы</p><h1>Поиск по сайту</h1></header><SearchClient items={rows}/></main><Footer/></>}
