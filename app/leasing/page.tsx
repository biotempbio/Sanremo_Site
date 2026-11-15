import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { FaqBlock } from "../components/GuideBlocks";
import { modelBySlug, modelPath, officialImageForModel } from "@/lib/catalog";
import { faqSchema, jsonLd, type Question } from "@/lib/seo";
import { LeasingRequest } from "./LeasingRequest";

export const metadata: Metadata = {
  title: "Кофемашина в лизинг для кофейни — Sanremo и Аренза",
  description: "Кофемашина Sanremo в лизинг для кофейни и ресторана. Выберите модель, оставьте заявку и получите индивидуальные условия от лизингового партнёра Аренза.",
};

const questions: Question[] = [
  { question: "Кто может купить кофемашину в лизинг?", answer: "Заявку могут подать юридические лица и индивидуальные предприниматели. Решение и условия определяет Аренза после рассмотрения документов." },
  { question: "Какие документы нужны?", answer: "Менеджер подготовит список документов под вашу компанию и выбранную машину. Окончательный перечень подтвердит Аренза." },
  { question: "Сколько времени занимает оформление?", answer: "Срок зависит от рассмотрения заявки и готовности документов. После обращения менеджер расскажет о следующих шагах." },
  { question: "Что происходит с гарантией и сервисом?", answer: "Гарантия на новую машину — 12 месяцев с даты продажи. Гарантийные обращения принимает дилер, у которого куплена машина; монтаж и запуск выполняют дилеры и сервисные партнёры." },
  { question: "Можно ли выбрать конкретное исполнение?", answer: "Да. Укажите модель, число групп и нужное исполнение в заявке. Из карточки машины эти данные подставятся автоматически." },
];
const steps = [
  ["Заявка", "Вы выбираете машину и оставляете контакты на сайте."],
  ["Документы", "Менеджер уточняет исполнение и помогает подготовить документы."],
  ["Решение", "Аренза рассматривает заявку и предлагает условия для вашей компании."],
  ["Покупка", "После заключения договора Аренза покупает машину и передаёт её вам."],
  ["Запуск", "Монтаж и запуск выполняют дилеры и сервисные партнёры."],
] as const;
const chosen = ["zoe-compact", "d8", "f18-sb", "cafe-racer"].map(modelBySlug).filter((model) => model !== undefined);

export default function LeasingPage() {
  return <><Header active="/solutions/" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/solutions/", label: "Решения" }, { label: "Лизинг" }]} />
    <main className="leasing-page">
      <section className="wrap leasing-hero"><div className="leasing-hero-copy"><p className="eyebrow">Для кофейни и ресторана</p><h1>Кофемашина Sanremo в лизинг</h1><p className="lead">Выберите машину, а условия покупки рассчитаем под вашу компанию. Партнёр по лизингу — Аренза.</p><div className="leasing-hero-actions"><a className="btn btn-solid" href="#leasing-request">Оставить заявку</a></div></div><div className="leasing-hero-photo"><img src={officialImageForModel("f18-sb") ?? ""} alt="Профессиональная кофемашина Sanremo F18 Single Boiler" /></div></section>
      <section className="wrap section-tight leasing-section leasing-intro"><div className="leasing-section-head"><p className="eyebrow">Покупка оборудования</p><h2>Машина для вашего проекта</h2></div><div className="leasing-explain"><p>Лизинг помогает приобрести профессиональную кофемашину Sanremo для действующей или новой кофейни без единовременной оплаты всей стоимости. Вы можете выбрать модель и исполнение в каталоге, указать количество машин и оставить заявку прямо на сайте. Если модель уже выбрана, ссылка из карточки перенесёт её название и артикул в форму.</p><p>Мы уточним комплектацию и подготовим документы для передачи партнёру. Аренза рассмотрит заявку и предложит условия для вашей компании. После заключения договора лизинговая компания купит оборудование и передаст его вам. Монтаж, подключение и запуск выполняют дилеры и сервисные партнёры Sanremo в России. Гарантийное обращение принимает дилер, у которого приобретена машина. Если вы ещё выбираете оборудование, сначала сравните линейки или воспользуйтесь подборщиком. Условия финансирования рассчитаем индивидуально.</p></div></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Пять шагов</p><h2>От выбора до запуска</h2></div><ol className="leasing-steps">{steps.map(([title, description]) => <li key={title}><b>{title}</b><p>{description}</p></li>)}</ol></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Выбор машины</p><h2>Начните с модели</h2><p>Посмотрите исполнения и характеристики, затем откройте заявку на лизинг из карточки выбранной машины.</p></div><div className="leasing-models">{chosen.map((model) => <a key={model.slug} href={modelPath(model)}><img src={officialImageForModel(model.slug) ?? ""} alt={`Sanremo ${model.name}`} /><strong>{model.name}</strong><span>Исполнения и характеристики</span></a>)}</div><p className="leasing-more"><a href="/choose/">Подбор по задаче</a><a href="/compare/">Сравнение линеек</a><a href="/dealers/">Где купить</a></p></section>
      <section className="wrap section-tight leasing-section" id="leasing-request"><div className="leasing-section-head"><p className="eyebrow">Заявка на лизинг</p><h2>Получить условия для вашей компании</h2><p>Укажите машину и контакты. Менеджер свяжется с вами и подготовит заявку для Арензы.</p></div><LeasingRequest /></section>
      <section className="wrap section-tight leasing-section"><div className="leasing-section-head"><p className="eyebrow">Перед заявкой</p><h2>Частые вопросы</h2></div><FaqBlock questions={questions} title="" schema={false} /></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(questions)) }} />
    </main><Footer /></>;
}
