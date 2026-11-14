"use client";

import { useMemo, useState } from "react";
import { LeadForm } from "../components/LeadForm";

type Option = { code: string; label: string; price: number };
const rub = (value: number) => `${new Intl.NumberFormat("ru-RU").format(Math.round(value)).replace(/[\s\u00a0\u202f]/g, "\u202f")}\u00a0₽`;
const monthWord = (value: number) => value % 10 === 1 && value % 100 !== 11 ? "месяц" : value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 12 || value % 100 > 14) ? "месяца" : "месяцев";

export function LeasingCalculator({ options }: { options: Option[] }) {
  const [code, setCode] = useState(options[0]?.code ?? "");
  const [advance, setAdvance] = useState(20);
  const [months, setMonths] = useState(24);
  const selected = useMemo(() => options.find((option) => option.code === code) ?? options[0], [code, options]);
  if (!selected) return null;
  const advanceAmount = Math.round(selected.price * advance / 100);
  const financed = selected.price - advanceAmount;

  return <div className="leasing-workbench" id="calculator">
    <div className="leasing-controls">
      <p className="eyebrow">Расчёт суммы финансирования</p>
      <h2>Начните с машины</h2>
      <p>Выберите исполнение из каталога и задайте аванс. Точный график платежей подготовит Аренза после рассмотрения заявки.</p>
      <label className="field"><span>Модель и исполнение</span>
        <select value={code} onChange={(event) => setCode(event.target.value)}>{options.map((option) => <option key={option.code} value={option.code}>{option.label} · {rub(option.price)}</option>)}</select>
      </label>
      <label className="leasing-range"><span>Аванс <strong>{advance}%</strong></span><input type="range" min="10" max="49" step="1" value={advance} onChange={(event) => setAdvance(Number(event.target.value))} /></label>
      <label className="leasing-range"><span>Срок <strong>{months} мес.</strong></span><input type="range" min="12" max="48" step="1" value={months} onChange={(event) => setMonths(Number(event.target.value))} /></label>
    </div>
    <div className="leasing-result">
      <div><span>Стоимость машины</span><strong>{rub(selected.price)}</strong></div>
      <div><span>Ваш аванс</span><strong>{rub(advanceAmount)}</strong></div>
      <div className="leasing-result-focus"><span>Сумма к финансированию</span><strong>{rub(financed)}</strong></div>
      <p>Деление суммы к финансированию на {months} {monthWord(months)}: {rub(financed / months)} в месяц <b>без учёта стоимости лизинга</b>. Это не размер платежа по договору.</p>
      <a href="#leasing-request" className="btn btn-solid">Запросить условия</a>
    </div>
    <div className="leasing-request" id="leasing-request">
      <div><p className="eyebrow">Заявка</p><h2>Получить предложение</h2><p>Передадим выбранное исполнение и параметры расчёта. Свяжемся с вами, чтобы подготовить счёт и заявку партнёру.</p></div>
      <LeadForm form="contacts" className="leasing-form" submitLabel="Отправить заявку">
        <input type="hidden" name="task" value="Лизинг кофемашины Sanremo" />
        <input type="hidden" name="model" value={`${selected.label} (${selected.code})`} />
        <input type="hidden" name="details" value={`Цена ${rub(selected.price)}; аванс ${advance}%; срок ${months} мес.`} />
        <label className="field"><span>Имя</span><input name="name" autoComplete="name" required /></label>
        <label className="field"><span>Телефон или e-mail</span><input name="contact" autoComplete="email" required /></label>
        <label className="field"><span>Компания / ИП</span><input name="company" /></label>
        <label className="leasing-consent"><input type="checkbox" name="consent" value="yes" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label>
      </LeadForm>
    </div>
  </div>;
}
