import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { FaqBlock } from "../components/GuideBlocks";
import { liveSkus, modelBySlug, modelPath, officialImageForModel } from "@/lib/catalog";
import { faqSchema, jsonLd, type Question } from "@/lib/seo";
import { LeasingCalculator } from "./LeasingCalculator";

export const metadata: Metadata = {
  title: "Кофемашина Sanremo в лизинг — от 10% аванса, решение за сутки",
  description: "Кофемашина Sanremo в лизинг для кофейни и ресторана. Выберите исполнение, рассчитайте аванс и срок 12–48 месяцев, отправьте заявку на условия Арензы.",
};

const questions: Question[] = [
  { question: "Кто может оформить лизинг?", answer: "Аренза рассматривает заявки индивидуальных предпринимателей и юридических лиц. Условия определяются после проверки заявки." },
  { question: "Какой нужен аванс?", answer: "На сайте Арензы указан аванс от 10%. Точный размер зависит от решения по заявке и выбранного оборудования." },
  { question: "На какой срок можно взять кофемашину?", answer: "На сайте партнёра указан срок от 12 до 48 месяцев. Окончательный срок закрепляется в договоре." },
  { question: "Можно включить кофемолку в договор?", answer: "Укажите кофемолку в заявке. Возможность включения комплекта в один договор подтвердит лизинговая компания." },
  { question: "Сохраняется ли гарантия на машину?", answer: "На новые кофемашины Sanremo действует гарантия 12 месяцев с даты продажи. Гарантийные обращения принимает дилер, у которого куплена машина." },
  { question: "Можно оформить машину под заказ?", answer: "Да, укажите нужное исполнение. Поставка из Италии для машин под заказ занимает 6–8 недель; складские исполнения отгружаются со склада в Москве." },
];

const chosen = ["zoe-compact", "d8", "f18-sb", "cafe-racer"].map((slug) => modelBySlug(slug)).filter((model) => model !== undefined);
const options = liveSkus.filter((sku) => sku.rrp > 0 && sku.model && !sku.markdown)
  .sort((a, b) => a.rrp - b.rrp)
  .map((sku) => ({ code: sku.code, label: [sku.modelName, sku.groups ? `${sku.groups} гр.` : null, sku.color, sku.edition].filter(Boolean).join(" · ") + ` · ${sku.code}`, price: sku.rrp }));

export default function LeasingPage() {
  return <><Header active="/solutions/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/solutions/", label: "Решения" }, { label: "Лизинг" }]} />
    <main className="leasing-page">
      <section className="wrap leasing-hero"><div className="leasing-hero-copy"><p className="eyebrow">Для кофейни и ресторана</p><h1>Кофемашина Sanremo в лизинг</h1><p className="lead">Выберите машину для вашего формата. Аренза рассматривает заявки на финансирование оборудования с авансом от 10% и сроком до 48 месяцев.</p><div className="leasing-hero-actions"><a className="btn btn-solid" href="#calculator">Рассчитать сумму</a><a className="btn" href="#leasing-request">Оставить заявку</a></div></div><div className="leasing-hero-photo"><img src={officialImageForModel("f18-sb") ?? ""} alt="Профессиональная кофемашина Sanremo F18 Single Boiler" /></div></section>
      <section className="wrap leasing-facts" aria-label="Условия партнёра"><div><b>от 10%</b><span>первоначальный взнос</span></div><div><b>12–48</b><span>месяцев договора</span></div><div><b>от 100 000 ₽</b><span>стоимость оборудования</span></div><div><b>24 часа</b><span>рассмотрение заявки у Арензы</span></div></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Условия на сайте партнёра</p><h2>Как устроена покупка</h2></div><ol className="leasing-steps"><li><b>Заявка</b><p>Вы указываете машину, срок и контакт. Мы уточняем нужное исполнение и готовим счёт.</p></li><li><b>Решение Арензы</b><p>Лизинговая компания рассматривает документы и согласовывает условия договора.</p></li><li><b>Покупка машины</b><p>Аренза оплачивает оборудование. Машина поступает со склада в Москве либо под заказ из Италии.</p></li><li><b>Установка</b><p>Дилер или сервисный партнёр выполняет монтаж и запуск. После окончания договора оборудование можно выкупить.</p></li></ol><p className="tiny">Аренза указывает выкупную стоимость 2 400 ₽. Точные условия финансирования определяются после рассмотрения заявки. <a href="https://arenza.ru/lizing-oborudovaniya/">Условия партнёра</a>.</p></section>
      <section className="wrap section-tight"><LeasingCalculator options={options} /></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Выбор машины</p><h2>Что можно включить в проект</h2><p>Начните с нагрузки и меню. Калькулятор выше показывает цены по конкретным исполнениям из каталога.</p></div><div className="leasing-models">{chosen.map((model) => <a key={model.slug} href={modelPath(model)}><img src={officialImageForModel(model.slug) ?? ""} alt={`Sanremo ${model.name}`} /><strong>{model.name}</strong><span>Посмотреть исполнения</span></a>)}</div><p className="leasing-more"><a href="/choose/">Подбор по задаче</a><a href="/dealers/">Где купить</a><a href="/cases/">Кейсы кофеен</a></p></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Форма владения</p><h2>Лизинг, рассрочка, аренда</h2></div><div className="leasing-explain"><p>Лизинг оформляется через партнёра: компания приобретает машину и передаёт её вашему бизнесу по договору с графиком платежей. В конце срока предусмотрен выкуп.</p><p>Sanremo не сдаёт кофемашины в аренду. Если нужна рассрочка, укажите это в заявке: проверим доступный способ покупки для выбранного исполнения.</p></div></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Перед заявкой</p><h2>Вопросы о лизинге</h2></div><FaqBlock questions={questions} title="" schema={false} /></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(questions)) }} />
    </main><Footer /></>;
}
