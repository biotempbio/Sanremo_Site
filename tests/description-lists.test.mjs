import test from "node:test";
import assert from "node:assert/strict";
import { cleanDescriptionBlocks, descriptionBlocks, descriptionHtml } from "../lib/product-description.mjs";

test("plain feature rows after an explicit label become one list without changing their values", () => {
  const rows = ["Экономайзер", "Цвет чёрный", "Комплектация 3 портафильтра (2 на 2 чашки, 1 на 1 чашку)"];
  const blocks = descriptionBlocks(["Технические характеристики:", ...rows].join("\n"));
  assert.deepEqual(blocks, [{ type: "heading", text: "Технические характеристики" }, { type: "list", items: rows }]);
  assert.equal((descriptionHtml("", blocks).match(/<li>/g) ?? []).length, 3);
});

test("already saved product paragraphs receive the same list normalization, idempotently", () => {
  const saved = [{ type: "paragraph", text: "Особенности:" }, { type: "paragraph", text: "Экономайзер" }, { type: "paragraph", text: "2 паровых крана" }];
  const before = structuredClone(saved);
  const normalized = cleanDescriptionBlocks(saved);
  assert.deepEqual(normalized[1], { type: "list", items: ["Экономайзер", "2 паровых крана"] });
  assert.deepEqual(cleanDescriptionBlocks(normalized), normalized);
  assert.deepEqual(saved, before);
});

test("ordinary descriptive prose and a long explanatory paragraph stay paragraphs", () => {
  const text = "Описание:\nКофемашина для кофейни.\nКоманда работает с привычными рецептами.";
  assert.ok(descriptionBlocks(text).every((block) => block.type === "paragraph"));
  const explanation = "Развёрнутое пояснение о ежедневной работе бариста. ".repeat(8);
  const blocks = descriptionBlocks(`Преимущества:\n${explanation}\nДругая часть описания.`);
  assert.ok(blocks.every((block) => block.type !== "list"));
});
