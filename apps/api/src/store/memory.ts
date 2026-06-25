import type { Kv } from './kv.js';

/** In-memory KV — the zero-dependency default for `npm run dev`. Not persistent. */
export class MemoryKv implements Kv {
  private readonly map = new Map<string, string>();

  get(key: string): string | undefined {
    return this.map.get(key);
  }

  set(key: string, value: string): void {
    this.map.set(key, value);
  }

  close(): void {
    this.map.clear();
  }
}
