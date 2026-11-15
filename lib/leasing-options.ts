import { models, skusOfModel, type Sku } from "./catalog";
import { pluralize } from "./format";

export type LeasingVariant = {
  value: string;
  label: string;
  codes: string[];
};

export type LeasingModelOption = {
  slug: string;
  name: string;
  variants: LeasingVariant[];
};

// Keep the same family sequence as the catalog, with the editions inside each family.
const MODEL_ORDER = [
  "zoe-compact", "zoe-competition", "zoe-sed", "zoe-sap",
  "d8", "d8-pro", "f18-sb", "f18-mb", "cafe-racer", "opera", "you",
];

function baseLabel(sku: Sku) {
  return [
    sku.groups ? `${sku.groups} ${pluralize(sku.groups, "группа", "группы", "групп")}` : null,
    sku.color,
    sku.edition && sku.edition !== "Base" ? sku.edition : null,
  ].filter(Boolean).join(" · ");
}

export function leasingModelOptions(): LeasingModelOption[] {
  return [...models]
    .sort((a, b) => (MODEL_ORDER.indexOf(a.slug) < 0 ? 999 : MODEL_ORDER.indexOf(a.slug))
      - (MODEL_ORDER.indexOf(b.slug) < 0 ? 999 : MODEL_ORDER.indexOf(b.slug)))
    .map((model) => {
      const skus = skusOfModel(model.slug);
      const groups = new Map<string, Sku[]>();
      for (const sku of skus) {
        const key = JSON.stringify([sku.groups, sku.color, sku.edition, sku.groupHeight, [...sku.options].sort()]);
        groups.set(key, [...(groups.get(key) ?? []), sku]);
      }
      const variants = [...groups.values()].map((entries) => {
        const preferred = [...entries].sort((a, b) => b.free - a.free || a.rrp - b.rrp)[0];
        const sameBase = skus.filter((sku) => baseLabel(sku) === baseLabel(preferred));
        const heightDiffers = new Set(sameBase.map((sku) => sku.groupHeight ?? "")).size > 1;
        const optionsDiffer = new Set(sameBase.map((sku) => [...sku.options].sort().join(", "))).size > 1;
        const label = [
          baseLabel(preferred) || "Исполнение",
          heightDiffers ? (preferred.groupHeight ? `${preferred.groupHeight} группа` : "Стандартная группа") : null,
          optionsDiffer ? (preferred.options.length ? preferred.options.join(", ") : "Без дополнительных опций") : null,
        ].filter(Boolean).join(" · ");
        return {
          value: preferred.code,
          label,
          codes: entries.flatMap((sku) => [sku.code, sku.vendorCode].filter((code): code is string => Boolean(code))),
        };
      });
      variants.sort((a, b) => {
        const aGroup = Number(a.label.match(/^\d+/)?.[0] ?? 0);
        const bGroup = Number(b.label.match(/^\d+/)?.[0] ?? 0);
        return aGroup - bGroup || a.label.localeCompare(b.label, "ru");
      });
      return { slug: model.slug, name: model.name, variants };
    })
    .filter((model) => model.variants.length > 0);
}
