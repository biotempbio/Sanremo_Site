import { pageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { Header, Footer } from "../../components/Chrome";
import { BaristaAccessories } from "../../components/BaristaAccessories";
import { Crumbs } from "../../components/Bits";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { X_ONE_META_DESCRIPTION, X_ONE_SEARCH_DESCRIPTION, xOneEntries, xOneVariants, xOneEntryColor, xOneProductPath, xOneProductImage } from "@/lib/x-one";
import XOnePicker from "./XOnePicker";

export const metadata: Metadata = pageMetadata("/products/x-one/", {
  title: "Кофемолка Sanremo X-One (X1) — купить у официального дистрибьютора",
  description: X_ONE_META_DESCRIPTION,
});

export default function XOnePage() {
  const product = {
    "@context": "https://schema.org", "@type": "ProductGroup", productGroupID: "x-one", variesBy: ["https://schema.org/color"], name: "Кофемолка Sanremo X-One",
    description: X_ONE_SEARCH_DESCRIPTION, brand: { "@type": "Brand", name: "Sanremo" },
    image: absoluteUrl("/photo/official/x-one.webp"), url: absoluteUrl("/products/x-one/"),
    hasVariant: xOneEntries.filter((item) => item.rrp > 0).map((item) => ({
      "@type": "Product", name: `Sanremo X-One ${xOneEntryColor(item)}`,
      sku: item.code, color: xOneEntryColor(item), description: X_ONE_SEARCH_DESCRIPTION,
      brand: { "@type": "Brand", name: "Sanremo" },
      image: xOneProductImage(item) ? absoluteUrl(xOneProductImage(item)!) : undefined,
      url: absoluteUrl(xOneProductPath(item)),
      offers: { "@type": "Offer", price: item.rrp, priceCurrency: "RUB",
        availability: item.availability === "reserved" ? "https://schema.org/OutOfStock" : item.availability === "on_order" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
        url: absoluteUrl(xOneProductPath(item)), seller: { "@type": "Organization", name: "BIO" },
      },
    })),
  };
  return <><Header active="/products" /><Crumbs items={[{ href: "/", label: "Главная" }, { href: "/products/", label: "Кофемашины" }, { href: "/products/grinders/", label: "Кофемолки" }, { label: "X-One" }]} /><main><XOnePicker variants={xOneVariants} entries={xOneEntries} /></main><BaristaAccessories /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(product) }} /><Footer /></>;
}
