import { create } from "zustand";
import type { Expense } from "@/types/finance";

import {
  insertExpense,
  listExpenses,
  removeExpense,
  updateExpense,
  upsertExpense,
  clearExpenses,
} from "@/database/expenseRepository";

import { listBudgets, upsertBudget } from "@/database/budgetRepository";

export type MonthlyBudget = {
  budget: number;
  startingBalance: number;
};

type FinanceState = {
  expenses: Expense[];

  monthlyBudgets: Record<string, MonthlyBudget>;

  hydrated: boolean;

  hydrate: () => Promise<void>;

  ensureMonth: (month: string, defaultBudget: number) => Promise<MonthlyBudget>;

  addExpense: (input: Omit<Expense, "id" | "createdAt">) => Promise<Expense>;

  importExpenses: (items: Expense[]) => Promise<number>;

  updateExpense: (e: Expense) => Promise<void>;

  deleteExpense: (id: string) => Promise<void>;

  clearAll: () => Promise<void>;

  setMonthlyBudget: (
    month: string,
    budget: number,
    startingBalance: number,
  ) => Promise<void>;
};

export const useFinanceStore = create<FinanceState>((set, get) => ({
  expenses: [],

  monthlyBudgets: {},

  hydrated: false,

  hydrate: async () => {
    const [expenses, budgets] = await Promise.all([
      listExpenses(),
      listBudgets(),
    ]);

    const monthlyBudgets: Record<string, MonthlyBudget> = {};

    for (const item of budgets) {
      monthlyBudgets[item.month] = {
        budget: item.amount,
        startingBalance: item.startingBalance,
      };
    }

    set({
      expenses,
      monthlyBudgets,
      hydrated: true,
    });
  },

  ensureMonth: async (month, defaultBudget) => {
    const existing = get().monthlyBudgets[month];

    // Month already exists.
    // Never overwrite existing financial data.
    if (existing) {
      return existing;
    }

    const newMonth: MonthlyBudget = {
      budget: Math.max(0, defaultBudget),
      startingBalance: Math.max(0, defaultBudget),
    };

    await upsertBudget(month, newMonth.budget, newMonth.startingBalance);

    set((state) => ({
      monthlyBudgets: {
        ...state.monthlyBudgets,
        [month]: newMonth,
      },
    }));

    return newMonth;
  },

  addExpense: async (input) => {
    const e: Expense = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    };

    await insertExpense(e);

    set((s) => ({
      expenses: [e, ...s.expenses],
    }));

    return e;
  },

  importExpenses: async (items) => {
    for (const item of items) {
      await upsertExpense(item);
    }

    const expenses = await listExpenses();

    set({ expenses });

    return items.length;
  },

  updateExpense: async (e) => {
    await updateExpense(e);

    set((s) => ({
      expenses: s.expenses.map((x) => (x.id === e.id ? e : x)),
    }));
  },

  deleteExpense: async (id) => {
    await removeExpense(id);

    set((s) => ({
      expenses: s.expenses.filter((x) => x.id !== id),
    }));
  },

  clearAll: async () => {
    await clearExpenses();

    set({
      expenses: [],
    });
  },

  setMonthlyBudget: async (month, budget, startingBalance) => {
    const safeBudget = Math.max(0, budget);
    const safeStartingBalance = Math.max(0, startingBalance);

    await upsertBudget(month, safeBudget, safeStartingBalance);

    set((s) => ({
      monthlyBudgets: {
        ...s.monthlyBudgets,
        [month]: {
          budget: safeBudget,
          startingBalance: safeStartingBalance,
        },
      },
    }));
  },
}));
