import type { DeploymentConfig, WorkspaceId } from '@comphub/core';
import type { Kv } from './kv.js';
import { MemoryKv } from './memory.js';
import { SqliteKv } from './sqlite.js';

const CONFIG_KEY = 'deployment-config';
const userKey = (userId: string) => `user:${userId}`;

/**
 * Typed persistence over a KV backend. Stores the per-deployment config and per-user
 * workspace assignments. Continuity needs no store — it is git-based — so nothing here
 * touches it.
 */
export class Store {
  constructor(private readonly kv: Kv) {}

  getConfig(): DeploymentConfig | null {
    const raw = this.kv.get(CONFIG_KEY);
    return raw ? (JSON.parse(raw) as DeploymentConfig) : null;
  }

  setConfig(config: DeploymentConfig): void {
    this.kv.set(CONFIG_KEY, JSON.stringify(config));
  }

  getUserAssignments(userId: string): WorkspaceId[] | null {
    const raw = this.kv.get(userKey(userId));
    return raw ? (JSON.parse(raw) as WorkspaceId[]) : null;
  }

  setUserAssignments(userId: string, ids: readonly WorkspaceId[]): void {
    this.kv.set(userKey(userId), JSON.stringify(ids));
  }

  close(): void {
    this.kv.close();
  }
}

/**
 * Resolve the embedded store from `COMPHUB_DB`:
 *   - unset / 'memory'         → in-memory (default; nothing external)
 *   - 'sqlite:///data/x.db'    → embedded SQLite file
 *   - 'sqlite::memory:'        → SQLite in-memory
 *   - 'postgres://…'           → opt-in for real deployments (not bundled here yet)
 */
export async function createStore(dbUrl: string | undefined): Promise<Store> {
  if (!dbUrl || dbUrl === 'memory') {
    return new Store(new MemoryKv());
  }
  if (dbUrl.startsWith('sqlite:')) {
    const filename = dbUrl === 'sqlite::memory:' ? ':memory:' : sqliteFile(dbUrl);
    return new Store(await SqliteKv.open(filename));
  }
  if (dbUrl.startsWith('postgres:')) {
    console.warn(
      '[store] Postgres is opt-in and not bundled in this build; using in-memory store.',
    );
    return new Store(new MemoryKv());
  }
  console.warn(`[store] unrecognized COMPHUB_DB '${dbUrl}'; using in-memory store.`);
  return new Store(new MemoryKv());
}

function sqliteFile(url: string): string {
  // sqlite:///abs/path → /abs/path ; sqlite:relative.db → relative.db
  return url.replace(/^sqlite:(\/\/)?/, '');
}

export type { Kv } from './kv.js';
