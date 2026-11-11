import type { Metadata } from "next";
import { Header, Footer } from "../../components/Chrome";
import { Crumbs, Stock } from "../../components/Bits";
import { ResponsiveImage } from "../../components/ResponsiveImage";
import { grinders, imgUrl, money, PRICE_DATE } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Кофемолки Sanremo — X-One: характеристики, РРЦ и наличие",
  description: "Профессиональная кофемолка Sanremo X-One: характеристики, исполнения, рекомендованные розничные цены и статус поставки от официального дистрибьютора BIO.",
};

const features = [
  ["Жернова", "плоские вертикальные, 98 мм, со специальным покрытием"],
  ["Бункеры для зерна", "2 × 1 200 г"],
  ["Весовой бункер", "250 г"],
  ["Дозирование", "запатентованная система взвешивания зерна перед помолом"],
  ["Управление", "сенсорный дисплей, до 12 рецептов помола"],
  ["Скорости", "1 000 / 1 200 / 1 400 об/мин и настраиваемая 800–1 400 об/мин"],
  ["Стабильность работы", "система охлаждения и инверторный мотор"],
  ["Подключение", "220 В, 1,65 кВт"],
];

export default function GrindersPage() {
  const entries = grinders.filter((item) => /x one/i.test(item.name));
  const priceFrom = entries.length ? Math.min(...entries.map((item) => item.rrp)) : null;
  const primary = entries.find((item) => item.availability === "in_stock") ?? entries[0];

  return <>
    <Header active="/products" />
    <Crumbs items={[{ href: "/", label: "Главная" }, { href: "/products/", label: "Кофемашины" }, { label: "Кофемолки" }]} />
    <main>
      <section className="wrap" style={{ paddingBottom: 34 }}>
        <div className="sec-head">
          <div>
            <p className="eyebrow">Профессиональное оборудование Sanremo</p>
            <h1 style={{ fontSize: "clamp(38px,4.6vw,68px)" }}>Кофемолки Sanremo</h1>
          </div>
          <p className="lead">Высокопроизводительная кофемолка с контролем веса зерна перед помолом, двумя бункерами и настройкой рецептов для стабильной работы барной станции.</p>
        </div>
      </section>

      <section className="bg-gray">
        <div className="wrap section">
          <div className="grid g2" style={{ alignItems: "start" }}>
            <div className="card-visual" style={{ minHeight: 320 }}>
              {primary?.image ? <ResponsiveImage src={imgUrl(primary.image) ?? ""} alt="Кофемолка Sanremo X-One" width={900} height={900} sizes="(max-width: 900px) 100vw, 50vw" style={{ width: "100%", height: "100%", minHeight: 320, objectFit: "contain" }} /> : null}
            </div>
            <div>
              <p className="eyebrow">X-One · данные BIO</p>
              <h2>X-One: точный помол для профессиональной рабочей зоны</h2>
              <p className="lead">X-One хранит рецепты, поддерживает несколько скоростей помола и помогает бариста работать с разными сортами зерна без лишних переключений.</p>
              <div className="card" style={{ marginTop: 26 }}>
                <div className="card-body">
                  <span className="price-from">РРЦ от</span>
                  <span className="price num">{money(priceFrom)}</span>
                  {primary ? <div style={{ marginTop: 12 }}><Stock status={primary.availability} /></div> : <div style={{ marginTop: 12 }}><Stock status="on_order" /></div>}
                  <p className="tiny" style={{ margin: "12px 0 0" }}>Коммерческие данные BIO: {PRICE_DATE}.</p>
                  <a className="btn btn-solid" href="/contacts/?type=model" style={{ marginTop: 18 }}>Запросить поставку</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="sec-head">
          <div><p className="eyebrow">Характеристики</p><h2>Всё необходимое — на странице</h2></div>
          <p className="lead">Параметры собраны из актуальной товарной выгрузки BIO — без необходимости скачивать PDF.</p>
        </div>
        <div className="table-scroll"><table className="data"><tbody>{features.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></div>
      </section>

      <section className="wrap section-tight">
        <div className="sec-head"><div><p className="eyebrow">Исполнения</p><h2>РРЦ и статус поставки</h2></div></div>
        <div className="table-scroll"><table className="data"><thead><tr><th>Артикул BIO</th><th>Исполнение</th><th className="num">РРЦ</th><th>Статус</th></tr></thead><tbody>
          {entries.map((item) => <tr key={item.code}><td className="sku">{item.code}</td><td>{item.name.replace(/^Кофемолка\s+/i, "")}</td><td className="num">{money(item.rrp)}</td><td><Stock status={item.availability} /></td></tr>)}
        </tbody></table></div>
      </section>
    </main>
    <Footer />
  </>;
}
