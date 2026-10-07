import { create } from "zustand";
import type { ThemeMode } from "@/types/finance";
import { getSettings, setSetting } from "@/database/settingsRepository";

type State = {
  theme: ThemeMode;
  defaultMonthlyBudget: number;
  userName: string;
  sheetWebhookUrl: string;
  soundsEnabled: boolean;
  onboardingComplete: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setDefaultBudget: (n: number) => Promise<void>;
  setUserName: (name: string) => Promise<void>;
  setSheetWebhookUrl: (url: string) => Promise<void>;
  setSoundsEnabled: (enabled: boolean) => Promise<void>;
  completeOnboarding: (
    name: string,
    budget: number,
    sheetUrl?: string,
  ) => Promise<void>;
};

export const useSettingsStore = create<State>((set) => ({
  theme: "system",
  defaultMonthlyBudget: 30000,
  userName: "",
  sheetWebhookUrl: "",
  soundsEnabled: true,
  onboardingComplete: false,
  hydrated: false,
  hydrate: async () => set({ ...(await getSettings()), hydrated: true }),
  setTheme: async (theme) => {
    await setSetting("theme", theme);
    set({ theme });
  },
  setDefaultBudget: async (n) => {
    await setSetting("defaultMonthlyBudget", n);
    set({ defaultMonthlyBudget: n });
  },
  setUserName: async (name) => {
    await setSetting("userName", name);
    set({ userName: name });
  },
  setSheetWebhookUrl: async (url) => {
    await setSetting("sheetWebhookUrl", url);
    set({ sheetWebhookUrl: url });
  },
  setSoundsEnabled: async (enabled) => {
    await setSetting("soundsEnabled", enabled);
    set({ soundsEnabled: enabled });
  },
  completeOnboarding: async (name, budget, sheetUrl = "") => {
    await Promise.all([
      setSetting("userName", name),
      setSetting("defaultMonthlyBudget", budget),
      setSetting("sheetWebhookUrl", sheetUrl),
      setSetting("onboardingComplete", true),
    ]);
    set({
      userName: name,
      defaultMonthlyBudget: budget,
      sheetWebhookUrl: sheetUrl,
      onboardingComplete: true,
    });
  },
}));
