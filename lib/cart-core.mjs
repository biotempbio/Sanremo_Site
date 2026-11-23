export const CART_KEY='sanremo-cart-v1';
export const CART_EVENT='sanremo-cart-change';
export function readCart(raw){
  try {const input=JSON.parse(raw||'[]');if(!Array.isArray(input))return[];const map=new Map();for(const item of input.slice(0,20)){if(typeof item?.code!=='string'||!item.code||item.code.length>64||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>99)continue;map.set(item.code,{code:item.code,quantity:item.quantity});}return[...map.values()];} catch{return[];}
}
export function changeCart(items,code,quantity){
  if(typeof code!=='string'||!code||code.length>64||!Number.isInteger(quantity)||quantity<0||quantity>99)throw new Error('Проверьте количество.');
  if(quantity===0)return items.filter(item=>item.code!==code);
  if(!items.some(item=>item.code===code)&&items.length>=20)throw new Error('В одном заказе можно оформить до 20 разных исполнений.');
  return items.some(item=>item.code===code)?items.map(item=>item.code===code?{code,quantity}:item):[...items,{code,quantity}];
}
