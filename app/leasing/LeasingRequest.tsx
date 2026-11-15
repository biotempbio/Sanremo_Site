"use client";

import { useEffect, useState } from "react";
import { LeadForm } from "../components/LeadForm";
import type { LeasingModelOption } from "@/lib/leasing-options";

export function LeasingRequest({ options }: { options: LeasingModelOption[] }) {
  const [modelSlug, setModelSlug] = useState("");
  const [variantValue, setVariantValue] = useState("");
  const [sku, setSku] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [inn, setInn] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedSku = params.get("sku") ?? "";
    const bySku = options.find((option) => option.variants.some((variant) => variant.codes.includes(requestedSku)));
    const requestedModel = (params.get("model") ?? "").toLocaleLowerCase("ru-RU");
    const byName = [...options].sort((a, b) => b.name.length - a.name.length)
      .find((option) => requestedModel === option.name.toLocaleLowerCase("ru-RU")
        || requestedModel.startsWith(`${option.name.toLocaleLowerCase("ru-RU")} ·`));
    const selected = bySku ?? byName;
    if (!selected) return;
    setModelSlug(selected.slug);
    const variant = selected.variants.find((item) => item.codes.includes(requestedSku));
    if (variant) {
      setVariantValue(variant.value);
      setSku(requestedSku);
    }
  }, [options]);

  const selectedModel = options.find((option) => option.slug === modelSlug);
  const selectedVariant = selectedModel?.variants.find((variant) => variant.value === variantValue);
  const model = selectedModel && selectedVariant ? `${selectedModel.name} · ${selectedVariant.label}` : "";

  return <LeadForm form="contacts" className="leasing-form leasing-form-full" submitLabel="Отправить заявку">
    <input type="hidden" name="task" value={`Лизинг кофемашины Sanremo. Компания: ${company}; модель: ${model}; артикул: ${sku || "не указан"}; количество: ${quantity}; ИНН: ${inn || "не указан"}; комментарий: ${comment || "нет"}`} />
    <label className="field"><span>Компания или ИП</span><input name="company" value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" required /></label>
    <label className="field"><span>ИНН (необязательно)</span><input name="inn" value={inn} onChange={(event) => setInn(event.target.value.replace(/\D/g, "").slice(0, 12))} inputMode="numeric" pattern="(?:\d{10}|\d{12})?" title="Введите 10 или 12 цифр ИНН" /></label>
    <label className="field"><span>Контактное лицо</span><input name="name" autoComplete="name" required /></label>
    <label className="field"><span>Телефон</span><input name="contact" type="tel" autoComplete="tel" required /></label>
    <label className="field"><span>E-mail</span><input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
    <label className="field"><span>Модель</span><select value={modelSlug} onChange={(event) => { setModelSlug(event.target.value); setVariantValue(""); setSku(""); }} required><option value="">Выберите модель</option>{options.map((option) => <option key={option.slug} value={option.slug}>{option.name}</option>)}</select></label>
    <label className="field"><span>Исполнение</span><select value={variantValue} onChange={(event) => { const value = event.target.value; setVariantValue(value); setSku(value); }} disabled={!selectedModel} required><option value="">Выберите исполнение</option>{selectedModel?.variants.map((variant) => <option key={variant.value} value={variant.value}>{variant.label}</option>)}</select></label>
    <input type="hidden" name="model" value={model} />
    <label className="field"><span>Количество</span><input name="quantity" type="number" min="1" max="999" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label>
    <label className="field leasing-comment"><span>Комментарий</span><textarea name="comment" rows={4} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Что важно учесть при покупке?" /></label>
    <label className="leasing-consent"><input type="checkbox" name="consent" value="yes" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label>
  </LeadForm>;
}
