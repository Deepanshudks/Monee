import type { Expense } from "@/types/finance";
import { insertExpense } from "@/database/expenseRepository";
import { getDatabase } from "@/database/database";
import { upsertBudget } from "@/database/budgetRepository";

export async function seedDevelopmentData() {
  const db = await getDatabase();
  const marker = await db.getFirstAsync<{ value: number }>(
    "SELECT 1 as value FROM sqlite_master WHERE type='table' AND name='seed_meta' LIMIT 1",
  );
  if (marker) return;
  await db.execAsync(
    "CREATE TABLE IF NOT EXISTS seed_meta(value INTEGER NOT NULL);",
  );
  await upsertBudget("2026-09", 27000, 27000);
  await upsertBudget("2026-10", 30000, 30000);
  const rows: Expense[] = [
    ["Lunch", 200, "Food", "2026-10-07"],
    ["Tea", 80, "Food", "2026-10-07"],
    ["Uber", 240, "Travel", "2026-10-07"],
    ["Shopping", 1200, "Shopping", "2026-10-06"],
    ["Electricity", 900, "Bills", "2026-10-06"],
    ["Groceries", 1580, "Food", "2026-10-06"],
  ].map(([description, amount, category, date], i) => ({
    id: `seed-${i}`,
    amount: Number(amount),
    description: String(description),
    category: category as Expense["category"],
    date: String(date),
    month: "2026-10",
    createdAt: `2026-10-0${i < 3 ? 7 : 6}T${10 + i}:00:00.000Z`,
  }));
  for (const row of rows) await insertExpense(row);
  await db.runAsync("INSERT INTO seed_meta(value) VALUES(1)");
}
