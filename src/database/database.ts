import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = initializeDatabase();

  try {
    db = await dbPromise;
    return db;
  } catch (error) {
    dbPromise = null;
    db = null;

    console.error("[Monee DB] Initialization failed:", error);
    throw error;
  }
}

async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync("Monee.db");

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

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
      amount REAL NOT NULL DEFAULT 0,
      starting_balance REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  const columns = await database.getAllAsync<{ name: string }>(
    "PRAGMA table_info(budgets);",
  );

  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has("starting_balance")) {
    await database.execAsync(
      "ALTER TABLE budgets ADD COLUMN starting_balance REAL NOT NULL DEFAULT 0;",
    );
  }

  if (!columnNames.has("created_at")) {
    await database.execAsync(
      "ALTER TABLE budgets ADD COLUMN created_at TEXT NOT NULL DEFAULT '';",
    );
  }

  if (!columnNames.has("updated_at")) {
    await database.execAsync(
      "ALTER TABLE budgets ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';",
    );
  }

  console.log("[Monee DB] Ready");

  return database;
}
