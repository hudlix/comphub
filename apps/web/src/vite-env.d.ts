/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute API base baked at build time (e.g. in Docker). Empty/undefined in dev. */
  readonly VITE_COMPHUB_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
