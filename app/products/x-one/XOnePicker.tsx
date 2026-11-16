"use client";

import { useEffect, useState } from "react";
import { LeadForm } from "@/app/components/LeadForm";
import { formatPrice } from "@/lib/format";
import type { XOneVariant, XOneColor } from "@/lib/x-one";

function availability(variant: XOneVariant) {
  if (variant.stock !== null) return variant.stock >= 3 ? `На складе в Москве: ${variant.stock} шт.` : variant.stock > 0 ? "Мало на складе, уточните наличие" : "Под заказ";
  return variant.availability === "on_order" ? "Под заказ" : "В наличии, уточните количество";
}
export default function XOnePicker({ variants }: { variants: XOneVariant[] }) {
  const [color, setColor] = useState<XOneColor>("Nero");
  useEffect(() => { const requested=new URLSearchParams(window.location.search).get("color"); if(requested?.toLowerCase()==="white")setColor("White"); }, []);
  const current=variants.find((item)=>item.color===color)??variants[0];
  const choose=(next:XOneColor)=>{setColor(next);const params=new URLSearchParams(window.location.search);params.set("color",next.toLowerCase());window.history.replaceState(null,"",`${window.location.pathname}?${params}`);};
  return <>
    <section className="bg-gray"><div className="wrap section xone-product-grid">
      <div className="xone-product-visual">{color==="Nero" ? <img src="/photo/official/x-one.webp" alt="Кофемолка Sanremo X-One Nero" /> : <div className="xone-white-photo"><span aria-hidden="true"/><p>White</p><small>Фото белого исполнения уточняем</small></div>}</div>
      <div className="xone-product-choice"><p className="eyebrow">Кофемолка Sanremo</p><h2>Выберите цвет</h2><div className="xone-color-buttons" role="group" aria-label="Цвет кофемолки">{variants.map((variant)=><button key={variant.color} type="button" aria-pressed={color===variant.color} onClick={()=>choose(variant.color)}><i className={variant.color==="Nero"?"xone-swatch nero":"xone-swatch white"} aria-hidden="true"/>{variant.color}</button>)}</div>
        <div className="xone-choice-price"><p>{current.price ? `Цена: ${formatPrice(current.price)}` : "Цена по запросу"}</p><span className={`dot st-${current.availability}`} aria-hidden="true"/><span>{availability(current)}</span></div>
        <p className="small">Для точного заказа укажите выбранный цвет и количество. Наличие подтвердит менеджер.</p><a className="btn btn-solid" href="#xone-request">Запросить X-One {color}</a>
      </div>
    </div></section>
    <section className="bg-gray" id="xone-request"><div className="wrap section"><div className="sec-head"><div><p className="eyebrow">Запрос поставки</p><h2>Уточнить наличие X-One {color}</h2></div><p className="lead">Оставьте контакты — менеджер подтвердит цену, наличие и условия поставки выбранного цвета.</p></div><LeadForm form="contacts" className="grid g2" style={{maxWidth:820}}><input type="hidden" name="model" value={`X-One ${color}`}/><label className="field"><span>Имя</span><input name="name" placeholder="Как к вам обращаться" required/></label><label className="field"><span>Телефон или e-mail</span><input name="contact" placeholder="Для ответа" required/></label><label className="field" style={{gridColumn:"1 / -1"}}><span>Задача</span><textarea key={color} name="task" defaultValue={`Интересует кофемолка Sanremo X-One ${color}`}/></label><label className="small" style={{gridColumn:"1 / -1",display:"flex",gap:10,alignItems:"flex-start"}}><input name="consent" value="yes" type="checkbox" style={{width:18,minHeight:18,marginTop:3}} required/><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label></LeadForm></div></section>
  </>;
}
