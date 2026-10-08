import type { Expense } from "@/types/finance";
import { getDatabase } from "./database";

export async function listExpenses(): Promise<Expense[]> {
  const db = await getDatabase();

  return db.getAllAsync<Expense>(
    `SELECT
      id,
      amount,
      description,
      category,
      date,
      month,
      created_at AS createdAt
     FROM expenses
     ORDER BY date DESC, created_at DESC`,
  );
}

export async function insertExpense(e: Expense): Promise<void> {
  const db = await getDatabase();

  const statement = await db.prepareAsync(`
    INSERT INTO expenses (
      id,
      amount,
      description,
      category,
      date,
      month,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    await statement.executeAsync(
      e.id,
      e.amount,
      e.description,
      e.category,
      e.date,
      e.month,
      e.createdAt,
    );
  } finally {
    await statement.finalizeAsync();
  }
}

export async function upsertExpense(e: Expense): Promise<void> {
  const db = await getDatabase();

  const statement = await db.prepareAsync(`
    INSERT INTO expenses (
      id,
      amount,
      description,
      category,
      date,
      month,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      amount = excluded.amount,
      description = excluded.description,
      category = excluded.category,
      date = excluded.date,
      month = excluded.month,
      created_at = excluded.created_at
  `);

  try {
    await statement.executeAsync(
      e.id,
      e.amount,
      e.description,
      e.category,
      e.date,
      e.month,
      e.createdAt,
    );
  } finally {
    await statement.finalizeAsync();
  }
}

export async function updateExpense(e: Expense): Promise<void> {
  const db = await getDatabase();

  const statement = await db.prepareAsync(`
    UPDATE expenses
    SET
      amount = ?,
      description = ?,
      category = ?,
      date = ?,
      month = ?
    WHERE id = ?
  `);

  try {
    await statement.executeAsync(
      e.amount,
      e.description,
      e.category,
      e.date,
      e.month,
      e.id,
    );
  } finally {
    await statement.finalizeAsync();
  }
}

export async function removeExpense(id: string): Promise<void> {
  const db = await getDatabase();

  const statement = await db.prepareAsync("DELETE FROM expenses WHERE id = ?");

  try {
    await statement.executeAsync(id);
  } finally {
    await statement.finalizeAsync();
  }
}

export async function clearExpenses(): Promise<void> {
  const db = await getDatabase();

  const statement = await db.prepareAsync("DELETE FROM expenses");

  try {
    await statement.executeAsync();
  } finally {
    await statement.finalizeAsync();
  }
}

export async function clearExpensesForMonth(month: string): Promise<void> {
  const db = await getDatabase();

  const statement = await db.prepareAsync(
    "DELETE FROM expenses WHERE month = ?",
  );

  try {
    await statement.executeAsync(month);
  } finally {
    await statement.finalizeAsync();
  }
}
