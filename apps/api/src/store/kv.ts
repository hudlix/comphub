/** Minimal synchronous key/value contract both embedded backends implement. */
export interface Kv {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  close(): void;
}
