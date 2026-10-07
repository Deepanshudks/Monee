import type { Expense, MonthlySummary } from "@/types/finance";
export const monthlyExpenses = (expenses: Expense[], month: string) =>
  expenses.filter((e) => e.month === month).reduce((s, e) => s + e.amount, 0);
export const monthlySummary = (
  expenses: Expense[],
  budget: number,
  month: string,
): MonthlySummary => {
  const spent = monthlyExpenses(expenses, month);
  return {
    month,
    budget,
    expenses: spent,
    remaining: budget - spent,
    utilization: budget > 0 ? (spent / budget) * 100 : null,
  };
};
export const totalExpenses = (expenses: Expense[]) =>
  expenses.reduce((s, e) => s + e.amount, 0);
export const totalBudget = (budgets: Record<string, number>) =>
  Object.values(budgets).reduce((s, v) => s + v, 0);
export const categoryTotals = (expenses: Expense[], month: string) =>
  expenses
    .filter((e) => e.month === month)
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {});
