"use client";

import { useEffect, useState } from "react";

export default function ContactPrefillFields({ models }: { models: { name: string }[] }) {
  const [model, setModel] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("model") || "";
    if (models.some((item) => item.name === requested)) setModel(requested);
  }, [models]);

  return <>
    <label className="field"><span>Интересующая модель</span>
      <select name="model" value={model} onChange={(event) => setModel(event.target.value)}>
        <option value="">Ещё выбираю</option>
        {models.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
      </select>
    </label>
  </>;
}

export function ContactTaskField() {
  const [task, setTask] = useState("");
  useEffect(() => {
    const sku = new URLSearchParams(window.location.search).get("sku");
    if (sku) setTask(`Интересует конфигурация, артикул ${sku}.`);
  }, []);
  return <label className="field" style={{ gridColumn: "1 / -1" }}>
    <span>Задача</span>
    <textarea name="task" placeholder="Поток, меню, число бариста, ограничения площадки" value={task} onChange={(event) => setTask(event.target.value)} />
  </label>;
}
