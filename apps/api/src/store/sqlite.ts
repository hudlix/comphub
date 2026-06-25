import type Database from 'better-sqlite3';
import type { Kv } from './kv.js';

/**
 * SQLite-backed KV — the embedded persistent store used by `docker compose up`.
 * better-sqlite3 is loaded dynamically so the default in-memory path never touches the
 * native module.
 */
export class SqliteKv implements Kv {
  private constructor(private readonly db: Database.Database) {}

  static async open(filename: string): Promise<SqliteKv> {
    const { default: BetterSqlite3 } = await import('better-sqlite3');
    const db = new BetterSqlite3(filename);
    db.pragma('journal_mode = WAL');
    db.exec('CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
    return new SqliteKv(db);
  }

  get(key: string): string | undefined {
    const row = this.db.prepare('SELECT value FROM kv WHERE key = ?').get(key) as
      | { value: string }
      | undefined;
    return row?.value;
  }

  set(key: string, value: string): void {
    this.db
      .prepare(
        'INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      )
      .run(key, value);
  }

  close(): void {
    this.db.close();
  }
}
