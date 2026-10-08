import type { Expense } from "@/types/finance";

export type MonthlyFinance = {
  budget: number;
};

export type GoogleSheetSyncPayload = {
  action: "sync";
  expenses: Expense[];
  monthlyBudgets: Record<string, MonthlyFinance>;
};

export async function syncExpensesToGoogleSheet(
  webhookUrl: string,
  expenses: Expense[],
  monthlyBudgets: Record<string, MonthlyFinance>,
) {
  if (!webhookUrl.trim()) {
    throw new Error("Add your Google Sheets webhook URL in Settings first.");
  }

  const payload: GoogleSheetSyncPayload = {
    action: "sync",
    expenses,
    monthlyBudgets,
  };

  const response = await fetch(webhookUrl.trim(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets returned ${response.status}`);
  }

  return response.json().catch(() => ({ ok: true }));
}
