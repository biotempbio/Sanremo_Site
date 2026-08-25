import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";

export const metadata: Metadata = { title: "Новости Sanremo в России", description: "Продуктовые обновления, обучение и события Sanremo в России." };

const ITEMS=[
  ["Продукты","D8 и D8 PRO в российской продуктовой матрице","Конфигурации, РРЦ и наличие опубликованы в каталоге и доступны для сравнения."],
  ["Обучение","Подготовка команды перед запуском","Чек-листы площадки, базовые регламенты и маршруты сервисной поддержки собраны в разделе сервиса."],
  ["Дилерская сеть","Продажа и запуск в регионах","На карте дилеров доступны подтверждённые города и контакты партнёров."],
];
export default function NewsPage(){return <><Header/><Crumbs items={[{href:"/",label:"Главная"},{label:"Новости"}]}/><main><section className="section wrap"><div className="sec-head"><div><p className="eyebrow">Sanremo Россия</p><h1 style={{fontSize:"clamp(34px,4vw,62px)"}}>Новости и обновления</h1></div><p className="lead">Продукты, обучение, события и развитие российской дилерской сети.</p></div><div className="grid g3">{ITEMS.map(([tag,title,text])=><article className="card" key={title}><div className="card-body"><span className="tag" style={{alignSelf:"flex-start"}}>{tag}</span><h3>{title}</h3><p className="small">{text}</p></div></article>)}</div></section></main><Footer/></>}
