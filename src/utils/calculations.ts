import type { Expense, MonthlySummary } from "@/types/finance";

export const monthlyExpenses = (expenses: Expense[], month: string) =>
  expenses.filter((e) => e.month === month).reduce((s, e) => s + e.amount, 0);

export const monthlySummary = (
  expenses: Expense[],
  budgets: Record<string, number>,
  month: string,
): MonthlySummary => {
  const spent = monthlyExpenses(expenses, month);

  const currentBudget = budgets[month] ?? 0;

  const [year, monthNumber] = month.split("-").map(Number);

  const previousDate = new Date(year!, monthNumber! - 2, 1);

  const previousMonth = `${previousDate.getFullYear()}-${String(
    previousDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const hasPreviousBudget = Object.prototype.hasOwnProperty.call(
    budgets,
    previousMonth,
  );

  const carryForward = hasPreviousBudget
    ? monthlySummary(expenses, budgets, previousMonth).remaining
    : 0;

  const availableBudget = currentBudget + carryForward;

  return {
    month,
    budget: availableBudget,
    expenses: spent,
    remaining: availableBudget - spent,
    utilization: availableBudget > 0 ? (spent / availableBudget) * 100 : null,
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
