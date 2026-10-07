import { getDatabase } from "./database";

export type BudgetRow = {
  month: string;
  amount: number;
  startingBalance: number;
};

export async function listBudgets(): Promise<BudgetRow[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{
    month: string;
    amount: number;
    starting_balance: number;
  }>(
    `
      SELECT
        month,
        amount,
        starting_balance
      FROM budgets
      ORDER BY month DESC;
    `,
  );

  return rows.map((row) => ({
    month: row.month,
    amount: row.amount,
    startingBalance: row.starting_balance,
  }));
}

export async function getBudget(month: string): Promise<BudgetRow | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{
    month: string;
    amount: number;
    starting_balance: number;
  }>(
    `
      SELECT
        month,
        amount,
        starting_balance
      FROM budgets
      WHERE month = ?
      LIMIT 1;
    `,
    month,
  );

  if (!row) {
    return null;
  }

  return {
    month: row.month,
    amount: row.amount,
    startingBalance: row.starting_balance,
  };
}

export async function upsertBudget(
  month: string,
  amount: number,
  startingBalance: number,
): Promise<void> {
  const db = await getDatabase();

  const now = new Date().toISOString();

  await db.runAsync(
    `
      INSERT INTO budgets (
        month,
        amount,
        starting_balance,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(month)
      DO UPDATE SET
        amount = excluded.amount,
        starting_balance = excluded.starting_balance,
        updated_at = excluded.updated_at;
    `,
    month,
    amount,
    startingBalance,
    now,
    now,
  );
}
