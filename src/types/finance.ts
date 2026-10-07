export const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Other",
] as const;
export type ExpenseCategory = (typeof CATEGORIES)[number];
export type ThemeMode = "light" | "dark" | "system";

export type Expense = {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  month: string;
  createdAt: string;
};

export type MonthlyBudget = { month: string; amount: number };
export type AppSettings = {
  currency: "INR";
  theme: ThemeMode;
  defaultMonthlyBudget: number;
};
export type MonthlySummary = {
  month: string;
  budget: number;
  expenses: number;
  remaining: number;
  utilization: number | null;
};
