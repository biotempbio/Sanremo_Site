import type { Metadata } from "next";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs, Stock } from "../../components/Bits";
import { ResponsiveImage } from "../../components/ResponsiveImage";
import { LeadForm } from "../../components/LeadForm";
import { grinders, imgUrl, money, PRICE_DATE } from "@/lib/catalog";
import { cleanDescriptionBlocks } from "@/lib/product-description.mjs";
import type { DescriptionBlock } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Кофемолка Sanremo X-One — характеристики, цены и наличие",
  description: "Кофемолка Sanremo X-One в России: жернова, бункеры, скорости помола и электропитание. Сравните исполнения, цены и наличие по артикулам.",
};

const features = [
  ["Жернова", "плоские вертикальные, 98\u00a0мм, со специальным покрытием"],
  ["Бункеры для зерна", "2 × 1\u00a0000\u00a0г"],
  ["Весовой бункер", "250\u00a0г"],
  ["Дозирование", "запатентованная система взвешивания зерна перед помолом"],
  ["Управление", "сенсорный дисплей, до 12 рецептов помола"],
  ["Скорости", "1 000 / 1 200 / 1 400 об/мин и настраиваемая 800–1 400 об/мин"],
  ["Стабильность работы", "система охлаждения и инверторный мотор"],
  ["Подключение", "220\u00a0В, 1,65\u00a0кВт"],
];

export default function XOnePage() {
  const entries = grinders.filter((item) => /x[\s-]?one/i.test(item.name));
  const knownPrices = entries.map((item) => item.rrp).filter((price) => price > 0);
  const priceFrom = knownPrices.length ? Math.min(...knownPrices) : null;
  const primary = entries.find((item) => item.availability === "in_stock") ?? entries[0];
  const descriptionBlocks = cleanDescriptionBlocks(primary?.descriptionBlocks ?? []) as DescriptionBlock[];
  const secondaryProps = primary?.secondaryProps ?? [];

  return <>
    <Header active="/products" />
    <Crumbs items={[{ href: "/", label: "Главная" }, { href: "/products/", label: "Кофемашины" }, { href: "/products/grinders/", label: "Кофемолки" }, { label: "X-One" }]} />
    <main>
      <section className="wrap" style={{ paddingBottom: 34 }}>
        <div className="sec-head">
          <div><p className="eyebrow">Профессиональная кофемолка Sanremo</p><h1 style={{ fontSize: "clamp(38px,4.6vw,68px)" }}>X-One</h1></div>
          <p className="lead">Кофемолка с контролем веса зерна перед помолом, двумя бункерами и сохранением рецептов для стабильной работы барной станции.</p>
        </div>
      </section>

      <section className="bg-gray"><div className="wrap section"><div className="grid g2" style={{ alignItems: "start" }}>
        <div className="card-visual" style={{ minHeight: 320 }}>
          {primary?.image ? <ResponsiveImage src={imgUrl(primary.image) ?? ""} alt="Кофемолка Sanremo X-One" width={900} height={900} sizes="(max-width: 900px) 100vw, 50vw" style={{ width: "100%", height: "100%", minHeight: 320, objectFit: "contain" }} /> : null}
        </div>
        <div><p className="eyebrow">Цена и поставка</p><h2>Точный помол для профессиональной рабочей зоны</h2><p className="lead">X-One помогает бариста работать с разными сортами зерна без лишних переключений: хранит рецепты, поддерживает несколько скоростей помола и взвешивает зерно до помола.</p>
          <div className="card" style={{ marginTop: 26 }}><div className="card-body"><span className="price-from">от</span><span className="price num">{money(priceFrom)}</span>{primary ? <div style={{ marginTop: 12 }}><Stock status={primary.availability} /></div> : <div style={{ marginTop: 12 }}><Stock status="on_order" /></div>}<p className="tiny" style={{ margin: "12px 0 0" }}>Цены и наличие на {PRICE_DATE}.</p></div></div>
        </div>
      </div></div></section>

      <section className="wrap section"><div className="sec-head"><div><p className="eyebrow">Характеристики</p><h2>Всё необходимое — на странице</h2></div><p className="lead">Характеристики, доступные исполнения и цены X-One — прямо на странице.</p></div><div className="table-scroll"><table className="data spec-table"><tbody>{features.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></div></section>

      {descriptionBlocks.length > 0 ? <section className="wrap section-tight"><div style={{ maxWidth: 720 }}><p className="eyebrow">Описание кофемолки</p><h2>Sanremo X-One</h2><div className="product-description">{descriptionBlocks.map((block, index) => block.type === "heading" ? <h3 key={index}>{block.text}</h3> : block.type === "list" ? <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul> : <p key={index}>{block.text}</p>)}</div></div></section> : null}
      {secondaryProps.length > 0 ? <section className="wrap section-tight"><details className="product-more-specs"><summary>Все характеристики исполнения · {secondaryProps.length}</summary><div className="table-scroll"><table className="data spec-table"><tbody>{secondaryProps.map((item) => <tr key={`${item.name}:${item.value}`}><th scope="row">{item.name}</th><td>{item.value}</td></tr>)}</tbody></table></div></details></section> : null}

      <section className="wrap section-tight"><div className="sec-head"><div><p className="eyebrow">Исполнения</p><h2>Цены и наличие</h2></div></div><div className="table-scroll"><table className="data"><thead><tr><th>Артикул</th><th>Исполнение</th><th className="num">Цена</th><th>Статус</th></tr></thead><tbody>{entries.map((item) => <tr key={item.code}><td className="sku">{item.code}</td><td>{item.name.replace(/^Кофемолка\s+/i, "")}</td><td className="num">{item.rrp > 0 ? money(item.rrp) : "Цена по запросу"}</td><td><Stock status={item.availability} free={"inStock" in item && typeof item.inStock === "number" ? item.inStock : undefined} /></td></tr>)}</tbody></table></div></section>

      <section className="bg-gray"><div className="wrap section"><div className="sec-head"><div><p className="eyebrow">Запрос поставки</p><h2>Уточнить наличие X-One</h2></div><p className="lead">Оставьте контакты — запрос будет передан официальному дилеру, который подтвердит исполнение и условия поставки.</p></div><LeadForm form="contacts" className="grid g2" style={{ maxWidth: 820 }}><label className="field"><span>Имя</span><input name="name" placeholder="Как к вам обращаться" required /></label><label className="field"><span>Телефон или e-mail</span><input name="contact" placeholder="для ответа" required /></label><label className="field" style={{ gridColumn: "1 / -1" }}><span>Задача</span><textarea name="task" defaultValue="Интересует кофемолка Sanremo X-One" /></label><label className="small" style={{ gridColumn: "1 / -1", display: "flex", gap: 10, alignItems: "flex-start" }}><input name="consent" value="yes" type="checkbox" style={{ width: 18, minHeight: 18, marginTop: 3 }} required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label></LeadForm></div></section>

      <section className="wrap section-tight" aria-label="Разделы Sanremo">
        <div className="grid g3">
          <a className="link-arrow" href="/products/grinders/">Все кофемолки Sanremo</a>
          <a className="link-arrow" href="/dealers/">Найти дилера</a>
          <a className="link-arrow" href="/service/">Сервис Sanremo</a>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
