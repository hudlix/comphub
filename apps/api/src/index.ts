import { createStore } from './store/index.js';
import { loadConfig } from './config.js';
import { createServer } from './server.js';

const PORT = Number(process.env.PORT ?? 4000);

async function main() {
  const store = await createStore(process.env.COMPHUB_DB);
  const config = await loadConfig(store);
  const app = createServer(store, config);

  app.listen(PORT, () => {
    console.log(`[api] CompHub API on :${PORT} (mode=${config.mode})`);
    console.log(`[api] workspaces shipped: ${config.workspaces.join(', ') || '(none)'}`);
  });
}

main().catch((err) => {
  console.error('[api] failed to start', err);
  process.exit(1);
});
