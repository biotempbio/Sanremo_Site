// Two-group dimensions from the drawings, in width × height × depth order.
// Keep drawing axes separate from the unlabelled triples in the source catalog.
export const comparisonSpecifications: Record<string, { dimensions: string; source: string; control?: string; boiler?: string; temperature?: string; electrical?: string }> = {
  "zoe-competition": { dimensions: "720 × 570 × 530 мм (Ш × В × Г; Tall)", control: "Автоматическая, программируемые дозы", boiler: "9 л, паровой бойлер", temperature: "Регулируемый прессостат", electrical: "3,2 кВт макс.; ТЭН 2,7 кВт; 220–240 В", source: "/documents/brochures/zoe-2026-ru.pdf" },
  d8: { dimensions: "808 × 500 × 555 мм (Ш × В × Г)", source: "/documents/d8/81017010-en-ru-r0.pdf" },
  "d8-pro": { dimensions: "807 × 496 × 554 мм (Ш × В × Г)", source: "/documents/d8-pro/d8-pro-manual-eng-ru.pdf" },
  "f18-mb": { dimensions: "902 × 526 × 646,5 мм (Ш × В × Г)", source: "/documents/f18-mb/81014003a-libro-utente-f18-rus.pdf" },
  "cafe-racer": { dimensions: "877 × 534 × 702 мм (Ш × В × Г)", source: "/documents/cafe-racer/instruktsiya-cafe-racer.pdf" },
};
