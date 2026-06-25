import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PORT = Number(process.env.PORT ?? 3000);
// Where the dev/preview server proxies /api. In Docker this is the api service.
const API_TARGET = process.env.COMPHUB_API_URL ?? 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: PORT,
    proxy: { '/api': { target: API_TARGET, changeOrigin: true } },
  },
  preview: {
    port: PORT,
    host: true,
  },
});
