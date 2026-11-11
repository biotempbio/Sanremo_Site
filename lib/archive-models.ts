export const ARCHIVE_MODELS = {
  napoli: { name: "Napoli", partsQuery: "Napoli" },
  cube: { name: "Cube", partsQuery: "Cube" },
  verona: { name: "Verona", partsQuery: "Verona" },
  "verona-rs": { name: "Verona RS", partsQuery: "Verona RS" },
  torino: { name: "Torino", partsQuery: "Torino" },
} as const;

export type ArchiveModelSlug = keyof typeof ARCHIVE_MODELS;
