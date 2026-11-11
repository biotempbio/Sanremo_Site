"use client";

import { useEffect, useMemo, useState } from "react";
import { documents, fileSizeMb, type DocumentEntry } from "@/lib/documents";
import { ARCHIVE_MODELS } from "@/lib/archive-models";
import { LeadForm } from "@/app/components/LeadForm";

type ModelOption = { slug: string; name: string; family: string };
type Group = { id: string; title: string; intro: string };

const GROUPS: Group[] = [
  { id: "zoe", title: "Zoe", intro: "Инструкции, схемы и брошюры линейки Zoe." },
  { id: "d8", title: "D8", intro: "Документы D8 и D8 PRO." },
  { id: "f18", title: "F18", intro: "Документы F18 MB и F18 Single Boiler." },
  { id: "cafe-racer", title: "Café Racer", intro: "Инструкции и схемы Café Racer." },
  { id: "opera", title: "Opera", intro: "Инструкции и схемы Opera." },
  { id: "you", title: "YOU", intro: "Документы одногруппной YOU." },
  { id: "shared", title: "Общие документы", intro: "Декларации для нескольких линеек." },
  { id: "x-one", title: "X-One", intro: "Документы кофемолки X-One." },
  { id: "archive", title: "Архивные модели", intro: "Napoli, Cube, Verona, Verona RS и Torino." },
];

export function DocumentLibrary({ models }: { models: ModelOption[] }) {
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [expanded, setExpanded] = useState<string[]>(["zoe"]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setModel(query.get("model") ?? "");
    setType(query.get("type") ?? "");
  }, []);

  function select(nextModel: string, nextType: string) {
    setModel(nextModel);
    setType(nextType);
    setExpanded(GROUPS.map((group) => group.id));
    const query = new URLSearchParams(window.location.search);
    if (nextModel) query.set("model", nextModel); else query.delete("model");
    if (nextType) query.set("type", nextType); else query.delete("type");
    const suffix = query.toString();
    window.history.replaceState(null, "", `/documents/${suffix ? `?${suffix}` : ""}`);
  }

  const types = useMemo(() => [...new Set(documents.map((document) => document.type))].sort((a, b) => a.localeCompare(b, "ru")), []);
  const filtered = documents.filter((document) => (!model || document.models.includes(model)) && (!type || document.type === type));
  const nameOf = (slug: string) => models.find((item) => item.slug === slug)?.name ?? slug;
  const familyOf = (slug: string) => models.find((item) => item.slug === slug)?.family;
  const groupOf = (document: DocumentEntry) => {
    const families = [...new Set(document.models.map(familyOf).filter(Boolean))];
    return families.length === 1 ? families[0] : "shared";
  };
  const visibleGroups = GROUPS.map((group) => ({
    ...group,
    files: filtered.filter((document) => groupOf(document) === group.id),
  })).filter((group) => group.files.length || (!model && !type && ["x-one", "archive"].includes(group.id)));

  function toggleGroup(id: string) {
    setExpanded((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return <>
    <nav className="document-jump" aria-label="Линейки документов">
      {visibleGroups.map((group) => <a key={group.id} href={`#docs-${group.id}`} onClick={() => setExpanded((current) => current.includes(group.id) ? current : [...current, group.id])}>
        {group.title}<span>{group.files.length || "по запросу"}</span>
      </a>)}
    </nav>
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
    <p className="small document-count" role="status">Найдено документов: {filtered.length}</p>
    {visibleGroups.length ? <div className="document-groups">
      {visibleGroups.map((group) => <section className="document-group" id={`docs-${group.id}`} key={group.id} data-open={expanded.includes(group.id)}>
        <div className="document-group-head">
          <div><p className="eyebrow">Библиотека Sanremo</p><h2>{group.title}</h2><p className="small">{group.intro}</p></div>
          <div className="document-group-side"><span>{group.files.length ? `${group.files.length} PDF` : "По запросу"}</span><button type="button" aria-expanded={expanded.includes(group.id)} aria-controls={`docs-body-${group.id}`} onClick={() => toggleGroup(group.id)}>{expanded.includes(group.id) ? "Свернуть" : "Показать"}</button></div>
        </div>
        <div className="document-group-body" id={`docs-body-${group.id}`}>
          {group.files.length ? <>
            <div className="table-scroll document-desktop"><table className="data"><thead><tr><th>Модель</th><th>Документ</th><th>Тип</th><th>Файл</th></tr></thead><tbody>
              {group.files.map((document) => <tr id={document.id} key={document.id}>
                <td>{document.models.map(nameOf).join(", ")}</td><td><b>{document.name}</b>{document.originalName && <small className="document-origin">{document.article && <>Артикул {document.article} · </>}Исходный файл: {document.originalName}</small>}</td><td>{document.type}</td>
                <td><a className="link-arrow" href={document.href} target="_blank" rel="noopener noreferrer">Открыть PDF · {fileSizeMb(document.bytes)}</a></td>
              </tr>)}
            </tbody></table></div>
            <div className="document-mobile">
              {group.files.map((document) => <article className="document-card" key={document.id}>
                <p className="eyebrow">{document.type}</p><h3>{document.name}</h3>{document.originalName && <small className="document-origin">{document.article && <>Артикул {document.article} · </>}Исходный файл: {document.originalName}</small>}<p className="small">{document.models.map(nameOf).join(", ")}</p>
                <a className="btn btn-solid" href={document.href} target="_blank" rel="noopener noreferrer">Открыть PDF · {fileSizeMb(document.bytes)}</a>
              </article>)}
            </div>
          </> : <div className="document-no-files"><p>Нужен документ для {group.title === "Архивные модели" ? "архивной модели" : group.title}? Укажите название или тип документа и оставьте контакт для ответа.</p>
            {group.id === "archive" && <p className="document-archive-links">{Object.entries(ARCHIVE_MODELS).map(([slug, entry]) => <a key={slug} href={`/products/${slug}/`}>{entry.name}</a>)}</p>}
            {group.id === "x-one" && <p><a href="/products/x-one/">Кофемолка X-One →</a></p>}
            <LeadForm form="contacts" className="document-request-form" submitLabel="Запросить документ">
              <label className="field"><span>Имя</span><input name="name" autoComplete="name" required /></label>
              <label className="field"><span>Телефон или e-mail</span><input name="contact" autoComplete="email" required /></label>
              <label className="field document-request-task"><span>Какой документ нужен</span><textarea name="task" defaultValue={`Нужен документ для ${group.title === "Архивные модели" ? "архивной модели Sanremo: " : `Sanremo ${group.title}: `}`} required /></label>
              <label className="document-request-consent"><input name="consent" value="yes" type="checkbox" required /><span>Согласен на <a href="/privacy/">обработку персональных данных</a></span></label>
            </LeadForm></div>}
        </div>
      </section>)}
    </div> : <div className="empty"><p>Документов с такими параметрами нет.</p><button className="btn" type="button" onClick={() => select("", "")}>Показать все документы</button></div>}
  </>;
}
