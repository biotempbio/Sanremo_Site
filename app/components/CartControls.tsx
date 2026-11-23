'use client';
import { useEffect, useState } from 'react';
import { CART_KEY,CART_EVENT,readCart,changeCart,type CartItem } from '@/lib/cart-core.mjs';
export function writeCart(items:CartItem[]){localStorage.setItem(CART_KEY,JSON.stringify(items));window.dispatchEvent(new Event(CART_EVENT));}
export function useCart(){
 const[items,setItems]=useState<CartItem[]>([]);const[ready,setReady]=useState(false);
 useEffect(()=>{const update=()=>{try{setItems(readCart(localStorage.getItem(CART_KEY)));}catch{setItems([]);}setReady(true);};update();window.addEventListener(CART_EVENT,update);window.addEventListener('storage',update);return()=>{window.removeEventListener(CART_EVENT,update);window.removeEventListener('storage',update);};},[]);
 return {items,ready};
}
export function CartLink(){const{items}=useCart();const count=items.reduce((n,s)=>n+s.quantity,0);return <a className="cart-link" href="/cart/" aria-label={`Корзина${count?`, товаров: ${count}`:''}`}>Корзина{count>0&&<span aria-hidden="true"> ({count})</span>}</a>;}
export function AddToCart({code,disabled=false}:{code:string;disabled?:boolean}){
 const[added,setAdded]=useState(false);const[error,setError]=useState('');
 function add(){try{const items=readCart(localStorage.getItem(CART_KEY));const quantity=(items.find(s=>s.code===code)?.quantity??0)+1;writeCart(changeCart(items,code,quantity));setAdded(true);setError('');}catch(e){setError(e instanceof Error?e.message:'Разрешите сохранение корзины в браузере.');}}
 useEffect(()=>{setAdded(false);setError('');},[code]);
 return <><button type="button" className="btn btn-solid" disabled={disabled} onClick={add}>{added?'Добавлено в корзину':'В корзину'}</button>{added&&<a className="btn" href="/cart/">Оформить заказ</a>}{error&&<span role="alert" className="cart-error">{error}</span>}</>;
}
