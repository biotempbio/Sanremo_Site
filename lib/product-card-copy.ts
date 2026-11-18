import { cleanDescriptionBlocks, descriptionBlocks } from "./product-description.mjs";
import type { DescriptionBlock } from "./catalog";

export function showDescription(blocks: DescriptionBlock[], raw: string, modelName: string) {
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
    if (!text) continue;
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
  // Opera's source is a sequence of paragraphs, including long sentences.
  // Keep those facts, but group them by task instead of relying on length to
  // recognise a list. This also applies when the selected colour/SKU changes.
  if (/^opera$/i.test(modelName) && result.every((block) => block.type === "paragraph")) {
    const sections = [
      { title: "Экстракция и управление", items: [] as string[] },
      { title: "Пар, горячая вода и чашки", items: [] as string[] },
      { title: "Мультибойлерная система", items: [] as string[] },
      { title: "Материалы и обслуживание", items: [] as string[] },
    ];
    for (const block of result) {
      if (block.type !== "paragraph" || /^Система мультибойлер\s*:/i.test(block.text)) continue;
      const text = block.text.replace(/Подключениек\s+Wi-fi/i, "Подключение к Wi-Fi")
        .replace(/(\d)(л)(?=[,\.\s]|$)/g, "$1\u00a0$2").replace(/[,;]$/, ".");
      const section = /бойлер для|бойлеры для|Бойлеры изготовлены/i.test(text) ? 2
        : /паровым|давления пара|подогреватель/i.test(text) ? 1
        : /изготовлены|Портафильтры|Внутренний дисплей|Wi-Fi|автодиагност|очистка|обслуживан/i.test(text) ? 3 : 0;
      sections[section].items.push(text);
    }
    return sections.flatMap(({ title, items }): DescriptionBlock[] => items.length
      ? [{ type: "heading", text: title }, { type: "list", items }] : []);
  }
  const structured = result.length >= 3 && result.every((block) => block.type === "paragraph" && block.text.length < 110)
    ? [{ type: "heading" as const, text: "Оснащение" }, { type: "list" as const, items: result.map((block) => (block as { text: string }).text) }]
    : result;
  return structured.flatMap((block) => block.type === "list" && block.items.length > 8
    ? [{ type: "list" as const, items: block.items.slice(0, 6) }, { type: "heading" as const, text: "Дополнительное оснащение" }, { type: "list" as const, items: block.items.slice(6) }]
    : [block]);
}
