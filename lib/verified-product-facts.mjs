// Manufacturer ZOE_EN_2026_09, printed page 14 (PDF page 9).
// Exact executions only: older Zoe/Competition and Compact are different products.
export const zoeBrochure = "/documents/brochures/zoe-stainless-en.pdf";
const newZoeExecutions = {
  "205904": "ZRC414000000",
  "208942": "ZRC414010200",
  "208943": "ZRC414A10200",
};

export function isStainlessZoe(sku) {
  return sku.model === "zoe-competition" && sku.groups === 2
    && Object.hasOwn(newZoeExecutions, sku.code)
    && newZoeExecutions[sku.code] === sku.vendorCode;
}

function correctZoeText(text) {
  return text
    .replace(/(бойлер[а-яё]*\s+(?:объ[её]мом|объ[её]м)\s*)\d+(?:[.,]\d+)?\s*л(?=\s|[.,;:!?)]|$)/giu, (_, label) => `${label}7 л`)
    .replace(/(объ[её]м\s+бойлера\s*[:,]?\s*)\d+(?:[.,]\d+)?\s*л(?=\s|[.,;:!?)]|$)/giu, (_, label) => `${label}7 л`)
    .replace(/медный бойлер/giu, (match) => `${match[0] === "М" ? "Б" : "б"}ойлер из нержавеющей стали AISI 316L`)
    .replace(/бойлер из меди/giu, "Бойлер из нержавеющей стали AISI 316L")
    .replace(/(мощность\s*(?:[:—–-]\s*)?)3[.,]2\s*кВт/giu, (_, label) => `${label}3 кВт`)
    .replace(/3[.,]2\s*кВт/giu, "3 кВт")
    .replace(/(высота(?: группы)?\s*)142\s*мм/giu, (_, label) => `${label}140 мм`);
}

// Apply after merging a fresh commercial snapshot, and also to the static fallback.
// Never edit the source export or touch its prices, stock, photos and other models.
export function applyVerifiedProductFacts(sku) {
  if (!isStainlessZoe(sku)) return sku;
  return {
    ...sku,
    boilerTotal: "7",
    power: 3,
    description: correctZoeText(sku.description),
    descriptionBlocks: sku.descriptionBlocks?.map((block) => block.type === "list"
      ? { ...block, items: block.items.map(correctZoeText) }
      : { ...block, text: correctZoeText(block.text) }),
    secondaryProps: sku.secondaryProps?.map((prop) => {
      if (/объ[её]м\s+бойлера/i.test(prop.name)) return { ...prop, value: "7" };
      if (/^мощность,?\s*кВт$/i.test(prop.name)) return { ...prop, value: "3" };
      return prop;
    }),
  };
}
