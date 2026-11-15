"use client";

import { useEffect, useState } from "react";
import { LeadForm } from "../components/LeadForm";

type Option = { code: string; label: string; modelName: string; groups: number | null; stock: number };

export function LeasingRequest({ options }: { options: Option[] }) {
  const [code, setCode] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("sku");
    const model = params.get("model");
    if (requested && options.some((option) => option.code === requested)) setCode(requested);
    else if (model) {
      const candidates = options.filter((option) => option.modelName?.toLocaleLowerCase("ru-RU") === model.toLocaleLowerCase("ru-RU"));
      setCode((candidates.find((option) => option.groups === 2 && option.stock >= 3)
        ?? candidates.find((option) => option.groups === 2)
        ?? candidates.find((option) => option.stock >= 3)
        ?? candidates[0])?.code ?? "");
    }
  }, [options]);
  const selected = options.find((option) => option.code === code);
  const model = selected?.label ?? "модель не выбрана";

  return <LeadForm form="contacts" className="leasing-form" submitLabel="Отправить заявку на лизинг">
    <input type="hidden" name="task" value={`Лизинг Sanremo — ${model} — ${company || "компания не указана"}`} />
    <input type="hidden" name="model" value={selected ? `${selected.label} (${selected.code})` : ""} />
    <label className="field"><span>Компания / ИП</span><input name="company" autoComplete="organization" value={company} onChange={(event) => setCompany(event.target.value)} required /></label>
    <label className="field"><span>ИНН (необязательно)</span><input name="inn" inputMode="numeric" pattern="[0-9]{10}|[0-9]{12}" title="Укажите 10 или 12 цифр ИНН" /></label>
    <label className="field"><span>Контактное лицо</span><input name="name" autoComplete="name" required /></label>
    <label className="field"><span>Телефон</span><input name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required /></label>
    <label className="field"><span>E-mail</span><input name="email" type="email" autoComplete="email" required /></label>
    <label className="field"><span>Модель / исполнение</span><select value={code} onChange={(event) => setCode(event.target.value)} required><option value="">Выберите машину</option>{options.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}</select></label>
    <label className="field"><span>Количество</span><input name="quantity" type="number" min="1" defaultValue="1" required /></label>
    <label className="field leasing-field-wide"><span>Комментарий</span><textarea name="message" rows={4} placeholder="Город, срок открытия или вопросы к менеджеру" /></label>
    <input type="hidden" name="contact" value={phone} />
    <label className="leasing-consent"><input type="checkbox" name="consent" value="yes" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label>
  </LeadForm>;
}
