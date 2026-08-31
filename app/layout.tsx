import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sanremo Russia — профессиональные кофемашины",
  description:
    "Официальный каталог профессиональных кофемашин Sanremo в России.",
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
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
