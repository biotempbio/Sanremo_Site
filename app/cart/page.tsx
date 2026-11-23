import { pageMetadata } from '@/lib/page-metadata';
import { Header,Footer } from '../components/Chrome';
import { Crumbs } from '../components/Bits';
import { shopProducts } from '@/lib/shop-catalog';
import CartClient from './CartClient';
export const metadata=pageMetadata('/cart/',{title:'Корзина и оформление заказа — Sanremo',description:'Оформление заказа на кофемашины и кофемолки Sanremo по РРЦ без онлайн-оплаты.',robots:{index:false,follow:true}});
export default function CartPage(){return <><Header/><Crumbs items={[{href:'/',label:'Главная'},{href:'/products/',label:'Каталог'},{label:'Корзина'}]}/><main className="wrap section shop-page"><p className="eyebrow">Sanremo · заказ по РРЦ</p><h1>Корзина</h1><CartClient initialProducts={shopProducts()}/></main><Footer/></>;}
