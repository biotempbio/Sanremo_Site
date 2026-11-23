import { shopProducts } from '@/lib/shop-catalog';
import { PRICE_DATE_ISO, STOCK_DATE_ISO } from '@/lib/catalog';
export const dynamic='force-static';
export function GET(){return Response.json({currency:'RUB',priceDate:PRICE_DATE_ISO,stockDate:STOCK_DATE_ISO,products:shopProducts()});}
