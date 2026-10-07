import type { Expense, ExpenseCategory } from "@/types/finance";
import { CATEGORIES } from "@/types/finance";
import { monthKey } from "./dates";

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (c === '"') {
      if (quoted && n === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && n === "\n") i++;
      row.push(cell.trim());
      cell = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }
  return rows;
}

const normalize = (v = "") => v.toLowerCase().replace(/[^a-z0-9]/g, "");
const pick = (headers: string[], values: string[], aliases: string[]) => {
  const i = headers.findIndex((h) => aliases.includes(normalize(h)));
  return i >= 0 ? (values[i] ?? "") : "";
};
const category = (value: string): ExpenseCategory =>
  CATEGORIES.includes(value as ExpenseCategory)
    ? (value as ExpenseCategory)
    : "Other";

export function parseExpenseCSV(text: string): Expense[] {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0];

  if (!headers) return [];

  return rows
    .slice(1)
    .map((values, index) => {
      const amount = Number(
        pick(headers, values, ["amount", "value", "expense", "price"]).replace(
          /[^0-9.-]/g,
          "",
        ),
      );
      const date =
        pick(headers, values, ["date", "day"]) ||
        new Date().toISOString().slice(0, 10);
      const month =
        pick(headers, values, ["month", "monthkey"]) ||
        date.slice(0, 7) ||
        monthKey();
      return {
        id:
          pick(headers, values, ["id", "expenseid"]) ||
          `import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
        amount,
        description: pick(headers, values, [
          "description",
          "title",
          "name",
          "note",
        ]),
        category: category(pick(headers, values, ["category", "type"])),
        date,
        month,
        createdAt:
          pick(headers, values, ["createdat", "created", "timestamp"]) ||
          new Date().toISOString(),
      };
    })
    .filter((e) => Number.isFinite(e.amount) && e.amount > 0);
}

export function expensesToCSV(expenses: Expense[]) {
  const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [
    "id,amount,description,category,date,month,createdAt",
    ...expenses.map((e) =>
      [e.id, e.amount, e.description, e.category, e.date, e.month, e.createdAt]
        .map(q)
        .join(","),
    ),
  ].join("\n");
}
