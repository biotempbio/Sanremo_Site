import rawDocuments from "@/data/documents.json";

export type DocumentEntry = {
  id: string;
  name: string;
  type: string;
  models: string[];
  href: string;
  bytes: number;
  pages: number | null;
  source: string;
};

export const documents = rawDocuments as DocumentEntry[];
export const documentsForModel = (slug: string) => documents.filter((document) => document.models.includes(slug));
export const fileSizeMb = (bytes: number) => `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(bytes / 1_000_000)} МБ`;
