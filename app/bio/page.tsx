import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";

export const metadata: Metadata = { title: "Компания BIO — дистрибьютор Sanremo", description: "Роль компании BIO в официальной дистрибуции Sanremo в России." };

export default function BioPage(){return <><Header/><Crumbs items={[{href:"/",label:"Главная"},{label:"Компания BIO"}]}/><main>
  <section className="section wrap"><div className="sec-head"><div><p className="eyebrow">Российский контур бренда</p><h1 style={{fontSize:"clamp(34px,4vw,62px)"}}>Компания BIO</h1></div><p className="lead">Официальный дистрибьютор Sanremo в России: ассортимент, рекомендованные цены, складская программа, дилерская сеть, обучение, сервис и запчасти.</p></div>
    <div className="grid g3">{[["Каталог и склад","Единая российская матрица моделей и конфигураций с РРЦ и доступностью."],["Дилерская сеть","Продажа, подготовка площадки, монтаж и запуск через партнёров в регионах."],["Сервис и ЗИП","Маршрутизация обращений, техническая документация и подбор совместимых деталей."]].map(([a,b])=><div className="card" key={a}><div className="card-body"><h3>{a}</h3><p className="small">{b}</p></div></div>)}</div>
    <div style={{marginTop:30,display:"flex",gap:12,flexWrap:"wrap"}}><a className="btn btn-solid" href="/contacts">Связаться с BIO</a><a className="btn" href="/dealers">Найти дилера</a></div>
  </section></main><Footer/></>}
