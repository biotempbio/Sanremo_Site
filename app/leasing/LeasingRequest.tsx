"use client";

import { useEffect, useState } from "react";
import { LeadForm } from "../components/LeadForm";

export function LeasingRequest() {
  const [model, setModel] = useState("");
  const [sku, setSku] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [inn, setInn] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setModel(params.get("model") ?? "");
    setSku(params.get("sku") ?? "");
  }, []);

  return <LeadForm form="contacts" className="leasing-form leasing-form-full" submitLabel="Отправить заявку">
    <input type="hidden" name="task" value="Лизинг кофемашины Sanremo" />
    <input type="hidden" name="subject" value={`Лизинг Sanremo — ${model || "модель не указана"} — ${company || "компания не указана"}`} />
    <input type="hidden" name="details" value={`Лизинг Sanremo — ${model || "модель не указана"} — ${company || "компания не указана"}; артикул: ${sku || "не указан"}; количество: ${quantity}; ИНН: ${inn || "не указан"}; e-mail: ${email}; комментарий: ${comment}`} />
    <label className="field"><span>Компания или ИП</span><input name="company" value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" required /></label>
    <label className="field"><span>ИНН (необязательно)</span><input name="inn" value={inn} onChange={(event) => setInn(event.target.value.replace(/\D/g, "").slice(0, 12))} inputMode="numeric" pattern="(?:\d{10}|\d{12})?" title="Введите 10 или 12 цифр ИНН" /></label>
    <label className="field"><span>Контактное лицо</span><input name="name" autoComplete="name" required /></label>
    <label className="field"><span>Телефон</span><input name="contact" type="tel" autoComplete="tel" required /></label>
    <label className="field"><span>E-mail</span><input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
    <label className="field"><span>Модель и исполнение</span><input name="model" value={model} onChange={(event) => setModel(event.target.value)} placeholder="Например, D8, 2 группы" required /></label>
    <label className="field"><span>Количество</span><input name="quantity" type="number" min="1" max="999" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label>
    <label className="field leasing-comment"><span>Комментарий</span><textarea name="comment" rows={4} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Что важно учесть при покупке?" /></label>
    <label className="leasing-consent"><input type="checkbox" name="consent" value="yes" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label>
  </LeadForm>;
}
