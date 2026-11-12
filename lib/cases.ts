import rawCases from "@/data/cases.json";

export type Sourced<T> = { value: T; source: string };
export type SanremoCase = {
  slug: string;
  name: Sourced<string>;
  format: Sourced<string>;
  city: Sourced<string>;
  address?: Sourced<string>;
  model?: Sourced<string> & { family: string };
  groups?: Sourced<number>;
  traffic?: Sourced<string>;
  milkShare?: Sourced<string>;
  baristas?: Sourced<number>;
  reason?: Sourced<string>;
  quote?: Sourced<string>;
  networkSize?: Sourced<string>;
  summary: Sourced<string>;
  story?: Sourced<string>[];
  photos: Sourced<string>[];
  order: number;
  cover: string;
  page?: boolean;
};

export const sanremoCases = (rawCases as unknown as SanremoCase[]).sort((a, b) => a.order - b.order);
export const detailedCases = sanremoCases.filter((entry) => entry.page && entry.story);
export const casesForFamily = (family: string) => sanremoCases.filter((entry) => entry.model?.family === family);
export const caseHref = (entry: SanremoCase) => entry.page ? `/cases/${entry.slug}/` : `/cases/#${entry.slug}`;
