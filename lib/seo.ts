export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://staging.sanremomachines.ru";
export const CONTENT_DATE = "2026-11-11";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function itemList(name: string, entries: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "ItemList", name,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem", position: index + 1, name: entry.name, url: absoluteUrl(entry.path),
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

export function articleSchema(headline: string, description: string, path: string) {
  return {
    "@context": "https://schema.org", "@type": "Article", headline, description,
    mainEntityOfPage: absoluteUrl(path),
    author: { "@type": "Organization", name: "BIO" },
    publisher: { "@type": "Organization", name: "BIO", url: SITE_URL },
    datePublished: CONTENT_DATE, dateModified: CONTENT_DATE, inLanguage: "ru-RU",
  };
}
