/* eslint-disable @next/next/no-img-element -- noscript analytics pixel */
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Canonical } from "./components/Canonical";
import { AnalyticsEvents } from "./components/AnalyticsEvents";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: { yandex: "114d33d3fd4da962" },
  title: "Sanremo Russia — профессиональные кофемашины",
  description:
    "Официальный каталог профессиональных кофемашин Sanremo в России.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-120.png", type: "image/png", sizes: "120x120" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Sanremo Russia — профессиональные кофемашины",
    description:
      "Подбор кофемашины, каталог, сравнение, сервис и запчасти Sanremo.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanremo Russia — профессиональные кофемашины",
    description:
      "Подбор кофемашины, каталог, сравнение, сервис и запчасти Sanremo.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const metrikaId = siteUrl === "https://sanremomachines.ru" ? process.env.NEXT_PUBLIC_METRIKA_ID : undefined;
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: "BIO", description: "Официальный дистрибьютор Sanremo в России", url: siteUrl, telephone: "+7 495 363-38-01", email: "info@sanremomachines.ru", contactPoint: { "@type": "ContactPoint", contactType: "Отдел продаж", telephone: "+7 495 363-38-01", email: "info@sanremomachines.ru", availableLanguage: "ru", areaServed: "RU" }, areaServed: { "@type": "Country", name: "Россия", identifier: "RU" }, address: { "@type": "PostalAddress", postalCode: "117630", addressLocality: "Москва", streetAddress: "ул. Обручева, 23с1, БЦ «Геолог», 4 этаж", addressCountry: "RU" }, sameAs: ["https://sanremomachines.ru/"] };
  return (
    <html lang="ru">
      <body><Canonical siteUrl={siteUrl} /><AnalyticsEvents />{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />{metrikaId ? <><Script id="yandex-metrika" strategy="afterInteractive">{`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${JSON.stringify(metrikaId)},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,trackHash:true});`}</Script><noscript><div><img src={`https://mc.yandex.ru/watch/${metrikaId}`} style={{ position: "absolute", left: -9999 }} alt="" /></div></noscript></> : null}</body>
    </html>
  );
}
