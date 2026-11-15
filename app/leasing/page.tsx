import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { FaqBlock } from "../components/GuideBlocks";
import { liveSkus, modelBySlug, modelPath, officialImageForModel } from "@/lib/catalog";
import { faqSchema, jsonLd, type Question } from "@/lib/seo";
import { LeasingRequest } from "./LeasingRequest";

export const metadata: Metadata = {
  title: "Кофемашина Sanremo в лизинг для кофейни | Аренза",
  description: "Кофемашина в лизинг для кофейни и ресторана: выберите Sanremo, отправьте заявку, получите условия для вашей компании. Оформление с партнёром Аренза.",
};

const questions: Question[] = [
  { question: "Кто может купить кофемашину в лизинг?", answer: "Оставить заявку могут компания или индивидуальный предприниматель. Аренза рассматривает её и предлагает условия для конкретного бизнеса." },
  { question: "Какие документы понадобятся?", answer: "Менеджер уточнит состав документов после заявки с учётом вашей компании и выбранной машины. Передавать документы через форму на сайте не нужно." },
  { question: "Сколько занимает оформление?", answer: "Сначала менеджер подготовит документы, затем решение примет Аренза. Срок зависит от рассмотрения заявки и наличия выбранного исполнения; его уточнят при обращении." },
  { question: "Как действует гарантия и кто обслуживает машину?", answer: "На новые кофемашины действует гарантия 12 месяцев с даты продажи. Гарантийное обращение принимает дилер, у которого куплена машина; монтаж и запуск выполняют дилеры и сервисные партнёры." },
  { question: "Можно выбрать конкретную модель и исполнение?", answer: "Да. Откройте карточку машины и нажмите «Купить в лизинг»: модель и исполнение попадут в заявку автоматически. Их можно изменить перед отправкой." },
];

const chosen = ["zoe-compact", "d8", "f18-sb", "cafe-racer"]
  .map((slug) => modelBySlug(slug)).filter((model) => model !== undefined);
const options = liveSkus.filter((sku) => sku.rrp > 0 && sku.model && !sku.markdown)
  .sort((a, b) => a.rrp - b.rrp)
  .map((sku) => ({ code: sku.code, modelName: sku.modelName ?? sku.model, groups: sku.groups, stock: sku.free,
    label: [sku.modelName, sku.groups ? `${sku.groups} гр.` : null, sku.color, sku.edition].filter(Boolean).join(" · ") }));

export default function LeasingPage() {
  return <><Header active="/solutions/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/solutions/", label: "Решения" }, { label: "Лизинг" }]} />
    <main className="leasing-page">
      <section className="wrap leasing-hero"><div className="leasing-hero-copy"><p className="eyebrow">Для кофейни и ресторана</p><h1>Кофемашина Sanremo в лизинг</h1><p className="lead">Выберите машину и отправьте заявку. Наш партнёр по лизингу — Аренза. Условия рассчитаем под вашу компанию и выбранное исполнение.</p><div className="leasing-hero-actions"><a className="btn btn-solid" href="#leasing-request">Оставить заявку</a><a className="btn" href="/products/">Выбрать машину</a></div></div><div className="leasing-hero-photo"><img src={officialImageForModel("f18-sb") ?? ""} alt="Профессиональная кофемашина Sanremo F18 Single Boiler" /></div></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Порядок покупки</p><h2>От выбора машины до запуска</h2><p>Один маршрут для выбранной модели: вы оставляете контакты, а оформление и установку ведут профильные специалисты.</p></div><ol className="leasing-steps"><li><b>Заявка</b><p>Укажите компанию, контакты и модель кофемашины.</p></li><li><b>Документы</b><p>Менеджер уточнит исполнение и подготовит документы.</p></li><li><b>Решение</b><p>Аренза рассмотрит заявку и предложит условия для вашей компании.</p></li><li><b>Передача машины</b><p>Аренза покупает кофемашину и передаёт её вам по договору.</p></li><li><b>Монтаж и запуск</b><p>Наши дилеры и сервисные партнёры подключают оборудование.</p></li></ol></section>
      <section className="wrap section-tight leasing-section leasing-story"><div><p className="eyebrow">Лизинг для кофейни</p><h2>Выбирайте машину по задаче, а условия — по компании</h2></div><div className="leasing-story-copy"><p>Профессиональная кофемашина в лизинг помогает открыть кофейню или обновить оборудование без единовременной оплаты полной стоимости машины. На сайте Sanremo можно сравнить линейки, проверить характеристики каждого исполнения, цену и наличие. В заявке укажите компанию, нужную модель и количество машин.</p><p>После обращения менеджер уточнит исполнение и подготовит документы. Решение по лизингу принимает Аренза: она покупает выбранное оборудование и передаёт его вашей компании по договору. Аванс, срок и остальные условия рассчитываются индивидуально. Монтаж и запуск выполняют дилеры и сервисные партнёры Sanremo в России.</p><p>Если вы ещё не определились с моделью, начните с <a href="/choose/">подбора по задаче</a> или <a href="/compare/">сравнения линеек</a>. Если исполнение уже выбрано, заявка из его карточки автоматически сохранит модель. Так менеджер сможет сразу работать с нужной машиной и количеством.</p></div></section>
      <section className="wrap section-tight leasing-request-section" id="leasing-request"><div className="leasing-request-intro"><p className="eyebrow">Заявка на лизинг</p><h2>Получить условия для вашей компании</h2><p>Оставьте контакты и выбранную машину. Менеджер свяжется с вами, чтобы уточнить исполнение и подготовить документы для Арензы.</p></div><LeasingRequest options={options} /></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Модель под задачу</p><h2>Выберите кофемашину Sanremo</h2><p>В карточках указаны исполнения, характеристики, цена и наличие.</p></div><div className="leasing-models">{chosen.map((model) => <a key={model.slug} href={modelPath(model)}><img src={officialImageForModel(model.slug) ?? ""} alt={`Sanremo ${model.name}`} /><strong>{model.name}</strong><span>Посмотреть исполнения</span></a>)}</div></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Частые вопросы</p><h2>Перед заявкой</h2></div><FaqBlock questions={questions} title="" schema={false} /></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(questions)) }} />
    </main><Footer /></>;
}
