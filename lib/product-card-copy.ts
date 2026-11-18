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
