"use client";

import { FormEvent, ReactNode, useState } from "react";

declare global { interface Window { ym?: (...args: unknown[]) => void } }

export function LeadForm({ form, children, className, style }: { form: "contacts" | "service"; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [ticket, setTicket] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    if (!element.reportValidity()) return;
    const data = Object.fromEntries(new FormData(element).entries());
    setState("sending");
    try {
      const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, form, page: location.href, sentAt: new Date().toISOString() }) });
      if (!response.ok) throw new Error("request failed");
      const result = await response.json();
      setTicket(result.id ?? "принято"); setState("sent");
      const id = process.env.NEXT_PUBLIC_METRIKA_ID; if (id && window.ym) window.ym(Number(id), "reachGoal", "lead_sent");
    } catch { setState("error"); }
  }
  if (state === "sent") return <div className="form-result" role="status"><p className="eyebrow">Обращение № {ticket}</p><h3>Заявка отправлена</h3><p>Ответим в рабочее время. Если вопрос срочный, позвоните: <a href="tel:+74953633801">8-495-363-3801</a>.</p></div>;
  return <form className={className} style={style} onSubmit={submit}>{children}<input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />{state === "error" ? <div className="form-error" role="alert">Не удалось отправить заявку. Позвоните по номеру <a href="tel:+74953633801">8-495-363-3801</a> или напишите на <a href="mailto:info@sanremomachines.ru">info@sanremomachines.ru</a>. <button type="button" onClick={() => setState("idle")}>Попробовать ещё раз</button></div> : null}<button className="btn btn-solid lead-submit" type="submit" disabled={state === "sending"}>{state === "sending" ? "Отправляем…" : form === "service" ? "Отправить обращение" : "Отправить запрос"}</button></form>;
}
