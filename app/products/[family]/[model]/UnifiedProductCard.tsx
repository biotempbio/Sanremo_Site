"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import SkuImage from "@/app/components/SkuImage";
import { LeadForm } from "@/app/components/LeadForm";
import { formatPrice, pluralize } from "@/lib/format";
import { cleanDescriptionBlocks, descriptionBlocks } from "@/lib/product-description.mjs";
import type { DescriptionBlock } from "@/lib/catalog";
import type { PickerSku } from "./ConfigPicker";

const DEFAULT_GROUPS: Record<string, number> = {
  "zoe-competition": 2, "zoe-compact": 2, "zoe-sed": 2, "zoe-sap": 2,
  d8: 2, "d8-pro": 2, "f18-sb": 2, "f18-mb": 2,
  "cafe-racer": 2, opera: 2, you: 1,
};
function preferred(pool: PickerSku[], slug: string) {
  return pool.find((item) => slug === "d8" && item.code === "194570" && item.free >= 3)
    ?? pool.find((item) => /ч[её]рн|black/i.test(item.color ?? "") && item.free >= 3)
    ?? pool.find((item) => item.free >= 3)
    ?? pool.find((item) => /ч[её]рн|black/i.test(item.color ?? ""))
    ?? pool[0];
}
function stock(item: PickerSku) {
  if (item.free >= 3) return `В наличии · на складе ${item.free} шт`;
  return item.free > 0 ? "В наличии" : "Под заказ";
}
function benefitText(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length < 3) return <strong>{text}</strong>;
  const colon = words.findIndex((word, index) => index < 4 && word.endsWith(":"));
  const count = colon >= 1 ? colon + 1 : /^(и|или|с|для|по|в|на)$/i.test(words[2]) ? 2 : 3;
  return <><strong>{words.slice(0, count).join(" ")}</strong>{" "}{words.slice(count).join(" ")}</>;
}
function distinctSpecs(item: PickerSku, architecture: string) {
  const seen = new Set<string>();
  const row = (name: string, value: string | null | undefined) => {
    if (!value) return null;
    const key = name.trim().toLocaleLowerCase("ru-RU");
    if (seen.has(key)) return null;
    seen.add(key);
    return [name, value] as const;
  };
  const groups = [
    { title: "Группы и бойлеры", rows: [row("Количество групп", item.groups ? String(item.groups) : null), row("Высота группы", item.groupHeight), row("Архитектура бойлеров", architecture), row("Общий объём бойлеров", item.boilerTotal ? `${item.boilerTotal}\u00a0л` : null)] },
    { title: "Управление и исполнение", rows: [row("Цвет", item.color), row("Исполнение", item.edition && item.edition !== "Base" ? item.edition : null), row("Опции", item.options.join(", "))] },
    { title: "Электрика", rows: [row("Мощность", item.power ? `${String(item.power).replace(".", ",")}\u00a0кВт` : null), row("Напряжение", item.voltage ? `${item.voltage}\u00a0В` : null)] },
    { title: "Габариты и вес", rows: [row("Габариты", item.sizeNet ? `${item.sizeNet.w} × ${item.sizeNet.h} × ${item.sizeNet.d}\u00a0мм` : null), row("Масса нетто", item.weightNet ? `${String(item.weightNet).replace(".", ",")}\u00a0кг` : null)] },
  ];
  const other = item.secondaryProps.map((entry) => row(entry.name, entry.value)).filter(Boolean);
  if (other.length) groups.push({ title: "Дополнительные данные", rows: other });
  return groups.map((group) => ({ ...group, rows: group.rows.filter((entry): entry is readonly [string, string] => Boolean(entry)) })).filter((group) => group.rows.length);
}
function showDescription(blocks: DescriptionBlock[], raw: string, modelName: string) {
  const clean = cleanDescriptionBlocks(blocks.length ? blocks : descriptionBlocks(raw)) as DescriptionBlock[];
  const result: DescriptionBlock[] = [];
  const technicalFact = /^(?:хар-ки|характеристики|высота группы|мощность|напряжение|вес|габариты|количество групп|объ[её]м бойлер|бойлер .*объ[её]мом|\d+ группы высотой)/i;
  const typography = (value: string) => value.replace(/(\d)\s+(л|мм|кВт|Вт|кг|г)(?![\p{L}])/giu, "$1\u00a0$2").replace(/(?<![\p{L}])[Чч]ерный(?![\p{L}])/gu, "чёрный");
  for (const block of clean) {
    if (block.type === "heading") {
      if (!/технические характеристики/i.test(block.text)) result.push({ ...block, text: block.text.replace(/:$/, "") });
      continue;
    }
    if (block.type === "list") {
      const items = block.items.filter((item) => !technicalFact.test(item.trim())).map(typography);
      if (items.length) result.push({ type: "list", items });
      continue;
    }
    let text = block.text.trim();
    if (!text) continue;
    if (result.length === 0 && /^кофемашина(?:\s|$)/i.test(text) && text.toLocaleLowerCase("ru-RU").includes(modelName.toLocaleLowerCase("ru-RU"))) {
      text = text.replace(/^[^.!?]+[.!?]\s*/, "");
    }
    if (/^(основные преимущества|особенности|управление|функции):?$/i.test(text)) { result.push({ type: "heading", text: text.replace(/:$/, "") }); continue; }
    if (/инновационн|не просто (?:кофемашина|машина)/i.test(text)) continue;
    const sentences = text.split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z])/u);
    for (const sentence of sentences) {
      const clauses = sentence.split(/,\s+/).map((part) => part.trim()).filter(Boolean);
      if (clauses.length >= 5 && sentence.length > 240) {
        const items = clauses.filter((part) => !technicalFact.test(part)).map(typography);
        if (items.length) result.push({ type: "list", items });
      } else if (!technicalFact.test(sentence) && !/^автомат[.]?$/i.test(sentence)) result.push({ type: "paragraph", text: typography(sentence) });
    }
  }
  const structured = result.length >= 3 && result.every((block) => block.type === "paragraph" && block.text.length < 110)
    ? [{ type: "heading" as const, text: "Оснащение" }, { type: "list" as const, items: result.map((block) => (block as { text: string }).text) }]
    : result;
  return structured.flatMap((block) => block.type === "list" && block.items.length > 8
    ? [{ type: "list" as const, items: block.items.slice(0, 6) }, { type: "heading" as const, text: "Дополнительное оснащение" }, { type: "list" as const, items: block.items.slice(6) }]
    : [block]);
}

export default function UnifiedProductCard({ skus, modelName, modelSlug, familyName, territory, architecture }: {
  skus: PickerSku[]; modelName: string; modelSlug: string; familyName: string; territory: string; architecture: string;
}) {
  const groupsAvailable = useMemo(() => [...new Set(skus.map((item) => item.groups).filter((value): value is number => Boolean(value)))].sort(), [skus]);
  const defaultGroup = groupsAvailable.includes(DEFAULT_GROUPS[modelSlug]) ? DEFAULT_GROUPS[modelSlug] : groupsAvailable[0] ?? null;
  const [group, setGroup] = useState<number | null>(defaultGroup);
  const pool = useMemo(() => skus.filter((item) => group === null || item.groups === group), [skus, group]);
  const [code, setCode] = useState(preferred(pool, modelSlug)?.code ?? "");
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedCode = params.get("sku");
    const requestedGroup = Number(params.get("groups"));
    const requestedColor = params.get("color")?.toLocaleLowerCase("ru-RU");
    const exact = skus.find((item) => item.code === requestedCode || item.vendorCode === requestedCode);
    const matched = exact ?? preferred(skus.filter((item) => (!requestedGroup || item.groups === requestedGroup) && (!requestedColor || item.color?.toLocaleLowerCase("ru-RU") === requestedColor)), modelSlug);
    if (matched && (requestedCode || requestedGroup || requestedColor)) { setGroup(matched.groups); setCode(matched.code); }
    const hero = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    const form = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { rootMargin: "0px 0px 100px 0px" });
    if (heroRef.current) hero.observe(heroRef.current);
    if (formRef.current) form.observe(formRef.current);
    return () => { hero.disconnect(); form.disconnect(); };
  }, [skus, modelSlug]);
  const current = pool.find((item) => item.code === code) ?? pool[0];
  if (!current) return null;
  const label = (item: PickerSku) => [item.color ?? item.edition ?? "Исполнение", item.edition && item.edition !== "Base" ? item.edition : null].filter((value, index, all) => value && all.indexOf(value) === index).join(" · ");
  const labels = [...new Map(pool.map((item) => [label(item), item])).values()];
  const specs = distinctSpecs(current, architecture);
  const description = showDescription(current.descriptionBlocks, current.description, modelName);
  const distinctDescription = description.filter((block) => block.type !== "paragraph" || block.text.trim() !== territory.trim());
  const descriptionLength = distinctDescription.map((block) => block.type === "list" ? block.items.join(" ") : block.text).join(" ").length;
  const title = `${modelName} · ${current.groups ?? "?"} ${pluralize(current.groups ?? 0, "группа", "группы", "групп")} · ${label(current)}`;
  const price = current.rrp > 0 ? formatPrice(current.rrp) : "Цена по запросу";
  const status = stock(current);
  const change = (item: PickerSku) => {
    setCode(item.code);
    const params = new URLSearchParams(location.search); params.set("sku", item.code); params.set("groups", String(item.groups ?? ""));
    history.replaceState(null, "", `${location.pathname}?${params}`);
  };
  return <div className="unified-product">
    <section className="unified-product-hero" ref={heroRef} id="product-overview">
      <div className="unified-product-gallery"><SkuImage src={current.image} alt={current.imageExact ? `Sanremo ${modelName}, ${current.groups ?? ""} группы, ${current.color ?? ""}` : `Sanremo ${modelName} — фото модели`} groups={current.groups} color={current.colorHex} width={current.imageWidth} height={current.imageHeight} label={current.imageCaption ?? (current.imageExact ? title : "Фото этого исполнения скоро добавим")} /></div>
      <div className="unified-product-summary"><p className="eyebrow">{familyName} · {architecture}</p><h1>Кофемашина Sanremo {modelName}</h1><p className="unified-product-lead"><strong>{territory}</strong></p>
        <div className="unified-product-facts"><span>{groupsAvailable.join("/")} {pluralize(groupsAvailable.at(-1) ?? 0, "группа", "группы", "групп")}</span><span>{architecture}</span><span>{skus.length} {pluralize(skus.length, "исполнение", "исполнения", "исполнений")}</span></div>
        {groupsAvailable.length > 1 && <div className="unified-product-choice"><h2>Количество групп</h2><div>{groupsAvailable.map((value) => <button type="button" key={value} aria-pressed={group === value} onClick={() => { const next = preferred(skus.filter((item) => item.groups === value), modelSlug); setGroup(value); if (next) change(next); }}>{value} {pluralize(value, "группа", "группы", "групп")}</button>)}</div></div>}
        <div className="unified-product-choice"><h2>Исполнение и цвет</h2><div>{labels.map((item) => <button type="button" key={item.code} aria-pressed={item.code === current.code} onClick={() => change(item)}>{item.colorHex && <i className="swatch" style={{ background: item.colorHex }} aria-hidden="true" />}{label(item)}</button>)}</div></div>
        <div className="unified-product-price"><strong>{price}</strong><span>{status}</span><small>Артикул {current.vendorCode ?? current.code}</small></div>
        <div className="unified-product-actions"><a className="btn btn-solid" href="#product-request">Запросить цену и наличие</a><a className="btn" href="/compare/">Сравнить</a><a className="btn" href={`/leasing/?model=${encodeURIComponent(title)}&sku=${encodeURIComponent(current.vendorCode ?? current.code)}#leasing-request`}>Купить в лизинг</a></div>
      </div>
    </section>
    <nav className="unified-product-nav" aria-label="Разделы карточки"><a href="#product-overview">Обзор</a><a href="#product-benefits">Преимущества</a><a href="#product-specs">Характеристики</a><a href="#product-availability">Наличие</a><a href="#product-service">Сервис</a></nav>
    <section className="unified-product-benefits" id="product-benefits"><p className="eyebrow">Почему {modelName}</p><h2>Что важно в работе</h2><div className="unified-product-benefit-grid"><article><span>01</span><h3>Группы под поток</h3><p>Доступны {groupsAvailable.join(" / ")} группы. Выберите число рабочих мест под пиковую нагрузку.</p></article><article><span>02</span><h3>Система бойлеров</h3><p>{architecture}. Характеристики выбранного исполнения приведены ниже.</p></article><article><span>03</span><h3>Исполнения</h3><p>{labels.length} {pluralize(labels.length, "вариант", "варианта", "вариантов")} для выбранного числа групп.</p></article></div></section>
    {distinctDescription.length > 0 && <section className={`unified-product-overview${descriptionLength < 280 ? " is-compact" : ""}`}><div><p className="eyebrow">Обзор исполнения</p><h2>{modelName}: описание и особенности</h2><div className="unified-product-prose">{distinctDescription.map((block, index) => block.type === "heading" ? <h3 key={index}>{block.text.replace(/:$/, "")}</h3> : block.type === "list" ? <ul key={index} className={block.items.length > 6 ? "unified-product-feature-list" : undefined}>{block.items.map((item, i) => <li key={i}>{benefitText(item)}</li>)}</ul> : <p key={index}>{block.text}</p>)}</div></div>{descriptionLength >= 280 && <aside><SkuImage src={current.image} alt="" groups={current.groups} color={current.colorHex} width={current.imageWidth} height={current.imageHeight} /><h3>{title}</h3><strong>{price}</strong><p>{status}</p><a className="btn btn-solid" href="#product-request">Запросить</a><div><a href={`/leasing/?model=${encodeURIComponent(title)}#leasing-request`}>Лизинг Arenza</a><a href="/dealers/?filter=showroom">Шоурумы</a></div></aside>}</section>}
    <section className="unified-product-specs" id="product-specs"><p className="eyebrow">Технические данные</p><h2>Характеристики исполнения</h2><table><tbody>{specs.map((group) => <Fragment key={group.title}><tr className="unified-product-spec-group"><th colSpan={2} scope="colgroup">{group.title}</th></tr>{group.rows.map(([name, value]) => <tr key={`${group.title}-${name}`}><th scope="row">{name}</th><td>{value}</td></tr>)}</Fragment>)}</tbody></table></section>
    <section className="unified-product-availability" id="product-availability"><p className="eyebrow">Исполнения</p><h2>Цены и наличие</h2><div className="table-scroll"><table className="data"><thead><tr><th>Артикул</th><th>Исполнение</th><th>Группы</th><th className="num">Цена</th><th>Наличие</th></tr></thead><tbody>{skus.map((item) => <tr key={item.code}><td className="sku">{item.vendorCode ?? item.code}</td><td>{label(item)}</td><td>{item.groups ?? "—"}</td><td className="num">{item.rrp > 0 ? formatPrice(item.rrp) : "По запросу"}</td><td>{stock(item)}</td></tr>)}</tbody></table></div><section className="unified-product-request" id="product-request" ref={formRef}><div><p className="eyebrow">Запрос поставки</p><h2>Уточнить наличие {title}</h2><p>Менеджер подтвердит цену и наличие выбранного исполнения.</p></div><LeadForm form="contacts" className="grid g2"><input type="hidden" name="model" value={title} /><input type="hidden" name="sku" value={current.vendorCode ?? current.code} /><label className="field"><span>Имя</span><input name="name" required /></label><label className="field"><span>Телефон или e-mail</span><input name="contact" required /></label><label className="field unified-product-wide"><span>Комментарий</span><textarea name="task" placeholder="Расскажите о вашей задаче" /></label><label className="small unified-product-wide unified-product-consent"><input type="checkbox" name="consent" value="yes" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label></LeadForm></section></section>
    <section className="unified-product-service" id="product-service"><a href="/service/">Сервис и запчасти →</a><a href="/dealers/?filter=showroom">Посмотреть вживую — шоурумы →</a><a href="/products/x-one/">Подобрать кофемолку X-One →</a></section>
    {!heroVisible && !formVisible && <div className="unified-product-mobile-buybar"><span><strong>{price}</strong><small>{status}</small></span><a className="btn btn-solid" href="#product-request">Запросить</a></div>}
  </div>;
}
