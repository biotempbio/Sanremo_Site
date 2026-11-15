/** Only a confirmed colour and finish may be shared between group counts. */
export function groupCount(name) {
  return Number(String(name ?? '').match(/\b([1-3])\s*(?:гр\.?|gr\b)/i)?.[1] ?? 0) || null;
}

const clean = (value) => String(value ?? '').toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').replace(/\s+/g, ' ').trim();

export function visualIdentity(item, base) {
  const name = clean(item.name);
  const color = clean(base?.color) || (
    /черно.красн/.test(name) ? 'черно-красная' :
    /черно.бел/.test(name) ? 'черно-белая' :
    /бел.*дерев|white.*wood/.test(name) ? 'белая с деревом' :
    /сталь.*голуб|steel.*blue/.test(name) ? 'сталь и голубой' :
    /сталь.*красн|steel.*red/.test(name) ? 'сталь и красный' :
    /голуб|blue/.test(name) ? 'голубая' :
    /розов|pink/.test(name) ? 'розовая' :
    /коричнев|brown/.test(name) ? 'коричневая' :
    /total black/.test(name) ? 'total black' :
    /total white/.test(name) ? 'total white' :
    /черн|black/.test(name) ? 'черная' :
    /бел|white/.test(name) ? 'белая' : '');
  const finish = clean(base?.edition) || (
    /custom renegade/.test(name) ? 'custom renegade' :
    /naked/.test(name) ? 'naked' :
    /racing/.test(name) ? 'racing' :
    /freedom/.test(name) ? 'freedom' :
    /dolomiti/.test(name) ? 'dolomiti' : '');
  if (!color) return null;
  return `${item.modelSlug ?? base?.model ?? ''}|${color}|${finish}`;
}
