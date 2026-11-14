// Public copy only. Never infer descriptions from prices, stock or other fields.
const entities={nbsp:' ',amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",ndash:'–',mdash:'—',bull:'•',middot:'·',trade:'™',reg:'®',copy:'©',deg:'°',times:'×',hellip:'…',laquo:'«',raquo:'»'};
const decode=value=>value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi,(all,key)=>{
 if(key[0]!=='#')return entities[key.toLowerCase()]??all;
 const n=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):Number(key.slice(1));
 return n>0&&n<=0x10ffff&&!(n>=0xd800&&n<=0xdfff)?String.fromCodePoint(n):'';
});
const tidy=value=>value.replace(/[\t \u00a0]+/g,' ').trim();
const caps=value=>value.length<=100&&/[А-ЯЁ]{4}/u.test(value)&&!/[а-яё]/u.test(value)&&!/[.!?;]$/.test(value);
function heading(value){
 if(!caps(value))return value;
 const s=value.replace(/[А-ЯЁ]+/gu,w=>w.toLocaleLowerCase('ru-RU'));
 return s.charAt(0).toLocaleUpperCase('ru-RU')+s.slice(1);
}
export function descriptionBlocks(value){
 if(typeof value!=='string'||!value.trim())return [];
 // Convert only structural markup to text events; no source HTML is emitted.
 const source=value.replace(/<!--[\s\S]*?(?:-->|$)/g,'').replace(/<(script|style|template|noscript|svg|math|iframe|object)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)/gi,'')
 .replace(/<h[1-6]\b[^>]*>/gi,'\n\u0001').replace(/<\/h[1-6]\s*>/gi,'\n')
 .replace(/<li\b[^>]*>/gi,'\n• ').replace(/<\/(?:li|ul|ol)\s*>/gi,'\n')
 .replace(/<(?:br|hr)\b[^>]*\/?\s*>/gi,'\n').replace(/<\/?(?:p|div|section|article|table|tr|td|th|dt|dd|blockquote|pre)\b[^>]*>/gi,'\n')
 .replace(/<[^>]*>/g,'');
 const blocks=[];
 for(const raw of decode(source).replace(/\r\n?/g,'\n').split('\n')){
  const marked=raw.startsWith('\u0001');const line=tidy(raw.replace(/^\u0001/,''));if(!line)continue;
  const bullet=line.match(/^(?:[•●▪◦*–—-]|\d+[.)])\s+(.+)/u);
  if(bullet){const last=blocks.at(-1);if(last?.type==='list')last.items.push(bullet[1]);else blocks.push({type:'list',items:[bullet[1]]});}
  else blocks.push({type:marked||caps(line)?'heading':'paragraph',text:marked||caps(line)?heading(line):line});
 }
 return blocks;
}
export function descriptionText(blocks){return blocks.map(b=>b.type==='list'?b.items.map(x=>'• '+x).join('\n'):b.text).join('\n\n');}
export function extractDescription(source){
 for(const key of ['fullDescription','descriptionHtml','description','Описание']){
  const blocks=descriptionBlocks(source?.[key]);if(blocks.length)return {text:descriptionText(blocks),blocks};
 }
 return {text:'',blocks:[]};
}
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function descriptionHtml(value, savedBlocks){
 const blocks=Array.isArray(savedBlocks)&&savedBlocks.length?savedBlocks.filter(b=>b&&(['paragraph','heading'].includes(b.type)?typeof b.text==='string':b.type==='list'&&Array.isArray(b.items)&&b.items.every(x=>typeof x==='string'))):descriptionBlocks(value);
 return blocks.map(b=>b.type==='heading'?`<h3>${escape(b.text)}</h3>`:b.type==='list'?`<ul>${b.items.map(x=>`<li>${escape(x)}</li>`).join('')}</ul>`:`<p>${escape(b.text)}</p>`).join('');}
