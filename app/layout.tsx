import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Canonical } from "./components/Canonical";
import { AnalyticsEvents } from "./components/AnalyticsEvents";
import { SITE_EMAIL } from "@/lib/site-contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: { yandex: "114d33d3fd4da962" },
  title: "Sanremo Russia — профессиональные кофемашины",
  description:
    "Официальный каталог профессиональных кофемашин Sanremo в России.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/favicon-120.png?v=3", type: "image/png", sizes: "120x120" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" }],
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
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: "BIO", description: "Официальный дистрибьютор Sanremo в России", url: siteUrl, telephone: "+7 495 363-38-01", email: SITE_EMAIL, contactPoint: { "@type": "ContactPoint", contactType: "Отдел продаж", telephone: "+7 495 363-38-01", email: SITE_EMAIL, availableLanguage: "ru", areaServed: "RU" }, areaServed: { "@type": "Country", name: "Россия", identifier: "RU" }, address: { "@type": "PostalAddress", postalCode: "117630", addressLocality: "Москва", streetAddress: "ул. Обручева, 23с1, БЦ «Геолог», 4 этаж", addressCountry: "RU" }, sameAs: ["https://sanremomachines.ru/"] };
  return (
    <html lang="ru">
      <head><script dangerouslySetInnerHTML={{ __html: "if(location.hostname!=='sanremomachines.ru'){var m=document.createElement('meta');m.name='robots';m.content='noindex,nofollow';document.head.appendChild(m)}" }} /></head>
      <body><Canonical siteUrl={siteUrl} /><AnalyticsEvents />{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />{metrikaId ? <Script id="yandex-metrika" strategy="afterInteractive">{`if(window.location.hostname==='sanremomachines.ru'){(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${JSON.stringify(metrikaId)},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,trackHash:true});}`}</Script> : null}</body>
    </html>
  );
}
