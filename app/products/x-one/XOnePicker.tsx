"use client";

import { useEffect, useRef, useState } from "react";
import { LeadForm } from "@/app/components/LeadForm";
import { formatPrice } from "@/lib/format";
import { X_ONE_SHORT_DESCRIPTION, X_ONE_SPEC_GROUPS, xOneStockLabel } from "@/lib/x-one";
import type { XOneColor, XOneEntry, XOneVariant } from "@/lib/x-one";

function Icon({ kind }: { kind: "beans" | "weight" | "burr" | "recipes" }) {
  const paths = {
    beans: <><path d="M3 8h8l2 12H5L3 8Zm10 0h8l-2 12h-8M5 4h6m4 0h6" /></>,
    weight: <><path d="M4 20h16L18 9H6L4 20Z" /><circle cx="12" cy="7" r="3" /><path d="m12 7 1.5-1" /></>,
    burr: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="m12 3 2 5m7 4-5 2m-4 7-2-5m-7-4 5-2" /></>,
    recipes: <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

const benefits = [
  { icon: "beans", title: "Три вида зерна", text: "Основной бленд, второй сорт и разовая порция на заказ — без пересыпания бункеров." },
  { icon: "weight", title: "Взвешивание до помола", text: "Кофемолка отмеряет зерно до жерновов; весы на рожке не нужны." },
  { icon: "burr", title: "Жернова с DLC", text: "Вертикальные плоские жернова 98 мм и настройка скорости для эспрессо и фильтра." },
  { icon: "recipes", title: "До 12 рецептов", text: "Сенсорный экран 4,3 дюйма сохраняет настройки для разных сортов зерна." },
] as const;

export default function XOnePicker({ variants, entries }: { variants: XOneVariant[]; entries: XOneEntry[] }) {
  const [color, setColor] = useState<XOneColor>("Nero");
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("color")?.toLowerCase() === "white") setColor("White");
    const hero = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    const form = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { rootMargin: "0px 0px 100px 0px" });
    if (heroRef.current) hero.observe(heroRef.current);
    if (formRef.current) form.observe(formRef.current);
    return () => { hero.disconnect(); form.disconnect(); };
  }, []);
  const current = variants.find((item) => item.color === color) ?? variants[0];
  const price = current.price ? formatPrice(current.price) : "Цена по запросу";
  const status = xOneStockLabel(current);
  const choose = (next: XOneColor) => {
    setColor(next);
    const params = new URLSearchParams(window.location.search); params.set("color", next.toLowerCase());
    window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
  };
  return <>
    <section className="wrap xone-detail-hero" id="xone-overview" ref={heroRef}>
      <div className="xone-detail-gallery" aria-label={`Кофемолка X-One ${color}`}>
        {color === "Nero" ? <img src="/photo/official/x-one.webp" alt="Кофемолка Sanremo X-One Nero" /> : <div className="xone-white-photo"><span aria-hidden="true" /><p>White</p><small>Фото белого исполнения уточняем</small></div>}
        <p className="xone-gallery-caption">Sanremo X-One · {color}</p>
      </div>
      <div className="xone-detail-summary">
        <p className="eyebrow">Профессиональная кофемолка Sanremo</p><h1>Кофемолка Sanremo <span style={{ whiteSpace: "nowrap" }}>X-One</span></h1>
        <p className="xone-detail-lead"><strong>Три бункера в одной кофемолке.</strong> Два основных по 1,2 кг для двух сортов эспрессо и фронтальный для третьего зерна — декафа, сезонного лота или фильтра.</p>
        <div className="xone-quick-facts" aria-label="Главные характеристики"><span><Icon kind="beans" />3 бункера</span><span><Icon kind="weight" />Взвешивание зерна</span><span><Icon kind="burr" />Жернова 98 мм</span><span><Icon kind="recipes" />12 рецептов</span></div>
        <div className="xone-detail-select"><h2>Цвет корпуса</h2><div className="xone-color-buttons" role="group" aria-label="Цвет кофемолки">{variants.map((variant) => <button key={variant.color} type="button" aria-pressed={color === variant.color} onClick={() => choose(variant.color)}><i className={variant.color === "Nero" ? "xone-swatch nero" : "xone-swatch white"} aria-hidden="true" />{variant.color}</button>)}</div></div>
        <div className="xone-detail-buy"><strong>{price}</strong><span>{status}</span></div>
        <div className="xone-detail-actions"><a className="btn btn-solid" href="#xone-request">Запросить цену и наличие</a><a className="btn" href="/choose/">Подобрать кофемашину</a></div>
      </div>
    </section>
    <nav className="xone-page-nav" aria-label="Разделы карточки X-One"><div className="wrap"><a href="#xone-overview">Обзор</a><a href="#xone-benefits">Преимущества</a><a href="#xone-specs">Характеристики</a><a href="#xone-availability">Наличие</a><a href="#xone-service">Сервис</a></div></nav>
    <section className="wrap section xone-benefits" id="xone-benefits"><p className="eyebrow">Почему X-One</p><h2>Три сорта зерна на одной рабочей станции</h2><div className="xone-benefit-grid">{benefits.map((item) => <article key={item.title}><Icon kind={item.icon} /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="wrap section xone-overview" aria-labelledby="xone-overview-heading"><div className="xone-overview-copy"><p className="eyebrow">Обзор</p><h2 id="xone-overview-heading">Один корпус для разных сортов</h2><p>X-One (X1) — профессиональная кофемолка для работы с разными сортами зерна. {X_ONE_SHORT_DESCRIPTION} Большинство профессиональных кофемолок работают с одним сортом, X-One — с тремя.</p><h3>Ключевое для работы</h3><ul><li><strong>Зерно по задаче.</strong> Два постоянных сорта и фронтальный бункер для разовой порции: декаф, сезонный лот или фильтр.</li><li><strong>Доза до помола.</strong> Встроенная система взвешивает зерно до подачи к жерновам.</li><li><strong>Настройки под рецепт.</strong> Можно сохранить параметры веса, скорости и расстояния между жерновами.</li><li><strong>Один стол вместо трёх.</strong> Три варианта зерна доступны на одной станции.</li></ul><h3>Кому подходит</h3><p>Кофейне с двумя сортами эспрессо в меню, обжарке для дегустаций и точке, где нужен декаф или отдельный сезонный лот.</p></div><aside className="xone-overview-aside" aria-label="Выбранное исполнение"><img src="/photo/official/x-one.webp" alt="" /><div><p className="eyebrow">Выбрано</p><h3>X-One {color}</h3><strong>{price}</strong><p>{status}</p><a className="btn btn-solid" href="#xone-request">Запросить</a><div className="xone-aside-links"><a href={`/leasing/?model=X-One%20${color}`}>Лизинг Arenza</a><a href="/dealers/?filter=showroom">Шоурумы</a></div></div></aside></section>
    <section className="wrap section xone-specifications" id="xone-specs"><div className="sec-head"><div><p className="eyebrow">Технические данные</p><h2>Характеристики X-One</h2></div></div><table className="xone-spec-table">{X_ONE_SPEC_GROUPS.map((group) => <tbody key={group.title}><tr className="xone-spec-group"><th colSpan={2} scope="colgroup">{group.title}</th></tr>{group.rows.map(([name, value]) => <tr key={name}><th scope="row">{name}</th><td>{value}</td></tr>)}</tbody>)}</table></section>
    <section className="bg-gray xone-availability" id="xone-availability"><div className="wrap section"><div className="sec-head"><div><p className="eyebrow">Исполнения</p><h2>Цены и наличие</h2></div></div><div className="table-scroll"><table className="data"><thead><tr><th>Артикул</th><th>Исполнение</th><th className="num">Цена</th><th>Статус</th></tr></thead><tbody>{entries.map((item) => { const variant = variants.find((option) => option.codes.includes(item.code)); return <tr key={item.code}><td className="sku">{item.code}</td><td>{item.name.replace(/^Кофемолка\s+/i, "")}</td><td className="num">{item.rrp > 0 ? formatPrice(item.rrp) : "Цена по запросу"}</td><td>{variant ? xOneStockLabel(variant) : "Под заказ"}</td></tr>; })}</tbody></table></div><section className="xone-request" id="xone-request" ref={formRef}><div><p className="eyebrow">Запрос поставки</p><h2>Уточнить наличие X-One {color}</h2><p>Оставьте контакты — менеджер подтвердит цену и наличие выбранного цвета.</p></div><LeadForm form="contacts" className="grid g2"><input type="hidden" name="model" value={`X-One ${color}`} /><label className="field"><span>Имя</span><input name="name" placeholder="Как к вам обращаться" required /></label><label className="field"><span>Телефон или e-mail</span><input name="contact" placeholder="Для ответа" required /></label><label className="field xone-form-wide"><span>Задача</span><textarea key={color} name="task" defaultValue={`Интересует кофемолка Sanremo X-One ${color}`} /></label><label className="small xone-form-wide xone-consent"><input name="consent" value="yes" type="checkbox" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label></LeadForm></section></div></section>
    <section className="wrap section-tight xone-guide-reading"><p className="eyebrow">Читайте также</p><h2>Как выбрать кофемолку для кофейни</h2><p>Разобрали жернова, дозирование, число сортов и место кофемолки на рабочей стойке.</p><a href="/guide/kofemolka-dlya-kofejni/">Читать гид →</a></section>
    <section className="wrap section xone-related" id="xone-service"><p className="eyebrow">После выбора</p><h2>Машина, сервис и поддержка</h2><div><a href="/products/">Подобрать кофемашину</a><a href="/leasing/">Лизинг Arenza</a><a href="/service/">Сервис и запчасти</a><a href="/dealers/?filter=showroom">Посмотреть вживую — шоурумы</a></div></section>
    {!heroVisible && !formVisible ? <div className="xone-mobile-buybar"><span><b>{price}</b><small>{status}</small></span><a className="btn btn-solid" href="#xone-request">Запросить</a></div> : null}
  </>;
}
