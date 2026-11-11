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
  return [
    { question: `Какие группы есть у Sanremo ${family.name}?`, answer: `Семейство ${family.name} включает исполнения с ${groups} группами. У конкретной версии набор может быть уже.` },
    { question: `Какие версии входят в семейство ${family.name}?`, answer: models.map((model) => model.name).join(", ") + ". На страницах версий доступны характеристики и матрица артикулов." },
    { question: `Сколько стоит Sanremo ${family.name}?`, answer: `Цены версий и исполнений указаны в матрице конфигураций. Выберите артикул, чтобы увидеть его цену и наличие.` },
    { question: `Есть ли ${family.name} в России?`, answer: stocked ? `На складе в Москве есть исполнения семейства ${family.name}. Наличие нужного артикула проверяйте в матрице конфигураций.` : `Сейчас исполнений семейства на складе в Москве нет. Варианты заказа уточняйте у дилера.` },
  ];
}
