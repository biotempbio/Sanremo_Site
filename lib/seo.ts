import { SITE_EMAIL } from "./site-contact";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";
export const CONTENT_DATE = "2026-11-11";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function itemList(name: string, entries: { name: string; path: string; image?: string | null }[]) {
  return {
    "@context": "https://schema.org", "@type": "ItemList", name,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem", position: index + 1, name: entry.name, url: absoluteUrl(entry.path),
      ...(entry.image ? { image: absoluteUrl(entry.image) } : {}),
    })),
  };
}

export type Question = { question: string; answer: string };
export function faqSchema(questions: Question[]) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question", name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function articleSchema(headline: string, description: string, path: string, dates?: { published?: string; modified: string }) {
  return {
    "@context": "https://schema.org", "@type": "Article", headline, description,
    mainEntityOfPage: absoluteUrl(path),
    author: { "@type": "Organization", name: "BIO" },
    publisher: { "@type": "Organization", name: "BIO", url: SITE_URL },
    datePublished: dates?.published ?? CONTENT_DATE, dateModified: dates?.modified ?? CONTENT_DATE, inLanguage: "ru-RU",
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization", "@id": absoluteUrl("/#organization"),
    name: "BIO — официальный дистрибьютор Sanremo в России",
    alternateName: ["BIO", "Sanremo Russia", "Sanremo Machines"],
    brand: { "@type": "Brand", name: "Sanremo" },
    description: "Компания BIO — официальный дистрибьютор кофемашин Sanremo в России",
    url: absoluteUrl("/"), logo: absoluteUrl("/favicon-120.png"),
    telephone: "+7 495 363-38-01", email: SITE_EMAIL,
    contactPoint: { "@type": "ContactPoint", contactType: "Отдел продаж", telephone: "+7 495 363-38-01", email: SITE_EMAIL, availableLanguage: "ru", areaServed: "RU" },
    areaServed: { "@type": "Country", name: "Россия", identifier: "RU" },
    address: { "@type": "PostalAddress", postalCode: "117630", addressLocality: "Москва", streetAddress: "ул. Обручева, 23с1, БЦ «Геолог», 4 этаж", addressCountry: "RU" },
    sameAs: ["https://t.me/sanremofamily"],
  };
}

export function websiteSchema() {
  return { "@type": "WebSite", "@id": absoluteUrl("/#website"), url: absoluteUrl("/"), name: "Sanremo Machines", alternateName: "Sanremo Russia", inLanguage: "ru-RU", publisher: { "@id": absoluteUrl("/#organization") } };
}
