import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import { FaqBlock } from "../components/GuideBlocks";
import { Question, faqSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Вопросы о кофемашинах Sanremo в России",
  description: "Ответы о выборе, ценах, наличии, поставке, сервисе, запчастях, подключении и дилерах Sanremo в России. Уточняйте условия по конкретной конфигурации.",
};

const questions: (Question & { actionHref?: string; actionLabel?: string })[] = [
  { question: "Где посмотреть доступные модели Sanremo?", answer: "В каталоге есть модели, версии, цены и наличие." },
  { question: "Есть ли официальная гарантия?", answer: "12 месяцев с даты продажи. Гарантийные обращения принимает дилер, у которого куплена машина; при сложных случаях подключается технический специалист BIO." },
  { question: "Где купить кофемашину Sanremo?", answer: "Выберите дилера в разделе «Где купить». Если вашего города нет в списке, отправьте запрос с указанием региона." },
  { question: "Что означает статус «На складе в Москве»?", answer: "Машина есть на московском складе. Количество от трёх штук указано рядом с выбранной версией." },
  { question: "Сколько ждать машину под заказ?", answer: "6–8 недель — поставка из Италии. Машины со статусом «На складе в Москве» отгружаются со склада." },
  { question: "Можно ли выбрать цвет и число групп?", answer: "Да. Доступные сочетания показаны в карточке модели; при выборе меняются цена и наличие." },
  { question: "Как найти запчасть для своей машины?", answer: "Ищите по артикулу, названию узла или модели в разделе «Запчасти». Для проверки совместимости укажите серийный номер машины." },
  { question: "Есть ли сервис в регионах?", answer: "Да — через дилеров и сервисных партнёров по всей стране. Ближайшего найдёте в разделе «Где купить»." },
  { question: "Кто выполняет монтаж и запуск?", answer: "Монтаж и запуск выполняют дилеры и сервисные партнёры BIO по всей России. Процедура стандартная; если возникнут сложности, на связи технический специалист BIO." },
  { question: "Какое питание нужно: 220 или 380 В?", answer: "Напряжение и мощность зависят от выбранной версии. Сверьте их с электросетью площадки перед заказом." },
  { question: "Нужна ли фильтрация воды?", answer: "Да, схему водоподготовки подбирают по качеству воды на площадке и требованиям машины. Обсудите её с сервисным специалистом до монтажа." },
  { question: "Обучают ли бариста при покупке?", answer: "Мы не проводим обучение бариста сами. На сайте собрана полная информация по каждой модели, а если нужен курс работы на Sanremo — порекомендуем школу бариста." },
  { question: "Где посмотреть цену выбранной версии?", answer: "Выберите число групп и исполнение в карточке модели — цена и наличие обновятся сразу." },
  { question: "Как стать дилером Sanremo?", answer: "Отправьте заявку с регионом, названием компании и опытом работы с профессиональным оборудованием." },
  { question: "Можно ли купить в лизинг?", answer: "Да. Работаем по стандартной схеме с лизинговыми компаниями: готовим документы, лизинговая компания покупает оборудование и передаёт его вам. Оставьте заявку — подготовим предложение.", actionHref: "/contacts/", actionLabel: "Оставить заявку" },
];

export default function FaqPage() {
  const groups = [
    { title: "Покупка", items: [0, 1, 2, 3, 4, 5, 12, 14] },
    { title: "Сервис", items: [6, 7] },
    { title: "Монтаж и обучение", items: [8, 9, 10, 11] },
    { title: "Дилерам", items: [13] },
  ];
  return <><Header /><Crumbs items={[{ href: "/", label: "Главная" }, { label: "Частые вопросы" }]} />
    <main className="wrap section guide-page faq-page"><header className="guide-intro"><p className="eyebrow">Покупка и владение</p><h1>Частые вопросы о Sanremo</h1>
      <p className="lead">Здесь собраны ответы о выборе кофемашины, покупке через дилера, запуске и обслуживании в России.</p></header>
      <nav className="faq-jump" aria-label="Темы вопросов">{groups.map((group) => <a key={group.title} href={"#faq-" + group.title.toLowerCase().replaceAll(" ", "-")}>{group.title}<span>{group.items.length}</span></a>)}</nav>
      <div className="faq-groups">{groups.map((group) => <div id={"faq-" + group.title.toLowerCase().replaceAll(" ", "-")} key={group.title}><FaqBlock questions={group.items.map((index) => questions[index])} title={group.title} schema={false} /></div>)}</div>
      <div className="faq-next"><p>Не нашли ответ по своей модели?</p><a className="btn btn-solid" href="/contacts/">Задать вопрос</a><a className="btn" href="/guide/">Читать гид по выбору</a></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(questions)) }} />
    </main><Footer /></>;
}
