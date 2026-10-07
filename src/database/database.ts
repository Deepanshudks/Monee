import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("Monee.db");

  try {
    await db.execAsync(`
      PRAGMA journal_mode=WAL;

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        month TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS budgets (
        month TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    const columns = await db.getAllAsync<{ name: string }>(
      "PRAGMA table_info(budgets);",
    );

    const columnNames = new Set(columns.map((column) => column.name));

    console.log("[Monee DB] budgets columns:", [...columnNames]);

    if (!columnNames.has("starting_balance")) {
      console.log("[Monee DB] Adding starting_balance");

      await db.execAsync(
        "ALTER TABLE budgets ADD COLUMN starting_balance REAL NOT NULL DEFAULT 0;",
      );
    }

    if (!columnNames.has("created_at")) {
      console.log("[Monee DB] Adding budgets.created_at");

      await db.execAsync(
        "ALTER TABLE budgets ADD COLUMN created_at TEXT NOT NULL DEFAULT '';",
      );
    }

    if (!columnNames.has("updated_at")) {
      console.log("[Monee DB] Adding budgets.updated_at");

      await db.execAsync(
        "ALTER TABLE budgets ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';",
      );
    }

    console.log("[Monee DB] Ready");

    return db;
  } catch (error) {
    console.error("[Monee DB] Initialization failed:", error);
    throw error;
  }
}
