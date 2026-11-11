import { Question, faqSchema, jsonLd } from "@/lib/seo";

export function RelatedReading() {
  return <section className="guide-related" aria-label="Продолжить выбор">
    <h2>Следующий шаг</h2>
    <div className="grid g3">
      <a href="/choose/">Подобрать версию по задаче →</a>
      <a href="/guide/linejki-sanremo/">Сравнить линейки Sanremo →</a>
      <a href="/dealers/">Найти дилера в регионе →</a>
    </div>
  </section>;
}

export function FaqBlock({ questions, title = "Частые вопросы", schema = true }: { questions: (Question & { actionHref?: string; actionLabel?: string })[]; title?: string; schema?: boolean }) {
  return <section className="guide-faq" aria-label={title}>
    <h2>{title}</h2>
    {questions.map(({ question, answer, actionHref, actionLabel }) => <details key={question}>
      <summary>{question}</summary><p>{answer}{actionHref ? <> <a href={actionHref}>{actionLabel ?? "Оставить заявку"} →</a></> : null}</p>
    </details>)}
    {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(questions)) }} /> : null}
  </section>;
}
