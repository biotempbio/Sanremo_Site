import { Family, Model, Sku, money, stockUnitsOfModel } from "@/lib/catalog";
import { Question } from "@/lib/seo";

export function modelQuestions(model: Model, family: Family): Question[] {
  const groups = model.groupsAvailable.join(" / ");
  const stock = stockUnitsOfModel(model.slug);
  return [
    { question: `Сколько групп у Sanremo ${model.name}?`, answer: `Для ${model.name} указаны исполнения с ${groups} группами. Доступные сочетания зависят от артикула.` },
    { question: `Сколько стоит Sanremo ${model.name}?`, answer: `Цена начинается от ${money(model.priceFrom)}. Цена выбранной конфигурации показана рядом с её артикулом и наличием.` },
    { question: `Есть ли Sanremo ${model.name} на складе?`, answer: stock ? `Модель есть на складе в Москве${stock >= 3 ? ` — ${stock} шт.` : ""}. Статус нужного цвета и исполнения смотрите по артикулу.` : `Сейчас свободных единиц модели на складе в Москве нет. Возможность заказа конкретного исполнения уточняйте у дилера.` },
    { question: `Где найти характеристики и запчасти для ${model.name}?`, answer: `Архитектура семейства ${family.name} — ${family.architecture}. Мощность, напряжение и габариты смотрите в карточке выбранного артикула. Совместимые детали ищите в разделе запчастей.` },
  ];
}

export function familyQuestions(family: Family, models: Model[], skus: Sku[]): Question[] {
  const groups = [...new Set(models.flatMap((model) => model.groupsAvailable))].sort().join(" / ");
  const stocked = skus.some((sku) => sku.free > 0);
  const prices = skus.map((sku) => sku.rrp).filter((price) => price > 0);
  const priceFrom = prices.length ? Math.min(...prices) : null;
  return [
    { question: `Сколько групп у Sanremo ${family.name}?`, answer: `В линейке ${family.name} представлены исполнения с ${groups} группами. Число групп каждого артикула указано в таблице.` },
    { question: `Какие версии входят в линейку ${family.name}?`, answer: models.map((model) => model.name).join(", ") + ". Характеристики каждой версии приведены на её странице." },
    { question: `Сколько стоит Sanremo ${family.name}?`, answer: priceFrom !== null ? `Цена начинается от ${money(priceFrom)}. Цена каждого исполнения указана в таблице.` : "Цена нужного исполнения доступна по запросу у дилера." },
    { question: `Есть ли ${family.name} на складе в Москве?`, answer: stocked ? `Да, отдельные исполнения ${family.name} есть на складе в Москве. Наличие каждого артикула указано в таблице.` : `Сейчас исполнений ${family.name} на складе в Москве нет. Доступна поставка под заказ.` },
    { question: `Какой срок поставки ${family.name} под заказ?`, answer: "Поставка из Италии занимает 6–8 недель. Исполнения со статусом «На складе в Москве» отгружаются со склада." },
    { question: `Какая гарантия на ${family.name}?`, answer: "Гарантия составляет 12 месяцев с даты продажи. Гарантийные обращения принимает дилер, у которого куплена машина." },
    { question: `Кто монтирует и запускает ${family.name}?`, answer: "Монтаж и запуск выполняют дилеры и сервисные партнёры по России. При сложных случаях подключается технический специалист BIO." },
    { question: `Можно ли купить ${family.name} в лизинг?`, answer: "Да. Для покупки в лизинг оставьте заявку: подготовим документы для лизинговой компании." },
    { question: `На какой поток рассчитана ${family.name}?`, answer: `Подходящий поток зависит от числа групп и рабочего меню. Сравните версии ${family.name} в таблице и пройдите подбор по числу чашек в день.` },
  ];
}
