import type { Expense } from "@/types/finance";
import { getDatabase } from "./database";

export async function listExpenses() {
  const db = await getDatabase();
  return db.getAllAsync<Expense>(
    "SELECT id, amount, description, category, date, month, created_at as createdAt FROM expenses ORDER BY date DESC, created_at DESC",
  );
}
export async function insertExpense(e: Expense) {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT INTO expenses(id,amount,description,category,date,month,created_at) VALUES(?,?,?,?,?,?,?)",
    e.id,
    e.amount,
    e.description,
    e.category,
    e.date,
    e.month,
    e.createdAt,
  );
}
export async function upsertExpense(e: Expense) {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT INTO expenses(id,amount,description,category,date,month,created_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET amount=excluded.amount,description=excluded.description,category=excluded.category,date=excluded.date,month=excluded.month,created_at=excluded.created_at",
    e.id,
    e.amount,
    e.description,
    e.category,
    e.date,
    e.month,
    e.createdAt,
  );
}
export async function updateExpense(e: Expense) {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE expenses SET amount=?,description=?,category=?,date=?,month=? WHERE id=?",
    e.amount,
    e.description,
    e.category,
    e.date,
    e.month,
    e.id,
  );
}
export async function removeExpense(id: string) {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM expenses WHERE id=?", id);
}
export async function clearExpenses() {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM expenses");
}
