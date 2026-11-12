"use client";

import { FormEvent, ReactNode, useState } from "react";
import { SITE_EMAIL, SITE_MAILTO } from "@/lib/site-contact";

declare global { interface Window { ym?: (...args: unknown[]) => void } }

export function LeadForm({ form, children, className, style, submitLabel }: { form: "contacts" | "service"; children: ReactNode; className?: string; style?: React.CSSProperties; submitLabel?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [ticket, setTicket] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    if (!element.reportValidity()) return;
    const data = Object.fromEntries(new FormData(element).entries());
    setState("sending");
    try {
      const endpoint = process.env.NEXT_PUBLIC_LEAD_API_URL || "https://api.carbomapro.ru/v1/contact-leads";
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, form, page: location.href }) });
      if (!response.ok) throw new Error("request failed");
      const result = await response.json();
      setTicket(result.requestId ?? "принято"); setState("sent");
      const id = process.env.NEXT_PUBLIC_METRIKA_ID; if (id && location.hostname === "sanremomachines.ru" && window.ym) window.ym(Number(id), "reachGoal", "lead_sent");
    } catch { setState("error"); }
  }
  if (state === "sent") return <div className="form-result" role="status"><p className="eyebrow">Обращение № {ticket}</p><h3>Заявка отправлена</h3><p>Ответим в рабочее время. Если вопрос срочный, позвоните: <a href="tel:+74953633801">8 (495) 363-38-01</a>.</p></div>;
  return <form className={className} style={style} onSubmit={submit}
    onInvalid={(event) => {
      const field = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (field.validity.valueMissing) field.setCustomValidity(field.type === "checkbox" ? "Подтвердите согласие на обработку персональных данных." : `Заполните поле «${field.closest("label")?.querySelector("span")?.textContent || field.name}».`);
    }}
    onInput={(event) => (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).setCustomValidity("")}
    onChange={(event) => (event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).setCustomValidity("")}
  >{children}<input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />{state === "error" ? <div className="form-error" role="alert">Не удалось отправить заявку. Позвоните по номеру <a href="tel:+74953633801">8 (495) 363-38-01</a> или напишите на <a href={SITE_MAILTO}>{SITE_EMAIL}</a>. <button type="button" onClick={() => setState("idle")}>Попробовать ещё раз</button></div> : null}<button className="btn btn-solid lead-submit" type="submit" disabled={state === "sending"}>{state === "sending" ? "Отправляем…" : submitLabel ?? (form === "service" ? "Отправить обращение" : "Отправить запрос")}</button></form>;
}
