import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sanremomachines.ru"),
  title: {
    default: "Sanremo Россия — профессиональные кофемашины, РРЦ и наличие",
    template: "%s — Sanremo Россия",
  },
  description:
    "Официальная дистрибуция Sanremo в России: каталог профессиональных рожковых кофемашин, рекомендованные розничные цены, наличие на складе, дилерская сеть, сервис и запчасти. Компания BIO.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Sanremo Россия",
  },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sanremomachines.ru/#bio",
      name: "BIO",
      description: "Официальный дистрибьютор профессиональных кофемашин Sanremo в России",
      url: "https://sanremomachines.ru/",
      areaServed: "RU",
      telephone: "+7 800 500-64-95",
    },
    {
      "@type": "Brand",
      "@id": "https://sanremomachines.ru/#sanremo",
      name: "Sanremo Coffee Machines",
      description: "Итальянский производитель профессиональных рожковых кофемашин",
    },
    {
      "@type": "WebSite",
      "@id": "https://sanremomachines.ru/#website",
      name: "Sanremo Россия",
      inLanguage: "ru-RU",
      publisher: { "@id": "https://sanremomachines.ru/#bio" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://sanremomachines.ru/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
