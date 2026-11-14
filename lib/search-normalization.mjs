// Search keys only: keep source names, SKU codes, URLs and articles unchanged.
const twins={р:'p',с:'c',а:'a',е:'e',к:'k',м:'m',н:'h',о:'o',т:'t',х:'x',в:'b'};
export function normalizeCatalogSearch(value){return String(value??'').normalize('NFKC').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[рсаекмнотхв]/g,c=>twins[c]).replace(/\s+/g,' ').trim();}
