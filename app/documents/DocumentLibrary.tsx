"use client";

import { useEffect, useMemo, useState } from "react";
import { documents, fileSizeMb } from "@/lib/documents";

type ModelOption = { slug: string; name: string };

export function DocumentLibrary({ models }: { models: ModelOption[] }) {
  const [model, setModel] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setModel(query.get("model") ?? "");
    setType(query.get("type") ?? "");
  }, []);

  function select(nextModel: string, nextType: string) {
    setModel(nextModel);
    setType(nextType);
    const query = new URLSearchParams(window.location.search);
    if (nextModel) query.set("model", nextModel); else query.delete("model");
    if (nextType) query.set("type", nextType); else query.delete("type");
    const suffix = query.toString();
    window.history.replaceState(null, "", `/documents/${suffix ? `?${suffix}` : ""}`);
  }

  const types = useMemo(() => [...new Set(documents.map((document) => document.type))].sort((a, b) => a.localeCompare(b, "ru")), []);
  const filtered = documents.filter((document) => (!model || document.models.includes(model)) && (!type || document.type === type));
  const nameOf = (slug: string) => models.find((item) => item.slug === slug)?.name ?? slug;

  return <>
    <div className="document-filters" role="group" aria-label="Фильтры документов">
      <label>Модель
        <select value={model} onChange={(event) => select(event.target.value, type)}>
          <option value="">Все модели</option>
          {models.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
      </label>
      <label>Тип документа
        <select value={type} onChange={(event) => select(model, event.target.value)}>
          <option value="">Все типы</option>
          {types.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      {(model || type) && <button className="btn" type="button" onClick={() => select("", "")}>Сбросить фильтры</button>}
    </div>
    <p className="small" role="status">Найдено документов: {filtered.length}</p>
    {filtered.length ? <div className="table-scroll"><table className="data"><thead><tr><th>Модель</th><th>Документ</th><th>Тип</th><th>Файл</th></tr></thead><tbody>
      {filtered.map((document) => <tr id={document.id} key={document.id}>
        <td>{document.models.map(nameOf).join(", ")}</td>
        <td><b>{document.name}</b></td><td>{document.type}</td>
        <td><a className="link-arrow" href={document.href} download>Скачать PDF · {fileSizeMb(document.bytes)}</a></td>
      </tr>)}
    </tbody></table></div> : <div className="empty"><p>Документов с такими параметрами нет.</p><button className="btn" type="button" onClick={() => select("", "")}>Показать все документы</button></div>}
  </>;
}
