export type CartItem={code:string;quantity:number};
export const CART_KEY:string;
export const CART_EVENT:string;
export function readCart(raw:string|null):CartItem[];
export function changeCart(items:CartItem[],code:string,quantity:number):CartItem[];
