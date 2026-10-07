import { getDatabase } from "./database";

export type StoredSettings = {
  userName: string;
  defaultMonthlyBudget: number;
  theme: "light" | "dark" | "system";
  sheetWebhookUrl: string;
  soundsEnabled: boolean;
  onboardingComplete: boolean;
};

const defaults: StoredSettings = {
  userName: "",
  defaultMonthlyBudget: 30000,
  theme: "system",
  sheetWebhookUrl: "",
  soundsEnabled: true,
  onboardingComplete: false,
};

export async function getSettings(): Promise<StoredSettings> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    "SELECT key,value FROM settings",
  );
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return {
    userName: map.userName ?? defaults.userName,
    defaultMonthlyBudget: Number(
      map.defaultMonthlyBudget ?? defaults.defaultMonthlyBudget,
    ),
    theme: (map.theme as StoredSettings["theme"]) ?? defaults.theme,
    sheetWebhookUrl: map.sheetWebhookUrl ?? defaults.sheetWebhookUrl,
    soundsEnabled:
      map.soundsEnabled !== undefined
        ? map.soundsEnabled === "true"
        : defaults.soundsEnabled,
    onboardingComplete: map.onboardingComplete === "true",
  };
}

export async function setSetting(
  key: keyof StoredSettings,
  value: string | number | boolean,
) {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
    key,
    String(value),
  );
}
